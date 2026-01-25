import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type, duration }])
        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast])
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast])
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast])
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast])

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="toast-container" role="region" aria-label="Notifications">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    )
}

function Toast({ id, message, type, duration, onClose }) {
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsExiting(true)
                setTimeout(onClose, 300)
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    const handleClose = () => {
        setIsExiting(true)
        setTimeout(onClose, 300)
    }

    const icons = {
        success: <CheckCircle size={18} />,
        error: <AlertCircle size={18} />,
        warning: <AlertTriangle size={18} />,
        info: <Info size={18} />
    }

    return (
        <div
            className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}
            role="alert"
            aria-live="polite"
        >
            <div className="toast-icon">{icons[type]}</div>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={handleClose} aria-label="Dismiss">
                <X size={14} />
            </button>
            {duration > 0 && (
                <div
                    className="toast-progress"
                    style={{ animationDuration: `${duration}ms` }}
                />
            )}
        </div>
    )
}

export default Toast
