import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

const TABLE_NAME = 'task_c'

export const taskService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords(TABLE_NAME, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      return []
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      }

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  create: async (taskData) => {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        records: [
          {
            Name: taskData.title || taskData.title_c,
            title_c: taskData.title || taskData.title_c,
            description_c: taskData.description || taskData.description_c || '',
            priority_c: taskData.priority || taskData.priority_c || 'medium',
            due_date_c: taskData.dueDate ? (taskData.dueDate instanceof Date ? taskData.dueDate.toISOString() : taskData.dueDate) : null,
            category_id_c: taskData.categoryId ? parseInt(taskData.categoryId) : null,
            completed_c: false,
            completed_at_c: null,
            created_at_c: new Date().toISOString(),
            updated_at_c: new Date().toISOString()
          }
        ]
      }

      const response = await apperClient.createRecord(TABLE_NAME, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      return null
    }
  },

  update: async (id, updateData) => {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            ...(updateData.title && { Name: updateData.title, title_c: updateData.title }),
            ...(updateData.description !== undefined && { description_c: updateData.description }),
            ...(updateData.priority && { priority_c: updateData.priority }),
            ...(updateData.dueDate !== undefined && { 
              due_date_c: updateData.dueDate ? 
                (updateData.dueDate instanceof Date ? updateData.dueDate.toISOString() : updateData.dueDate) 
                : null 
            }),
            ...(updateData.categoryId !== undefined && { 
              category_id_c: updateData.categoryId ? parseInt(updateData.categoryId) : null 
            }),
            ...(updateData.completed !== undefined && { completed_c: updateData.completed }),
            ...(updateData.completedAt !== undefined && { completed_at_c: updateData.completedAt }),
            updated_at_c: new Date().toISOString()
          }
        ]
      }

      const response = await apperClient.updateRecord(TABLE_NAME, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      return null
    }
  },

  complete: async (id) => {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            completed_c: true,
            completed_at_c: new Date().toISOString(),
            updated_at_c: new Date().toISOString()
          }
        ]
      }

      const response = await apperClient.updateRecord(TABLE_NAME, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to complete ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error completing task:", error?.response?.data?.message || error)
      return null
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord(TABLE_NAME, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      return false
    }
  }
}