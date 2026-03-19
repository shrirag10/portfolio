'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * AnimatedCounter — counts up from 0 to `target` when it scrolls into view.
 * Inspired by Magic UI Number Ticker.
 */
function AnimatedCounter({ target, duration = 1500, suffix = '', prefix = '' }) {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                    const startTime = performance.now()
                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime
                        const progress = Math.min(elapsed / duration, 1)
                        // Ease out cubic for a satisfying deceleration
                        const eased = 1 - Math.pow(1 - progress, 3)
                        setCount(Math.floor(eased * target))
                        if (progress < 1) {
                            requestAnimationFrame(animate)
                        } else {
                            setCount(target)
                        }
                    }
                    requestAnimationFrame(animate)
                }
            },
            { threshold: 0.5 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target, duration, hasAnimated])

    return (
        <span ref={ref} className="animated-counter">
            {prefix}{count}{suffix}
        </span>
    )
}

export default AnimatedCounter
