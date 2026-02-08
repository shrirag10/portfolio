'use client'

import { ArrowLeft, Building2 } from 'lucide-react'
import Projects from '../../components/Projects'
import { EditableText } from '../../components/Editable'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { EditProvider } from '../../context/EditContext'

/**
 * HeroProjectsPage - Dedicated page for Hero MotoCorp professional projects
 */
export default function HeroProjectsPage() {
    return (
        <EditProvider>
            <Navbar />
            <div className="category-page">
                {/* Hero Section */}
                <section className="category-hero" style={{
                    background: 'linear-gradient(135deg, rgba(232, 68, 68, 0.1), rgba(0, 0, 0, 0.95))',
                    padding: '120px 0 60px',
                    borderBottom: '1px solid var(--border-subtle)'
                }}>
                    <div className="container">
                        <a href="/" className="back-link" style={{
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
                        </a>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #e84444, #cc3333)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(232, 68, 68, 0.3)'
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
                                defaultValue="Graduate Engineer Trainee at Hero MotoCorp's manufacturing facility. Worked on AMR deployment and fleet management systems for automated material handling in manufacturing."
                                multiline
                            />
                        </p>
                    </div>
                </section>

                {/* Projects Section */}
                <Projects
                    filter={{ company: "Hero MotoCorp" }}
                    titleContext="hero-page"
                    defaultTitle="Hero MotoCorp"
                    defaultTitleHighlight=" Projects"
                    showFilters={true}
                    showSearch={true}
                    hideHeader={true}
                />
            </div>
            <Footer />
        </EditProvider>
    )
}
