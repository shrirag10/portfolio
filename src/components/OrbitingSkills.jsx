'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * OrbitingSkills — Rotating orbital rings showing tech stack.
 * Inspired by Magic UI Orbiting Circles.
 * 
 * Skills orbit at different speeds and radii around a central label.
 */

const ORBIT_CONFIG = [
    { radius: 100, duration: 25, reverse: false },
    { radius: 160, duration: 35, reverse: true },
    { radius: 220, duration: 45, reverse: false },
]

function OrbitingSkills({ skills = [] }) {
    const containerRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true)
            },
            { threshold: 0.2 }
        )
        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    // Distribute skills across orbits
    const orbits = ORBIT_CONFIG.map((config, orbitIdx) => {
        const startIdx = orbitIdx === 0 ? 0 : ORBIT_CONFIG.slice(0, orbitIdx).reduce((sum, c, i) => {
            const itemsPerOrbit = Math.ceil(skills.length / ORBIT_CONFIG.length)
            return sum + Math.min(itemsPerOrbit, skills.length - sum)
        }, 0)
        const itemsPerOrbit = Math.ceil(skills.length / ORBIT_CONFIG.length)
        const orbitSkills = skills.slice(orbitIdx * itemsPerOrbit, (orbitIdx + 1) * itemsPerOrbit)
        return { ...config, skills: orbitSkills }
    })

    return (
        <div
            ref={containerRef}
            className="orbiting-container"
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                aspectRatio: '1',
                margin: '0 auto',
            }}
        >
            {/* Center label */}
            <div className="orbit-center">
                <span className="orbit-center-text">Robotics</span>
                <span className="orbit-center-sub">Engineering</span>
            </div>

            {/* Orbit rings (decorative) */}
            {ORBIT_CONFIG.map((config, i) => (
                <div
                    key={`ring-${i}`}
                    className="orbit-ring"
                    style={{
                        width: config.radius * 2,
                        height: config.radius * 2,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}

            {/* Orbiting items */}
            {orbits.map((orbit, orbitIdx) =>
                orbit.skills.map((skill, skillIdx) => {
                    const angle = (360 / orbit.skills.length) * skillIdx
                    return (
                        <div
                            key={`${orbitIdx}-${skillIdx}`}
                            className={`orbit-item ${isVisible ? 'orbit-item-visible' : ''}`}
                            style={{
                                '--orbit-radius': `${orbit.radius}px`,
                                '--orbit-duration': `${orbit.duration}s`,
                                '--orbit-direction': orbit.reverse ? 'reverse' : 'normal',
                                '--orbit-start-angle': `${angle}deg`,
                                '--orbit-delay': `${skillIdx * 0.1}s`,
                                animationDelay: `${skillIdx * 0.1}s`,
                            }}
                        >
                            <span className="orbit-skill-tag">{skill}</span>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default OrbitingSkills
