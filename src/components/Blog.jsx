import { useState } from 'react'
import { ArrowUpRight, Clock, Tag, BookOpen } from 'lucide-react'
import { blogPosts } from '../data/blog'
import Reveal from './Reveal'

function Blog() {
    const [showAll, setShowAll] = useState(false)
    const displayPosts = showAll ? blogPosts : blogPosts.filter(p => p.featured)

    return (
        <section className="blog section" id="blog">
            <div className="container">
                <div className="section-header" style={{ textAlign: 'center' }}>
                    <p className="section-label" style={{ justifyContent: 'center' }}>
                        <BookOpen size={16} />
                        Writings
                    </p>
                    <h2>
                        Technical <span className="gradient-text">Insights</span>
                    </h2>
                    <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                        Articles on robotics, AI, and engineering — originally published on LinkedIn.
                    </p>
                </div>

                <div className="blog-grid">
                    {displayPosts.map((post, index) => (
                        <Reveal key={post.id} delay={index * 0.1}>
                            <a
                                href={post.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blog-card"
                            >
                                <div className="blog-card-content">
                                    <div className="blog-card-meta">
                                        <span className="blog-date">{post.date}</span>
                                        <span className="blog-read-time">
                                            <Clock size={14} />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    <h3 className="blog-card-title">{post.title}</h3>
                                    <p className="blog-card-summary">{post.summary}</p>

                                    <div className="blog-card-tags">
                                        {post.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="blog-tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="blog-card-cta">
                                        Read on LinkedIn
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </a>
                        </Reveal>
                    ))}
                </div>

                {blogPosts.length > 2 && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? 'Show Featured' : `View All Articles (${blogPosts.length})`}
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Blog
