import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Code,
  ExternalLink,
  Github,
  Edit,
  Trash2,
  X,
  Eye,
  Save
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const Projects = () => {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  // Fetch projects
  const { data: projectsData, isLoading, refetch } = useQuery(
    ['projects', filters],
    () => {
      const params = new URLSearchParams()
      if (filters.tech_stack) params.append('tech_stack', filters.tech_stack)
      if (filters.year) params.append('year', filters.year)
      if (filters.search) params.append('search', filters.search)
      if (filters.user_id) params.append('user_id', filters.user_id)
      
      return api.get(`/projects?${params.toString()}`).then(res => res.data.data)
    }
  )

  // Create project mutation
  const createProjectMutation = useMutation(
    (projectData) => api.post('/projects', projectData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects')
        queryClient.invalidateQueries(['userProjects', user?._id])
        toast.success('Project created successfully!')
        setShowCreateModal(false)
        reset()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create project')
      }
    }
  )

  // Update project mutation
  const updateProjectMutation = useMutation(
    ({ id, data }) => api.put(`/projects/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects')
        queryClient.invalidateQueries(['userProjects', user?._id])
        toast.success('Project updated successfully!')
        setEditingProject(null)
        reset()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update project')
      }
    }
  )

  // Delete project mutation
  const deleteProjectMutation = useMutation(
    (id) => api.delete(`/projects/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects')
        queryClient.invalidateQueries(['userProjects', user?._id])
        toast.success('Project deleted successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete project')
      }
    }
  )

  const onSearch = (data) => {
    setFilters(data)
    refetch()
  }

  const clearFilters = () => {
    reset()
    setFilters({})
    setShowFilters(false)
  }

  const onCreateProject = (data) => {
    const techStack = data.tech_stack ? data.tech_stack.split(',').map(t => t.trim()) : []
    createProjectMutation.mutate({ ...data, tech_stack })
  }

  const onUpdateProject = (data) => {
    const techStack = data.tech_stack ? data.tech_stack.split(',').map(t => t.trim()) : []
    updateProjectMutation.mutate({ id: editingProject._id, data: { ...data, tech_stack } })
  }

  const onDeleteProject = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(id)
    }
  }

  const onEditProject = (project) => {
    setEditingProject(project)
    setValue('title', project.title)
    setValue('description', project.description)
    setValue('tech_stack', (project.tech_stack || []).join(', '))
    setValue('github_link', project.github_link)
    setValue('demo_link', project.demo_link)
    setValue('year', project.year)
    setValue('status', project.status)
  }

  const projects = projectsData?.projects || []

  const commonTech = [
    'React', 'Node.js', 'Python', 'JavaScript', 'Java', 'C++', 'MongoDB',
    'MySQL', 'Machine Learning', 'Data Science', 'UI/UX', 'Flutter',
    'Blockchain', 'IoT', 'AWS', 'Docker', 'Git', 'TypeScript', 'Express.js'
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-400 bg-green-400/20'
      case 'In Progress':
        return 'text-blue-400 bg-blue-400/20'
      case 'Planning':
        return 'text-yellow-400 bg-yellow-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">
            Showcase your projects and discover what others are building
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Search Section */}
      <div className="card">
        <form onSubmit={handleSubmit(onSearch)} className="space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input pl-12 w-full"
                placeholder="Search projects..."
                {...register('search')}
              />
            </div>
            <button
              type="submit"
              className="btn-primary flex items-center justify-center px-6"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center justify-center px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="p-6 rounded-xl glass border border-white/20 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="React, Node.js"
                    {...register('tech_stack')}
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year
                  </label>
                  <select className="input w-full" {...register('year')}>
                    <option value="">All Years</option>
                    {[2024, 2023, 2022, 2021, 2020].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* My Projects */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Show
                  </label>
                  <select className="input w-full" {...register('user_id')}>
                    <option value="">All Projects</option>
                    <option value={user?._id}>My Projects</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {projects.length} Projects Found
          </h2>
          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner size="large" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="card card-hover group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className="text-xs text-gray-500">{project.year}</span>
                    </div>
                  </div>
                  {project.user_id._id === user?._id && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditProject(project)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(project._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>

                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {(project.tech_stack || []).slice(0, 4).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.tech_stack || []).length > 4 && (
                      <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
                        +{(project.tech_stack || []).length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg glass">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {project.user_id.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{project.user_id.name}</p>
                    <p className="text-xs text-gray-400">{project.user_id.college}</p>
                  </div>
                </div>

                {/* Links */}
                <div className="flex items-center space-x-2">
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                    >
                      <Github className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                  {project.demo_link && (
                    <a
                      href={project.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                  <button className="btn-primary text-sm px-3 py-1.5 flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or create your first project
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Project
            </button>
          </div>
        )}
      </div>

      {/* Popular Technologies */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Popular Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {commonTech.map((tech) => (
            <button
              key={tech}
              onClick={() => {
                reset({ tech_stack: tech })
                setFilters({ tech_stack: tech })
                refetch()
              }}
              className="px-3 py-1.5 bg-primary-600/20 text-primary-400 rounded-lg hover:bg-primary-600/30 transition-colors text-sm"
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50">
          <div className="w-full max-w-2xl card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingProject(null)
                  reset()
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingProject ? onUpdateProject : onCreateProject)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Project Title"
                  {...register('title', { required: 'Project title is required' })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  className="input w-full resize-none"
                  rows={4}
                  placeholder="Describe your project..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="React, Node.js, MongoDB"
                    {...register('tech_stack')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year *
                  </label>
                  <select className="input w-full" {...register('year', { required: 'Year is required' })}>
                    <option value="">Select Year</option>
                    {[2024, 2023, 2022, 2021, 2020].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-400">{errors.year.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    className="input w-full"
                    placeholder="https://github.com/username/repo"
                    {...register('github_link')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    className="input w-full"
                    placeholder="https://your-project-demo.com"
                    {...register('demo_link')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select className="input w-full" {...register('status')}>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingProject(null)
                    reset()
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isLoading || updateProjectMutation.isLoading}
                  className="btn-primary"
                >
                  {createProjectMutation.isLoading || updateProjectMutation.isLoading
                    ? 'Saving...'
                    : editingProject ? 'Update Project' : 'Create Project'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects
