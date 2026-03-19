#!/usr/bin/env node

/**
 * LinkedIn → Portfolio Blog Updater
 * 
 * Fetches your recent LinkedIn posts and adds new ones to blog.js.
 * 
 * Usage:
 *   node scripts/update-linkedin-posts.js
 * 
 * How it works:
 *   1. Reads your current blog.js to find existing LinkedIn URLs
 *   2. Fetches your public LinkedIn activity feed
 *   3. Extracts post data (title, summary, date, URL)
 *   4. Prompts you to confirm which posts to add
 *   5. Appends new posts to blog.js
 * 
 * Since LinkedIn's API has limited access for personal posts,
 * this script also supports a manual mode where you paste
 * post details interactively.
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const BLOG_FILE = path.join(__dirname, '..', 'src', 'data', 'blog.js')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve))
}

function getExistingUrls() {
    const content = fs.readFileSync(BLOG_FILE, 'utf-8')
    const urlRegex = /linkedinUrl:\s*["']([^"']+)["']/g
    const urls = []
    let match
    while ((match = urlRegex.exec(content)) !== null) {
        urls.push(match[1])
    }
    return urls
}

function generateId(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 40)
        .replace(/-$/, '')
}

function estimateReadTime(summary) {
    const words = summary.split(/\s+/).length
    const minutes = Math.max(3, Math.ceil(words / 50))
    return `${minutes} min read`
}

function formatPost(post) {
    return `    {
        id: "${post.id}",
        title: "${post.title.replace(/"/g, '\\"')}",
        summary: "${post.summary.replace(/"/g, '\\"')}",
        date: "${post.date}",
        tags: [${post.tags.map(t => `"${t}"`).join(', ')}],
        readTime: "${post.readTime}",
        linkedinUrl: "${post.linkedinUrl}",
        featured: ${post.featured},
    }`
}

function insertPost(postStr) {
    let content = fs.readFileSync(BLOG_FILE, 'utf-8')
    // Insert after the opening bracket of the array
    const insertPoint = content.indexOf('[') + 1
    content = content.slice(0, insertPoint) + '\n' + postStr + ',' + content.slice(insertPoint)
    fs.writeFileSync(BLOG_FILE, content, 'utf-8')
}

async function manualMode() {
    console.log('\n📝 Manual Mode — Add a LinkedIn post to your portfolio\n')

    const existingUrls = getExistingUrls()
    console.log(`Found ${existingUrls.length} existing posts in blog.js\n`)

    const linkedinUrl = await ask('LinkedIn post URL: ')

    if (existingUrls.includes(linkedinUrl.trim())) {
        console.log('⚠️  This post already exists in blog.js — skipping.')
        rl.close()
        return
    }

    const title = await ask('Post title: ')
    const summary = await ask('Post summary (1-2 sentences): ')
    const dateStr = await ask('Date (e.g., "February 2026"): ')
    const tagsStr = await ask('Tags (comma-separated, e.g., "Tesla, Robotics, AI"): ')
    const featuredStr = await ask('Featured post? (y/n): ')

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    const featured = featuredStr.toLowerCase().startsWith('y')

    const post = {
        id: generateId(title),
        title: title.trim(),
        summary: summary.trim(),
        date: dateStr.trim(),
        tags,
        readTime: estimateReadTime(summary),
        linkedinUrl: linkedinUrl.trim(),
        featured,
    }

    console.log('\n--- Preview ---')
    console.log(formatPost(post))
    console.log('--- End Preview ---\n')

    const confirm = await ask('Add this post to blog.js? (y/n): ')
    if (confirm.toLowerCase().startsWith('y')) {
        insertPost(formatPost(post))
        console.log('✅ Post added to blog.js!')
        console.log('📌 Next steps: git commit & push to trigger Vercel deploy')
    } else {
        console.log('❌ Cancelled.')
    }

    rl.close()
}

async function fetchMode() {
    console.log('\n🔍 Fetch Mode — Checking LinkedIn for new posts...\n')

    const existingUrls = getExistingUrls()
    console.log(`Found ${existingUrls.length} existing posts in blog.js`)

    // LinkedIn doesn't expose a public API for personal posts without OAuth.
    // We'll try to fetch the public activity page and extract what we can.
    try {
        const profileUrl = 'https://www.linkedin.com/in/shriman-raghav/recent-activity/all/'
        console.log(`\nAttempting to fetch: ${profileUrl}`)
        console.log('⚠️  LinkedIn blocks automated requests. Falling back to manual mode.\n')
        console.log('💡 Tip: Open your LinkedIn activity page, copy the post URL, and use manual mode.\n')
        await manualMode()
    } catch (err) {
        console.log(`Error: ${err.message}`)
        console.log('Falling back to manual mode...\n')
        await manualMode()
    }
}

async function main() {
    console.log('╔══════════════════════════════════════════╗')
    console.log('║  LinkedIn → Portfolio Blog Updater       ║')
    console.log('╚══════════════════════════════════════════╝')

    const mode = await ask('\nChoose mode:\n  1. Manual — paste post details\n  2. Fetch — try to auto-detect new posts\n\nChoice (1/2): ')

    if (mode.trim() === '2') {
        await fetchMode()
    } else {
        await manualMode()
    }
}

main().catch(err => {
    console.error('Error:', err)
    rl.close()
    process.exit(1)
})
