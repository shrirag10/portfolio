import './globals.css'
import { Providers } from './providers'

export const metadata = {
    title: 'Shriman Raghav Srinivasan | Mechatronics & Robotics Engineer',
    description: 'Portfolio of Shriman Raghav Srinivasan - Mechatronics & Robotics Engineer specializing in AMR systems, SLAM, and sensor fusion for industrial automation.',
    keywords: ['Robotics Engineer', 'AMR', 'SLAM', 'Sensor Fusion', 'Tesla', 'Portfolio'],
    authors: [{ name: 'Shriman Raghav Srinivasan' }],
    openGraph: {
        title: 'Shriman Raghav Srinivasan | Mechatronics & Robotics Engineer',
        description: 'Accelerating Material Flow with Autonomy & Intelligent Coordination',
        type: 'website',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
