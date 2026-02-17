'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, Cpu, Navigation, Layers, Brain, Eye, Zap, Factory, Code } from 'lucide-react'
import { personalInfo, education } from '../data/content'
import { EditableText, EditableList } from './Editable'
import { useEdit } from '../context/EditContext'
import HobbyCards from './HobbyCards'
import Reveal from './Reveal'

/**
 * Combined "Who I Am" + About section
 * Features interactive Venn diagram of expertise domains, bio, and education
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
    cx: 35, cy: 30, r: 26,
  },
  {
    id: 'av',
    label: 'Autonomous Vehicles & CV',
    shortLabel: 'AV / CV',
    icon: <Eye size={28} />,
    color: '#00C9A7',
    skills: ['Computer Vision', 'Sensor Fusion', 'Object Detection', 'LiDAR', 'SLAM'],
    description: 'Perception pipelines that let machines see and understand the world.',
    cx: 75, cy: 30, r: 26,
  },
  {
    id: 'mobile',
    label: 'Mobile & Field Robots',
    shortLabel: 'Mobile Robots',
    icon: <Bot size={28} />,
    color: '#FF6B6B',
    skills: ['AMR Deployment', 'Path Planning', 'ROS', 'Fleet Management', 'Navigation'],
    description: 'Deploying robots that move, navigate, and operate in real-world environments.',
    cx: 55, cy: 55, r: 24,
  },
  {
    id: 'humanoid',
    label: 'Humanoids',
    shortLabel: 'Humanoids',
    icon: <Zap size={28} />,
    color: '#FFD93D',
    skills: ['Bipedal Locomotion', 'Control Systems', 'Sim-to-Real', 'Motion Planning'],
    description: 'The next frontier — robots that walk, grasp, and interact like humans.',
    cx: 28, cy: 72, r: 20,
  },
  {
    id: 'industrial',
    label: 'Industrial Engineering',
    shortLabel: 'Industrial Engg',
    icon: <Factory size={28} />,
    color: '#A78BFA',
    skills: ['Manufacturing Automation', 'Process Optimization', 'PLC/HMI', 'Production Systems'],
    description: 'Bridging robotics and factory floors — real-world manufacturing impact.',
    cx: 82, cy: 72, r: 20,
  }
]

function About() {
  const { isEditMode, getContent } = useEdit()
  const [activeDomain, setActiveDomain] = useState(null)
  const [isVennVisible, setIsVennVisible] = useState(false)
  const vennRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVennVisible(true) },
      { threshold: 0.2 }
    )
    if (vennRef.current) observer.observe(vennRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="about section" id="about">
      <div className="container">
        {/* ── Who I Am: Venn Diagram ── */}
        <Reveal>
          <div className="section-header" style={{ textAlign: 'center' }}>
            <p className="section-label" style={{ justifyContent: 'center' }}>
              <Code size={16} />
              Who I Am
            </p>
            <h2 className="section-title">
              <EditableText path="about.title" defaultValue="Turning Complex Robotics Challenges Into" />
              <span className="gradient-text">
                <EditableText path="about.titleHighlight" defaultValue=" Production-Ready Solutions" />
              </span>
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '620px', margin: '0 auto', color: 'var(--text-secondary)' }}>
              A robotics engineer at the intersection of AI, autonomous systems, and manufacturing — here's where my worlds collide.
            </p>
          </div>
        </Reveal>

        <div className="whoiam-content" ref={vennRef}>
          {/* Interactive Venn Diagram */}
          <Reveal delay={0.2}>
            <div className="whoiam-venn-container">
              <svg
                viewBox="0 0 110 100"
                className={`whoiam-venn-svg ${isVennVisible ? 'animate' : ''}`}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {domains.map(d => (
                    <radialGradient key={d.id} id={`grad-${d.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={d.color} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={d.color} stopOpacity="0.08" />
                    </radialGradient>
                  ))}
                </defs>
                {domains.map((d, i) => (
                  <g key={d.id}>
                    <circle
                      cx={d.cx} cy={d.cy} r={d.r}
                      fill={`url(#grad-${d.id})`}
                      stroke={d.color}
                      strokeWidth={activeDomain === d.id ? 0.8 : 0.4}
                      strokeDasharray={activeDomain === d.id ? 'none' : '2,1'}
                      opacity={activeDomain && activeDomain !== d.id ? 0.3 : 1}
                      className="whoiam-circle"
                      style={{ animationDelay: `${i * 0.15}s`, transition: 'all 0.4s ease', cursor: 'pointer' }}
                      onMouseEnter={() => setActiveDomain(d.id)}
                      onMouseLeave={() => setActiveDomain(null)}
                      onClick={() => setActiveDomain(activeDomain === d.id ? null : d.id)}
                    />
                    <text
                      x={d.cx} y={d.cy - 1} textAnchor="middle" dominantBaseline="middle"
                      fill={activeDomain && activeDomain !== d.id ? 'var(--text-muted)' : d.color}
                      fontSize={d.r > 22 ? 3.8 : 3.2} fontWeight="700"
                      fontFamily="var(--font-heading)"
                      style={{ transition: 'all 0.3s ease', pointerEvents: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      {d.shortLabel}
                    </text>
                    {d.r > 18 && (
                      <text
                        x={d.cx} y={d.cy + 3.5} textAnchor="middle" dominantBaseline="middle"
                        fill="var(--text-secondary)" fontSize="2.2"
                        style={{ pointerEvents: 'none', opacity: 0.7 }}
                      >
                        {d.skills.slice(0, 2).join(' • ')}
                      </text>
                    )}
                  </g>
                ))}
                <text
                  x="55" y="46" textAnchor="middle" dominantBaseline="middle"
                  fill="var(--text-primary)" fontSize="3" fontWeight="800"
                  fontFamily="var(--font-heading)"
                  style={{ pointerEvents: 'none', opacity: activeDomain ? 0.2 : 0.8, transition: 'opacity 0.3s ease' }}
                >
                  SHRI
                </text>
              </svg>
            </div>
          </Reveal>

          {/* Domain Cards */}
          <Reveal delay={0.3}>
            <div className="whoiam-domains">
              {domains.map(d => (
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

        {/* Explore note */}
        <Reveal delay={0.4}>
          <div className="whoiam-explore-note">
            <Zap size={16} />
            <span>Always exploring the boundaries — next up: <strong>Humanoid locomotion</strong> and <strong>Sim-to-Real transfer</strong>.</span>
          </div>
        </Reveal>

        {/* ── Bio ── */}
        <div className="about-content" style={{ marginTop: '64px' }}>
          <Reveal delay={0.2} width="100%">
            <div className="about-text">
              <div className="section-header">
                <p className="section-label">My Story</p>
              </div>
              <p>
                <EditableText path="about.paragraph1" defaultValue={personalInfo.about[0]} multiline={true} />
              </p>
              <p>
                <EditableText path="about.paragraph2" defaultValue={personalInfo.about[1]} multiline={true} />
              </p>
              <p>
                <EditableText path="about.paragraph3" defaultValue={personalInfo.about[2]} multiline={true} />
              </p>
            </div>
          </Reveal>

          {/* Education */}
          <Reveal delay={0.4} width="100%">
            <div className="about-education">
              <div className="section-header">
                <p className="section-label">Education</p>
              </div>
              {education.map((edu, index) => (
                <div className="experience-card" key={index} style={{ marginBottom: '24px' }}>
                  <div className="experience-header">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      {edu.icon && (
                        <div style={{
                          flexShrink: 0, width: '48px', height: '48px', borderRadius: '8px',
                          overflow: 'hidden', background: 'white', padding: '4px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <img src={edu.icon} alt={edu.school}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="experience-title">
                          <EditableText path={`education.${index}.degree`} defaultValue={edu.degree} />
                        </h3>
                        <p className="experience-company">
                          <EditableText path={`education.${index}.school`} defaultValue={edu.school} />
                        </p>
                      </div>
                    </div>
                    <div className="experience-location">
                      <EditableText path={`education.${index}.location`} defaultValue={edu.location} />
                    </div>
                  </div>
                  <p className="experience-date" style={{ marginBottom: '12px' }}>
                    <EditableText path={`education.${index}.date`} defaultValue={edu.date} />
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <strong>GPA:</strong> <EditableText path={`education.${index}.gpa`} defaultValue={edu.gpa} /> | <strong>Relevant:</strong> {edu.courses.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Hobby Cards */}
        <Reveal delay={0.6} width="100%">
          <HobbyCards />
        </Reveal>
      </div>
    </section>
  )
}

export default About
