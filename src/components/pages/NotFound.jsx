import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="h-32 w-32 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <ApperIcon name="FileQuestion" className="h-16 w-16 text-emerald-600" />
          </div>
          <div className="absolute -top-2 -right-2 h-12 w-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">404</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/')} 
            size="lg" 
            className="w-full sm:w-auto px-8"
          >
            <ApperIcon name="Home" className="h-5 w-5 mr-2" />
            Back to Tasks
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="text-gray-600 hover:text-gray-800"
            >
              <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support or try refreshing the page.</p>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound