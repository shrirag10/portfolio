import { useState } from 'react'
import { ArrowRight, Download, ChevronDown, Eye } from 'lucide-react'
import { personalInfo } from '../data/content'
import { EditableText, EditableImage } from './Editable'
import { useEdit } from '../context/EditContext'
import TypewriterText from './TypewriterText'
import HeroImpactCards from './HeroImpactCards'
import ResumeModal from './ResumeModal'

function Hero() {
  const { getContent, isEditMode } = useEdit()
  const [resumeModalOpen, setResumeModalOpen] = useState(false)

  const scrollToProjects = () => {
    const element = document.getElementById('teslaProjects')
    if (element) {
      const navbarHeight = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth'
      })
    }
  }

  const firstName = getContent('hero.firstName', personalInfo.name.split(' ')[0])
  const title = getContent('hero.title', personalInfo.title)

  return (
    <section className="hero" id="hero">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge pulse-dot" style={{ paddingLeft: '20px' }}>
              <EditableText
                path="hero.badge"
                defaultValue="Open to Robotics Engineer opportunities"
              />
            </div>

            <h1 className="hero-title">
              Hi, I'm <span className="gradient-text">
                <EditableText path="hero.firstName" defaultValue={personalInfo.name.split(' ')[0]} />
              </span>
              <br />
              {isEditMode ? (
                <EditableText path="hero.title" defaultValue={personalInfo.title} />
              ) : (
                <TypewriterText
                  text={title}
                  speed={80}
                  delay={500}
                />
              )}
            </h1>

            <p className="hero-subtitle">
              <EditableText
                path="hero.subtitle"
                defaultValue={`${personalInfo.tagline}. Specializing in AMR systems, SLAM, and sensor fusion for industrial automation. Currently at Tesla, engineering intelligent material handling solutions that deliver real-world impact.`}
                multiline={true}
              />
            </p>

            <div className="hero-cta">
              <button className="btn btn-primary glow-hover" onClick={scrollToProjects}>
                View My Work
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setResumeModalOpen(true)}
                className="btn btn-secondary glow-hover"
              >
                <Eye size={18} />
                View Resume
              </button>
              <a
                href={personalInfo.resumeUrl}
                download
                className="btn btn-secondary glow-hover"
                style={{ padding: '12px 16px' }}
              >
                <Download size={18} />
              </a>
            </div>

            {/* ManuFX-Style Impact Cards */}
            <HeroImpactCards />
          </div>

          <div className="hero-image">
            <div className="hero-image-wrapper">
              <EditableImage
                path="hero.profileImage"
                defaultValue="/images/profile.jpg"
                alt={personalInfo.name}
                className="hero-image-main"
              />
              <div className="hero-image-decoration"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouncing Scroll Indicator */}
      <div
        className="scroll-indicator"
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          opacity: 0.6,
          transition: 'opacity 0.3s'
        }}
        onClick={scrollToProjects}
      >
        <ChevronDown size={32} color="var(--text-secondary)" />
      </div>

      {/* Resume Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />
    </section>
  )
}

export default Hero

