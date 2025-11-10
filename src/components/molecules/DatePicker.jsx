import { useState } from 'react'
import { format } from 'date-fns'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const DatePicker = ({ value, onChange, placeholder = "Select date..." }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateChange = (e) => {
    const dateValue = e.target.value
    if (dateValue) {
      onChange(new Date(dateValue))
    } else {
      onChange(null)
    }
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setIsOpen(false)
  }

  const formatValue = () => {
    if (!value) return ""
    return format(value, 'yyyy-MM-dd')
  }

  const displayValue = () => {
    if (!value) return ""
    return format(value, 'MMM dd, yyyy')
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={displayValue()}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className="pr-20 cursor-pointer"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-6 w-6 hover:bg-gray-100"
            >
              <ApperIcon name="X" className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-6 w-6 hover:bg-gray-100"
          >
            <ApperIcon name="Calendar" className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <Input
              type="date"
              value={formatValue()}
              onChange={handleDateChange}
              className="w-auto"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default DatePicker