import Projects from './Projects'

/**
 * HeroProjects - Section for Hero MotoCorp professional projects
 */
function HeroProjects() {
    return (
        <Projects
            filter={{ company: "Hero MotoCorp" }}
            titleContext="hero"
            defaultTitle="Hero MotoCorp"
            defaultTitleHighlight=" Projects"
        />
    )
}

export default HeroProjects
