/**
 * DraggableElement.jsx
 * 
 * A wrapper component that makes any element draggable within the layout editor.
 * Allows users to reposition elements within their parent containers.
 * 
 * Features:
 * - Drag handle appears on hover in edit mode
 * - Stores position offsets in EditContext
 * - Supports free positioning or grid snap
 * - Smooth drag animations
 * 
 * @requires @dnd-kit/core
 */

import { useState, useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Move, GripVertical } from 'lucide-react'
import { useEdit } from '../context/EditContext'

/**
 * Makes any element draggable within the layout editor
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for position storage
 * @param {React.ReactNode} props.children - Element content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disable dragging
 */
function DraggableElement({
    id,
    children,
    className = '',
    disabled = false,
    style = {}
}) {
    const { isEditMode, getStyle, updateStyle } = useEdit()
    const [isDragging, setIsDragging] = useState(false)
    const elementRef = useRef(null)

    // Get stored position from context
    const storedPosition = getStyle(`element-position-${id}`) || { x: 0, y: 0 }

    // Setup draggable with dnd-kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
    } = useDraggable({
        id: `draggable-${id}`,
        disabled: !isEditMode || disabled,
        data: {
            type: 'element',
            id,
        },
    })

    // Combine stored position with current drag transform
    const combinedStyle = {
        ...style,
        transform: transform
            ? CSS.Translate.toString(transform)
            : `translate(${storedPosition.x}px, ${storedPosition.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        position: storedPosition.x !== 0 || storedPosition.y !== 0 ? 'relative' : undefined,
        zIndex: isDragging ? 1000 : undefined,
    }

    // Only show drag UI in edit mode
    if (!isEditMode) {
        return <div className={className} style={style}>{children}</div>
    }

    return (
        <div
            ref={(node) => {
                setNodeRef(node)
                elementRef.current = node
            }}
            style={combinedStyle}
            className={`draggable-element ${className} ${isDragging ? 'is-dragging' : ''}`}
        >
            {/* Drag Handle */}
            <div
                className="element-drag-handle"
                {...attributes}
                {...listeners}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                title="Drag to move"
            >
                <Move size={14} />
            </div>

            {children}
        </div>
    )
}

export default DraggableElement
