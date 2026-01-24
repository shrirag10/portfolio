import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { EditableText } from './Editable'
import { useEdit } from '../context/EditContext'
import { personalInfo } from '../data/content'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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
            <button className="navbar-link" onClick={() => scrollToSection('teslaProjects')}>
              <EditableText path="navbar.link3" defaultValue="Projects" />
            </button>
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
