import { Bot, Code, Wrench, Cpu, Cloud, Factory, User } from 'lucide-react'
import { skills } from '../data/content'
import { EditableText, EditableTags } from './Editable'
import { useEdit } from '../context/EditContext'
import TextScramble from './TextScramble'
import OrbitingSkills from './OrbitingSkills'

// Core skills to display in the orbital visualization
const coreSkills = [
  'SLAM', 'ROS 2', 'Python', 'C++', 'PyTorch',
  'OpenCV', 'LiDAR', 'MuJoCo', 'Docker', 'Path Planning',
  'Control Systems', 'Gazebo', 'TensorFlow', 'SolidWorks',
  'Isaac Sim', 'CUDA', 'Sensor Fusion', 'PLC',
  'Six Sigma', 'GD&T', 'Lean Mfg'
]

function Skills() {
  const { getContent, isEditMode } = useEdit()

  const icons = {
    personal: <User size={28} />,
    robotics: <Bot size={28} />,
    programming: <Code size={28} />,
    frameworks: <Wrench size={28} />,
    hardware: <Cpu size={28} />,
    software: <Cloud size={28} />,
    manufacturing: <Factory size={28} />
  }

  return (
    <section className="skills section" id="skills">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px' }}>
          <p className="section-label" style={{ justifyContent: 'center' }}>Skills</p>
          <h2 className="section-title">
            <EditableText path="skills.title" defaultValue="Technical" />
            <span className="gradient-text">
              <EditableText path="skills.titleHighlight" defaultValue=" Expertise" />
            </span>
          </h2>
        </div>

        {/* Orbital Skills Visualization */}
        <div style={{ marginBottom: '64px' }}>
          <OrbitingSkills skills={coreSkills} />
        </div>

        <div className="skills-grid">
          {Object.entries(skills).map(([key, category]) => (
            <div className="skill-category" key={key}>
              <div className="skill-category-icon">
                {icons[key]}
              </div>
              <h3>
                <EditableText
                  path={`skills.${key}.title`}
                  defaultValue={category.title}
                />
              </h3>
              {isEditMode ? (
                <EditableTags
                  path={`skills.${key}.items`}
                  defaultValue={category.items}
                  className="skill-list"
                />
              ) : (
                <div className="skill-list">
                  {(getContent(`skills.${key}.items`, category.items) || category.items).map((item, i) => (
                    <span key={i} className="skill-item">
                      <TextScramble text={item} trigger="scroll" duration={600 + i * 100} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
