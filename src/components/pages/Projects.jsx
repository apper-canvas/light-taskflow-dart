import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import ProjectModal from '@/components/organisms/ProjectModal'
import { projectService } from '@/services/api/projectService'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await projectService.getAll()
      
      if (response.success) {
        setProjects(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = () => {
    setEditingProject(null)
    setShowModal(true)
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setShowModal(true)
  }

  const handleSaveProject = async (projectData) => {
    try {
      let response
      if (editingProject) {
        response = await projectService.update(editingProject.Id, projectData)
        if (response.success) {
          setProjects(prev => prev.map(p => 
            p.Id === editingProject.Id 
              ? { ...p, ...projectData }
              : p
          ))
          toast.success('Project updated successfully')
        }
      } else {
        response = await projectService.create(projectData)
        if (response.success) {
          await loadProjects() // Reload to get complete data with system fields
          toast.success('Project created successfully')
        }
      }
      
      if (response.success) {
        setShowModal(false)
        setEditingProject(null)
      } else {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error('Failed to save project')
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await projectService.delete(projectId)
      if (response.success) {
        setProjects(prev => prev.filter(p => p.Id !== projectId))
        toast.success('Project deleted successfully')
      } else {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <ErrorView 
        title="Failed to load projects" 
        message={error}
        onRetry={loadProjects}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Projects
              </h1>
              <p className="text-gray-600">
                Manage your projects and track their progress
              </p>
            </div>
            <Button
              onClick={handleCreateProject}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              New Project
            </Button>
          </motion.div>
        </div>

        {/* Search and Actions */}
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search projects..."
          />
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Empty
            title="No projects found"
            message={searchTerm ? "No projects match your search criteria" : "Get started by creating your first project"}
            actionLabel="Create Project"
            onAction={handleCreateProject}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProject(project)}
                      className="p-2"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.Id)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Project Dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    <span>Start: {formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="CalendarCheck" className="w-4 h-4" />
                    <span>End: {formatDate(project.endDate)}</span>
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Project Modal */}
        {showModal && (
          <ProjectModal
            project={editingProject}
            onSave={handleSaveProject}
            onClose={() => {
              setShowModal(false)
              setEditingProject(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Projects