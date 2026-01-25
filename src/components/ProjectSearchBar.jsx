import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

/**
 * Project Search and Filter Bar
 * ManuFX-style search with category filter pills
 */
function ProjectSearchBar({ onSearch, onFilter, categories = [], activeCategory = 'all' }) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        onSearch?.(value)
    }

    const defaultCategories = [
        { id: 'all', label: 'All' },
        { id: 'robotics', label: 'Robotics' },
        { id: 'automation', label: 'Automation' },
        { id: 'ai', label: 'AI/ML' },
        { id: 'manufacturing', label: 'Manufacturing' }
    ]

    const displayCategories = categories.length > 0 ? categories : defaultCategories

    return (
        <div className="project-search-bar">
            <div className="project-search-input">
                <Search size={18} style={{ color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search projects, technologies, outcomes..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    padding: '4px 8px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '4px'
                }}>
                    ⌘K
                </span>
            </div>

            <div className="project-filter-pills">
                {displayCategories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onFilter?.(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ProjectSearchBar
