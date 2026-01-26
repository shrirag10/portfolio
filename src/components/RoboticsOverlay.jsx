import React from 'react'

/**
 * RoboticsOverlay Component
 * Renders decorative elements simulating a robot's sensor feed/HUD
 * Includes: SLAM Grid, Scanner Line, Telemetry Corners, System Status
 */
const RoboticsOverlay = () => {
    return (
        <div className="robotics-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            {/* Background Grid Pattern */}
            <div className="robotics-grid"></div>

            {/* Lidar Scanner Animation */}
            <div className="scanner-line"></div>

            {/* Viewfinder Corners */}
            <div className="telemetry-corner corner-tl"></div>
            <div className="telemetry-corner corner-tr"></div>
            <div className="telemetry-corner corner-bl"></div>
            <div className="telemetry-corner corner-br"></div>

            {/* Simulated System Status */}
            <div className="system-status desktop-only">
                <div className="status-row">
                    <span>SYSTEM: ONLINE</span>
                    <div className="status-dot"></div>
                </div>
                <div className="status-row">
                    <span style={{ opacity: 0.8 }}>LIDAR: ACTIVE</span>
                    <div className="status-dot" style={{ animationDelay: '0.3s', background: '#60a5fa' }}></div>
                </div>
                <div className="status-row">
                    <span style={{ opacity: 0.6 }}>SLAM: ACTIVE</span>
                    <div className="status-dot" style={{ animationDelay: '0.6s' }}></div>
                </div>
            </div>
        </div>
    )
}

export default RoboticsOverlay
