import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import CategorySidebar from '@/components/organisms/CategorySidebar'
import TaskList from '@/components/organisms/TaskList'
import TaskModal from '@/components/organisms/TaskModal'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import { taskService } from '@/services/api/taskService'
import { categoryService } from '@/services/api/categoryService'
import { sortByDueDate } from '@/utils/dateUtils'

const Home = () => {
  // Data state
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // UI state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: 'all', // all, active, completed
    priority: [] // high, medium, low
  })
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  // Filter and search tasks
const filteredTasks = tasks.filter(task => {
    // Search filter
    const title = task.title_c || task.title || ''
    const description = task.description_c || task.description || ''
    if (searchQuery && !title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Category filter
    const completed = task.completed_c !== undefined ? task.completed_c : task.completed
    if (selectedCategory === 'active') {
      if (completed) return false
    } else if (selectedCategory === 'completed') {
      if (!completed) return false
    } else if (selectedCategory !== 'all') {
      const categoryId = task.category_id_c?.Id || task.category_id_c || task.categoryId
      if (categoryId?.toString() !== selectedCategory) return false
    }

    // Status filter
    if (filters.status === 'active' && completed) return false
    if (filters.status === 'completed' && !completed) return false

    // Priority filter
    const priority = task.priority_c || task.priority
    if (filters.priority.length > 0 && !filters.priority.includes(priority)) {
      return false
    }

    return true
  })

  // Sort filtered tasks
  const sortedTasks = sortByDueDate(filteredTasks)

  // Calculate task counts for sidebar
const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => {
      const completed = t.completed_c !== undefined ? t.completed_c : t.completed
      return !completed
    }).length,
    completed: tasks.filter(t => {
      const completed = t.completed_c !== undefined ? t.completed_c : t.completed
      return completed
    }).length,
    categories: {}
  }

  categories.forEach(category => {
    const categoryId = category.Id
    taskCounts.categories[categoryId] = tasks.filter(t => {
      const taskCategoryId = t.category_id_c?.Id || t.category_id_c || t.categoryId
      return taskCategoryId?.toString() === categoryId.toString()
    }).length
  })

  // Task actions
  const handleCreateTask = () => {
    setEditingTask(null)
    setShowTaskModal(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData)
        setTasks(prev => prev.map(t => t.Id === updatedTask.Id ? updatedTask : t))
      } else {
        const newTask = await taskService.create(taskData)
        setTasks(prev => [newTask, ...prev])
      }
      setShowTaskModal(false)
      setEditingTask(null)
    } catch (err) {
      toast.error(err.message || 'Failed to save task')
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      const updatedTask = await taskService.complete(taskId)
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t))
      toast.success('Task completed! 🎉')
    } catch (err) {
      toast.error(err.message || 'Failed to complete task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId)
        setTasks(prev => prev.filter(t => t.Id !== taskId))
        toast.success('Task deleted')
      } catch (err) {
        toast.error(err.message || 'Failed to delete task')
      }
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex">
        {/* Desktop Sidebar Skeleton */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-100 p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-32" />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorView message={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="absolute left-0 top-0 h-full w-70 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={(category) => {
                setSelectedCategory(category)
                setIsMobileSidebarOpen(false)
              }}
              taskCounts={taskCounts}
              className="h-full"
            />
          </motion.div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          taskCounts={taskCounts}
          className="h-screen sticky top-0"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <ApperIcon name="Menu" className="h-5 w-5" />
                </Button>

                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                  <p className="text-gray-600">
{tasks.filter(t => {
                      const completed = t.completed_c !== undefined ? t.completed_c : t.completed
                      return !completed
                    }).length} active tasks • {tasks.filter(t => {
                      const completed = t.completed_c !== undefined ? t.completed_c : t.completed
                      return completed
                    }).length} completed
                  </p>
                </div>
              </div>

              <Button onClick={handleCreateTask} size="lg">
                <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
                New Task
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search tasks..."
                />
              </div>
              <FilterDropdown
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </header>

        {/* Task Content */}
        <main className="flex-1 p-6">
          {sortedTasks.length === 0 && searchQuery === '' && selectedCategory === 'all' && filters.status === 'all' && filters.priority.length === 0 ? (
            <Empty
              title="Welcome to TaskFlow!"
              message="Start organizing your tasks and boost your productivity. Create your first task to begin your journey to better task management."
              actionLabel="Create your first task"
              onAction={handleCreateTask}
            />
          ) : (
            <TaskList
              tasks={sortedTasks}
              categories={categories}
              onComplete={handleCompleteTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              showCompleted={selectedCategory === 'completed'}
            />
          )}
        </main>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false)
          setEditingTask(null)
        }}
        onSave={handleSaveTask}
        task={editingTask}
        categories={categories}
      />
    </div>
  )
}

export default Home