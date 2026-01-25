import { Bot, Cpu, Navigation, Layers } from 'lucide-react'
import { personalInfo, education } from '../data/content'
import { EditableText, EditableList } from './Editable'
import { useEdit } from '../context/EditContext'
import HobbyCards from './HobbyCards'

function About() {
  const { isEditMode, getContent } = useEdit()

  const highlights = [
    {
      icon: <Bot size={24} />,
      title: "Autonomous Systems",
      description: "AMR deployment & fleet management"
    },
    {
      icon: <Navigation size={24} />,
      title: "SLAM & Navigation",
      description: "Real-time localization & mapping"
    },
    {
      icon: <Cpu size={24} />,
      title: "Sensor Fusion",
      description: "Multi-sensor integration & filtering"
    },
    {
      icon: <Layers size={24} />,
      title: "Path Planning",
      description: "Optimal trajectory generation"
    }
  ]

  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <div className="section-header">
              <p className="section-label">About Me</p>
              <h2 className="section-title">
                <EditableText
                  path="about.title"
                  defaultValue="Turning Complex Robotics Challenges Into"
                />
                <span className="gradient-text">
                  <EditableText
                    path="about.titleHighlight"
                    defaultValue=" Production-Ready Solutions"
                  />
                </span>
              </h2>
            </div>

            <p>
              <EditableText
                path="about.paragraph1"
                defaultValue={personalInfo.about[0]}
                multiline={true}
              />
            </p>
            <p>
              <EditableText
                path="about.paragraph2"
                defaultValue={personalInfo.about[1]}
                multiline={true}
              />
            </p>
            <p>
              <EditableText
                path="about.paragraph3"
                defaultValue={personalInfo.about[2]}
                multiline={true}
              />
            </p>

            {/* Hobbies & Interests */}
            {personalInfo.hobbies && personalInfo.hobbies.length > 0 && (
              <div className="about-hobbies" style={{ marginTop: '24px', marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '1rem',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                  fontWeight: 500
                }}>
                  When I'm not engineering...
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {personalInfo.hobbies.map((hobby, index) => (
                    <span key={index} style={{
                      padding: '8px 16px',
                      background: 'var(--accent-glow)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      color: 'var(--accent-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {hobby === 'Formula 1 Racing' && '🏎️'}
                      {hobby === 'Playing Mridangam' && '🥁'}
                      {hobby === '3D Printing' && '🖨️'}
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="about-highlights">
              {highlights.map((item, index) => (
                <div className="about-highlight" key={index}>
                  <div className="about-highlight-icon">
                    {item.icon}
                  </div>
                  <h4>
                    <EditableText
                      path={`about.highlight${index}Title`}
                      defaultValue={item.title}
                    />
                  </h4>
                  <p>
                    <EditableText
                      path={`about.highlight${index}Desc`}
                      defaultValue={item.description}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="about-education">
            <div className="section-header">
              <p className="section-label">Education</p>
            </div>

            {education.map((edu, index) => (
              <div className="experience-card" key={index} style={{ marginBottom: '24px' }}>
                <div className="experience-header">
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {edu.icon && (
                      <div style={{
                        flexShrink: 0,
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: 'white',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={edu.icon}
                          alt={edu.school}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="experience-title">
                        <EditableText
                          path={`education.${index}.degree`}
                          defaultValue={edu.degree}
                        />
                      </h3>
                      <p className="experience-company">
                        <EditableText
                          path={`education.${index}.school`}
                          defaultValue={edu.school}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="experience-location">
                    <EditableText
                      path={`education.${index}.location`}
                      defaultValue={edu.location}
                    />
                  </div>
                </div>
                <p className="experience-date" style={{ marginBottom: '12px' }}>
                  <EditableText
                    path={`education.${index}.date`}
                    defaultValue={edu.date}
                  />
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  <strong>GPA:</strong> <EditableText path={`education.${index}.gpa`} defaultValue={edu.gpa} /> | <strong>Relevant:</strong> {edu.courses.join(', ')}
                </p>
              </div>
            ))}
          </div>

          {/* ManuFX-style Hobby Cards with Insights */}
          <HobbyCards />
        </div>
      </div>
    </section>
  )
}

export default About
