import { Link } from 'react-router-dom'
import { ArrowLeft, GraduationCap, Github } from 'lucide-react'
import Projects from '../components/Projects'
import { EditableText } from '../components/Editable'

/**
 * AcademicProjectsPage - Dedicated page for academic/research projects
 * Includes domain-based filtering and GitHub profile link
 */
function AcademicProjectsPage() {
    return (
        <div className="category-page">
            {/* Hero Section */}
            <section className="category-hero" style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(0, 0, 0, 0.95))',
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
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                        }}>
                            <GraduationCap size={28} color="white" />
                        </div>
                        <div>
                            <p style={{
                                color: 'var(--text-tertiary)',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '4px'
                            }}>
                                <EditableText path="academicPage.label" defaultValue="Research & Development" />
                            </p>
                            <h1 style={{
                                fontSize: 'clamp(2rem, 5vw, 3rem)',
                                fontWeight: '700',
                                margin: 0
                            }}>
                                <EditableText path="academicPage.title" defaultValue="Academic Projects" />
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
                            path="academicPage.description"
                            defaultValue="Academic and research projects from my Master's in Robotics at Northeastern University and Bachelor's in Mechatronics from SRM Institute. Spanning SLAM, perception, path planning, deep learning, and autonomous systems."
                            multiline
                        />
                    </p>

                    {/* GitHub Profile Link */}
                    <a
                        href="https://github.com/shrirag10"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '10px',
                            padding: '12px 20px',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            fontWeight: '500'
                        }}
                    >
                        <Github size={20} />
                        View All Repositories on GitHub
                    </a>
                </div>
            </section>

            {/* Projects Section */}
            <Projects
                filter={{ type: "academic" }}
                titleContext="academic-page"
                defaultTitle="Academic"
                defaultTitleHighlight=" Research Projects"
            />
        </div>
    )
}

export default AcademicProjectsPage
