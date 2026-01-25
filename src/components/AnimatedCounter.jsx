import { useState, useEffect, useRef } from 'react'

/**
 * Animated Counter Component
 * Counts up from 0 to target value when scrolled into view
 */
function AnimatedCounter({
    value,
    suffix = '',
    prefix = '',
    duration = 2000,
    decimals = 0
}) {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef(null)

    // Parse numeric value from string (handles "$2.04M", "67%", "3+", etc.)
    const parseValue = (val) => {
        if (typeof val === 'number') return val
        const numStr = val.toString().replace(/[^0-9.]/g, '')
        return parseFloat(numStr) || 0
    }

    const targetValue = parseValue(value)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true)
                        animateValue(0, targetValue, duration)
                    }
                })
            },
            { threshold: 0.3 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [targetValue, duration, hasAnimated])

    const animateValue = (start, end, duration) => {
        const startTime = performance.now()

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const current = start + (end - start) * easeOutQuart

            setCount(current)

            if (progress < 1) {
                requestAnimationFrame(updateCount)
            }
        }

        requestAnimationFrame(updateCount)
    }

    // Format the display value
    const formatValue = () => {
        if (decimals > 0) {
            return count.toFixed(decimals)
        }
        return Math.round(count)
    }

    return (
        <span ref={ref} className="animated-counter">
            {prefix}{formatValue()}{suffix}
        </span>
    )
}

export default AnimatedCounter
