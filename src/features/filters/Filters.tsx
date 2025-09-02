import React, { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button, Card } from '../../shared/ui'
import { useFiltersStore } from '../../shared/lib/stores'
import { useTelegram } from '../../shared/lib/Telegram'
import { CATEGORIES } from '../../shared/lib/utils'
import type { CategoryId } from '../../shared/types/types'

export const ProductFilters: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempCategory, setTempCategory] = useState<CategoryId>('all')
  const { selectedCategory, setCategory } = useFiltersStore()
  const { haptic } = useTelegram()

  const handleOpen = () => {
    setTempCategory(selectedCategory)
    setIsOpen(true)
  }

  const handleCategorySelect = (categoryId: CategoryId) => {
    haptic.light()
    setTempCategory(categoryId)
  }

  const handleApply = () => {
    haptic.light()
    setCategory(tempCategory)
    setIsOpen(false)
  }

  const handleReset = () => {
    haptic.light()
    setTempCategory('all')
  }

  const selectedCategoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Все'

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleOpen}
        className="w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <span>Фильтры</span>
        </div>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white" onClick={() => setIsOpen(false)}>
          <div 
            className="h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Фильтры</h3>
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="p-2"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-center">
              <h4 className="font-medium mb-6 text-center">Категории</h4>
              <div className="space-y-4">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`
                      w-full text-center p-4 rounded-lg text-lg
                      ${tempCategory === category.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-800'
                      }
                    `}
                  >
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Сбросить
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-3 px-6 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  Применить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}