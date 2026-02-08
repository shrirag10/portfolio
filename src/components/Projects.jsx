import { useState } from 'react'
import { ArrowRight, Building2, GraduationCap } from 'lucide-react'
import { projects } from '../data/content'
import { EditableText, EditableTags, EditableImage } from './Editable'
import { useEdit } from '../context/EditContext'
import ProjectSearchBar from './ProjectSearchBar'

// Subdomain categories for filtering
const subdomains = [
  { id: 'all', label: 'All Projects' },
  { id: 'Manufacturing', label: 'Manufacturing' },
  { id: 'Perception-SLAM', label: 'Perception & SLAM' },
  { id: 'Deep Learning', label: 'Deep Learning' },
  { id: 'Mechanical', label: 'Mechanical' },
  { id: 'Aerial Robotics', label: 'Aerial' },
  { id: 'Underwater Robotics', label: 'Underwater' }
]

function Projects({
  filter = {},
  titleContext = 'home',
  defaultTitle = 'Featured',
  defaultTitleHighlight = ' Robotics Projects',
  showFilters = true,
  showSearch = false,
  hideHeader = false
}) {
  const { getContent } = useEdit()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter existing projects by the passed prop filter (e.g. company or type)
  const baseProjects = projects.filter(p => {
    return Object.entries(filter).every(([key, value]) => p[key] === value)
  })

  // Sort projects: by date (most recent first), featured come first within same year
  const sortedProjects = [...baseProjects].sort((a, b) => {
    // Extract year from date string (handles "2025", "March 2025 – April 2025", etc.)
    const getYear = (dateStr) => {
      const match = dateStr.match(/\d{4}/)
      return match ? parseInt(match[0]) : 0
    }
    const yearA = getYear(a.date)
    const yearB = getYear(b.date)

    // Sort by year descending (most recent first)
    if (yearB !== yearA) return yearB - yearA

    // Within same year, featured projects first
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  // Filter projects by subdomain and search term
  const filteredProjects = sortedProjects.filter(p => {
    // 1. Subdomain Filter
    if (showFilters && activeFilter !== 'all' && p.subdomain !== activeFilter) {
      return false
    }

    // 2. Search Filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      const searchFields = [
        p.title,
        p.description,
        p.category,
        p.subdomain,
        ...(p.tech || [])
      ]

      return searchFields.some(field =>
        field && field.toString().toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <section className="projects section" id="projects">
      <div className="container">
        {!hideHeader && (
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
            <p className="section-label" style={{ justifyContent: 'center' }}>Projects</p>
            <h2 className="section-title">
              <EditableText
                path={titleContext === 'home' ? 'projects.title' : `projects.${titleContext}.title`}
                defaultValue={defaultTitle}
              />
              <span className="gradient-text">
                <EditableText
                  path={titleContext === 'home' ? 'projects.titleHighlight' : `projects.${titleContext}.titleHighlight`}
                  defaultValue={defaultTitleHighlight}
                />
              </span>
            </h2>
          </div>
        )}

        {/* Project Search Bar */}
        {showSearch && (
          <ProjectSearchBar
            onSearch={setSearchTerm}
            onFilter={(id) => setActiveFilter(id)}
            categories={subdomains}
            activeCategory={activeFilter}
          />
        )}

        {/* Legacy Subdomain Filter Tabs (only if Search is disabled, otherwise SearchBar handles it) */}
        {showFilters && !showSearch && (
          <div className="project-filters" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '48px'
          }}>
            {subdomains.map(subdomain => (
              <button
                key={subdomain.id}
                onClick={() => setActiveFilter(subdomain.id)}
                className={`filter-btn ${activeFilter === subdomain.id ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: activeFilter === subdomain.id
                    ? '1px solid var(--accent-primary)'
                    : '1px solid var(--border-subtle)',
                  background: activeFilter === subdomain.id
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))'
                    : 'var(--bg-card)',
                  color: activeFilter === subdomain.id
                    ? 'var(--accent-primary)'
                    : 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {subdomain.label}
              </button>
            ))}
          </div>
        )}

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <a
              href={`/project/${project.id}`}
              className={`project-card ${project.featured ? 'featured' : ''}`}
              key={project.id}
            >
              <div className="project-image">
                <EditableImage
                  path={`project.${project.id}.image`}
                  defaultValue={project.image}
                  alt={project.title}
                  className="project-card-image"
                />

                {/* Type Badge (Professional/Academic) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 2
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: project.type === 'professional'
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>
                    {project.type === 'professional' ? <Building2 size={12} /> : <GraduationCap size={12} />}
                    {project.type === 'professional' ? 'Professional' : 'Academic'}
                  </span>
                </div>

                {/* Company Logo for Professional Projects */}
                {project.type === 'professional' && project.companyLogo && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'white',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    zIndex: 2
                  }}>
                    <img
                      src={project.companyLogo}
                      alt={project.company}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '4px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <div className="project-overlay">
                  <span style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    View Details <ArrowRight size={16} />
                  </span>
                </div>
              </div>

              <div className="project-content">
                {/* Subdomain Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: '500',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {project.subdomain}
                  </span>
                  <p className="project-category" style={{ margin: 0 }}>
                    <EditableText
                      path={`project.${project.id}.category`}
                      defaultValue={project.category}
                    />
                  </p>
                </div>

                <h3 className="project-title">
                  <EditableText
                    path={`project.${project.id}.title`}
                    defaultValue={project.title}
                  />
                </h3>
                <p className="project-description">
                  <EditableText
                    path={`project.${project.id}.description`}
                    defaultValue={project.description}
                    multiline={true}
                  />
                </p>

                <EditableTags
                  path={`project.${project.id}.tech`}
                  defaultValue={project.tech.slice(0, 5)}
                  className="project-tech"
                />

                <div className="project-link">
                  Learn More <ArrowRight size={16} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
