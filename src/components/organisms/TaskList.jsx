import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/organisms/TaskCard'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Empty from '@/components/ui/Empty'

const TaskList = ({ 
  tasks, 
  categories, 
  onComplete, 
  onEdit, 
  onDelete, 
  showCompleted = false 
}) => {
  const [showCompletedSection, setShowCompletedSection] = useState(false)

  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  const getCategoryForTask = (task) => {
    return categories.find(cat => cat.Id.toString() === task.categoryId?.toString())
  }

  const renderTasks = (taskList, title, showToggle = false) => {
    if (taskList.length === 0 && !showToggle) {
      return <Empty />
    }

    return (
      <div className="space-y-4">
        {title && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {showToggle && taskList.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setShowCompletedSection(!showCompletedSection)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ApperIcon 
                  name={showCompletedSection ? "ChevronUp" : "ChevronDown"} 
                  className="h-4 w-4" 
                />
                {showCompletedSection ? 'Hide' : 'Show'} ({taskList.length})
              </Button>
            )}
          </div>
        )}

        {(!showToggle || showCompletedSection) && (
          <AnimatePresence>
            <div className="space-y-4">
              {taskList.map(task => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  category={getCategoryForTask(task)}
                  onComplete={onComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    )
  }

  if (showCompleted) {
    return renderTasks(completedTasks, "Completed Tasks")
  }

  return (
    <div className="space-y-8">
      {/* Active Tasks */}
      {activeTasks.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {activeTasks.map(task => (
              <TaskCard
                key={task.Id}
                task={task}
                category={getCategoryForTask(task)}
                onComplete={onComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Empty />
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="border-t border-gray-100 pt-8">
          {renderTasks(completedTasks, "Completed", true)}
        </div>
      )}
    </div>
  )
}

export default TaskList