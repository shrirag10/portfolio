import { useState, useEffect, useRef } from 'react'
import { useEdit } from '../context/EditContext'
import {
  Pencil, Check, X, Image as ImageIcon, Plus, Trash2,
  Palette, Type, AlignLeft, AlignCenter, AlignRight,
  ChevronUp, ChevronDown, Bold, Italic, Upload, Loader
} from 'lucide-react'
import { uploadImage, getAvailableProviders } from '../utils/imageUpload'

// Style Panel - floating panel for visual editing
export function StylePanel({ elementId, onClose }) {
  const { getStyle, updateStyle } = useEdit()
  const panelRef = useRef(null)

  const currentStyles = getStyle(elementId) || {}

  const handleStyleChange = (property, value) => {
    updateStyle(elementId, { ...currentStyles, [property]: value })
  }

  const colors = [
    '#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8', '#64748b',
    '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
    '#22c55e', '#06b6d4', '#000000', '#1e293b', '#334155'
  ]

  const fontSizes = ['0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem', '1.5rem', '2rem', '2.5rem', '3rem']

  return (
    <div className="style-panel" ref={panelRef}>
      <div className="style-panel-header">
        <span>Style Editor</span>
        <button onClick={onClose}><X size={14} /></button>
      </div>

      {/* Text Color */}
      <div className="style-section">
        <label><Palette size={12} /> Text Color</label>
        <div className="color-grid">
          {colors.map(color => (
            <button
              key={color}
              className={`color-swatch ${currentStyles.color === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleStyleChange('color', color)}
            />
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div className="style-section">
        <label><Palette size={12} /> Background</label>
        <div className="color-grid">
          <button
            className={`color-swatch transparent ${!currentStyles.backgroundColor ? 'active' : ''}`}
            onClick={() => handleStyleChange('backgroundColor', 'transparent')}
          >
            <span>∅</span>
          </button>
          {colors.map(color => (
            <button
              key={color}
              className={`color-swatch ${currentStyles.backgroundColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleStyleChange('backgroundColor', color)}
            />
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="style-section">
        <label><Type size={12} /> Font Size</label>
        <div className="font-size-buttons">
          {fontSizes.map(size => (
            <button
              key={size}
              className={`font-size-btn ${currentStyles.fontSize === size ? 'active' : ''}`}
              onClick={() => handleStyleChange('fontSize', size)}
            >
              {size.replace('rem', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment */}
      <div className="style-section">
        <label>Alignment</label>
        <div className="alignment-buttons">
          <button
            className={currentStyles.textAlign === 'left' ? 'active' : ''}
            onClick={() => handleStyleChange('textAlign', 'left')}
          >
            <AlignLeft size={14} />
          </button>
          <button
            className={currentStyles.textAlign === 'center' ? 'active' : ''}
            onClick={() => handleStyleChange('textAlign', 'center')}
          >
            <AlignCenter size={14} />
          </button>
          <button
            className={currentStyles.textAlign === 'right' ? 'active' : ''}
            onClick={() => handleStyleChange('textAlign', 'right')}
          >
            <AlignRight size={14} />
          </button>
        </div>
      </div>

      {/* Font Weight & Style */}
      <div className="style-section">
        <label>Font Style</label>
        <div className="alignment-buttons">
          <button
            className={currentStyles.fontWeight === 'bold' ? 'active' : ''}
            onClick={() => handleStyleChange('fontWeight', currentStyles.fontWeight === 'bold' ? 'normal' : 'bold')}
          >
            <Bold size={14} />
          </button>
          <button
            className={currentStyles.fontStyle === 'italic' ? 'active' : ''}
            onClick={() => handleStyleChange('fontStyle', currentStyles.fontStyle === 'italic' ? 'normal' : 'italic')}
          >
            <Italic size={14} />
          </button>
        </div>
      </div>

      {/* Spacing */}
      <div className="style-section">
        <label>Padding</label>
        <div className="spacing-control">
          <button onClick={() => {
            const current = parseInt(currentStyles.padding) || 0
            handleStyleChange('padding', `${Math.max(0, current - 4)}px`)
          }}><ChevronDown size={14} /></button>
          <span>{currentStyles.padding || '0px'}</span>
          <button onClick={() => {
            const current = parseInt(currentStyles.padding) || 0
            handleStyleChange('padding', `${current + 4}px`)
          }}><ChevronUp size={14} /></button>
        </div>
      </div>

      {/* Border Radius - Phase 5 */}
      <div className="style-section">
        <label>Corners</label>
        <div className="style-radius-presets">
          {[0, 4, 8, 16, 9999].map((radius) => (
            <button
              key={radius}
              className={`style-radius-preset radius-${radius === 9999 ? 'full' : radius} ${parseInt(currentStyles.borderRadius) === radius ? 'active' : ''
                }`}
              onClick={() => handleStyleChange('borderRadius', `${radius}px`)}
              title={radius === 9999 ? 'Fully rounded' : `${radius}px`}
            />
          ))}
        </div>
      </div>

      {/* Box Shadow - Phase 5 */}
      <div className="style-section">
        <label>Shadow</label>
        <div className="style-shadow-presets">
          {[
            { name: 'none', value: 'none' },
            { name: 'sm', value: '0 2px 4px rgba(0,0,0,0.1)' },
            { name: 'md', value: '0 4px 12px rgba(0,0,0,0.15)' },
            { name: 'lg', value: '0 8px 24px rgba(0,0,0,0.2)' },
            { name: 'xl', value: '0 16px 48px rgba(0,0,0,0.3)' },
          ].map((shadow) => (
            <button
              key={shadow.name}
              className={`style-shadow-preset shadow-${shadow.name} ${currentStyles.boxShadow === shadow.value ? 'active' : ''
                }`}
              onClick={() => handleStyleChange('boxShadow', shadow.value)}
              title={shadow.name === 'none' ? 'No shadow' : `Shadow ${shadow.name}`}
            />
          ))}
        </div>
      </div>

      {/* Opacity - Phase 5 */}
      <div className="style-section">
        <label>Opacity</label>
        <div className="style-slider-control">
          <input
            type="range"
            min="0"
            max="100"
            value={(parseFloat(currentStyles.opacity) || 1) * 100}
            onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value) / 100)}
          />
          <span className="value-display">{Math.round((parseFloat(currentStyles.opacity) || 1) * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

// Simple Editable Text with style support
export function EditableText({ path, defaultValue, as = 'span', className = '', multiline = false, placeholder = 'Click to edit...' }) {
  const { isEditMode, getContent, updateContent, getStyle } = useEdit()
  const [isEditing, setIsEditing] = useState(false)
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [value, setValue] = useState('')
  const wrapperRef = useRef(null)

  const currentValue = getContent(path, defaultValue)
  const currentStyles = getStyle(path) || {}
  const Tag = as

  useEffect(() => {
    setValue(currentValue || '')
  }, [currentValue])

  if (!isEditMode) {
    return <Tag className={className} style={currentStyles}>{currentValue}</Tag>
  }

  if (isEditing) {
    const handleSave = () => {
      updateContent(path, value)
      setIsEditing(false)
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !multiline) handleSave()
      if (e.key === 'Escape') setIsEditing(false)
    }

    return (
      <span className="editable-inline-edit">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="editable-input multiline"
            placeholder={placeholder}
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="editable-input"
            placeholder={placeholder}
            autoFocus
          />
        )}
        <button className="editable-btn save" onClick={handleSave}><Check size={14} /></button>
        <button className="editable-btn cancel" onClick={() => setIsEditing(false)}><X size={14} /></button>
        <button className="editable-btn style" onClick={() => setShowStylePanel(!showStylePanel)}>
          <Palette size={14} />
        </button>
        {showStylePanel && (
          <StylePanel elementId={path} onClose={() => setShowStylePanel(false)} />
        )}
      </span>
    )
  }

  return (
    <span
      ref={wrapperRef}
      className="editable-hover"
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      <Tag className={className} style={currentStyles}>{currentValue || placeholder}</Tag>
      <Pencil size={12} className="edit-icon" />
    </span>
  )
}

// Editable Rich Text with style support
export function EditableRichText({ path, defaultValue, className = '' }) {
  const { isEditMode, getContent, updateContent, getStyle } = useEdit()
  const [isEditing, setIsEditing] = useState(false)
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [value, setValue] = useState('')

  const currentValue = getContent(path, defaultValue)
  const currentStyles = getStyle(path) || {}

  useEffect(() => {
    setValue(currentValue || '')
  }, [currentValue])

  if (!isEditMode) {
    return <p className={className} style={currentStyles}>{currentValue}</p>
  }

  if (isEditing) {
    return (
      <div className="editable-inline-edit">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="editable-input multiline"
          rows={4}
          autoFocus
        />
        <div className="editable-actions">
          <button className="editable-btn save" onClick={() => { updateContent(path, value); setIsEditing(false) }}>
            <Check size={14} /> Save
          </button>
          <button className="editable-btn style" onClick={() => setShowStylePanel(!showStylePanel)}>
            <Palette size={14} /> Style
          </button>
          <button className="editable-btn cancel" onClick={() => setIsEditing(false)}>
            <X size={14} /> Cancel
          </button>
        </div>
        {showStylePanel && (
          <StylePanel elementId={path} onClose={() => setShowStylePanel(false)} />
        )}
      </div>
    )
  }

  return (
    <div className="editable-hover" onClick={() => setIsEditing(true)} title="Click to edit">
      <p className={className} style={currentStyles}>{currentValue}</p>
      <Pencil size={12} className="edit-icon" />
    </div>
  )
}

// Editable List
export function EditableList({ path, defaultValue = [], className = '', renderItem }) {
  const { isEditMode, getContent, updateContent } = useEdit()
  const currentValue = getContent(path, defaultValue)
  const items = Array.isArray(currentValue) ? currentValue : []

  if (!isEditMode) {
    return (
      <ul className={className}>
        {items.map((item, i) => <li key={i}>{renderItem ? renderItem(item) : item}</li>)}
      </ul>
    )
  }

  return (
    <ul className={className}>
      {items.map((item, i) => <li key={i}>{renderItem ? renderItem(item) : item}</li>)}
    </ul>
  )
}

// Editable Image with cloud upload support
export function EditableImage({ path, defaultValue, alt, className = '' }) {
  const { isEditMode, getContent, updateContent, getStyle, updateStyle } = useEdit()
  const [isEditing, setIsEditing] = useState(false)
  const [url, setUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  const currentValue = getContent(path, defaultValue)
  const currentStyles = getStyle(path) || {}
  const availableProviders = getAvailableProviders()

  useEffect(() => {
    setUrl(currentValue || '')
  }, [currentValue])

  // Handle file upload with cloud provider
  const handleFileUpload = async (file) => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      const result = await uploadImage(file, {
        onProgress: setUploadProgress,
        onError: (msg) => setUploadError(msg)
      })

      updateContent(path, result.url)
      setUrl(result.url)
      setIsEditing(false)
      setUploadError(null)
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  if (!isEditMode) {
    return <img src={currentValue} alt={alt} className={className} style={currentStyles} />
  }

  if (isEditing) {
    return (
      <div className="editable-image-editor" onClick={(e) => e.stopPropagation()}>
        <div className="editable-image-preview">
          <img src={url || currentValue} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className="editable-image-error">
            ⚠️ {uploadError}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="editable-image-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span>{uploadProgress}%</span>
          </div>
        )}

        <div className="editable-image-options">
          {/* URL Input */}
          <div className="editable-image-url">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter image URL..."
              className="editable-input"
              disabled={isUploading}
            />
            <button
              className="editable-btn save"
              onClick={() => { updateContent(path, url); setIsEditing(false) }}
              disabled={isUploading}
            >
              <Check size={14} />
            </button>
          </div>

          <div className="editable-image-divider">or</div>

          {/* Cloud Upload Button */}
          <button
            className="editable-btn upload cloud-upload"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader size={14} className="spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload size={14} /> Upload to Cloud
              </>
            )}
          </button>

          {/* Provider Info */}
          <div className="upload-provider-info">
            {availableProviders.map(p => (
              <span key={p.id} className="provider-badge" title={p.name}>
                {p.icon}
              </span>
            ))}
            <span className="provider-hint">
              {availableProviders[0]?.id === 'base64'
                ? 'Local storage only'
                : `Using ${availableProviders[0]?.name}`}
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
            style={{ display: 'none' }}
          />
        </div>

        {/* Size controls */}
        <div className="editable-image-size">
          <label>Width:</label>
          <input
            type="range"
            min="50"
            max="100"
            value={parseInt(currentStyles.width) || 100}
            onChange={(e) => updateStyle(path, { ...currentStyles, width: `${e.target.value}%` })}
          />
          <span>{currentStyles.width || '100%'}</span>
        </div>

        {/* Border Radius */}
        <div className="editable-image-size">
          <label>Corners:</label>
          <div className="image-radius-presets">
            {[0, 8, 16, 50, 9999].map((r) => (
              <button
                key={r}
                className={`image-radius-btn ${parseInt(currentStyles.borderRadius) === r ? 'active' : ''}`}
                onClick={() => updateStyle(path, { ...currentStyles, borderRadius: `${r}px` })}
                style={{ borderRadius: r === 9999 ? '50%' : `${r}px` }}
                title={r === 9999 ? 'Circle' : `${r}px`}
              />
            ))}
          </div>
        </div>

        {/* Shadow */}
        <div className="editable-image-size">
          <label>Shadow:</label>
          <div className="image-shadow-presets">
            {[
              { name: 'none', value: 'none' },
              { name: 'sm', value: '0 4px 12px rgba(0,0,0,0.15)' },
              { name: 'lg', value: '0 8px 30px rgba(0,0,0,0.25)' },
            ].map((s) => (
              <button
                key={s.name}
                className={`image-shadow-btn ${currentStyles.boxShadow === s.value ? 'active' : ''}`}
                onClick={() => updateStyle(path, { ...currentStyles, boxShadow: s.value })}
                title={s.name === 'none' ? 'No shadow' : `Shadow ${s.name}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="editable-image-size">
          <label>Filter:</label>
          <div className="image-filter-presets">
            {[
              { name: 'None', value: 'none' },
              { name: 'B&W', value: 'grayscale(100%)' },
              { name: 'Sepia', value: 'sepia(100%)' },
              { name: 'Blur', value: 'blur(2px)' },
              { name: 'Bright', value: 'brightness(1.2)' },
            ].map((f) => (
              <button
                key={f.name}
                className={`image-filter-btn ${currentStyles.filter === f.value ? 'active' : ''}`}
                onClick={() => updateStyle(path, { ...currentStyles, filter: f.value })}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <button className="editable-btn cancel" onClick={() => setIsEditing(false)}>
          <X size={14} /> Cancel
        </button>
      </div>
    )
  }

  return (
    <div
      className="editable-image-hover"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true) }}
    >
      <img src={currentValue} alt={alt} className={className} style={currentStyles} />
      <div className="editable-image-overlay">
        <ImageIcon size={20} />
        <span>Click to edit</span>
      </div>
    </div>
  )
}

// Editable Tags
export function EditableTags({ path, defaultValue = [], className = '' }) {
  const { isEditMode, getContent, updateContent } = useEdit()
  const [newTag, setNewTag] = useState('')

  const currentValue = getContent(path, defaultValue)
  const tags = Array.isArray(currentValue) ? currentValue : []

  const addTag = () => {
    if (newTag.trim()) {
      updateContent(path, [...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (index) => {
    updateContent(path, tags.filter((_, i) => i !== index))
  }

  if (!isEditMode) {
    return (
      <div className={className}>
        {tags.map((tag, i) => <span key={i} className="skill-item">{tag}</span>)}
      </div>
    )
  }

  return (
    <div className={`editable-tags ${className}`}>
      {tags.map((tag, i) => (
        <span key={i} className="skill-item editable-tag">
          {tag}
          <button onClick={() => removeTag(i)} className="tag-remove"><X size={10} /></button>
        </span>
      ))}
      <div className="tag-add">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTag()}
          placeholder="Add..."
          className="tag-input"
        />
        <button onClick={addTag}><Plus size={12} /></button>
      </div>
    </div>
  )
}
