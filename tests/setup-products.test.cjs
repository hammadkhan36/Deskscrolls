const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(relative, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', relative), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })
  const module = { exports: {} }
  new Function('require', 'module', 'exports', outputText)(
    name => name in mocks ? mocks[name] : require(name), module, module.exports,
  )
  return module.exports
}

const { syncSetupProducts } = load('app/lib/setup-products.ts')

function database(initial = [], failures = {}) {
  let rows = structuredClone(initial)
  const calls = []
  let reads = 0
  return {
    rows: () => rows,
    calls,
    from(table) {
      const query = { table, operation: 'select', filters: {} }
      const chain = {
        select() { return chain },
        eq(key, value) { query.filters[key] = value; return chain },
        in(key, value) { query.filters[key] = value; return chain },
        is() { return chain },
        upsert(values) { query.operation = 'insert'; query.values = values; return chain },
        delete() { query.operation = 'delete'; return chain },
        then(resolve, reject) {
          return Promise.resolve().then(() => {
            calls.push(query)
            if (table === 'products') return {
              data: failures.unavailable ? [] : query.filters.id.map(id => ({ id })), error: null,
            }
            if (query.operation === 'select') {
              reads++
              if (failures.read || (failures.verify && reads > 1)) return { data: null, error: { message: 'read failed' } }
            }
            if (failures[query.operation]) return { data: null, error: { message: `${query.operation} failed` } }
            if (query.operation === 'insert') {
              for (const value of query.values) {
                if (!rows.some(row => row.setup_id === value.setup_id && row.product_id === value.product_id)) rows.push(value)
              }
            }
            if (query.operation === 'delete' && !failures.silentDelete) {
              rows = rows.filter(row => row.setup_id !== query.filters.setup_id || !query.filters.product_id.includes(row.product_id))
            }
            return { data: rows.filter(row => row.setup_id === query.filters.setup_id), error: null }
          }).then(resolve, reject)
        },
      }
      return chain
    },
  }
}

const link = (id, extra = {}) => ({ setup_id: 'setup', product_id: id, sort_order: 3, notes: 'Keep this note', ...extra })

test('create deduplicates selections and an unchanged retry does not rewrite links', async () => {
  const db = database()
  await syncSetupProducts(db, 'setup', ['a', 'a', 'b'])
  assert.deepEqual(db.rows().map(row => row.product_id), ['a', 'b'])
  assert.deepEqual(db.rows().map(row => row.sort_order), [0, 1])
  const saved = structuredClone(db.rows())
  await syncSetupProducts(db, 'setup', ['a', 'b'])
  assert.deepEqual(db.rows(), saved)
  assert.equal(db.calls.filter(call => call.operation === 'insert').length, 1)
})

test('edit adds/removes products while retaining notes/order and other setups', async () => {
  const retained = link('a', { created_at: '2026-09-18', sort_order: 8 })
  const other = link('b', { setup_id: 'other' })
  const db = database([retained, link('b'), other])
  await syncSetupProducts(db, 'setup', ['a', 'c'])
  assert.deepEqual(db.rows().find(row => row.product_id === 'a'), retained)
  assert.deepEqual(db.rows().find(row => row.setup_id === 'other'), other)
  assert.equal(db.rows().find(row => row.product_id === 'c').sort_order, 9)
  assert.equal(db.rows().filter(row => row.setup_id === 'setup').length, 2)
})

test('clearing all products deletes only this setup links', async () => {
  const other = link('a', { setup_id: 'other' })
  const db = database([link('a'), other])
  await syncSetupProducts(db, 'setup', [])
  assert.deepEqual(db.rows(), [other])
})

for (const failure of ['read', 'unavailable', 'insert']) {
  test(`${failure} failure preserves the previous selection`, async () => {
    const original = [link('a')]
    const db = database(original, { [failure]: true })
    await assert.rejects(syncSetupProducts(db, 'setup', ['b']))
    assert.deepEqual(db.rows(), original)
    assert.equal(db.calls.some(call => call.operation === 'delete'), false)
  })
}

for (const failure of ['delete', 'silentDelete', 'verify']) {
  test(`${failure} failure cannot return a false success`, async () => {
    const db = database([link('a')], { [failure]: true })
    await assert.rejects(syncSetupProducts(db, 'setup', []))
  })
}

function actions({ user = { id: 'author' }, role = 'author', owner = 'author', setup = true } = {}) {
  let saves = 0
  const client = {
    from(table) {
      const chain = {
        select() { return chain }, eq() { return chain }, is() { return chain },
        single: async () => ({ data: { role }, error: null }),
        maybeSingle: async () => ({ data: setup ? { id: setupId, slug: 'example', author_id: owner } : null, error: null }),
      }
      return chain
    },
  }
  const loaded = load('app/admin/setup-product-actions.ts', {
    'next/cache': { revalidatePath() {} },
    '@/lib/auth': { getAdminUser: async () => user },
    '@/lib/supabase/server': { createServerSupabaseActionClient: async () => client },
    '@/lib/setup-products': { syncSetupProducts: async () => { saves++ } },
  })
  return { ...loaded, saves: () => saves }
}
const setupId = '11111111-1111-1111-1111-111111111111'

test('server action rejects unauthenticated, foreign-author and missing setup writes', async () => {
  for (const config of [{ user: null }, { owner: 'another-author' }, { setup: false }, { role: 'member' }]) {
    const action = actions(config)
    assert.ok((await action.saveSetupProducts(setupId, [])).error)
    assert.equal(action.saves(), 0)
  }
})

test('server action accepts own-author and admin/manager edits', async () => {
  for (const config of [{}, { role: 'admin', owner: 'other' }, { role: 'manager', owner: 'other' }]) {
    const action = actions(config)
    assert.equal((await action.saveSetupProducts(setupId, [])).success, true)
    assert.equal(action.saves(), 1)
  }
})

test('server action validates UUIDs and selection size before writes', async () => {
  const action = actions()
  for (const ids of [['invalid'], Array(501).fill(setupId), null]) {
    assert.ok((await action.saveSetupProducts(setupId, ids)).error)
  }
  assert.ok((await action.saveSetupProducts('invalid', [])).error)
  assert.equal(action.saves(), 0)
})
