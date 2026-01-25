import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { logVisit } from './utils/analytics'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import TeslaProjectsPage from './pages/TeslaProjectsPage'
import HeroProjectsPage from './pages/HeroProjectsPage'
import AcademicProjectsPage from './pages/AcademicProjectsPage'
import EditModePanel from './components/EditModePanel'
import ErrorBoundary from './components/ErrorBoundary'
import { EditProvider, useEdit } from './context/EditContext'

/**
 * ViewportPreview - Wraps content with device width simulation
 * Applies width constraints based on viewport state from EditContext
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

import { AnimatePresence } from 'framer-motion'
import { ScrollProgressBar, BackToTop, PageTransition } from './components/PremiumEffects'

import CustomCursor from './components/CustomCursor'

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    logVisit()
    // Reset scroll position on route change
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app">
      <CustomCursor />
      <ScrollProgressBar />
      <BackToTop />
      <EditModePanel />
      <ViewportPreview>
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/tesla" element={<PageTransition><TeslaProjectsPage /></PageTransition>} />
            <Route path="/hero" element={<PageTransition><HeroProjectsPage /></PageTransition>} />
            <Route path="/academic" element={<PageTransition><AcademicProjectsPage /></PageTransition>} />
            <Route path="/project/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </ViewportPreview>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <EditProvider>
        <AppContent />
      </EditProvider>
    </ErrorBoundary>
  )
}

export default App
