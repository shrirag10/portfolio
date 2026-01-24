import { personalInfo } from '../data/content'
import { EditableText } from './Editable'
import { useEdit } from '../context/EditContext'

function Footer() {
  const currentYear = new Date().getFullYear()
  const { getContent } = useEdit()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <p className="footer-text">
            © {currentYear} <EditableText path="footer.name" defaultValue={personalInfo.name} />.
            <EditableText path="footer.tagline" defaultValue=" Built with React." />
          </p>

          <div className="footer-links">
            <a
              href={getContent('footer.linkedinUrl', personalInfo.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <EditableText path="footer.link1" defaultValue="LinkedIn" />
            </a>
            <a
              href={getContent('footer.githubUrl', personalInfo.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <EditableText path="footer.link2" defaultValue="GitHub" />
            </a>
            <a
              href={`mailto:${getContent('footer.email', personalInfo.email)}`}
              className="footer-link"
            >
              <EditableText path="footer.link3" defaultValue="Email" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
