import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger' // 'danger' | 'warning' | 'info'
}) {
    const dialogRef = useRef(null)
    const confirmBtnRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            // Focus the cancel button when dialog opens (safer default)
            confirmBtnRef.current?.focus()
            // Prevent body scroll when dialog is open
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return
            if (e.key === 'Escape') {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="confirm-dialog-backdrop"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
        >
            <div className="confirm-dialog" ref={dialogRef}>
                <div className={`confirm-dialog-icon ${variant}`}>
                    <AlertTriangle size={24} />
                </div>

                <h3 id="confirm-dialog-title" className="confirm-dialog-title">
                    {title}
                </h3>

                <p className="confirm-dialog-message">
                    {message}
                </p>

                <div className="confirm-dialog-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        ref={confirmBtnRef}
                        className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                    >
                        {confirmText}
                    </button>
                </div>

                <button
                    className="confirm-dialog-close"
                    onClick={onClose}
                    aria-label="Close dialog"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    )
}

export default ConfirmDialog
