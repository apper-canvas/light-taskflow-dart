import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

export default function FileUpload({ 
  value, 
  onChange, 
  accept = "*", 
  maxSize = 10 * 1024 * 1024, // 10MB default
  disabled = false,
  className = "" 
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`
    }
    
    if (accept !== "*" && accept !== "") {
      const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase())
      const fileName = file.name.toLowerCase()
      const fileExtension = '.' + fileName.split('.').pop()
      
      if (!acceptedTypes.some(type => 
        type === fileExtension || 
        fileName.includes(type.replace('*', ''))
      )) {
        return `File type not supported. Accepted types: ${accept}`
      }
    }
    
    return null
  }

  const simulateUpload = async (file) => {
    // Simulate file upload process
    setIsUploading(true)
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, we'll just use the file name
    // In a real implementation, this would upload to a server
    const fileName = `${Date.now()}_${file.name}`
    
    setIsUploading(false)
    return fileName
  }

  const handleFileSelect = async (files) => {
    const file = files[0]
    if (!file) return

    const error = validateFile(file)
    if (error) {
      alert(error) // In production, use proper error handling/toast
      return
    }

    try {
      const fileName = await simulateUpload(file)
      onChange(fileName)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled || isUploading) return
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleRemoveFile = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileSelect = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {!value ? (
        <motion.div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            isDragOver 
              ? "border-primary-500 bg-primary-50" 
              : "border-gray-300 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed",
            isUploading && "cursor-wait"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          whileHover={!disabled && !isUploading ? { scale: 1.01 } : {}}
          whileTap={!disabled && !isUploading ? { scale: 0.99 } : {}}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin">
                <ApperIcon name="Loader2" size={32} className="text-primary-500" />
              </div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <ApperIcon 
                name="Upload" 
                size={32} 
                className={cn(
                  "transition-colors",
                  isDragOver ? "text-primary-500" : "text-gray-400"
                )} 
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Drop file here or <span className="text-primary-600">browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max size: {formatFileSize(maxSize)}
                  {accept !== "*" && ` • Types: ${accept}`}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
        >
          <ApperIcon name="File" size={20} className="text-gray-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate" title={value}>
              {value.split('_').slice(1).join('_') || value}
            </p>
            <p className="text-xs text-gray-500">Attached file</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            disabled={disabled}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </motion.div>
      )}
    </div>
  )
}