/**
 * PasswordDialog.jsx
 * 
 * A secure password dialog that protects edit mode access.
 * Requires correct password to enter the page builder.
 * 
 * Features:
 * - Password input with show/hide toggle
 * - Configurable password (stored in environment variable)
 * - Rate limiting after failed attempts
 * - Keyboard accessible (Enter to submit)
 * 
 * IMPORTANT: Set VITE_EDITOR_PASSWORD in .env file
 * Default password for development: "admin123"
 */

import { useState, useEffect, useRef } from 'react'
import { Lock, Eye, EyeOff, X, AlertCircle } from 'lucide-react'
import { useEdit } from '../context/EditContext'

/**
 * Default password if not set in environment
 * CHANGE THIS IN PRODUCTION via VITE_EDITOR_PASSWORD env var
 */
const EDITOR_PASSWORD = import.meta.env.VITE_EDITOR_PASSWORD || 'admin123'

/**
 * Maximum failed attempts before temporary lockout
 */
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 30000 // 30 seconds

/**
 * Password protection dialog for edit mode
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is visible
 * @param {function} props.onSuccess - Called when correct password entered
 * @param {function} props.onClose - Called when dialog is closed
 */
function PasswordDialog({ isOpen, onSuccess, onClose }) {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [attempts, setAttempts] = useState(0)
    const [lockedUntil, setLockedUntil] = useState(null)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const inputRef = useRef(null)
    const { setEditPassword } = useEdit()

    // Focus input when dialog opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    // Handle lockout countdown
    useEffect(() => {
        if (!lockedUntil) return

        const interval = setInterval(() => {
            const remaining = Math.max(0, lockedUntil - Date.now())
            setTimeRemaining(Math.ceil(remaining / 1000))

            if (remaining <= 0) {
                setLockedUntil(null)
                setAttempts(0)
                setError('')
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [lockedUntil])

    const handleSubmit = (e) => {
        e.preventDefault()

        // Check if locked out
        if (lockedUntil && Date.now() < lockedUntil) {
            return
        }

        // Validate password
        if (password === EDITOR_PASSWORD) {
            // Set password for cloud sync before clearing
            setEditPassword(password)
            setPassword('')
            setError('')
            setAttempts(0)
            onSuccess()
        } else {
            const newAttempts = attempts + 1
            setAttempts(newAttempts)
            setPassword('')

            if (newAttempts >= MAX_ATTEMPTS) {
                setLockedUntil(Date.now() + LOCKOUT_DURATION)
                setError(`Too many attempts. Locked for ${LOCKOUT_DURATION / 1000} seconds.`)
            } else {
                setError(`Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`)
            }
        }
    }

    const handleClose = () => {
        setPassword('')
        setError('')
        onClose()
    }

    if (!isOpen) return null

    const isLocked = lockedUntil && Date.now() < lockedUntil

    return (
        <div className="password-dialog-overlay" onClick={handleClose}>
            <div
                className="password-dialog"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="password-dialog-title"
            >
                {/* Header */}
                <div className="password-dialog-header">
                    <div className="password-dialog-icon">
                        <Lock size={24} />
                    </div>
                    <h2 id="password-dialog-title">Enter Edit Mode</h2>
                    <button
                        className="password-dialog-close"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit}>
                    <p className="password-dialog-desc">
                        Enter the editor password to access the page builder.
                    </p>

                    {/* Password Input */}
                    <div className="password-input-wrapper">
                        <input
                            ref={inputRef}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            disabled={isLocked}
                            className={error ? 'has-error' : ''}
                            aria-describedby={error ? 'password-error' : undefined}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div id="password-error" className="password-error" role="alert">
                            <AlertCircle size={14} />
                            <span>{error}</span>
                            {isLocked && <span className="lockout-timer">{timeRemaining}s</span>}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="password-submit"
                        disabled={isLocked || !password}
                    >
                        {isLocked ? `Locked (${timeRemaining}s)` : 'Enter Editor'}
                    </button>
                </form>

                {/* Hint */}
                <p className="password-hint">
                    Hint: Contact the site owner for access credentials.
                </p>
            </div>
        </div>
    )
}

export default PasswordDialog
