import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth catch-up effect
    const springConfig = { damping: 25, stiffness: 700 }
    const cursorX = useSpring(mouseX, springConfig)
    const cursorY = useSpring(mouseY, springConfig)

    useEffect(() => {
        // Only show custom cursor on desktop
        if (window.matchMedia('(pointer: coarse)').matches) return

        const moveCursor = (e) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
            if (!isVisible) setIsVisible(true)
        }

        const checkHover = (e) => {
            // Check if hovering over clickable elements
            const target = e.target
            const isClickable = (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('clickable') ||
                window.getComputedStyle(target).cursor === 'pointer'
            )

            setIsHovering(isClickable)
        }

        window.addEventListener('mousemove', moveCursor)
        window.addEventListener('mouseover', checkHover)

        // Hide native cursor for better effect (optional, maybe too aggressive)
        // document.body.style.cursor = 'none'

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            window.removeEventListener('mouseover', checkHover)
            // document.body.style.cursor = 'auto'
        }
    }, [isVisible, mouseX, mouseY])

    if (!isVisible) return null

    return (
        <>
            <motion.div
                className="custom-cursor"
                style={{
                    translateX: cursorX,
                    translateY: cursorY,
                    x: '-50%',
                    y: '-50%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: isHovering ? '60px' : '20px',
                    height: isHovering ? '60px' : '20px',
                    backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.8)',
                    border: isHovering ? '1px solid rgba(59, 130, 246, 0.5)' : 'none',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    mixBlendMode: 'difference'
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 28
                }}
            />

            {/* Small dot that stays perfectly on point */}
            <motion.div
                style={{
                    translateX: mouseX,
                    translateY: mouseY,
                    x: '-50%',
                    y: '-50%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000
                }}
            />
        </>
    )
}
