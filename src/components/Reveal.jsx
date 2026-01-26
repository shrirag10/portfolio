import { motion, useInView, useAnimation } from 'framer-motion'
import { useEffect, useRef } from 'react'

/**
 * Reveal Component
 * Adds a scroll-reveal animation to any children
 * 
 * @param {ReactNode} children - Content to animate
 * @param {string} width - CSS width (default: 'fit-content' or '100%')
 * @param {number} delay - Animation delay in seconds
 */
const Reveal = ({ children, width = '100%', delay = 0.25 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const mainControls = useAnimation()

    useEffect(() => {
        if (isInView) {
            mainControls.start('visible')
        }
    }, [isInView, mainControls])

    return (
        <div ref={ref} style={{ position: 'relative', width }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    )
}

export default Reveal
