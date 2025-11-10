import { getApperClient } from '@/services/apperClient'

const tableName = 'projects_c'

// Get all projects
export const getAll = async () => {
  try {
    const apperClient = getApperClient()
    const response = await apperClient.query(`SELECT * FROM ${tableName} ORDER BY CreatedOn DESC`)
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.map(project => ({
          Id: project.Id,
          name: project.name_c || '',
          description: project.description_c || '',
          startDate: project.start_date_c,
          endDate: project.end_date_c,
          tags: project.Tags || [],
          createdOn: project.CreatedOn,
          createdBy: project.CreatedBy,
          modifiedOn: project.ModifiedOn,
          modifiedBy: project.ModifiedBy
        }))
      }
    }
    
    return {
      success: false,
      error: response.error || 'Failed to fetch projects'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch projects'
    }
  }
}

// Get project by ID
export const getById = async (id) => {
  try {
    const apperClient = getApperClient()
    const response = await apperClient.query(`SELECT * FROM ${tableName} WHERE Id = ?`, [id])
    
    if (response.success && response.data && response.data.length > 0) {
      const project = response.data[0]
      return {
        success: true,
        data: {
          Id: project.Id,
          name: project.name_c || '',
          description: project.description_c || '',
          startDate: project.start_date_c,
          endDate: project.end_date_c,
          tags: project.Tags || [],
          createdOn: project.CreatedOn,
          createdBy: project.CreatedBy,
          modifiedOn: project.ModifiedOn,
          modifiedBy: project.ModifiedBy
        }
      }
    }
    
    return {
      success: false,
      error: 'Project not found'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch project'
    }
  }
}

// Create new project
export const create = async (projectData) => {
  try {
    const apperClient = getApperClient()
    
    // Only include updateable fields
    const data = {
      name_c: projectData.name || '',
      description_c: projectData.description || '',
      start_date_c: projectData.startDate || null,
      end_date_c: projectData.endDate || null,
      Tags: projectData.tags || []
    }
    
    const response = await apperClient.query(
      `INSERT INTO ${tableName} (name_c, description_c, start_date_c, end_date_c, Tags) VALUES (?, ?, ?, ?, ?)`,
      [data.name_c, data.description_c, data.start_date_c, data.end_date_c, JSON.stringify(data.Tags)]
    )
    
    if (response.success) {
      return {
        success: true,
        data: { Id: response.insertId, ...data }
      }
    }
    
    return {
      success: false,
      error: response.error || 'Failed to create project'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create project'
    }
  }
}

// Update project
export const update = async (id, projectData) => {
  try {
    const apperClient = getApperClient()
    
    // Only include updateable fields
    const data = {
      name_c: projectData.name || '',
      description_c: projectData.description || '',
      start_date_c: projectData.startDate || null,
      end_date_c: projectData.endDate || null,
      Tags: projectData.tags || []
    }
    
    const response = await apperClient.query(
      `UPDATE ${tableName} SET name_c = ?, description_c = ?, start_date_c = ?, end_date_c = ?, Tags = ? WHERE Id = ?`,
      [data.name_c, data.description_c, data.start_date_c, data.end_date_c, JSON.stringify(data.Tags), id]
    )
    
    if (response.success) {
      return {
        success: true,
        data: { Id: id, ...data }
      }
    }
    
    return {
      success: false,
      error: response.error || 'Failed to update project'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update project'
    }
  }
}

// Delete project
export const deleteProject = async (id) => {
  try {
    const apperClient = getApperClient()
    const response = await apperClient.query(`DELETE FROM ${tableName} WHERE Id = ?`, [id])
    
    if (response.success) {
      return {
        success: true,
        data: { id }
      }
    }
    
    return {
      success: false,
      error: response.error || 'Failed to delete project'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete project'
    }
  }
}

export const projectService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteProject
}