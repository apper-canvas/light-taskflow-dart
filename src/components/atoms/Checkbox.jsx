import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = forwardRef(({ className, checked, ...props }, ref) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "relative h-5 w-5 rounded border-2 border-gray-300 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        checked 
          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500 shadow-md" 
          : "bg-white hover:border-gray-400",
        className
      )}
      ref={ref}
      {...props}
    >
      {checked && (
        <ApperIcon 
          name="Check" 
          className="absolute inset-0 h-3 w-3 m-auto text-white animate-scale-in" 
        />
      )}
    </button>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox