import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  taskCounts,
  className = ""
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const allTasksCount = taskCounts.all || 0
  const activeTasksCount = taskCounts.active || 0
  const completedTasksCount = taskCounts.completed || 0

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`bg-white border-r border-gray-100 ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {isCollapsed ? 'Lists' : 'Task Lists'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <ApperIcon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} className="h-4 w-4" />
          </Button>
        </div>

        {/* Default Categories */}
        <div className="space-y-2 mb-6">
          <SidebarItem
            icon="List"
            label="All Tasks"
            count={allTasksCount}
            isActive={selectedCategory === 'all'}
            onClick={() => onCategorySelect('all')}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon="Circle"
            label="Active"
            count={activeTasksCount}
            isActive={selectedCategory === 'active'}
            onClick={() => onCategorySelect('active')}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon="CheckCircle"
            label="Completed"
            count={completedTasksCount}
            isActive={selectedCategory === 'completed'}
            onClick={() => onCategorySelect('completed')}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <>
            <div className="border-t border-gray-100 pt-6">
              {!isCollapsed && (
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Categories
                </h3>
              )}
              <div className="space-y-2">
                {categories.map(category => (
                  <SidebarItem
key={category.Id}
                    icon={category.icon_c || category.icon || "Folder"}
                    label={category.name_c || category.name}
                    count={taskCounts.categories?.[category.Id] || 0}
                    isActive={selectedCategory === category.Id.toString()}
                    onClick={() => onCategorySelect(category.Id.toString())}
                    color={category.color_c || category.color}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

const SidebarItem = ({ 
  icon, 
  label, 
  count, 
  isActive, 
  onClick, 
  color, 
  isCollapsed 
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 group ${
        isActive 
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' 
          : 'hover:bg-gray-50 text-gray-700'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <ApperIcon 
          name={icon} 
          className={`h-5 w-5 flex-shrink-0 ${
            isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
          }`}
          style={color && !isActive ? { color: color } : {}}
        />
        {!isCollapsed && (
          <span className={`font-medium truncate ${
            isActive ? 'text-white' : 'text-gray-900'
          }`}>
            {label}
          </span>
        )}
      </div>
      
      {!isCollapsed && count > 0 && (
        <Badge 
          className={`ml-2 ${
            isActive 
              ? 'bg-white/20 text-white border-white/30' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {count}
        </Badge>
      )}
    </button>
  )
}

export default CategorySidebar