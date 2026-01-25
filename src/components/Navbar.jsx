import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { EditableText } from './Editable'
import { useEdit } from '../context/EditContext'
import { personalInfo } from '../data/content'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { isEditMode } = useEdit()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    if (!isHome) {
      window.location.href = `/#${sectionId}`
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <EditableText path="navbar.logo" defaultValue="Shriman" /><span>.</span>
          </Link>

          <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
            <button className="navbar-link" onClick={() => scrollToSection('about')}>
              <EditableText path="navbar.link1" defaultValue="About" />
            </button>
            <button className="navbar-link" onClick={() => scrollToSection('experience')}>
              <EditableText path="navbar.link2" defaultValue="Experience" />
            </button>

            {/* Projects Dropdown */}
            <div
              className="navbar-dropdown"
              onMouseEnter={() => setProjectsDropdownOpen(true)}
              onMouseLeave={() => setProjectsDropdownOpen(false)}
              style={{ position: 'relative' }}
            >
              <button
                className="navbar-link"
                onClick={() => scrollToSection('teslaProjects')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <EditableText path="navbar.link3" defaultValue="Projects" />
                <ChevronDown size={14} style={{
                  transform: projectsDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s'
                }} />
              </button>

              {projectsDropdownOpen && (
                <div className="navbar-dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '8px',
                  minWidth: '180px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  zIndex: 100,
                  marginTop: '8px'
                }}>
                  <Link
                    to="/tesla"
                    className="dropdown-item"
                    onClick={() => { setProjectsDropdownOpen(false); setMobileOpen(false); }}
                    style={{
                      display: 'block',
                      padding: '10px 14px',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    Tesla Projects
                  </Link>
                  <Link
                    to="/hero"
                    className="dropdown-item"
                    onClick={() => { setProjectsDropdownOpen(false); setMobileOpen(false); }}
                    style={{
                      display: 'block',
                      padding: '10px 14px',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    Hero MotoCorp Projects
                  </Link>
                  <Link
                    to="/academic"
                    className="dropdown-item"
                    onClick={() => { setProjectsDropdownOpen(false); setMobileOpen(false); }}
                    style={{
                      display: 'block',
                      padding: '10px 14px',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    Academic Projects
                  </Link>
                </div>
              )}
            </div>

            <button className="navbar-link" onClick={() => scrollToSection('skills')}>
              <EditableText path="navbar.link4" defaultValue="Skills" />
            </button>
            <button className="navbar-link" onClick={() => scrollToSection('contact')}>
              <EditableText path="navbar.link5" defaultValue="Contact" />
            </button>
          </div>

          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-cta"
          >
            <EditableText path="navbar.cta" defaultValue="Resume" />
          </a>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
