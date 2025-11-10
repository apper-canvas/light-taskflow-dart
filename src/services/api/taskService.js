import tasksData from '@/services/mockData/tasks.json'
import { storage } from '@/utils/storage'

const TASKS_KEY = 'taskflow_tasks'

// Initialize storage with mock data if empty
const initializeTasks = () => {
  const stored = storage.get(TASKS_KEY)
  if (!stored || stored.length === 0) {
    storage.set(TASKS_KEY, tasksData)
    return tasksData
  }
  return stored
}

export const taskService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...initializeTasks()]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const tasks = initializeTasks()
    return tasks.find(task => task.Id === parseInt(id))
  },

  create: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const tasks = initializeTasks()
    const maxId = tasks.reduce((max, task) => Math.max(max, task.Id), 0)
    
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : null,
      categoryId: taskData.categoryId || '',
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const updatedTasks = [...tasks, newTask]
    storage.set(TASKS_KEY, updatedTasks)
    return newTask
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const tasks = initializeTasks()
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id))
    
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updateData,
      dueDate: updateData.dueDate ? updateData.dueDate.toISOString() : updateData.dueDate,
      updatedAt: new Date().toISOString()
    }
    
    tasks[taskIndex] = updatedTask
    storage.set(TASKS_KEY, tasks)
    return updatedTask
  },

  complete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const tasks = initializeTasks()
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id))
    
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      completed: true,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    storage.set(TASKS_KEY, tasks)
    return tasks[taskIndex]
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const tasks = initializeTasks()
    const filteredTasks = tasks.filter(task => task.Id !== parseInt(id))
    storage.set(TASKS_KEY, filteredTasks)
    return true
  }
}