'use client'

/**
 * Client-side App Wrapper
 * Renders the portfolio content with interactive features.
 * Editor functionality is available at /admin route.
 */

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Blog from '../components/Blog'
import Contact from '../components/Contact'
import ErrorBoundary from '../components/ErrorBoundary'
import { ScrollProgressBar, BackToTop } from '../components/PremiumEffects'

// Dynamically import Three.js scene to avoid SSR issues
const Scene3D = dynamic(() => import('../components/3d/Scene'), {
    ssr: false,
    loading: () => null,
})

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
            </div>
        </ErrorBoundary>
    )
}
