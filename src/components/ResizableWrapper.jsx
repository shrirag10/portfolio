/**
 * ResizableWrapper.jsx
 * 
 * A wrapper component that adds resize handles to any element.
 * Allows users to resize elements by dragging corner/edge handles.
 * 
 * Features:
 * - 8 resize handles (corners + edges)
 * - Optional aspect ratio lock
 * - Min/max size constraints
 * - Stores dimensions in EditContext
 * - Smooth resize animations
 * 
 * @requires React
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { useEdit } from '../context/EditContext'

/**
 * Resize handle positions
 */
const HANDLES = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

/**
 * Cursor styles for each handle
 */
const CURSORS = {
    n: 'ns-resize',
    ne: 'nesw-resize',
    e: 'ew-resize',
    se: 'nwse-resize',
    s: 'ns-resize',
    sw: 'nesw-resize',
    w: 'ew-resize',
    nw: 'nwse-resize',
}

/**
 * Makes any element resizable within the layout editor
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for size storage
 * @param {React.ReactNode} props.children - Element content
 * @param {number} props.minWidth - Minimum width in pixels
 * @param {number} props.minHeight - Minimum height in pixels
 * @param {number} props.maxWidth - Maximum width in pixels
 * @param {number} props.maxHeight - Maximum height in pixels
 * @param {boolean} props.lockAspectRatio - Maintain aspect ratio while resizing
 * @param {string} props.className - Additional CSS classes
 */
function ResizableWrapper({
    id,
    children,
    minWidth = 50,
    minHeight = 50,
    maxWidth = 2000,
    maxHeight = 2000,
    lockAspectRatio = false,
    className = '',
    style = {},
}) {
    const { isEditMode, getStyle, updateStyle } = useEdit()
    const containerRef = useRef(null)
    const [isResizing, setIsResizing] = useState(false)
    const [activeHandle, setActiveHandle] = useState(null)
    const startRef = useRef({ x: 0, y: 0, width: 0, height: 0 })

    // Get stored dimensions from context
    const storedSize = getStyle(`element-size-${id}`) || {}
    const currentWidth = storedSize.width || 'auto'
    const currentHeight = storedSize.height || 'auto'

    /**
     * Handle resize start
     */
    const handleResizeStart = useCallback((e, handle) => {
        e.preventDefault()
        e.stopPropagation()

        const rect = containerRef.current.getBoundingClientRect()
        startRef.current = {
            x: e.clientX,
            y: e.clientY,
            width: rect.width,
            height: rect.height,
        }

        setIsResizing(true)
        setActiveHandle(handle)
    }, [])

    /**
     * Handle resize move
     */
    const handleResizeMove = useCallback((e) => {
        if (!isResizing || !activeHandle) return

        const deltaX = e.clientX - startRef.current.x
        const deltaY = e.clientY - startRef.current.y

        let newWidth = startRef.current.width
        let newHeight = startRef.current.height

        // Calculate new dimensions based on handle
        if (activeHandle.includes('e')) {
            newWidth = startRef.current.width + deltaX
        }
        if (activeHandle.includes('w')) {
            newWidth = startRef.current.width - deltaX
        }
        if (activeHandle.includes('s')) {
            newHeight = startRef.current.height + deltaY
        }
        if (activeHandle.includes('n')) {
            newHeight = startRef.current.height - deltaY
        }

        // Apply constraints
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))

        // Lock aspect ratio if needed
        if (lockAspectRatio) {
            const aspectRatio = startRef.current.width / startRef.current.height
            if (activeHandle.includes('e') || activeHandle.includes('w')) {
                newHeight = newWidth / aspectRatio
            } else {
                newWidth = newHeight * aspectRatio
            }
        }

        // Update stored size
        updateStyle(`element-size-${id}`, {
            width: Math.round(newWidth),
            height: Math.round(newHeight),
        })
    }, [isResizing, activeHandle, minWidth, minHeight, maxWidth, maxHeight, lockAspectRatio, id, updateStyle])

    /**
     * Handle resize end
     */
    const handleResizeEnd = useCallback(() => {
        setIsResizing(false)
        setActiveHandle(null)
    }, [])

    // Add global mouse listeners during resize
    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove)
            document.addEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = CURSORS[activeHandle]
            document.body.style.userSelect = 'none'
        }

        return () => {
            document.removeEventListener('mousemove', handleResizeMove)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }
    }, [isResizing, activeHandle, handleResizeMove, handleResizeEnd])

    // Combine styles
    const combinedStyle = {
        ...style,
        width: currentWidth !== 'auto' ? `${currentWidth}px` : undefined,
        height: currentHeight !== 'auto' ? `${currentHeight}px` : undefined,
        position: 'relative',
    }

    // Only show resize UI in edit mode
    if (!isEditMode) {
        return <div className={className} style={style}>{children}</div>
    }

    return (
        <div
            ref={containerRef}
            className={`resizable-wrapper ${className} ${isResizing ? 'is-resizing' : ''}`}
            style={combinedStyle}
        >
            {children}

            {/* Resize Handles */}
            {HANDLES.map((handle) => (
                <div
                    key={handle}
                    className={`resize-handle resize-handle-${handle}`}
                    style={{ cursor: CURSORS[handle] }}
                    onMouseDown={(e) => handleResizeStart(e, handle)}
                />
            ))}

            {/* Size indicator during resize */}
            {isResizing && (
                <div className="resize-indicator">
                    {Math.round(containerRef.current?.getBoundingClientRect().width || 0)} ×
                    {Math.round(containerRef.current?.getBoundingClientRect().height || 0)}
                </div>
            )}
        </div>
    )
}

export default ResizableWrapper
