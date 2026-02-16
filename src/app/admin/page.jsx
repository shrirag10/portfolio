'use client'

/**
 * Admin Page - Full CMS/Editor Mode
 * Loads the portfolio with all editor functionality enabled.
 * Access at /admin - protected by password dialog.
 */

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import About from '../../components/About'
import Experience from '../../components/Experience'
import Projects from '../../components/Projects'
import Skills from '../../components/Skills'
import Blog from '../../components/Blog'
import Contact from '../../components/Contact'
import EditModePanel from '../../components/EditModePanel'
import ErrorBoundary from '../../components/ErrorBoundary'
import { ScrollProgressBar, BackToTop } from '../../components/PremiumEffects'
import { useEdit } from '../../context/EditContext'

// Dynamically import Three.js scene
const Scene3D = dynamic(() => import('../../components/3d/Scene'), {
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

export default function AdminPage() {
    return (
        <ErrorBoundary>
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
                        <Blog />
                        <Contact />
                    </main>
                    <Footer />
                </ViewportPreview>
            </div>
        </ErrorBoundary>
    )
}
