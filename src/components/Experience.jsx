import { MapPin, Building2 } from 'lucide-react'
import { experiences } from '../data/content'
import { EditableText, EditableList, EditableTags, EditableImage } from './Editable'
import { useEdit } from '../context/EditContext'

function Experience() {
  const { getContent } = useEdit()

  return (
    <section className="experience section" id="experience">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px' }}>
          <p className="section-label" style={{ justifyContent: 'center' }}>My Journey</p>
          <h2 className="section-title">
            <EditableText path="experience.title" defaultValue="Where I've Built" />
            <span className="gradient-text">
              <EditableText path="experience.titleHighlight" defaultValue=" Autonomous Systems" />
            </span>
          </h2>
        </div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div className="experience-item" key={exp.id}>
              <div className="experience-dot"></div>

              {/* Enhanced Date Badge */}
              <div className="experience-date-badge">
                <EditableText
                  path={`experience.${exp.id}.date`}
                  defaultValue={exp.date}
                />
              </div>

              <div className="experience-card">
                <div className="experience-header">
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1 }}>
                    {/* Company Photo/Logo */}
                    {exp.companyPhoto && (
                      <div className="experience-company-photo">
                        <EditableImage
                          path={`experience.${exp.id}.companyPhoto`}
                          defaultValue={exp.companyPhoto}
                          alt={exp.company}
                        />
                      </div>
                    )}

                    <div style={{ flex: 1 }}>
                      <h3 className="experience-title">
                        <EditableText
                          path={`experience.${exp.id}.title`}
                          defaultValue={exp.title}
                        />
                      </h3>
                      <p className="experience-company">
                        <EditableText
                          path={`experience.${exp.id}.company`}
                          defaultValue={exp.company}
                        />
                      </p>
                    </div>
                  </div>

                  <div className="experience-location">
                    <MapPin size={14} />
                    <EditableText
                      path={`experience.${exp.id}.location`}
                      defaultValue={exp.location}
                    />
                  </div>
                </div>

                <ul className="experience-description">
                  {(getContent(`experience.${exp.id}.description`, exp.description) || exp.description).map((item, i) => (
                    <li key={i}>
                      <EditableText
                        path={`experience.${exp.id}.description.${i}`}
                        defaultValue={item}
                        multiline={true}
                      />
                    </li>
                  ))}
                </ul>

                <EditableTags
                  path={`experience.${exp.id}.tags`}
                  defaultValue={exp.tags}
                  className="experience-tags"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
