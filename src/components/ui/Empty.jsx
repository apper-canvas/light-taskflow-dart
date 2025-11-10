import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "No tasks yet", 
  message = "Create your first task to get started with organizing your work!",
  actionLabel = "Add your first task",
  onAction,
  icon = "ListTodo"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="relative mb-8">
        <div className="h-24 w-24 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name={icon} className="h-12 w-12 text-emerald-600" />
        </div>
        <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
          <ApperIcon name="Plus" className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {message}
      </p>
      
      {onAction && (
        <Button onClick={onAction} size="lg" className="px-8">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          {actionLabel}
        </Button>
      )}
      
      {/* Decorative elements */}
      <div className="mt-12 flex items-center gap-4 text-gray-400">
        <div className="flex items-center gap-2">
          <ApperIcon name="CheckCircle" className="h-4 w-4" />
          <span className="text-sm">Stay organized</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
        <div className="flex items-center gap-2">
          <ApperIcon name="Clock" className="h-4 w-4" />
          <span className="text-sm">Meet deadlines</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
        <div className="flex items-center gap-2">
          <ApperIcon name="Target" className="h-4 w-4" />
          <span className="text-sm">Achieve goals</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Empty