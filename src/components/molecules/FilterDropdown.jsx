import { useState } from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FilterDropdown = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterToggle = (filterType, value) => {
    onFilterChange(filterType, value)
  }

  const hasActiveFilters = filters.priority.length > 0 || filters.status !== 'all'

  return (
    <div className="relative">
      <Button
        variant={hasActiveFilters ? "default" : "ghost"}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <ApperIcon name="Filter" className="h-4 w-4" />
        Filter
        {hasActiveFilters && (
          <span className="bg-white text-emerald-600 text-xs px-1.5 py-0.5 rounded-full">
            {filters.priority.length + (filters.status !== 'all' ? 1 : 0)}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64 animate-fade-in">
            {/* Status Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
              <div className="space-y-2">
                {['all', 'active', 'completed'].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={filters.status === status}
                      onChange={() => handleFilterToggle('status', status)}
                      className="text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-600 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
              <div className="space-y-2">
                {['high', 'medium', 'low'].map((priority) => (
                  <label key={priority} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority)}
                      onChange={() => {
                        const newPriorities = filters.priority.includes(priority)
                          ? filters.priority.filter(p => p !== priority)
                          : [...filters.priority, priority]
                        handleFilterToggle('priority', newPriorities)
                      }}
                      className="text-emerald-500 focus:ring-emerald-500 rounded"
                    />
                    <span className="text-sm text-gray-600 capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleFilterToggle('status', 'all')
                    handleFilterToggle('priority', [])
                    setIsOpen(false)
                  }}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default FilterDropdown