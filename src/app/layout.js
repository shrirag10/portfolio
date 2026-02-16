import './globals.css'
import { Providers } from './providers'

export const metadata = {
    title: 'Shriman Raghav Srinivasan | Mechatronics & Robotics Engineer',
    description: 'Robotics engineer who deployed autonomous forklifts at Tesla projected to save $2.04M annually. Specializing in AMR systems, SLAM, and sensor fusion for industrial automation.',
    keywords: ['Robotics Engineer', 'AMR', 'SLAM', 'Sensor Fusion', 'Tesla', 'Portfolio', 'Shriman Raghav'],
    authors: [{ name: 'Shriman Raghav Srinivasan' }],
    openGraph: {
        title: 'Shriman Raghav Srinivasan | Mechatronics & Robotics Engineer',
        description: 'Robotics engineer who deployed autonomous forklifts at Tesla projected to save $2.04M annually. Specializing in AMR systems, SLAM, and sensor fusion.',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Shriman Raghav Srinivasan - Mechatronics & Robotics Engineer',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shriman Raghav Srinivasan | Mechatronics & Robotics Engineer',
        description: 'Robotics engineer who deployed autonomous forklifts at Tesla projected to save $2.04M annually.',
        images: ['/og-image.png'],
    },
    icons: {
        icon: '/favicon.svg',
    },
}

// JSON-LD Structured Data for rich search results
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Shriman Raghav Srinivasan',
    jobTitle: 'Mechatronics & Robotics Engineer',
    url: 'https://portfolio-virid-pi-96.vercel.app',
    sameAs: [
        'https://www.linkedin.com/in/shriman-raghav',
        'https://github.com/shrirag10',
        'https://scholar.google.com/citations?user=tu8HUxUAAAAJ',
    ],
    alumniOf: [
        {
            '@type': 'CollegeOrUniversity',
            name: 'Northeastern University',
        },
        {
            '@type': 'CollegeOrUniversity',
            name: 'SRM Institute of Science & Technology',
        },
    ],
    worksFor: {
        '@type': 'Organization',
        name: 'Tesla Inc.',
    },
    knowsAbout: ['Robotics', 'SLAM', 'AMR', 'Sensor Fusion', 'Path Planning', 'LiDAR', 'Manufacturing Automation'],
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
