import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

const TABLE_NAME = 'category_c'

export const categoryService = {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "created_at_c"}}
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
      console.error("Error fetching categories:", error?.response?.data?.message || error)
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      }

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  create: async (categoryData) => {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        records: [
          {
            Name: categoryData.name || categoryData.name_c,
            name_c: categoryData.name || categoryData.name_c,
            color_c: categoryData.color || categoryData.color_c || '#6b7280',
            icon_c: categoryData.icon || categoryData.icon_c || 'Folder',
            task_count_c: 0,
            created_at_c: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} categories:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error)
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
            ...(updateData.name && { Name: updateData.name, name_c: updateData.name }),
            ...(updateData.color && { color_c: updateData.color }),
            ...(updateData.icon && { icon_c: updateData.icon }),
            ...(updateData.taskCount !== undefined && { task_count_c: updateData.taskCount })
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
          console.error(`Failed to update ${failed.length} categories:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error)
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
          console.error(`Failed to delete ${failed.length} categories:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error)
      return false
    }
  }
}