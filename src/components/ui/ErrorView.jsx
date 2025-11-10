import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="relative mb-6">
        <div className="h-24 w-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="h-12 w-12 text-red-500" />
        </div>
        <div className="absolute -top-1 -right-1 h-8 w-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name="X" className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}. Don't worry, this happens sometimes. Please try again or contact support if the problem persists.
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="px-6">
          <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
      
      <div className="mt-8 text-sm text-gray-500">
        <p>If this error continues, please refresh the page or contact support.</p>
      </div>
    </motion.div>
  )
}

export default ErrorView