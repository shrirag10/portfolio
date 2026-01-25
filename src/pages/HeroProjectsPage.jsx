import { Link } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'
import Projects from '../components/Projects'
import { EditableText } from '../components/Editable'

/**
 * HeroProjectsPage - Dedicated page for Hero MotoCorp professional projects
 * Includes domain-based filtering and company context
 */
function HeroProjectsPage() {
    return (
        <div className="category-page">
            {/* Hero Section */}
            <section className="category-hero" style={{
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(0, 0, 0, 0.95))',
                padding: '120px 0 60px',
                borderBottom: '1px solid var(--border-subtle)'
            }}>
                <div className="container">
                    <Link to="/" className="back-link" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        marginBottom: '24px',
                        fontSize: '0.9rem',
                        transition: 'color 0.2s'
                    }}>
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)'
                        }}>
                            <Building2 size={28} color="white" />
                        </div>
                        <div>
                            <p style={{
                                color: 'var(--text-tertiary)',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '4px'
                            }}>
                                <EditableText path="heroPage.label" defaultValue="Professional Experience" />
                            </p>
                            <h1 style={{
                                fontSize: 'clamp(2rem, 5vw, 3rem)',
                                fontWeight: '700',
                                margin: 0
                            }}>
                                <EditableText path="heroPage.title" defaultValue="Hero MotoCorp" />
                            </h1>
                        </div>
                    </div>

                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        maxWidth: '700px',
                        lineHeight: '1.7',
                        marginBottom: '24px'
                    }}>
                        <EditableText
                            path="heroPage.description"
                            defaultValue="Robotics Engineer at Hero MotoCorp's EV plant, optimizing production throughput through implementation of Automation and Robotics in manufacturing. Led initiatives across AMR deployment, pallet handling optimization, and battery production."
                            multiline
                        />
                    </p>

                    {/* Career Timeline */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}>
                        <div style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '10px 16px'
                        }}>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '2px' }}>2023-2024</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>Assistant Manager - Robotics</p>
                        </div>
                        <div style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '10px 16px'
                        }}>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '2px' }}>2023</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>Production Engineer</p>
                        </div>
                        <div style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '10px 16px'
                        }}>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '2px' }}>2022-2023</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>Graduate Engineer Trainee</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <Projects
                filter={{ company: "Hero MotoCorp" }}
                titleContext="hero-page"
                defaultTitle="Hero MotoCorp"
                defaultTitleHighlight=" Projects"
                showFilters={false}
            />
        </div>
    )
}

export default HeroProjectsPage
