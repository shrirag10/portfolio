import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { fetchCloudContent, saveCloudContent } from '../utils/cloudSync'

const EditContext = createContext()

const CONTENT_STORAGE_KEY = 'portfolio_content_edits'
const STYLE_STORAGE_KEY = 'portfolio_style_edits'
const SECTIONS_STORAGE_KEY = 'portfolio_sections_v2'
const PASSWORD_STORAGE_KEY = 'portfolio_edit_password'
const DEBOUNCE_DELAY = 500 // ms
const CLOUD_SYNC_DELAY = 2000 // ms - longer delay for cloud sync

// Default sections configuration
const DEFAULT_SECTIONS = [
  { id: 'hero', name: 'Hero Banner', icon: '🏠', visible: true },
  { id: 'impact', name: 'Impact Highlights', icon: '📈', visible: true },
  { id: 'about', name: 'About Section', icon: '👤', visible: true },
  { id: 'experience', name: 'Experience', icon: '💼', visible: true },
  { id: 'gallery', name: 'Project Gallery', icon: '🖼️', visible: true },
  { id: 'teslaProjects', name: 'Tesla Projects', icon: '🚗', visible: true },
  { id: 'heroProjects', name: 'Hero MotoCorp Projects', icon: '🏍️', visible: true },
  { id: 'academicProjects', name: 'Academic Projects', icon: '🎓', visible: true },
  { id: 'skills', name: 'Skills', icon: '⚡', visible: true },
  { id: 'contact', name: 'Contact', icon: '✉️', visible: true },
]

// Safe localStorage helpers
const safeGetItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key)
    if (!item) return fallback
    return JSON.parse(item)
  } catch (e) {
    console.warn(`Failed to parse ${key}, clearing corrupted data:`, e)
    try {
      localStorage.removeItem(key)
    } catch (removeError) {
      console.error('Failed to remove corrupted data:', removeError)
    }
    return fallback
  }
}

const safeSetItem = (key, value) => {
  try {
    const serialized = JSON.stringify(value)
    // Check storage quota (rough estimate: 5MB limit)
    if (serialized.length > 4 * 1024 * 1024) {
      console.warn('Data too large to store in localStorage')
      return false
    }
    localStorage.setItem(key, serialized)
    return true
  } catch (e) {
    // Handle quota exceeded or other storage errors
    if (e.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded')
    } else {
      console.error(`Failed to save ${key}:`, e)
    }
    return false
  }
}

const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.error(`Failed to remove ${key}:`, e)
    return false
  }
}

// Debounce utility
const useDebouncedEffect = (effect, deps, delay) => {
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      effect()
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

export function EditProvider({ children }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState({})
  const [editedStyles, setEditedStyles] = useState({})
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [viewport, setViewport] = useState('desktop') // 'desktop' | 'tablet' | 'mobile'
  const [cloudSyncStatus, setCloudSyncStatus] = useState('idle') // 'idle' | 'syncing' | 'synced' | 'error'
  const [editPassword, setEditPassword] = useState(() => safeGetItem(PASSWORD_STORAGE_KEY, ''))
  const isInitialLoad = useRef(true)
  const cloudSyncTimeoutRef = useRef(null)

  // Load saved edits on mount - cloud first, then localStorage fallback
  useEffect(() => {
    async function loadContent() {
      // Try to fetch from cloud first
      const cloudData = await fetchCloudContent()

      if (cloudData && (Object.keys(cloudData.content || {}).length > 0 ||
        Object.keys(cloudData.styles || {}).length > 0 ||
        (cloudData.sections && cloudData.sections.length > 0))) {
        // Use cloud data
        // Cloud data loaded successfully
        setEditedContent(cloudData.content || {})
        setEditedStyles(cloudData.styles || {})
        if (Array.isArray(cloudData.sections) && cloudData.sections.length > 0) {
          setSections(cloudData.sections)
        }
        // Also update localStorage as cache
        safeSetItem(CONTENT_STORAGE_KEY, cloudData.content || {})
        safeSetItem(STYLE_STORAGE_KEY, cloudData.styles || {})
        safeSetItem(SECTIONS_STORAGE_KEY, cloudData.sections || DEFAULT_SECTIONS)
      } else {
        // Fallback to localStorage
        // Fallback to localStorage
        const savedContent = safeGetItem(CONTENT_STORAGE_KEY, {})
        const savedStyles = safeGetItem(STYLE_STORAGE_KEY, {})
        const savedSections = safeGetItem(SECTIONS_STORAGE_KEY, DEFAULT_SECTIONS)

        // Validate sections structure
        if (Array.isArray(savedSections) && savedSections.every(s => s.id && s.name)) {
          setSections(savedSections)
        } else {
          console.warn('Invalid sections data, using defaults')
          setSections(DEFAULT_SECTIONS)
        }

        if (typeof savedContent === 'object' && savedContent !== null) {
          setEditedContent(savedContent)
        }

        if (typeof savedStyles === 'object' && savedStyles !== null) {
          setEditedStyles(savedStyles)
        }
      }

      isInitialLoad.current = false
    }

    loadContent()
  }, [])

  // Debounced save for content (localStorage)
  useDebouncedEffect(() => {
    if (isInitialLoad.current) return
    if (Object.keys(editedContent).length > 0) {
      setIsSaving(true)
      const success = safeSetItem(CONTENT_STORAGE_KEY, editedContent)
      if (success) setLastSaved(new Date())
      setIsSaving(false)
    }
  }, [editedContent], DEBOUNCE_DELAY)

  // Debounced save for styles (localStorage)
  useDebouncedEffect(() => {
    if (isInitialLoad.current) return
    if (Object.keys(editedStyles).length > 0) {
      const success = safeSetItem(STYLE_STORAGE_KEY, editedStyles)
      if (success) setLastSaved(new Date())
    }
  }, [editedStyles], DEBOUNCE_DELAY)

  // Debounced save for sections (localStorage)
  useDebouncedEffect(() => {
    if (isInitialLoad.current) return
    const success = safeSetItem(SECTIONS_STORAGE_KEY, sections)
    if (success) setLastSaved(new Date())
  }, [sections], DEBOUNCE_DELAY)

  // Cloud sync effect - syncs all content to cloud when in edit mode
  useEffect(() => {
    if (isInitialLoad.current || !isEditMode || !editPassword) return

    // Clear existing timeout
    if (cloudSyncTimeoutRef.current) {
      clearTimeout(cloudSyncTimeoutRef.current)
    }

    // Debounced cloud sync
    cloudSyncTimeoutRef.current = setTimeout(async () => {
      setCloudSyncStatus('syncing')

      const result = await saveCloudContent({
        content: editedContent,
        styles: editedStyles,
        sections: sections
      }, editPassword)

      if (result.success) {
        setCloudSyncStatus('synced')
        // Cloud sync successful
      } else {
        setCloudSyncStatus('error')
        console.error('Cloud sync failed:', result.error)
      }
    }, CLOUD_SYNC_DELAY)

    return () => {
      if (cloudSyncTimeoutRef.current) {
        clearTimeout(cloudSyncTimeoutRef.current)
      }
    }
  }, [editedContent, editedStyles, sections, isEditMode, editPassword])

  // Save password to localStorage when it changes
  useEffect(() => {
    if (editPassword) {
      safeSetItem(PASSWORD_STORAGE_KEY, editPassword)
    }
  }, [editPassword])

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev)
  }, [])

  // Content functions
  const updateContent = useCallback((path, value) => {
    if (typeof path !== 'string' || !path) {
      console.warn('Invalid content path:', path)
      return
    }
    setEditedContent(prev => ({ ...prev, [path]: value }))
  }, [])

  const getContent = useCallback((path, defaultValue) => {
    return editedContent[path] !== undefined ? editedContent[path] : defaultValue
  }, [editedContent])

  // Style functions
  const updateStyle = useCallback((path, styles) => {
    if (typeof path !== 'string' || !path) {
      console.warn('Invalid style path:', path)
      return
    }
    if (typeof styles !== 'object' || styles === null) {
      console.warn('Invalid styles object:', styles)
      return
    }
    setEditedStyles(prev => ({ ...prev, [path]: styles }))
  }, [])

  const getStyle = useCallback((path) => {
    return editedStyles[path] || {}
  }, [editedStyles])

  // Section management
  const toggleSection = useCallback((sectionId) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    ))
  }, [])

  const reorderSection = useCallback((sectionId, direction) => {
    setSections(prev => {
      const index = prev.findIndex(s => s.id === sectionId)
      if (index === -1) return prev

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newSections = [...prev]
      const [removed] = newSections.splice(index, 1)
      newSections.splice(newIndex, 0, removed)
      return newSections
    })
  }, [])

  const addSection = useCallback((template) => {
    if (!template || !template.id || !template.name) {
      console.warn('Invalid section template:', template)
      return
    }
    setSections(prev => [...prev, { ...template, visible: true }])
  }, [])

  const removeSection = useCallback((sectionId) => {
    setSections(prev => prev.filter(s => s.id !== sectionId))
  }, [])

  const isSectionVisible = useCallback((sectionId) => {
    const section = sections.find(s => s.id === sectionId)
    return section ? section.visible !== false : true
  }, [sections])

  const getSectionOrder = useCallback(() => {
    return sections.filter(s => s.visible !== false).map(s => s.id)
  }, [sections])

  const resetChanges = useCallback(() => {
    setEditedContent({})
    setEditedStyles({})
    setSections(DEFAULT_SECTIONS)
    safeRemoveItem(CONTENT_STORAGE_KEY)
    safeRemoveItem(STYLE_STORAGE_KEY)
    safeRemoveItem(SECTIONS_STORAGE_KEY)
    setLastSaved(null)
  }, [])

  const exportContent = useCallback(() => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      content: editedContent,
      styles: editedStyles,
      sections: sections
    }
    const dataStr = JSON.stringify(data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-edits-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [editedContent, editedStyles, sections])

  const importContent = useCallback((data) => {
    // Validate import data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid import data: expected an object')
    }

    let imported = false

    if (data.content && typeof data.content === 'object') {
      setEditedContent(data.content)
      safeSetItem(CONTENT_STORAGE_KEY, data.content)
      imported = true
    }

    if (data.styles && typeof data.styles === 'object') {
      setEditedStyles(data.styles)
      safeSetItem(STYLE_STORAGE_KEY, data.styles)
      imported = true
    }

    if (Array.isArray(data.sections) && data.sections.every(s => s.id && s.name)) {
      setSections(data.sections)
      safeSetItem(SECTIONS_STORAGE_KEY, data.sections)
      imported = true
    }

    if (!imported) {
      throw new Error('No valid content found in import file')
    }

    setLastSaved(new Date())
    return true
  }, [])

  return (
    <EditContext.Provider value={{
      isEditMode,
      toggleEditMode,
      editedContent,
      updateContent,
      getContent,
      editedStyles,
      updateStyle,
      getStyle,
      sections,
      setSections, // Exposed for drag-drop reordering
      toggleSection,
      reorderSection,
      addSection,
      removeSection,
      isSectionVisible,
      getSectionOrder,
      resetChanges,
      exportContent,
      importContent,
      isSaving,
      lastSaved,
      viewport,
      setViewport,
      cloudSyncStatus,
      editPassword,
      setEditPassword
    }}>
      {children}
    </EditContext.Provider>
  )
}

export function useEdit() {
  const context = useContext(EditContext)
  if (!context) {
    throw new Error('useEdit must be used within an EditProvider')
  }
  return context
}

