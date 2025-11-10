import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Badge = forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    high: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200",
    medium: "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border border-amber-200",
    low: "bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-200",
    category: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

Badge.displayName = "Badge"

export default Badge