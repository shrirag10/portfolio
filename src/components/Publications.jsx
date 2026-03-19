import { ExternalLink, BookMarked, Award, Quote } from 'lucide-react'
import { publications, personalInfo } from '../data/content'
import Reveal from './Reveal'
import AnimatedCounter from './AnimatedCounter'

function Publications() {
    const totalCitations = publications.reduce((sum, pub) => sum + pub.citations, 0)

    return (
        <section className="publications section" id="publications">
            <div className="container">
                <Reveal>
                    <div className="section-header" style={{ textAlign: 'center' }}>
                        <p className="section-label" style={{ justifyContent: 'center' }}>
                            <BookMarked size={16} />
                            Research Publications
                        </p>
                        <h2>
                            Published <span className="gradient-text">Research</span>
                        </h2>
                        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                            Peer-reviewed research in robotics, manufacturing automation, and industrial engineering.
                        </p>
                    </div>
                </Reveal>

                {/* Stats Bar */}
                <Reveal delay={0.1}>
                    <div className="publications-stats">
                        <div className="pub-stat">
                            <span className="pub-stat-value"><AnimatedCounter target={publications.length} duration={1000} /></span>
                            <span className="pub-stat-label">Publications</span>
                        </div>
                        <div className="pub-stat-divider" />
                        <div className="pub-stat">
                            <span className="pub-stat-value"><AnimatedCounter target={totalCitations} duration={1500} /></span>
                            <span className="pub-stat-label">Total Citations</span>
                        </div>
                        <div className="pub-stat-divider" />
                        <div className="pub-stat">
                            <span className="pub-stat-value"><AnimatedCounter target={3} duration={1200} /></span>
                            <span className="pub-stat-label">h-index</span>
                        </div>
                    </div>
                </Reveal>

                {/* Publication Cards */}
                <div className="publications-list">
                    {publications.map((pub, index) => (
                        <Reveal key={pub.id} delay={index * 0.12}>
                            <a
                                href={pub.doi}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="publication-card"
                            >
                                <div className="publication-card-inner">
                                    <div className="publication-header">
                                        <div className="publication-year-badge">
                                            {pub.year}
                                        </div>
                                        <div className="citation-badge">
                                            <Award size={14} />
                                            <span>{pub.citations} citations</span>
                                        </div>
                                    </div>

                                    <h3 className="publication-title">{pub.title}</h3>

                                    <div className="publication-authors">
                                        {pub.authors.map((author, i) => (
                                            <span key={i}>
                                                <span className={author.includes('Shriman') ? 'author-highlight' : ''}>
                                                    {author}
                                                </span>
                                                {i < pub.authors.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="publication-journal">
                                        <Quote size={14} />
                                        <span>{pub.journal}</span>
                                    </div>

                                    <div className="publication-footer">
                                        <div className="publication-tags">
                                            {pub.tags.map(tag => (
                                                <span key={tag} className="pub-tag">{tag}</span>
                                            ))}
                                        </div>
                                        <span className="publication-link">
                                            View Paper <ExternalLink size={14} />
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </Reveal>
                    ))}
                </div>

                {/* Google Scholar Link */}
                <Reveal delay={0.3}>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <a
                            href={personalInfo.scholar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            <BookMarked size={18} />
                            View Google Scholar Profile
                        </a>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

export default Publications
