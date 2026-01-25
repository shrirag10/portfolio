/**
 * SectionContainer.jsx
 * 
 * Container component that enables drag-and-drop reordering of portfolio sections.
 * Wraps all sections with DndContext and SortableContext for sortable functionality.
 * 
 * Features:
 * - Drag sections to reorder them
 * - Collision detection for accurate drop targets
 * - Updates section order in EditContext
 * - Smooth reorder animations
 * 
 * @requires @dnd-kit/core
 * @requires @dnd-kit/sortable
 */

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import { useEdit } from '../context/EditContext'
import SortableSection from './SortableSection'

// Import section components
import Hero from './Hero'
import About from './About'
import Experience from './Experience'
import TeslaProjects from './TeslaProjects'
import HeroProjects from './HeroProjects'
import AcademicProjects from './AcademicProjects'
import Projects from './Projects' // Legacy fallback
import Skills from './Skills'
import ImpactCards from './ImpactCards'
import ProjectGallery from './ProjectGallery'
import Contact from './Contact'

/**
 * Maps section IDs to their React components
 * Add new sections here when created
 */
const SECTION_COMPONENTS = {
    hero: { component: Hero, name: 'Hero Banner' },
    about: { component: About, name: 'About' },
    experience: { component: Experience, name: 'Experience' },
    impact: { component: ImpactCards, name: 'Impact Highlights' },
    gallery: { component: ProjectGallery, name: 'Project Gallery' },
    teslaProjects: { component: TeslaProjects, name: 'Tesla Projects' },
    heroProjects: { component: HeroProjects, name: 'Hero MotoCorp Projects' },
    academicProjects: { component: AcademicProjects, name: 'Academic Projects' },
    projects: { component: Projects, name: 'All Projects (Legacy)' }, // Fallback for old cached layout
    skills: { component: Skills, name: 'Skills' },
    contact: { component: Contact, name: 'Contact' },
}

/**
 * Container that manages drag-and-drop section reordering
 */
function SectionContainer() {
    const { sections, setSections, isEditMode } = useEdit()
    const [activeId, setActiveId] = useState(null)

    // Configure drag sensors
    // PointerSensor: mouse/touch with 8px activation distance (prevents accidental drags)
    // KeyboardSensor: keyboard navigation with arrow keys
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Minimum drag distance before activation
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    /**
     * Called when drag starts - store the active item ID for overlay
     */
    const handleDragStart = (event) => {
        setActiveId(event.active.id)
    }

    /**
     * Called when drag ends - reorder sections if dropped in new position
     */
    const handleDragEnd = (event) => {
        const { active, over } = event
        setActiveId(null)

        // Only reorder if dropped on a different item
        if (over && active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                // Use arrayMove utility for immutable reorder
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    // Get visible sections in their current order
    const visibleSections = sections.filter(s => s.visible !== false)
    const sectionIds = visibleSections.map(s => s.id)

    // If not in edit mode, render sections without drag functionality
    if (!isEditMode) {
        return (
            <main>
                {visibleSections.map((section) => {
                    const config = SECTION_COMPONENTS[section.id]
                    if (!config) return null
                    const Component = config.component
                    return <Component key={section.id} />
                })}
            </main>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={sectionIds}
                strategy={verticalListSortingStrategy}
            >
                <main className="sections-container edit-mode-active">
                    {visibleSections.map((section) => {
                        const config = SECTION_COMPONENTS[section.id]
                        if (!config) return null
                        const Component = config.component

                        return (
                            <SortableSection
                                key={section.id}
                                id={section.id}
                                name={config.name}
                            >
                                <Component />
                            </SortableSection>
                        )
                    })}
                </main>
            </SortableContext>

            {/* Drag Overlay - shows a preview while dragging */}
            <DragOverlay>
                {activeId ? (
                    <div className="section-drag-overlay">
                        <span>{SECTION_COMPONENTS[activeId]?.name || activeId}</span>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

export default SectionContainer
