'use client'

/**
 * Client-side App Wrapper
 * Imports the existing Vite/React app structure and renders it in Next.js
 * This allows gradual migration while preserving existing functionality
 */

import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import EditModePanel from '../components/EditModePanel'
import ErrorBoundary from '../components/ErrorBoundary'
import { ScrollProgressBar, BackToTop } from '../components/PremiumEffects'
import { useEdit } from '../context/EditContext'

// Dynamically import Three.js scene to avoid SSR issues
const Scene3D = dynamic(() => import('../components/3d/Scene'), {
    ssr: false,
    loading: () => null,
})

/**
 * ViewportPreview - Wraps content with device width simulation for edit mode
 */
function ViewportPreview({ children }) {
    const { isEditMode, viewport } = useEdit()

    if (!isEditMode || viewport === 'desktop') {
        return <>{children}</>
    }

    return (
        <div className="viewport-preview-container">
            <div className={`viewport-preview viewport-${viewport}`}>
                {children}
            </div>
        </div>
    )
}

export default function ClientApp() {
    // Log visit on mount
    useEffect(() => {
        const logVisit = async () => {
            try {
                await fetch('/api/visit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: window.location.pathname,
                        userAgent: navigator.userAgent,
                        screenWidth: window.innerWidth
                    })
                })
            } catch (err) {
                // Silent fail - analytics are optional
            }
        }
        logVisit()
    }, [])

    return (
        <ErrorBoundary>
            {/* 3D Background Scene */}
            <Scene3D />

            <div className="app">
                <ScrollProgressBar />
                <BackToTop />
                <EditModePanel />
                <ViewportPreview>
                    <Navbar />
                    <main>
                        <Hero />
                        <About />
                        <Experience />
                        <Projects />
                        <Skills />
                        <Contact />
                    </main>
                    <Footer />
                </ViewportPreview>
            </div>
        </ErrorBoundary>
    )
}
