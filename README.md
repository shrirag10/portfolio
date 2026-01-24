# Shriman Raghav Srinivasan - Portfolio Website

A modern, professional portfolio website built with React and Vite, showcasing robotics engineering projects and experience.

## 🚀 Features

- **Single Page Design** - Smooth scrolling main page with all sections
- **Project Detail Pages** - Deep-dive into each project with routing
- **Modern UI/UX** - Dark theme with gradient accents, animations, and responsive design
- **Optimized for Robotics** - Showcases AMR systems, SLAM, sensor fusion, and path planning projects

## 📦 Tech Stack

- React 18
- React Router v6
- Vite (build tool)
- Lucide React (icons)
- Framer Motion (animations)
- CSS Variables for theming

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/shrirag10/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 🖼️ Adding Your Content

### 1. Profile Photo
Add your photo to `/public/images/profile.jpg`

### 2. Project Images
Add project images to `/public/images/`:
- `tesla-amr.jpg`
- `llm-astar.jpg`
- `rtab-slam.jpg`
- `sensor-fusion.jpg`
- `hero-pallet.jpg`

### 3. Resume
Add your resume PDF to `/public/resume.pdf`

### 4. Update Content
Edit `/src/data/content.js` to update:
- Personal information
- Experience details
- Project descriptions
- Skills
- Education

### 5. Social Links
Update the links in `/src/data/content.js`:
```javascript
linkedin: "https://www.linkedin.com/in/shriman-raghav",
github: "https://github.com/shrirag10",
scholar: "https://scholar.google.com/citations?user=YOUR_ID"
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite and deploy

### GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

2. Build and deploy:
```bash
npm run build
# Push dist folder to gh-pages branch
```

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── images/           # Profile & project images
│   └── resume.pdf        # Your resume
├── src/
│   ├── components/       # React components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Experience.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── ProjectDetail.jsx
│   ├── data/
│   │   └── content.js    # All portfolio content
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css         # All styles
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 🎨 Customization

### Colors
Edit CSS variables in `/src/index.css`:
```css
:root {
  --accent-primary: #3b82f6;    /* Main accent color */
  --accent-secondary: #60a5fa;  /* Secondary accent */
  --bg-primary: #0a0a0b;        /* Background */
}
```

### Fonts
Change fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

Then update in CSS:
```css
:root {
  --font-display: 'Your Font', sans-serif;
}
```

## 📧 Contact

- Email: srinivasan.shrim@northeastern.edu
- LinkedIn: [linkedin.com/in/shriman-raghav](https://www.linkedin.com/in/shriman-raghav)
- GitHub: [github.com/shrirag10](https://github.com/shrirag10)

---

Built with ❤️ by Shriman Raghav Srinivasan
