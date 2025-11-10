import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Select from '@/components/atoms/Select'
import DatePicker from '@/components/molecules/DatePicker'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const TaskModal = ({ isOpen, onClose, onSave, task = null, categories = [] }) => {
  const [formData, setFormData] = useState({
title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
    categoryId: '',
    summary: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
if (task) {
      const title = task.title_c || task.title || ''
const description = task.description_c || task.description || ''
      const priority = task.priority_c || task.priority || 'medium'
      const dueDate = task.due_date_c || task.dueDate
      const categoryId = task.category_id_c?.Id || task.category_id_c || task.categoryId || ''
      const summary = task.summary_c || task.summary || ''
      setFormData({
title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        categoryId: categoryId.toString(),
        summary
      })
    } else {
setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: null,
        categoryId: categories.length > 0 ? categories[0].Id.toString() : '',
        summary: ''
      })
    }
    setErrors({})
  }, [task, categories, isOpen])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
if (validateForm()) {
onSave({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        summary: formData.summary.trim()
      })
      onClose()
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <Input
              type="text"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={errors.title ? 'border-red-300 focus-visible:ring-red-500' : ''}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              placeholder="Add a description..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

{/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief summary of the task (auto-generated from title)"
              rows={2}
              className="w-full resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Summary is automatically generated from the task title, but can be customized
            </p>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Select>
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
              >
                <option value="">No Category</option>
{categories.map(category => (
                  <option key={category.Id} value={category.Id.toString()}>
                    {category.name_c || category.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <DatePicker
              value={formData.dueDate}
              onChange={(date) => handleChange('dueDate', date)}
              placeholder="Select due date..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {task ? 'Update Task' : 'Create Task'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default TaskModal