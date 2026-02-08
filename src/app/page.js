import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ClientApp to ensure it runs only on client
const ClientApp = dynamic(() => import('./ClientApp'), {
    ssr: false,
    loading: () => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#0a0a0b',
            color: '#fafafa'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(59, 130, 246, 0.3)',
                    borderTopColor: '#3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                }} />
                Loading...
            </div>
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    ),
})

export default function HomePage() {
    return <ClientApp />
}
