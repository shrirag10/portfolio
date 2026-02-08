import { projects } from '../../../data/content'
import ProjectDetailClient from './ProjectDetail'

// Generate static params for all projects at build time
export function generateStaticParams() {
    return projects.map((project) => ({
        id: project.id,
    }))
}

export default function ProjectDetailPage({ params }) {
    return <ProjectDetailClient id={params.id} />
}
