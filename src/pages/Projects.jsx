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
  User
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
            <button onClick={() => { deleteProjectMutation.mutate(id); toast.dismiss(t.id) }} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Cancel</button>
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
            {projects.map((project) => {
              const isOwner = user && (project.user_id?._id === user._id || project.user_id === user._id)
              const userLikesInfo = likesState[project._id] || {
                liked: user && Array.isArray(project.likedBy)
                  ? project.likedBy.some(id => id.toString() === user._id || id === user._id)
                  : false,
                count: project.likesCount || 0
              }
              const isLiked = userLikesInfo.liked
              const count = userLikesInfo.count

              return (
                <div
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Top Accent Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6)' }} />

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />

                  <div className="relative z-10 space-y-4">
                    {/* Header: Title & Owner Actions */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-lg group-hover:text-primary-300 transition-colors truncate">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            project.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {project.status}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">{project.year}</span>
                        </div>
                      </div>

                      {/* Owner Actions */}
                      {isOwner && (
                        <div className="flex items-center space-x-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onEditProject(project)}
                            className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(project._id)}
                            className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {(project.tech_stack || []).slice(0, 4).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-blue-500/15 text-blue-300 border border-blue-500/25 text-[11px] font-semibold rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.tech_stack || []).length > 4 && (
                        <span className="px-2.5 py-1 bg-white/10 text-gray-400 text-[11px] font-medium rounded-lg">
                          +{(project.tech_stack || []).length - 4}
                        </span>
                      )}
                    </div>

                    {/* Author Box */}
                    <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {project.user_id?.profile_image ? (
                          <img src={project.user_id.profile_image} alt={project.user_id.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-white">
                            {project.user_id?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{project.user_id?.name || 'Student Developer'}</p>
                        <p className="text-[11px] text-gray-400 truncate">{project.user_id?.college || 'KNIT Sultanpur'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="relative z-10 flex items-center justify-between gap-2 pt-4 mt-4 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                    {/* Heart Like Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) return toast.error('Please login to like projects')
                        if (isOwner) return toast.error('You cannot like your own project')
                        likeMutation.mutate(project._id)
                      }}
                      disabled={likeMutation.isLoading}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                        isLiked
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-sm shadow-rose-500/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10'
                      } ${isOwner ? 'opacity-60 cursor-not-allowed' : ''}`}
                      title={isOwner ? 'Your own project' : isLiked ? 'Unlike project' : 'Like project'}
                    >
                      <Heart className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                      }`} />
                      <span>{count}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.github_link && (
                        <a
                          href={project.github_link.startsWith('http') ? project.github_link : `https://${project.github_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.demo_link && (
                        <a
                          href={project.demo_link.startsWith('http') ? project.demo_link : `https://${project.demo_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 font-semibold rounded-xl"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
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

      {/* Project Detail View Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl card p-6 max-h-[90vh] overflow-y-auto border border-white/15 shadow-2xl space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedProject.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    selectedProject.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {selectedProject.status}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">Year {selectedProject.year}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Owner Section */}
            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                {selectedProject.user_id?.profile_image ? (
                  <img src={selectedProject.user_id.profile_image} alt={selectedProject.user_id.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {selectedProject.user_id?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{selectedProject.user_id?.name || 'Student Developer'}</p>
                <p className="text-xs text-gray-400">{selectedProject.user_id?.college || 'KNIT Sultanpur'} · {selectedProject.user_id?.branch || 'BTech'}</p>
              </div>
              {selectedProject.user_id?._id && (
                <Link
                  to={`/user/${selectedProject.user_id._id}`}
                  className="btn-secondary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" /> View Profile
                </Link>
              )}
            </div>

            {/* Full Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Project Overview</h3>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                {selectedProject.description}
              </div>
            </div>

            {/* Tech Stack */}
            {selectedProject.tech_stack?.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech_stack.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-500/15 text-blue-300 border border-blue-500/25 text-xs font-semibold rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              {/* Like Button inside Modal */}
              {(() => {
                const isSelf = user && (selectedProject.user_id?._id === user._id || selectedProject.user_id === user._id)
                const userLikesInfo = likesState[selectedProject._id] || {
                  liked: user && Array.isArray(selectedProject.likedBy)
                    ? selectedProject.likedBy.some(id => id.toString() === user._id || id === user._id)
                    : false,
                  count: selectedProject.likesCount || 0
                }
                const isLiked = userLikesInfo.liked
                const count = userLikesInfo.count

                return (
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) return toast.error('Please login to like projects')
                      if (isSelf) return toast.error('You cannot like your own project')
                      likeMutation.mutate(selectedProject._id)
                    }}
                    disabled={likeMutation.isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                      isLiked
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-sm shadow-rose-500/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10'
                    } ${isSelf ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{count} Likes</span>
                  </button>
                )
              })()}

              <div className="flex items-center gap-3">
                {selectedProject.github_link && (
                  <a
                    href={selectedProject.github_link.startsWith('http') ? selectedProject.github_link : `https://${selectedProject.github_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                  >
                    <Github className="w-4 h-4" /> GitHub Code
                  </a>
                )}
                {selectedProject.demo_link && (
                  <a
                    href={selectedProject.demo_link.startsWith('http') ? selectedProject.demo_link : `https://${selectedProject.demo_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl card p-4 sm:p-6 max-h-[90vh] overflow-y-auto border border-white/15 shadow-2xl space-y-6 custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingProject(null)
                  reset()
                }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingProject ? onUpdateProject : onCreateProject)} className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g., AI Teammate Finder Web App"
                  {...register('title', { required: 'Project title is required' })}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  className="input w-full resize-none"
                  rows={4}
                  placeholder="Describe your project key features, goals, and tech details..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="React, Node.js, MongoDB, Tailwind"
                    {...register('tech_stack')}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                    Year *
                  </label>
                  <select className="input w-full" {...register('year', { required: 'Year is required' })}>
                    <option value="">Select Year</option>
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="mt-1 text-xs text-red-400">{errors.year.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
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
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
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
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                  Project Status
                </label>
                <select className="input w-full" {...register('status')}>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Sticky Submit Footer */}
              <div className="pt-4 border-t border-white/10 sticky bottom-0 bg-[#0d0d14]/95 backdrop-blur-md -mx-4 -mb-4 px-4 py-3 sm:-mx-6 sm:-mb-6 sm:px-6 sm:py-4 rounded-b-2xl z-20 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingProject(null)
                    reset()
                  }}
                  className="btn-secondary text-xs sm:text-sm px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isLoading || updateProjectMutation.isLoading}
                  className="btn-primary text-xs sm:text-sm px-5 py-2 flex items-center gap-1.5 shadow-lg shadow-primary-500/20"
                >
                  <Save className="w-4 h-4" />
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
