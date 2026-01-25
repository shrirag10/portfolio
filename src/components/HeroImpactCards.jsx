import { TrendingUp, Zap, Target, Users } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

/**
 * ManuFX-Style Hero Impact Cards
 * Displays key metrics with animated counters in the hero section
 */
function HeroImpactCards() {
    const impactStats = [
        {
            value: 83,
            suffix: '%',
            label: 'Downtime Reduction',
            icon: TrendingUp,
            color: '#10b981', // emerald
            bgColor: 'rgba(16, 185, 129, 0.15)'
        },
        {
            value: 2.04,
            prefix: '$',
            suffix: 'M',
            label: 'Annual Savings',
            icon: Zap,
            color: '#3b82f6', // blue
            bgColor: 'rgba(59, 130, 246, 0.15)',
            decimals: 2
        },
        {
            value: 67,
            suffix: '%',
            label: 'Efficiency Increase',
            icon: Target,
            color: '#8b5cf6', // purple
            bgColor: 'rgba(139, 92, 246, 0.15)'
        },
        {
            value: 25,
            suffix: '+',
            label: 'Team Members Led',
            icon: Users,
            color: '#06b6d4', // cyan
            bgColor: 'rgba(6, 182, 212, 0.15)'
        }
    ]

    return (
        <div className="hero-impact-cards">
            {impactStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div
                        key={index}
                        className="hero-impact-card"
                        style={{
                            '--card-color': stat.color,
                            '--card-bg': stat.bgColor
                        }}
                    >
                        <div className="hero-impact-icon">
                            <Icon size={18} />
                        </div>
                        <div className="hero-impact-value">
                            <AnimatedCounter
                                value={stat.value}
                                prefix={stat.prefix || ''}
                                suffix={stat.suffix || ''}
                                decimals={stat.decimals || 0}
                                duration={2000}
                            />
                        </div>
                        <div className="hero-impact-label">{stat.label}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default HeroImpactCards
