import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function GET() {
    if (!supabase) {
        return NextResponse.json({ content: {}, styles: {}, sections: [] })
    }

    try {
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching content:', error)
            return NextResponse.json({ content: {}, styles: {}, sections: [] })
        }

        return NextResponse.json(data || { content: {}, styles: {}, sections: [] })
    } catch (err) {
        console.error('Supabase error:', err)
        return NextResponse.json({ content: {}, styles: {}, sections: [] })
    }
}

export async function POST(request) {
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    try {
        const body = await request.json()
        const { content, password } = body

        const expectedPassword = process.env.NEXT_PUBLIC_EDITOR_PASSWORD || 'admin123'
        if (password !== expectedPassword) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('portfolio_content')
            .upsert({
                id: 'main',
                content: content,
                updated_at: new Date().toISOString()
            })
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
