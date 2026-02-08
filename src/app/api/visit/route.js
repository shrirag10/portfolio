import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function POST(request) {
    if (!supabase) {
        return NextResponse.json({ success: false, error: 'Supabase not configured' })
    }

    try {
        const body = await request.json()
        const { ip, location, path, userAgent, device } = body

        const { error } = await supabase
            .from('visitor_logs')
            .insert({
                ip: ip || 'unknown',
                location: location || 'Unknown',
                path: path || '/',
                user_agent: userAgent || 'Unknown',
                device: device || 'Unknown',
                created_at: new Date().toISOString()
            })

        if (error) {
            console.error('Error logging visitor:', error)
            return NextResponse.json({ success: false })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Visitor log error:', err)
        return NextResponse.json({ success: false })
    }
}
