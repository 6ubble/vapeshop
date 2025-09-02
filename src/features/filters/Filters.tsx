import React from 'react'
import { useFiltersStore } from '../../shared/lib/stores'
import { useTelegram } from '../../shared/lib/Telegram'
import { CATEGORIES } from '../../shared/lib/utils'

export const ProductFilters: React.FC = () => {
  const { selectedCategory, setCategory } = useFiltersStore()
  const { haptic } = useTelegram()

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map(category => (
        <button
          key={category.id}
          onClick={() => {
            haptic.light()
            setCategory(category.id)
          }}
          className={`
            px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0
            ${selectedCategory === category.id
              ? 'bg-tg-button text-tg-button-text'
              : 'bg-tg-secondary-bg text-tg-text hover:bg-gray-200'
            }
          `}
        >
          {category.emoji} {category.name}
        </button>
      ))}
    </div>
  )
}