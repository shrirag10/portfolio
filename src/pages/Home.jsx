/**
 * Home.jsx
 * 
 * Main landing page that renders all portfolio sections.
 * Uses SectionContainer for drag-and-drop section reordering in edit mode.
 * 
 * In edit mode: Sections can be dragged to reorder
 * In view mode: Sections render in their saved order
 */

import SectionContainer from '../components/SectionContainer'

function Home() {
  return <SectionContainer />
}

export default Home

