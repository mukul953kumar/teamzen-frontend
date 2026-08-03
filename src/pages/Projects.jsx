import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
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
  Save,
  Heart,
  MapPin,
  User,
  Sparkles,
  Layers,
  Star
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/useAuth'

const Projects = () => {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [likesState, setLikesState] = useState({})
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const likeMutation = useMutation(
    (projectId) => api.post(`/projects/like/${projectId}`),
    {
      onSuccess: (res, projectId) => {
        setLikesState(prev => ({
          ...prev,
          [projectId]: {
            liked: res.data.liked,
            count: res.data.likesCount
          }
        }))
        toast.success(res.data.message)
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to like project')
    }
  )

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
    const tech_stack = typeof data.tech_stack === 'string'
      ? data.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
      : (data.tech_stack || [])
    createProjectMutation.mutate({ ...data, tech_stack })
  }

  const onUpdateProject = (data) => {
    const tech_stack = typeof data.tech_stack === 'string'
      ? data.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
      : (data.tech_stack || [])
    updateProjectMutation.mutate({ id: editingProject._id, data: { ...data, tech_stack } })
  }

  const onDeleteProject = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Delete this project? This cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={() => { deleteProjectMutation.mutate(id); toast.dismiss(t.id) }} className="px-3 py-1 bg-red-500 text-white rounded text-sm font-bold">Delete</button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-semibold">Cancel</button>
          </div>
        </div>
      ),
      { duration: 10000 }
    )
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* Glassmorphic Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 13, 20, 0.95) 0%, rgba(20, 20, 35, 0.85) 100%)',
          backdropFilter: 'blur(20px)'
        }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <FolderOpen className="w-7 h-7 text-orange-400" />
              <span>Showcase & Innovation Gallery</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">Explore technical projects built by KNIT students or publish your own work.</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-sunset flex items-center justify-center text-xs sm:text-sm px-5 py-3 rounded-xl font-bold shadow-lg shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Publish New Project
          </button>
        </div>
      </div>

      {/* Search & Filter Container */}
      <div className="card space-y-5 border border-white/10 p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="input pl-10 w-full text-xs sm:text-sm"
                placeholder="Search projects by title, description, or tech stack..."
                {...register('search')}
              />
            </div>
            <button
              type="submit"
              className="btn-sunset text-xs sm:text-sm px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Projects</span>
            </button>
          </div>
        </form>

        {/* Projects Grid */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-400" />
              <span>Published Projects ({projects.length})</span>
            </h2>
            {Object.keys(filters).length > 0 && (
              <button onClick={clearFilters} className="text-xs text-orange-400 font-semibold hover:underline">
                Clear Filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-80">
              <LoadingSpinner size="large" />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project) => {
                const isOwner = user && (project.user_id?._id === user._id || project.user_id === user._id)
                const userLikesInfo = likesState[project._id] || {
                  liked: user && Array.isArray(project.likedBy)
                    ? project.likedBy.some(id => id.toString() === user._id || id === user._id)
                    : false,
                  count: project.likesCount || 0
                }

                return (
                  <div
                    key={project._id}
                    onClick={() => setSelectedProject(project)}
                    className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col justify-between space-y-4 shadow-xl cursor-pointer"
                  >
                    <div className="space-y-3">
                      
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-base group-hover:text-orange-300 transition-colors truncate">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              project.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {project.status || 'Completed'}
                            </span>
                            <span className="text-[11px] text-gray-400 font-semibold">{project.year || '2024'}</span>
                          </div>
                        </div>

                        {/* Owner edit & delete actions */}
                        {isOwner && (
                          <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onEditProject(project)}
                              className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-colors"
                              title="Edit project"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProject(project._id)}
                              className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      {project.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech_stack.slice(0, 4).map((tech, index) => (
                            <span key={index} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/20">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                      <div className="flex items-center space-x-2">
                        {project.github_link && (
                          <a
                            href={project.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors"
                            title="GitHub Repository"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demo_link && (
                          <a
                            href={project.demo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          likeMutation.mutate(project._id)
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          userLikesInfo.liked ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 text-gray-300 border-white/10'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${userLikesInfo.liked ? 'fill-rose-500' : ''}`} />
                        <span>{userLikesInfo.count}</span>
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <FolderOpen className="w-12 h-12 text-gray-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No projects found</h3>
              <p className="text-xs text-gray-400">Be the first to publish a project on TeamZen!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {(showCreateModal || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
          <div className="w-full max-w-xl card p-6 space-y-5 border border-white/15 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-orange-400" />
                <span>{editingProject ? 'Edit Showcase Project' : 'Publish New Project'}</span>
              </h2>
              <button
                type="button"
                onClick={() => { setShowCreateModal(false); setEditingProject(null); reset() }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingProject ? onUpdateProject : onCreateProject)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  className="input w-full text-xs sm:text-sm"
                  placeholder="e.g. TeamZen Realtime Matchmaker"
                  {...register('title', { required: 'Project title is required' })}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Project Description *</label>
                <textarea
                  className="input w-full resize-none text-xs sm:text-sm"
                  rows={4}
                  placeholder="Explain key features, architecture, and technology..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Tech Stack * (Comma separated)</label>
                <input
                  type="text"
                  className="input w-full text-xs sm:text-sm"
                  placeholder="React, Node.js, MongoDB, TailwindCSS"
                  {...register('tech_stack', { required: 'Tech stack is required' })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub Link</label>
                  <input
                    type="url"
                    className="input w-full text-xs sm:text-sm"
                    placeholder="https://github.com/user/project"
                    {...register('github_link')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Live Demo Link</label>
                  <input
                    type="url"
                    className="input w-full text-xs sm:text-sm"
                    placeholder="https://myproject.vercel.app"
                    {...register('demo_link')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setEditingProject(null); reset() }}
                  className="btn-secondary text-xs px-4 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isLoading || updateProjectMutation.isLoading}
                  className="btn-sunset text-xs px-5 py-2.5 rounded-xl font-bold shadow-md"
                >
                  {editingProject ? 'Update Project' : 'Publish Project'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Selected Project View Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl card p-6 space-y-5 border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-orange-400" />
                <span>{selectedProject.title}</span>
              </h2>
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">{selectedProject.description}</p>

              {selectedProject.tech_stack?.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-gray-400 uppercase text-[10px]">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tech_stack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-500/15 text-orange-300 border border-orange-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                {selectedProject.github_link && (
                  <a
                    href={selectedProject.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {selectedProject.demo_link && (
                  <a
                    href={selectedProject.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sunset text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Projects
