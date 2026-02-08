'use client'

import { EditProvider } from '../context/EditContext'

export function Providers({ children }) {
    return (
        <EditProvider>
            {children}
        </EditProvider>
    )
}
