import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowLeft, Calendar, User, ExternalLink, Github, Building2, GraduationCap } from 'lucide-react'
import { projects } from '../data/content'
import { EditableText, EditableImage } from '../components/Editable'
import { useEdit } from '../context/EditContext'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getContent } = useEdit()
  const project = projects.find(p => p.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!project) {
    return (
      <div className="project-detail section">
        <div className="container">
          <h1>Project not found</h1>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="project-detail">
      <div className="container">
        <div className="project-detail-header">
          <button onClick={() => navigate(-1)} className="back-link">
            <ArrowLeft size={18} />
            Back to Projects
          </button>

          {/* Company Logo & Badges for Professional Projects */}
          {project.type === 'professional' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              {project.companyLogo && (
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'white',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <EditableImage
                    path={`project.${id}.companyLogo`}
                    defaultValue={project.companyLogo}
                    alt={project.company}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              )}
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  <Building2 size={14} />
                  Professional Project
                </span>
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>
                  {project.company}
                </p>
              </div>
            </div>
          )}

          {/* Academic Project Badge */}
          {project.type === 'academic' && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white'
              }}>
                <GraduationCap size={14} />
                Academic Project
              </span>
            </div>
          )}

          {/* Subdomain Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: 'var(--bg-tertiary)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-subtle)'
            }}>
              {project.subdomain}
            </span>
            <p className="project-category" style={{ margin: 0 }}>
              <EditableText path={`project.${id}.category`} defaultValue={project.category} />
            </p>
          </div>

          <h1 className="project-detail-title">
            <EditableText path={`project.${id}.title`} defaultValue={project.title} />
          </h1>

          <div className="project-detail-meta">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} />
              <EditableText path={`project.${id}.date`} defaultValue={project.date} />
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} />
              <EditableText path={`project.${id}.role`} defaultValue={project.role} />
            </span>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}
              >
                <Github size={18} />
                View on GitHub
              </a>
            )}
          </div>
        </div>

        <div
          className="project-detail-image"
          style={{
            background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-card) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <EditableImage
            path={`project.${id}.image`}
            defaultValue={project.image}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="project-detail-content">
          <div className="project-detail-body">
            <h2>Overview</h2>
            <p>
              <EditableText
                path={`project.${id}.overview`}
                defaultValue={project.details.overview}
                multiline={true}
              />
            </p>

            <h2>The Challenge</h2>
            <p>
              <EditableText
                path={`project.${id}.challenge`}
                defaultValue={project.details.challenge}
                multiline={true}
              />
            </p>

            <h2>The Solution</h2>
            <p>
              <EditableText
                path={`project.${id}.solution`}
                defaultValue={project.details.solution}
                multiline={true}
              />
            </p>

            <h2>Key Results</h2>
            <ul>
              {project.details.results.map((result, index) => (
                <li key={index}>
                  <EditableText
                    path={`project.${id}.result.${index}`}
                    defaultValue={result}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="project-detail-sidebar">
            <div className="project-info-card">
              <div className="project-info-item">
                <p className="project-info-label">Category</p>
                <p className="project-info-value">
                  <EditableText path={`project.${id}.category`} defaultValue={project.category} />
                </p>
              </div>

              <div className="project-info-item">
                <p className="project-info-label">Timeline</p>
                <p className="project-info-value">
                  <EditableText path={`project.${id}.date`} defaultValue={project.date} />
                </p>
              </div>

              <div className="project-info-item">
                <p className="project-info-label">Role</p>
                <p className="project-info-value">
                  <EditableText path={`project.${id}.role`} defaultValue={project.role} />
                </p>
              </div>

              <div className="project-info-item">
                <p className="project-info-label">Technologies</p>
                <div className="project-tech" style={{ marginTop: '8px' }}>
                  {project.tech.map((tech, i) => (
                    <span key={i}>{tech}</span>
                  ))}
                </div>
              </div>

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                >
                  <Github size={18} />
                  View Code
                </a>
              )}

              {project.internalGithub && (
                <div style={{ marginTop: '16px' }}>
                  <a
                    href={project.internalGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <Building2 size={18} />
                    Internal Tesla Repo
                  </a>
                  {project.internalGithubNote && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-tertiary)',
                      marginTop: '8px',
                      fontStyle: 'italic',
                      lineHeight: '1.4'
                    }}>
                      <EditableText
                        path={`project.${id}.internalGithubNote`}
                        defaultValue={project.internalGithubNote}
                      />
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation to other projects */}
        <div style={{
          marginTop: '80px',
          paddingTop: '48px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ marginBottom: '32px', textAlign: 'center' }}>Other Projects</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {projects
              .filter(p => p.id !== id)
              .slice(0, 3)
              .map(p => (
                <Link
                  to={`/project/${p.id}`}
                  key={p.id}
                  className="project-card"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-content" style={{ padding: '24px' }}>
                    <p className="project-category">{p.category}</p>
                    <h4 className="project-title" style={{ fontSize: '1.125rem' }}>{p.title}</h4>
                    <div className="project-tech">
                      {p.tech.slice(0, 3).map((tech, i) => (
                        <span key={i}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
