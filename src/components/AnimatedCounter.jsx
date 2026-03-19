'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * AnimatedCounter — counts up from 0 to `target` when it scrolls into view.
 * Inspired by Magic UI Number Ticker.
 */
function AnimatedCounter({ target, value, duration = 1500, suffix = '', prefix = '', decimals = 0 }) {
    const finalTarget = target ?? value ?? 0
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
                        const current = eased * finalTarget
                        setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current))
                        if (progress < 1) {
                            requestAnimationFrame(animate)
                        } else {
                            setCount(finalTarget)
                        }
                    }
                    requestAnimationFrame(animate)
                }
            },
            { threshold: 0.5 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [finalTarget, duration, hasAnimated, decimals])

    const display = decimals > 0 ? count.toFixed(decimals) : count

    return (
        <span ref={ref} className="animated-counter">
            {prefix}{display}{suffix}
        </span>
    )
}

export default AnimatedCounter
