import categoriesData from '@/services/mockData/categories.json'
import { storage } from '@/utils/storage'

const CATEGORIES_KEY = 'taskflow_categories'

// Initialize storage with mock data if empty
const initializeCategories = () => {
  const stored = storage.get(CATEGORIES_KEY)
  if (!stored || stored.length === 0) {
    storage.set(CATEGORIES_KEY, categoriesData)
    return categoriesData
  }
  return stored
}

export const categoryService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...initializeCategories()]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150))
    const categories = initializeCategories()
    return categories.find(category => category.Id === parseInt(id))
  },

  create: async (categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const categories = initializeCategories()
    const maxId = categories.reduce((max, category) => Math.max(max, category.Id), 0)
    
    const newCategory = {
      Id: maxId + 1,
      name: categoryData.name,
      color: categoryData.color || '#6b7280',
      icon: categoryData.icon || 'Folder',
      taskCount: 0,
      createdAt: new Date().toISOString()
    }
    
    const updatedCategories = [...categories, newCategory]
    storage.set(CATEGORIES_KEY, updatedCategories)
    return newCategory
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const categories = initializeCategories()
    const categoryIndex = categories.findIndex(category => category.Id === parseInt(id))
    
    if (categoryIndex === -1) {
      throw new Error('Category not found')
    }
    
    const updatedCategory = {
      ...categories[categoryIndex],
      ...updateData
    }
    
    categories[categoryIndex] = updatedCategory
    storage.set(CATEGORIES_KEY, categories)
    return updatedCategory
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const categories = initializeCategories()
    const filteredCategories = categories.filter(category => category.Id !== parseInt(id))
    storage.set(CATEGORIES_KEY, filteredCategories)
    return true
  }
}