import Projects from './Projects'

/**
 * TeslaProjects - Section for Tesla professional projects
 */
function TeslaProjects() {
    return (
        <Projects
            filter={{ company: "Tesla Inc." }}
            titleContext="tesla"
            defaultTitle="Tesla"
            defaultTitleHighlight=" Projects"
        />
    )
}

export default TeslaProjects
