import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client - returns null if env vars not configured
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase

// Database table names
export const TABLES = {
    CONTENT: 'portfolio_content',
    VISITOR_LOGS: 'visitor_logs',
}

/**
 * Fetch portfolio content from Supabase
 * Falls back to default content if Supabase not configured
 */
export async function getContent() {
    if (!supabase) {
        return { content: {}, styles: {}, sections: [] }
    }

    try {
        const { data, error } = await supabase
            .from(TABLES.CONTENT)
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching content:', error)
            return { content: {}, styles: {}, sections: [] }
        }

        return data || { content: {}, styles: {}, sections: [] }
    } catch (err) {
        console.error('Supabase error:', err)
        return { content: {}, styles: {}, sections: [] }
    }
}

/**
 * Save portfolio content to Supabase
 */
export async function saveContent(contentData, password) {
    if (!supabase) {
        throw new Error('Supabase not configured')
    }

    const expectedPassword = process.env.EDIT_MODE_PASSWORD || 'admin123'
    if (password !== expectedPassword) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .upsert({
            id: 'main',
            ...contentData,
            updated_at: new Date().toISOString()
        })
        .select()

    if (error) throw error
    return data
}

/**
 * Log a visitor to Supabase
 */
export async function logVisitor(visitorData) {
    if (!supabase) return { success: false }

    try {
        const { error } = await supabase
            .from(TABLES.VISITOR_LOGS)
            .insert({
                ip: visitorData.ip || 'unknown',
                location: visitorData.location || 'Unknown',
                path: visitorData.path || '/',
                user_agent: visitorData.userAgent || 'Unknown',
                device: visitorData.device || 'Unknown',
                created_at: new Date().toISOString()
            })

        if (error) {
            console.error('Error logging visitor:', error)
            return { success: false }
        }

        return { success: true }
    } catch (err) {
        console.error('Visitor log error:', err)
        return { success: false }
    }
}

/**
 * Get visitor logs from Supabase (protected)
 */
export async function getVisitorLogs(password, limit = 100) {
    if (!supabase) {
        throw new Error('Supabase not configured')
    }

    const expectedPassword = process.env.EDIT_MODE_PASSWORD || 'admin123'
    if (password !== expectedPassword) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from(TABLES.VISITOR_LOGS)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data || []
}
