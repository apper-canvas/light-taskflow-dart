import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Checkbox from '@/components/atoms/Checkbox'
import PriorityBadge from '@/components/molecules/PriorityBadge'
import CategoryTag from '@/components/molecules/CategoryTag'
import { formatDate, isOverdue } from '@/utils/dateUtils'

const TaskCard = ({ task, category, onComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    // Add a small delay for the animation
    setTimeout(() => {
      onComplete(task.Id)
      setIsCompleting(false)
    }, 300)
  }

const completed = task.completed_c !== undefined ? task.completed_c : task.completed
  const dueDate = task.due_date_c || task.dueDate
  const title = task.title_c || task.title
  const description = task.description_c || task.description
  const priority = task.priority_c || task.priority
  const overdue = !completed && dueDate && isOverdue(dueDate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isCompleting ? 0.7 : 1, 
        scale: isCompleting ? 0.98 : 1,
        y: 0 
      }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${
completed ? 'opacity-60' : ''
      } ${overdue ? 'ring-2 ring-red-200 bg-red-50/30' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Checkbox */}
          <div className="pt-0.5">
            <Checkbox
checked={completed}
              onClick={handleComplete}
              className={isCompleting ? 'animate-pulse' : ''}
            />
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`text-lg font-semibold text-gray-900 ${
completed ? 'line-through text-gray-500' : ''
              }`}>
                {title}
              </h3>
            </div>

{description && (
              <p className={`text-gray-600 mb-4 ${
                completed ? 'line-through text-gray-400' : ''
              }`}>
                {description}
              </p>
            )}

            {/* Tags and Date */}
            <div className="flex items-center gap-3 mb-4">
<PriorityBadge priority={priority} />
              {category && <CategoryTag category={category} />}
              
{dueDate && (
                <div className={`flex items-center gap-1 text-sm ${
                  overdue ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  {formatDate(dueDate)}
                  {overdue && (
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs ml-2">
                      Overdue
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ApperIcon name="Edit2" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.Id)}
            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard