/**
 * SortableSection.jsx
 * 
 * A wrapper component that makes portfolio sections sortable via drag-and-drop.
 * Uses @dnd-kit/sortable for smooth, accessible drag interactions.
 * 
 * Features:
 * - Drag handle appears on hover in edit mode
 * - Visual feedback during drag (opacity, scale)
 * - Keyboard accessible (Tab + Space/Enter to pick up)
 * - Smooth animations during reorder
 * 
 * @requires @dnd-kit/sortable
 * @requires @dnd-kit/utilities
 */

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useEdit } from '../context/EditContext'

/**
 * Makes a section sortable within the layout editor
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the section
 * @param {string} props.name - Display name for the section
 * @param {React.ReactNode} props.children - Section content
 */
function SortableSection({ id, name, children }) {
    const { isEditMode } = useEdit()

    // useSortable hook provides drag-and-drop functionality
    const {
        attributes,      // ARIA attributes for accessibility
        listeners,       // Event handlers for drag interactions
        setNodeRef,      // Ref to attach to the draggable element
        transform,       // Current transform during drag
        transition,      // CSS transition for smooth animations
        isDragging,      // Whether this item is currently being dragged
    } = useSortable({ id })

    // Apply transform and transition styles during drag
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
    }

    // Only show drag handle in edit mode
    if (!isEditMode) {
        return <>{children}</>
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`sortable-section ${isDragging ? 'is-dragging' : ''}`}
        >
            {/* Drag Handle - appears on left side of section */}
            <div
                className="section-drag-handle"
                {...attributes}
                {...listeners}
                title={`Drag to reorder ${name}`}
                aria-label={`Drag handle for ${name} section`}
            >
                <GripVertical size={20} />
                <span className="drag-handle-label">{name}</span>
            </div>

            {/* Section Content */}
            {children}
        </div>
    )
}

export default SortableSection
