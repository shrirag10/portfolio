import { TrendingUp, Clock, Zap, Target } from 'lucide-react'
import { EditableText } from './Editable'
import { useEdit } from '../context/EditContext'

function ImpactCards() {
    return (
        <section className="section impact-cards-section" id="impact">
            <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <h2 className="section-title">
                        <EditableText path="impact.title" defaultValue="Quantified Impact" />
                    </h2>
                    <p className="section-subtitle">
                        <EditableText
                            path="impact.subtitle"
                            defaultValue="Delivering measurable results through engineering excellence and automation."
                        />
                    </p>
                </div>

                <div className="impact-grid">
                    {/* Card 1: Tesla Savings */}
                    <div className="impact-card">
                        <div className="impact-icon" style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: '#3b82f6'
                        }}>
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="impact-number" style={{
                            backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                        }}>
                            <EditableText path="impact.card1.value" defaultValue="$2.04M" />
                        </h3>
                        <h4 className="impact-label">
                            <EditableText path="impact.card1.label" defaultValue="Projected Annual Savings" />
                        </h4>
                        <p className="impact-desc">
                            <EditableText
                                path="impact.card1.desc"
                                defaultValue="Tesla Inc. - Through implementation of autonomous forklift AMRs and optimized fleet management."
                                multiline
                            />
                        </p>
                    </div>

                    {/* Card 2: Efficiency */}
                    <div className="impact-card">
                        <div className="impact-icon" style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981'
                        }}>
                            <Zap size={24} />
                        </div>
                        <h3 className="impact-number" style={{
                            backgroundImage: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
                        }}>
                            <EditableText path="impact.card2.value" defaultValue="67%" />
                        </h3>
                        <h4 className="impact-label">
                            <EditableText path="impact.card2.label" defaultValue="Efficiency Increase" />
                        </h4>
                        <p className="impact-desc">
                            <EditableText
                                path="impact.card2.desc"
                                defaultValue="Hero MotoCorp - Reduction in pallet unloading time through automated robotic systems."
                                multiline
                            />
                        </p>
                    </div>

                    {/* Card 3: Complexity Reduction */}
                    <div className="impact-card">
                        <div className="impact-icon" style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#f59e0b'
                        }}>
                            <Target size={24} />
                        </div>
                        <h3 className="impact-number" style={{
                            backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                        }}>
                            <EditableText path="impact.card3.value" defaultValue="83%" />
                        </h3>
                        <h4 className="impact-label">
                            <EditableText path="impact.card3.label" defaultValue="Routing Optimized" />
                        </h4>
                        <p className="impact-desc">
                            <EditableText
                                path="impact.card3.desc"
                                defaultValue="Tesla Inc. - Reduction in complexity for AMR path planning and traffic management."
                                multiline
                            />
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ImpactCards
