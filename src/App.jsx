import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { logVisit } from './utils/analytics'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
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

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    logVisit()
  }, [location.pathname])

  return (
    <div className="app">
      <EditModePanel />
      <ViewportPreview>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
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
