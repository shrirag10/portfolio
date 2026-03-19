'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * TextScramble — scrambles text through random characters before revealing.
 * Inspired by Motion Primitives Text Scramble.
 * 
 * Usage:
 *   <TextScramble text="SLAM" />
 *   <TextScramble text="PyTorch" trigger="hover" />
 */

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?0123456789'

function TextScramble({ text, className = '', trigger = 'scroll', duration = 800 }) {
    const [displayText, setDisplayText] = useState(text)
    const [isScrambling, setIsScrambling] = useState(false)
    const [hasTriggered, setHasTriggered] = useState(false)
    const ref = useRef(null)

    const scramble = useCallback(() => {
        if (isScrambling) return
        setIsScrambling(true)

        const length = text.length
        const startTime = performance.now()
        const revealDelay = duration * 0.3 // Start revealing after 30% of duration

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            let result = ''
            for (let i = 0; i < length; i++) {
                // Each character gets revealed progressively
                const charRevealPoint = revealDelay / duration + (i / length) * (1 - revealDelay / duration)

                if (progress >= charRevealPoint) {
                    result += text[i]
                } else {
                    result += CHARS[Math.floor(Math.random() * CHARS.length)]
                }
            }

            setDisplayText(result)

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setDisplayText(text)
                setIsScrambling(false)
            }
        }

        // Start with all scrambled
        setDisplayText(
            Array.from({ length: text.length }, () =>
                CHARS[Math.floor(Math.random() * CHARS.length)]
            ).join('')
        )

        requestAnimationFrame(animate)
    }, [text, duration, isScrambling])

    // Scroll-triggered
    useEffect(() => {
        if (trigger !== 'scroll') return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTriggered) {
                    setHasTriggered(true)
                    // Small random delay to stagger effects when multiple tags appear
                    const delay = Math.random() * 400
                    setTimeout(scramble, delay)
                }
            },
            { threshold: 0.5 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [trigger, hasTriggered, scramble])

    const handleMouseEnter = () => {
        if (trigger === 'hover') {
            scramble()
        }
    }

    return (
        <span
            ref={ref}
            className={`text-scramble ${className}`}
            onMouseEnter={handleMouseEnter}
            style={{ fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums' }}
        >
            {displayText}
        </span>
    )
}

export default TextScramble
