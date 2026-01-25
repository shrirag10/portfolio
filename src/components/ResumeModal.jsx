import { useState, useEffect } from 'react'
import { X, Download, ExternalLink } from 'lucide-react'
import { personalInfo } from '../data/content'

/**
 * PDF Resume Viewer Modal
 * Opens resume in a modal overlay with download option
 */
function ResumeModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Prevent body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div
            className={`resume-modal-overlay ${isOpen ? 'active' : ''}`}
            onClick={onClose}
        >
            <div
                className="resume-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="resume-modal-header">
                    <h3 className="resume-modal-title">Resume - Shriman Raghav Srinivasan</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <a
                            href={personalInfo.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-modal-close"
                            title="Open in new tab"
                        >
                            <ExternalLink size={18} />
                        </a>
                        <a
                            href={personalInfo.resumeUrl}
                            download
                            className="resume-modal-close"
                            title="Download"
                        >
                            <Download size={18} />
                        </a>
                        <button
                            className="resume-modal-close"
                            onClick={onClose}
                            title="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
                <div className="resume-modal-body">
                    {loading && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: 'var(--text-muted)'
                        }}>
                            Loading resume...
                        </div>
                    )}
                    <iframe
                        src={personalInfo.resumeUrl}
                        title="Resume"
                        onLoad={() => setLoading(false)}
                        style={{ display: loading ? 'none' : 'block' }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ResumeModal
