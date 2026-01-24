import { useState, useEffect, useRef } from 'react'
import { useEdit } from '../context/EditContext'
import ConfirmDialog from './ConfirmDialog'
import ComponentLibrary from './ComponentLibrary'
import PasswordDialog from './PasswordDialog'
import VisitorLogs from './VisitorLogs'
import {
  Pencil, Eye, Save, RotateCcw, Download, Upload, Plus, Layout,
  GripVertical, EyeOff, Trash2, ChevronUp, ChevronDown,
  Smartphone, Monitor, Tablet, X, Image as ImageIcon, Check, Loader2,
  Puzzle, Cloud, CloudOff, RefreshCw, Settings, Activity
} from 'lucide-react'

// Max import file size (2MB)
const MAX_IMPORT_SIZE = 2 * 1024 * 1024

// Secret tap count to trigger edit mode on mobile
const SECRET_TAP_COUNT = 5
const SECRET_TAP_TIMEOUT = 2000 // 2 seconds to complete the taps

function EditModePanel() {
  const {
    isEditMode, toggleEditMode, resetChanges, exportContent, importContent,
    sections, toggleSection, reorderSection, addSection, isSaving, lastSaved,
    viewport, setViewport, cloudSyncStatus
  } = useEdit()

  const [showSectionManager, setShowSectionManager] = useState(false)
  const [showAddSection, setShowAddSection] = useState(false)
  const [showImportPanel, setShowImportPanel] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [importError, setImportError] = useState(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [showComponentLibrary, setShowComponentLibrary] = useState(false)
  const [showVisitorLogs, setShowVisitorLogs] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [showMobileHint, setShowMobileHint] = useState(false)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const tapTimeoutRef = useRef(null)

  /**
   * Handle password authentication for edit mode
   * Shows password dialog instead of directly entering edit mode
   */
  const handleEditModeRequest = () => {
    if (isEditMode) {
      // If already in edit mode, just toggle off
      toggleEditMode()
    } else {
      // Show password dialog before entering edit mode
      setShowPasswordDialog(true)
    }
  }

  const handlePasswordSuccess = () => {
    setShowPasswordDialog(false)
    toggleEditMode()
  }

  /**
   * Handle secret tap gesture for mobile
   * User needs to tap 5 times quickly to trigger edit mode
   */
  const handleSecretTap = () => {
    if (isEditMode) return // Already in edit mode

    const newCount = tapCount + 1
    setTapCount(newCount)

    // Clear existing timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current)
    }

    // Show hint after 2 taps
    if (newCount >= 2 && newCount < SECRET_TAP_COUNT) {
      setShowMobileHint(true)
    }

    // Trigger edit mode after required taps
    if (newCount >= SECRET_TAP_COUNT) {
      setTapCount(0)
      setShowMobileHint(false)
      handleEditModeRequest()
      return
    }

    // Reset after timeout
    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0)
      setShowMobileHint(false)
    }, SECRET_TAP_TIMEOUT)
  }

  // Secret keyboard shortcut to enter edit mode: Ctrl+Shift+E
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        handleEditModeRequest()
      }
      if (e.key === 'Escape' && isEditMode) {
        toggleEditMode()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleEditMode, isEditMode])

  const handleFileImport = (e) => {
    const file = e.target.files?.[0]
    setImportError(null)
    setImportSuccess(false)

    if (!file) return

    // Check file size
    if (file.size > MAX_IMPORT_SIZE) {
      setImportError('File too large. Maximum size is 2MB.')
      return
    }

    // Check file type
    if (!file.name.endsWith('.json')) {
      setImportError('Please select a JSON file.')
      return
    }

    const reader = new FileReader()
    reader.onerror = () => {
      setImportError('Failed to read file. Please try again.')
    }
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        importContent(data)
        setImportSuccess(true)
        setTimeout(() => {
          setShowImportPanel(false)
          setImportSuccess(false)
        }, 1500)
      } catch (err) {
        if (err.message.includes('No valid content')) {
          setImportError('File contains no valid portfolio data.')
        } else {
          setImportError('Invalid JSON file. Please select a valid export file.')
        }
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    setShowResetConfirm(true)
  }

  const confirmReset = () => {
    resetChanges()
    setShowResetConfirm(false)
  }

  const sectionTemplates = [
    { id: 'hero', name: 'Hero Banner', icon: '🏠' },
    { id: 'about', name: 'About Section', icon: '👤' },
    { id: 'experience', name: 'Experience Timeline', icon: '💼' },
    { id: 'projects', name: 'Project Gallery', icon: '📁' },
    { id: 'skills', name: 'Skills Grid', icon: '⚡' },
    { id: 'contact', name: 'Contact Form', icon: '✉️' },
    { id: 'testimonials', name: 'Testimonials', icon: '💬' },
    { id: 'gallery', name: 'Image Gallery', icon: '🖼️' },
    { id: 'cta', name: 'Call to Action', icon: '📢' },
  ]

  // When not in edit mode, render mobile FAB and password dialog
  if (!isEditMode) {
    return (
      <>
        {/* Mobile Edit Button - Hidden FAB that appears on tap */}
        <button
          className="mobile-edit-fab"
          onClick={handleSecretTap}
          aria-label="Enter edit mode"
          title="Tap 5 times to enter edit mode"
        >
          <Settings size={20} />
          {tapCount > 0 && <span className="tap-counter">{tapCount}</span>}
        </button>

        {/* Mobile Hint Toast */}
        {showMobileHint && (
          <div className="mobile-edit-hint">
            Tap {SECRET_TAP_COUNT - tapCount} more times to edit
          </div>
        )}

        <PasswordDialog
          isOpen={showPasswordDialog}
          onSuccess={handlePasswordSuccess}
          onClose={() => setShowPasswordDialog(false)}
        />
      </>
    )
  }

  return (
    <div className="editor-toolbar edit-mode-active">
      <div className="editor-toolbar-inner">
        <div className="editor-left">
          <span className="editor-logo">✨ Portfolio Editor</span>
          <span className="editor-hint">Click any element to edit • ESC to exit</span>
          {isSaving && (
            <span className="editor-saving">
              <Loader2 size={14} className="spin" /> Saving...
            </span>
          )}
          {!isSaving && lastSaved && (
            <span className="editor-saved">
              <Check size={14} /> Saved
            </span>
          )}
          {/* Cloud Sync Status */}
          {cloudSyncStatus === 'syncing' && (
            <span className="editor-cloud-syncing" title="Syncing to cloud...">
              <RefreshCw size={14} className="spin" /> Cloud sync...
            </span>
          )}
          {cloudSyncStatus === 'synced' && (
            <span className="editor-cloud-synced" title="Synced to cloud">
              <Cloud size={14} /> Cloud ✓
            </span>
          )}
          {cloudSyncStatus === 'error' && (
            <span className="editor-cloud-error" title="Cloud sync failed">
              <CloudOff size={14} /> Sync failed
            </span>
          )}
        </div>

        <div className="editor-center">
          {/* Section Manager Toggle */}
          <button
            className={`editor-btn icon-btn ${showSectionManager ? 'active' : ''}`}
            onClick={() => {
              setShowSectionManager(!showSectionManager)
              setShowAddSection(false)
              setShowImportPanel(false)
            }}
            title="Manage Sections"
          >
            <Layout size={18} />
          </button>

          {/* Add Section */}
          <button
            className={`editor-btn icon-btn ${showAddSection ? 'active' : ''}`}
            onClick={() => {
              setShowAddSection(!showAddSection)
              setShowSectionManager(false)
              setShowImportPanel(false)
              setShowComponentLibrary(false)
            }}
            title="Add Section"
          >
            <Plus size={18} />
          </button>

          {/* Component Library */}
          <button
            className={`editor-btn icon-btn ${showComponentLibrary ? 'active' : ''}`}
            onClick={() => {
              setShowComponentLibrary(!showComponentLibrary)
              setShowSectionManager(false)
              setShowAddSection(false)
              setShowImportPanel(false)
            }}
            title="Component Library"
          >
            <Puzzle size={18} />
          </button>

          {/* Visitor Logs */}
          <button
            className={`editor-btn icon-btn ${showVisitorLogs ? 'active' : ''}`}
            onClick={() => {
              setShowVisitorLogs(true)
              setShowSectionManager(false)
              setShowAddSection(false)
              setShowImportPanel(false)
              setShowComponentLibrary(false)
            }}
            title="Visitor Logs"
          >
            <Activity size={18} />
          </button>

          <div className="editor-divider" />

          {/* Viewport Selector */}
          <div className="viewport-buttons">
            <button
              className={`editor-btn icon-btn ${viewport === 'desktop' ? 'active' : ''}`}
              title="Desktop"
              onClick={() => setViewport('desktop')}
            >
              <Monitor size={16} />
            </button>
            <button
              className={`editor-btn icon-btn ${viewport === 'tablet' ? 'active' : ''}`}
              title="Tablet"
              onClick={() => setViewport('tablet')}
            >
              <Tablet size={16} />
            </button>
            <button
              className={`editor-btn icon-btn ${viewport === 'mobile' ? 'active' : ''}`}
              title="Mobile"
              onClick={() => setViewport('mobile')}
            >
              <Smartphone size={16} />
            </button>
          </div>
        </div>

        <div className="editor-right">
          {/* Import Button */}
          <button
            className={`editor-btn secondary ${showImportPanel ? 'active' : ''}`}
            onClick={() => {
              setShowImportPanel(!showImportPanel)
              setShowSectionManager(false)
              setShowAddSection(false)
            }}
            title="Import Content"
          >
            <Upload size={16} />
          </button>
          <button className="editor-btn secondary" onClick={exportContent} title="Export">
            <Download size={16} />
          </button>
          <button className="editor-btn secondary" onClick={handleReset} title="Reset All">
            <RotateCcw size={16} />
          </button>
          <button className="editor-btn primary" onClick={toggleEditMode}>
            <X size={16} />
            Exit Editor
          </button>
        </div>
      </div>

      {/* Import Panel */}
      {showImportPanel && (
        <div className="import-panel">
          <div className="section-manager-header">
            <h3>Import Content</h3>
            <span className="section-hint">Upload previously exported files</span>
          </div>
          <div className="import-options">
            <div className="import-option">
              <div className="import-icon">📄</div>
              <div className="import-info">
                <h4>Import JSON</h4>
                <p>Load a previously exported portfolio file</p>
              </div>
              <button
                className="editor-btn primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} /> Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Section Manager Panel */}
      {showSectionManager && (
        <div className="section-manager">
          <div className="section-manager-header">
            <h3>Page Sections</h3>
            <span className="section-hint">Drag to reorder • Click eye to hide</span>
          </div>
          <div className="section-list">
            {(sections || []).map((section, index) => (
              <div
                key={section.id}
                className={`section-item ${section.visible === false ? 'hidden' : ''}`}
              >
                <div className="section-grip">
                  <GripVertical size={16} />
                </div>
                <span className="section-icon">{section.icon || '📦'}</span>
                <span className="section-name">{section.name}</span>
                <div className="section-actions">
                  <button
                    onClick={() => reorderSection(section.id, 'up')}
                    disabled={index === 0}
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => reorderSection(section.id, 'down')}
                    disabled={index === sections.length - 1}
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={() => toggleSection(section.id)}
                    title={section.visible === false ? 'Show' : 'Hide'}
                    className={section.visible === false ? 'hidden-indicator' : ''}
                  >
                    {section.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Section Panel */}
      {showAddSection && (
        <div className="add-section-panel">
          <div className="section-manager-header">
            <h3>Add New Section</h3>
            <span className="section-hint">Choose a template to add</span>
          </div>
          <div className="section-templates">
            {sectionTemplates.map(template => (
              <button
                key={template.id}
                className="section-template"
                onClick={() => {
                  addSection(template)
                  setShowAddSection(false)
                }}
              >
                <span className="template-icon">{template.icon}</span>
                <span className="template-name">{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Component Library Panel */}
      <ComponentLibrary
        isOpen={showComponentLibrary}
        onClose={() => setShowComponentLibrary(false)}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={confirmReset}
        title="Reset All Changes?"
        message="This will remove all your text edits, style changes, and section customizations. This action cannot be undone."
        confirmText="Reset Everything"
        cancelText="Keep Changes"
        variant="danger"
      />

      {/* Password Dialog for Edit Mode Access */}
      <PasswordDialog
        isOpen={showPasswordDialog}
        onSuccess={handlePasswordSuccess}
        onClose={() => setShowPasswordDialog(false)}
      />

      {/* Visitor Logs Modal */}
      <VisitorLogs
        isOpen={showVisitorLogs}
        onClose={() => setShowVisitorLogs(false)}
      />
    </div>
  )
}

export default EditModePanel
