import { Lightbulb } from 'lucide-react'
import { personalInfo } from '../data/content'
import { EditableText } from './Editable'
import { useEdit } from '../context/EditContext'

/**
 * Enhanced Hobby Cards with Insights
 * ManuFX-style hobby/interest cards with personal insights
 */
function HobbyCards() {
    const { isEditMode } = useEdit()

    const hobbies = [
        {
            icon: '🏎️',
            title: 'Formula 1 Racing',
            category: 'Motorsport',
            description: 'Passionate about the engineering excellence behind F1 cars and the strategic depth of race management.',
            insight: 'Following the aerodynamic innovations in F1 inspires my approach to robotics design optimization.',
            gradient: 'linear-gradient(135deg, #e11d48, #f97316)'
        },
        {
            icon: '🥁',
            title: 'Playing Mridangam',
            category: 'Music & Culture',
            description: 'Trained in Carnatic classical percussion, exploring the mathematical precision of rhythm patterns.',
            insight: 'The rhythmic cycles in Carnatic music mirror the timing algorithms in robotic control systems.',
            gradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
        },
        {
            icon: '🖨️',
            title: '3D Printing',
            category: 'Fabrication',
            description: 'Creating functional prototypes and custom parts for robotics projects using FDM and resin printing.',
            insight: '50+ functional prototypes printed, from robot chassis to custom end-effectors.',
            gradient: 'linear-gradient(135deg, #10b981, #06b6d4)'
        }
    ]

    return (
        <section className="hobbies-section">
            <div className="section-header" style={{ marginBottom: '32px' }}>
                <p className="section-label">Beyond Engineering</p>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginTop: '8px'
                }}>
                    <EditableText path="hobbies.title" defaultValue="Personal Interests" />
                </h3>
            </div>

            <div className="hobbies-grid">
                {hobbies.map((hobby, index) => (
                    <div
                        key={index}
                        className="hobby-card"
                        style={{ '--hobby-gradient': hobby.gradient }}
                    >
                        <div className="hobby-header">
                            <span className="hobby-icon">
                                <EditableText path={`hobbies.${index}.icon`} defaultValue={hobby.icon} />
                            </span>
                            <div style={{ flex: 1 }}>
                                <h4 className="hobby-title">
                                    <EditableText path={`hobbies.${index}.title`} defaultValue={hobby.title} />
                                </h4>
                                <span className="hobby-category">
                                    <EditableText path={`hobbies.${index}.category`} defaultValue={hobby.category} />
                                </span>
                            </div>
                        </div>

                        <p className="hobby-description">
                            <EditableText
                                path={`hobbies.${index}.description`}
                                defaultValue={hobby.description}
                                multiline={true}
                            />
                        </p>

                        <div className="hobby-insight">
                            <Lightbulb size={16} className="hobby-insight-icon" />
                            <span className="hobby-insight-text">
                                <EditableText
                                    path={`hobbies.${index}.insight`}
                                    defaultValue={hobby.insight}
                                    multiline={true}
                                />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default HobbyCards
