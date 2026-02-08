import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react'
import { EditableText } from './Editable'
import { useEdit } from '../context/EditContext'
import { personalInfo } from '../data/content'

// Helper to check if on a specific path (replaces useLocation)
const usePathname = () => {
  const [pathname, setPathname] = useState('/')
  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])
  return pathname
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { isEditMode } = useEdit()
  const dropdownRef = useRef(null)

  // Initialize theme from localStorage on client
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved) {
      setTheme(saved)
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light')
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProjectsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scrollToSection = (sectionId) => {
    if (!isHome) {
      // Navigate to home first, then scroll after a small delay
      window.location.href = `/#${sectionId}`
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      const navbarHeight = 80 // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth'
      })
    }
    setMobileOpen(false)
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const toggleDropdown = (e) => {
    e.stopPropagation()
    setProjectsDropdownOpen(prev => !prev)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">
            <EditableText path="navbar.logo" defaultValue="Shriman" /><span>.</span>
          </a>

          <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
            <button className="navbar-link" onClick={() => scrollToSection('about')}>
              <EditableText path="navbar.link1" defaultValue="About" />
            </button>
            <button className="navbar-link" onClick={() => scrollToSection('experience')}>
              <EditableText path="navbar.link2" defaultValue="Experience" />
            </button>

            {/* Projects Dropdown - Click-based for persistence */}
            <div
              ref={dropdownRef}
              className="navbar-dropdown"
              style={{ position: 'relative' }}
            >
              <button
                className="navbar-link"
                onClick={toggleDropdown}
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
                  <a
                    href="/tesla"
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
                  </a>
                  <a
                    href="/hero"
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
                  </a>
                  <a
                    href="/academic"
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
                  </a>
                </div>
              )}
            </div>

            <button className="navbar-link" onClick={() => scrollToSection('skills')}>
              <EditableText path="navbar.link4" defaultValue="Skills" />
            </button>
            <button className="navbar-link" onClick={() => scrollToSection('contact')}>
              <EditableText path="navbar.link5" defaultValue="Contact" />
            </button>

            {/* Mobile-Only Theme Toggle & Resume */}
            <div className="mobile-menu-actions mobile-only" style={{ display: 'none', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%', marginTop: '16px' }}>
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '8px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  width: 'fit-content'
                }}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={18} style={{ marginRight: '8px' }} /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={18} style={{ marginRight: '8px' }} /> Dark Mode
                  </>
                )}
              </button>

              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '80%', textAlign: 'center' }}
              >
                <EditableText path="navbar.cta" defaultValue="Resume" />
              </a>
            </div>
          </div>

          {/* Desktop-Only Theme Toggle Button */}
          <button
            className="theme-toggle desktop-only"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              transition: 'all 0.3s ease',
              marginRight: '12px'
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-cta desktop-only"
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

