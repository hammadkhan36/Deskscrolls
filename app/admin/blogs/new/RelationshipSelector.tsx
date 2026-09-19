'use client'

import { useMemo, useState } from 'react'

export type RelationshipOption = {
  id: string
  label: string
  description?: string | null
}

export default function RelationshipSelector({
  title,
  description,
  name,
  options,
  initialSelected = [],
}: {
  title: string
  description: string
  name: string
  options: RelationshipOption[]
  initialSelected?: string[]
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] =
    useState<string[]>(initialSelected)

  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) return options

    return options.filter((option) =>
      `${option.label} ${option.description || ''}`
        .toLowerCase()
        .includes(search)
    )
  }, [options, query])

  function toggleOption(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      {selected.map((id) => (
        <input
          key={id}
          type="hidden"
          name={name}
          value={id}
        />
      ))}

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={`Search ${title.toLowerCase()}...`}
        className="mt-4 min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
      />

      <p className="mt-3 text-xs font-medium text-slate-500">
        {selected.length} selected
      </p>

      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-2">
        {filteredOptions.map((option) => {
          const checked = selected.includes(option.id)

          return (
            <label
              key={option.id}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                checked
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOption(option.id)}
                className="h-5 w-5 rounded"
              />

              <span className="min-w-0">
                <span className="block font-medium text-slate-900">
                  {option.label}
                </span>

                {option.description && (
                  <span className="block truncate text-xs text-slate-500">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          )
        })}

        {filteredOptions.length === 0 && (
          <p className="p-4 text-center text-sm text-slate-500">
            No matching items found.
          </p>
        )}
      </div>
    </section>
  )
}
