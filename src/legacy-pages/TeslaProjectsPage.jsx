import { Link } from 'react-router-dom'
import { ArrowLeft, Building2, ExternalLink, Lock } from 'lucide-react'
import Projects from '../components/Projects'
import { EditableText } from '../components/Editable'

/**
 * TeslaProjectsPage - Dedicated page for Tesla professional projects
 * Includes domain-based filtering and Tesla internal GitHub notice
 */
function TeslaProjectsPage() {
    return (
        <div className="category-page">
            {/* Hero Section */}
            <section className="category-hero" style={{
                background: 'linear-gradient(135deg, rgba(232, 33, 39, 0.1), rgba(0, 0, 0, 0.95))',
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
                            background: 'linear-gradient(135deg, #e82127, #cc1c21)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(232, 33, 39, 0.3)'
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
                                <EditableText path="teslaPage.label" defaultValue="Professional Experience" />
                            </p>
                            <h1 style={{
                                fontSize: 'clamp(2rem, 5vw, 3rem)',
                                fontWeight: '700',
                                margin: 0
                            }}>
                                <EditableText path="teslaPage.title" defaultValue="Tesla Inc." />
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
                            path="teslaPage.description"
                            defaultValue="Manufacturing Equipment Engineer Intern at Tesla's Fremont facility. Leading deployment of autonomous forklift AMRs using SLAM, LiDAR, and 3D pallet vision for automated material handling in manufacturing."
                            multiline
                        />
                    </p>

                    {/* Tesla Internal GitHub Notice */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        maxWidth: '600px'
                    }}>
                        <Lock size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <p style={{
                                color: 'var(--text-primary)',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                marginBottom: '6px'
                            }}>
                                Tesla Internal GitHub
                            </p>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                marginBottom: '8px',
                                lineHeight: '1.5'
                            }}>
                                If you're viewing this from within Tesla's network, you can access my internal GitHub repositories:
                            </p>
                            <a
                                href="https://github.tesla.com/shsrinivasan"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'var(--accent-primary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}
                            >
                                github.tesla.com/shsrinivasan
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <Projects
                filter={{ company: "Tesla Inc." }}
                titleContext="tesla-page"
                defaultTitle="Tesla"
                defaultTitleHighlight=" Projects"
                showFilters={true}
                showSearch={true}
                hideHeader={true}
            />
        </div>
    )
}

export default TeslaProjectsPage
