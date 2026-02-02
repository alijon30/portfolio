
import { Code, Server, Wrench } from 'lucide-react';
import './Skills.css';

const Skills = () => {
    const skillsData = [
        {
            title: "Frontend Development",
            icon: <Code size={32} className="text-primary" />,
            skills: ["React", "JavaScript (ES6+)", "TypeScript", "HTML5/CSS3", "Tailwind CSS", "Next.js", "Redux"]
        },
        {
            title: "Backend Development",
            icon: <Server size={32} className="text-secondary" />,
            skills: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB", "REST APIs"]
        },
        {
            title: "Tools & DevOps",
            icon: <Wrench size={32} className="text-accent" />,
            skills: ["Git", "Docker", "AWS", "CI/CD", "Jest", "Webpack", "Figma"]
        }
    ];

    return (
        <section id="skills" className="skills-section">
            <div className="container">
                <h2 className="section-title">Technical Skills</h2>
                <p className="section-subtitle">
                    A collection of technologies and tools I work with to build robust applications.
                </p>

                <div className="skills-grid">
                    {skillsData.map((category, index) => (
                        <div key={index} className="skill-category">
                            <div className="category-title" style={{ color: 'var(--primary-color)' }}>
                                {category.icon}
                                <h3>{category.title}</h3>
                            </div>
                            <div className="skill-tags">
                                {category.skills.map((skill, idx) => (
                                    <span key={idx} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
