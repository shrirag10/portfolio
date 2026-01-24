import { ArrowRight, Download } from 'lucide-react'
import { personalInfo } from '../data/content'
import { EditableText, EditableImage } from './Editable'
import { useEdit } from '../context/EditContext'

function Hero() {
  const { getContent } = useEdit()

  const scrollToProjects = () => {
    const element = document.getElementById('projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
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
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
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
              <EditableText path="hero.title" defaultValue={personalInfo.title} />
            </h1>

            <p className="hero-subtitle">
              <EditableText
                path="hero.subtitle"
                defaultValue={`${personalInfo.tagline}. Specializing in AMR systems, SLAM, and sensor fusion for industrial automation. Currently at Tesla, engineering intelligent material handling solutions that deliver real-world impact.`}
                multiline={true}
              />
            </p>

            <div className="hero-cta">
              <button className="btn btn-primary" onClick={scrollToProjects}>
                View My Work
                <ArrowRight size={18} />
              </button>
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Download size={18} />
                Download Resume
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <EditableText path="hero.stat1Value" defaultValue="$2M+" />
                </div>
                <div className="hero-stat-label">
                  <EditableText path="hero.stat1Label" defaultValue="Cost Savings Delivered" />
                </div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <EditableText path="hero.stat2Value" defaultValue="67%" />
                </div>
                <div className="hero-stat-label">
                  <EditableText path="hero.stat2Label" defaultValue="Efficiency Improvement" />
                </div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <EditableText path="hero.stat3Value" defaultValue="3+" />
                </div>
                <div className="hero-stat-label">
                  <EditableText path="hero.stat3Label" defaultValue="Years Experience" />
                </div>
              </div>
            </div>
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
    </section>
  )
}

export default Hero
