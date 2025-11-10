import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-gradient-to-r from-emerald-200 to-emerald-300 rounded-lg animate-pulse" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-10 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />

      {/* Task Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start gap-4">
              {/* Checkbox skeleton */}
              <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded border-2 animate-pulse mt-0.5" />
              
              <div className="flex-1 space-y-3">
                {/* Title skeleton */}
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse w-3/4" />
                
                {/* Description skeleton */}
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse w-full" />
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse w-2/3" />
                
                {/* Tags skeleton */}
                <div className="flex items-center gap-3">
                  <div className="h-6 w-16 bg-gradient-to-r from-red-200 to-red-300 rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                </div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex gap-1">
                <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Loading