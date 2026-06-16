// components/CategoryMultiSelect.tsx
'use client'

import { useState, useEffect } from 'react'

type Category = { id: string; name: string }

interface Props {
  categories: Category[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export default function CategoryMultiSelect({ categories, selectedIds, onChange }: Props) {
  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(s => s !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map(cat => (
        <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedIds.includes(cat.id)}
            onChange={() => toggle(cat.id)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm">{cat.name}</span>
        </label>
      ))}
    </div>
  )
}