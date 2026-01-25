import { useState, useEffect } from 'react'

function TypewriterText({ text, speed = 100, delay = 0, className = '' }) {
    const [displayText, setDisplayText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        // Reset if text changes
        setDisplayText('')
        setCurrentIndex(0)
        setIsTyping(false)

        const startTimeout = setTimeout(() => {
            setIsTyping(true)
        }, delay)

        return () => clearTimeout(startTimeout)
    }, [text, delay])

    useEffect(() => {
        if (!isTyping) return

        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, speed)

            return () => clearTimeout(timeout)
        }
    }, [currentIndex, isTyping, text, speed])

    return (
        <span className={className}>
            {displayText}
            <span className="cursor-animate" style={{
                display: 'inline-block',
                width: '2px',
                height: '1em',
                backgroundColor: 'currentColor',
                marginLeft: '2px',
                verticalAlign: 'middle',
                animation: 'blink 1s step-end infinite'
            }}></span>
        </span>
    )
}

export default TypewriterText
