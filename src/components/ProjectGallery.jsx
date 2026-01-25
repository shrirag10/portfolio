import { useState } from 'react'
import { extractedImages } from '../data/extractedImages'
import { EditableText } from './Editable'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProjectGallery() {
    const [filter, setFilter] = useState('all')
    const [selectedImage, setSelectedImage] = useState(null)

    const filteredImages = filter === 'all'
        ? extractedImages
        : extractedImages.filter(img => img.category === filter)

    return (
        <section className="section project-gallery" id="gallery">
            <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '40px' }}>
                    <h2 className="section-title">
                        <EditableText path="gallery.title" defaultValue="Project Gallery" />
                    </h2>
                    <p className="section-subtitle">
                        <EditableText
                            path="gallery.subtitle"
                            defaultValue="A collection of visuals from my industrial and personal projects."
                        />
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="gallery-filters" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
                    {['all', 'industrial', 'personal'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`filter-btn ${filter === cat ? 'active' : ''}`}
                            style={{
                                padding: '8px 24px',
                                borderRadius: '9999px',
                                background: filter === cat ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: filter === cat ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div style={{
                    columnCount: 3,
                    columnGap: '24px',
                }} className="masonry-grid">
                    <AnimatePresence>
                        {filteredImages.map((img, index) => (
                            <motion.div
                                key={img.src}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                style={{ breakInside: 'avoid', marginBottom: '24px' }}
                                onClick={() => setSelectedImage(img.src)}
                            >
                                <div className="gallery-item glow-hover" style={{
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    cursor: 'zoom-in',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <img
                                        src={img.src}
                                        alt={`Project ${index + 1}`}
                                        style={{ width: '100%', display: 'block' }}
                                    />
                                    <div className="overlay" style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                        opacity: 0,
                                        transition: 'opacity 0.3s'
                                    }} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.9)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 10000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px',
                            cursor: 'zoom-out'
                        }}
                    >
                        <motion.img
                            src={selectedImage}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                maxWidth: '90%',
                                maxHeight: '90%',
                                borderRadius: '8px',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        @media (max-width: 1024px) {
            .masonry-grid { column-count: 2 !important; }
        }
        @media (max-width: 640px) {
            .masonry-grid { column-count: 1 !important; }
        }
        .gallery-item:hover .overlay { opacity: 1 !important; }
      `}</style>
        </section>
    )
}
