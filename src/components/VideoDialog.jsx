'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, X } from 'lucide-react'

/**
 * VideoDialog — Hero video with play button overlay that opens a fullscreen modal.
 * Inspired by Magic UI Hero Video Dialog.
 * 
 * Props:
 *   posterImage - static image to show as background
 *   videoSrc - video file URL (mp4, webm)
 *   alt - alt text
 */
function VideoDialog({ posterImage, videoSrc, alt = 'Project demo' }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') setIsOpen(false)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, handleKeyDown])

    if (!videoSrc) return null

    return (
        <>
            {/* Play Button Overlay on the poster image */}
            <button
                onClick={() => setIsOpen(true)}
                className="video-dialog-trigger"
                aria-label="Play project demo video"
            >
                <div className="video-play-btn">
                    <div className="video-play-btn-ring" />
                    <Play size={28} fill="white" color="white" />
                </div>
            </button>

            {/* Fullscreen Modal */}
            {isOpen && (
                <div
                    className="video-dialog-backdrop"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="video-dialog-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="video-dialog-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close video"
                        >
                            <X size={24} />
                        </button>
                        <video
                            src={videoSrc}
                            controls
                            autoPlay
                            className="video-dialog-player"
                            playsInline
                        >
                            Your browser does not support video playback.
                        </video>
                    </div>
                </div>
            )}
        </>
    )
}

export default VideoDialog
