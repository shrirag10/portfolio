/**
 * ComponentLibrary.jsx
 * 
 * A sidebar panel containing draggable component templates that can be
 * added to the page. Users can drag components from this library and
 * drop them into sections.
 * 
 * Features:
 * - Categorized component templates
 * - Drag to add new components
 * - Preview of each component
 * - Search/filter functionality
 * 
 * @requires @dnd-kit/core
 */

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import {
    Type, Image, Square, Layout, Minus,
    ArrowUpDown, Quote, List, Link, X,
    Search, ChevronDown
} from 'lucide-react'
import { useEdit } from '../context/EditContext'

/**
 * Available component templates organized by category
 */
const COMPONENT_TEMPLATES = {
    'Basic': [
        {
            id: 'text-block',
            name: 'Text Block',
            icon: Type,
            description: 'Paragraph of text',
            defaultContent: { text: 'Enter your text here...' }
        },
        {
            id: 'heading',
            name: 'Heading',
            icon: Type,
            description: 'Section heading',
            defaultContent: { text: 'New Heading', level: 'h2' }
        },
        {
            id: 'image',
            name: 'Image',
            icon: Image,
            description: 'Image with caption',
            defaultContent: { src: '', alt: 'Image description' }
        },
        {
            id: 'button',
            name: 'Button',
            icon: Square,
            description: 'Call-to-action button',
            defaultContent: { text: 'Click Me', href: '#' }
        },
    ],
    'Layout': [
        {
            id: 'divider',
            name: 'Divider',
            icon: Minus,
            description: 'Horizontal line',
            defaultContent: {}
        },
        {
            id: 'spacer',
            name: 'Spacer',
            icon: ArrowUpDown,
            description: 'Vertical spacing',
            defaultContent: { height: 50 }
        },
        {
            id: 'columns',
            name: 'Columns',
            icon: Layout,
            description: '2-column layout',
            defaultContent: { columns: 2 }
        },
    ],
    'Content': [
        {
            id: 'quote',
            name: 'Quote',
            icon: Quote,
            description: 'Blockquote',
            defaultContent: { text: 'Quote text...', author: 'Author' }
        },
        {
            id: 'list',
            name: 'List',
            icon: List,
            description: 'Bullet or numbered list',
            defaultContent: { items: ['Item 1', 'Item 2'], ordered: false }
        },
        {
            id: 'link-card',
            name: 'Link Card',
            icon: Link,
            description: 'Clickable card link',
            defaultContent: { title: 'Link Title', url: '#', description: '' }
        },
    ],
}

/**
 * Individual draggable component item
 */
function DraggableComponentItem({ template, category }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `component-${template.id}`,
        data: {
            type: 'new-component',
            template,
            category,
        },
    })

    const Icon = template.icon

    return (
        <div
            ref={setNodeRef}
            className={`component-library-item ${isDragging ? 'is-dragging' : ''}`}
            {...attributes}
            {...listeners}
        >
            <div className="component-item-icon">
                <Icon size={20} />
            </div>
            <div className="component-item-info">
                <span className="component-item-name">{template.name}</span>
                <span className="component-item-desc">{template.description}</span>
            </div>
        </div>
    )
}

/**
 * Component Library sidebar panel
 */
function ComponentLibrary({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedCategories, setExpandedCategories] = useState(
        Object.keys(COMPONENT_TEMPLATES)
    )

    const toggleCategory = (category) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        )
    }

    const filteredTemplates = Object.entries(COMPONENT_TEMPLATES).reduce(
        (acc, [category, templates]) => {
            const filtered = templates.filter(t =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            if (filtered.length > 0) {
                acc[category] = filtered
            }
            return acc
        },
        {}
    )

    if (!isOpen) return null

    return (
        <div className="component-library-panel">
            <div className="component-library-header">
                <h3>Components</h3>
                <button className="component-library-close" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            {/* Search */}
            <div className="component-library-search">
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Instructions */}
            <p className="component-library-hint">
                Drag components to add them to the page
            </p>

            {/* Component Categories */}
            <div className="component-library-categories">
                {Object.entries(filteredTemplates).map(([category, templates]) => (
                    <div key={category} className="component-category">
                        <button
                            className="component-category-header"
                            onClick={() => toggleCategory(category)}
                        >
                            <span>{category}</span>
                            <ChevronDown
                                size={16}
                                className={expandedCategories.includes(category) ? 'expanded' : ''}
                            />
                        </button>

                        {expandedCategories.includes(category) && (
                            <div className="component-category-items">
                                {templates.map((template) => (
                                    <DraggableComponentItem
                                        key={template.id}
                                        template={template}
                                        category={category}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ComponentLibrary
