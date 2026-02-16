import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const body = await request.json()
        const { password } = body

        // Server-only env var (no NEXT_PUBLIC_ prefix)
        const expectedPassword = process.env.EDITOR_PASSWORD
        if (!expectedPassword) {
            return NextResponse.json(
                { error: 'Editor password not configured on server' },
                { status: 500 }
            )
        }

        if (password !== expectedPassword) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            )
        }

        // Return success — client stores auth state
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        )
    }
}
