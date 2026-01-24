import { useState } from 'react'
import { Mail, Linkedin, Github, GraduationCap, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { personalInfo } from '../data/content'
import { EditableText } from './Editable'
import { useEdit } from '../context/EditContext'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Contact() {
  const { getContent } = useEdit()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return null
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address'
        return null
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        return null
      default:
        return null
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Validate on change if field has been touched
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })
    setErrors(newErrors)
    setTouched({ name: true, email: true, message: true })
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

    setStatus('sending')

    const mailtoLink = `mailto:${personalInfo.email}?subject=${encodeURIComponent(formData.subject || 'Contact from Portfolio')}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`

    window.location.href = mailtoLink

    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      setTouched({})
      setTimeout(() => setStatus('idle'), 3000)
    }, 500)
  }

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="contact-content">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <p className="section-label" style={{ justifyContent: 'center' }}>
              <EditableText path="contact.label" defaultValue="Contact" />
            </p>
            <h2 className="contact-title">
              <EditableText path="contact.title" defaultValue="Let's Build Something" />
              <span className="gradient-text">
                <EditableText path="contact.titleHighlight" defaultValue=" Together" />
              </span>
            </h2>
          </div>

          <p className="contact-text">
            <EditableText
              path="contact.description"
              defaultValue="I'm currently open to full-time Robotics Engineer opportunities and interesting collaboration projects. Whether you have a question, want to discuss robotics, or just want to say hi, I'd love to hear from you."
              multiline={true}
            />
          </p>

          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className={`form-group ${errors.name && touched.name ? 'has-error' : ''}`}>
                <label htmlFor="name">
                  <EditableText path="contact.nameLabel" defaultValue="Your Name" />
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && touched.name && (
                  <span className="form-error" id="name-error" role="alert">
                    <AlertCircle size={14} /> {errors.name}
                  </span>
                )}
              </div>
              <div className={`form-group ${errors.email && touched.email ? 'has-error' : ''}`}>
                <label htmlFor="email">
                  <EditableText path="contact.emailLabel" defaultValue="Your Email" />
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="john@example.com"
                  aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && touched.email && (
                  <span className="form-error" id="email-error" role="alert">
                    <AlertCircle size={14} /> {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">
                <EditableText path="contact.subjectLabel" defaultValue="Subject" />
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
              />
            </div>

            <div className={`form-group ${errors.message && touched.message ? 'has-error' : ''}`}>
              <label htmlFor="message">
                <EditableText path="contact.messageLabel" defaultValue="Message" />
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tell me about your project or just say hi!"
                rows={5}
                aria-invalid={errors.message && touched.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && touched.message && (
                <span className="form-error" id="message-error" role="alert">
                  <AlertCircle size={14} /> {errors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`contact-submit ${status}`}
              disabled={status === 'sending'}
            >
              {status === 'idle' && (
                <>
                  <Send size={18} />
                  <EditableText path="contact.submitBtn" defaultValue="Send Message" />
                </>
              )}
              {status === 'sending' && (
                <>
                  <span className="spinner" />
                  Sending...
                </>
              )}
              {status === 'success' && (
                <>
                  <CheckCircle size={18} />
                  Message Sent!
                </>
              )}
              {status === 'error' && (
                <>
                  <AlertCircle size={18} />
                  Try Again
                </>
              )}
            </button>
          </form>

          {/* Social Links */}
          <div className="contact-socials">
            <a
              href={getContent('contact.linkedinUrl', personalInfo.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={getContent('contact.githubUrl', personalInfo.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href={getContent('contact.scholarUrl', personalInfo.scholar)}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social"
              aria-label="Google Scholar"
            >
              <GraduationCap size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
