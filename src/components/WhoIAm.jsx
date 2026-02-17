'use client'

import { useState, useEffect, useRef } from 'react'
import { Brain, Eye, Bot, Cog, Zap, Code, Navigation, Factory } from 'lucide-react'
import Reveal from './Reveal'

/**
 * WhoIAm — Interactive expertise Venn diagram section
 * Based on Shri's handwritten diagram showing overlapping domains:
 * AI (ML/DL/RL) ∩ Autonomous Vehicles/CV ∩ Mobile & Field Robots ∩ Humanoids
 */

const domains = [
    {
        id: 'ai',
        label: 'AI & Deep Learning',
        shortLabel: 'AI / ML / DL',
        icon: <Brain size={28} />,
        color: '#6C63FF',
        skills: ['Machine Learning', 'Deep Learning', 'Reinforcement Learning', 'Neural Networks', 'PyTorch'],
        description: 'Building intelligent systems that learn, adapt, and make decisions from data.',
        cx: 38,
        cy: 32,
        r: 28,
    },
    {
        id: 'av',
        label: 'Autonomous Vehicles & CV',
        shortLabel: 'AV / CV',
        icon: <Eye size={28} />,
        color: '#00C9A7',
        skills: ['Computer Vision', 'Sensor Fusion', 'Object Detection', 'LiDAR', 'SLAM'],
        description: 'Perception pipelines that let machines see and understand the world.',
        cx: 62,
        cy: 32,
        r: 28,
    },
    {
        id: 'mobile',
        label: 'Mobile & Field Robots',
        shortLabel: 'Mobile Robots',
        icon: <Bot size={28} />,
        color: '#FF6B6B',
        skills: ['AMR Deployment', 'Path Planning', 'ROS', 'Fleet Management', 'Navigation'],
        description: 'Deploying robots that move, navigate, and operate in real-world environments.',
        cx: 50,
        cy: 56,
        r: 26,
    },
    {
        id: 'humanoid',
        label: 'Humanoids',
        shortLabel: 'Humanoids',
        icon: <Zap size={28} />,
        color: '#FFD93D',
        skills: ['Bipedal Locomotion', 'Control Systems', 'Sim-to-Real', 'Motion Planning'],
        description: 'The next frontier — robots that walk, grasp, and interact like humans.',
        cx: 38,
        cy: 68,
        r: 18,
    },
    {
        id: 'industrial',
        label: 'Industrial Engineering',
        shortLabel: 'Industrial Engg',
        icon: <Factory size={28} />,
        color: '#A78BFA',
        skills: ['Manufacturing Automation', 'Process Optimization', 'PLC/HMI', 'Production Systems'],
        description: 'Bridging robotics and factory floors — real-world manufacturing impact.',
        cx: 72,
        cy: 68,
        r: 18,
    }
]

function WhoIAm() {
    const [activeDomain, setActiveDomain] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    const active = domains.find(d => d.id === activeDomain)

    return (
        <section className="whoiam section" id="whoiam" ref={sectionRef}>
            <div className="container">
                <Reveal>
                    <div className="section-header" style={{ textAlign: 'center' }}>
                        <p className="section-label" style={{ justifyContent: 'center' }}>
                            <Code size={16} />
                            Who I Am
                        </p>
                        <h2>
                            Where My <span className="gradient-text">Worlds Collide</span>
                        </h2>
                        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                            A robotics engineer at the intersection of AI, autonomous systems, and manufacturing — these are the domains I live in.
                        </p>
                    </div>
                </Reveal>

                <div className="whoiam-content">
                    {/* Interactive Venn Diagram */}
                    <Reveal delay={0.2}>
                        <div className="whoiam-venn-container">
                            <svg
                                viewBox="0 0 100 90"
                                className={`whoiam-venn-svg ${isVisible ? 'animate' : ''}`}
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <defs>
                                    {domains.map(d => (
                                        <radialGradient key={d.id} id={`grad-${d.id}`} cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor={d.color} stopOpacity="0.35" />
                                            <stop offset="100%" stopColor={d.color} stopOpacity="0.08" />
                                        </radialGradient>
                                    ))}
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* Domain circles */}
                                {domains.map((d, i) => (
                                    <g key={d.id}>
                                        <circle
                                            cx={d.cx}
                                            cy={d.cy}
                                            r={d.r}
                                            fill={`url(#grad-${d.id})`}
                                            stroke={d.color}
                                            strokeWidth={activeDomain === d.id ? 0.8 : 0.4}
                                            strokeDasharray={activeDomain === d.id ? 'none' : '2,1'}
                                            opacity={activeDomain && activeDomain !== d.id ? 0.3 : 1}
                                            className="whoiam-circle"
                                            style={{
                                                animationDelay: `${i * 0.15}s`,
                                                transition: 'all 0.4s ease',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={() => setActiveDomain(d.id)}
                                            onMouseLeave={() => setActiveDomain(null)}
                                            onClick={() => setActiveDomain(activeDomain === d.id ? null : d.id)}
                                        />
                                        {/* Labels */}
                                        <text
                                            x={d.cx}
                                            y={d.cy - 1}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill={activeDomain && activeDomain !== d.id ? 'var(--text-muted)' : d.color}
                                            fontSize={d.r > 20 ? 3.2 : 2.8}
                                            fontWeight="700"
                                            fontFamily="var(--font-heading)"
                                            style={{
                                                transition: 'all 0.3s ease',
                                                pointerEvents: 'none',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            {d.shortLabel}
                                        </text>
                                        {/* Sub-labels for larger circles */}
                                        {d.r > 20 && (
                                            <text
                                                x={d.cx}
                                                y={d.cy + 3}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fill="var(--text-secondary)"
                                                fontSize="2"
                                                style={{ pointerEvents: 'none', opacity: 0.7 }}
                                            >
                                                {d.skills.slice(0, 2).join(' • ')}
                                            </text>
                                        )}
                                    </g>
                                ))}

                                {/* Center intersection label */}
                                <text
                                    x="50"
                                    y="44"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="var(--text-primary)"
                                    fontSize="2.5"
                                    fontWeight="800"
                                    fontFamily="var(--font-heading)"
                                    style={{
                                        pointerEvents: 'none',
                                        opacity: activeDomain ? 0.2 : 0.8,
                                        transition: 'opacity 0.3s ease'
                                    }}
                                >
                                    SHRI
                                </text>
                            </svg>
                        </div>
                    </Reveal>

                    {/* Domain Detail Cards */}
                    <Reveal delay={0.3}>
                        <div className="whoiam-domains">
                            {domains.map((d, i) => (
                                <button
                                    key={d.id}
                                    className={`whoiam-domain-card ${activeDomain === d.id ? 'active' : ''}`}
                                    style={{ '--domain-color': d.color }}
                                    onMouseEnter={() => setActiveDomain(d.id)}
                                    onMouseLeave={() => setActiveDomain(null)}
                                    onClick={() => setActiveDomain(activeDomain === d.id ? null : d.id)}
                                >
                                    <div className="whoiam-domain-icon">{d.icon}</div>
                                    <div className="whoiam-domain-info">
                                        <h4>{d.label}</h4>
                                        <p>{d.description}</p>
                                        <div className="whoiam-domain-skills">
                                            {d.skills.map(skill => (
                                                <span key={skill} className="whoiam-skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Reveal>
                </div>

                {/* "Need to explore more" note from the diagram */}
                <Reveal delay={0.5}>
                    <div className="whoiam-explore-note">
                        <Zap size={16} />
                        <span>Always exploring the boundaries — next up: <strong>Humanoid locomotion</strong> and <strong>Sim-to-Real transfer</strong>.</span>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

export default WhoIAm
