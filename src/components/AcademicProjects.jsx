import Projects from './Projects'

/**
 * AcademicProjects - Section for academic/research projects
 */
function AcademicProjects() {
    return (
        <Projects
            filter={{ type: "academic" }}
            titleContext="academic"
            defaultTitle="Academic"
            defaultTitleHighlight=" Research Projects"
        />
    )
}

export default AcademicProjects
