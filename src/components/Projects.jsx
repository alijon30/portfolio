
import { Github, ExternalLink } from 'lucide-react';
import './Projects.css';

const Projects = () => {
    const projects = [
        {
            title: "E-Commerce Dashboard",
            description: "A comprehensive dashboard for managing online stores. Features include real-time analytics, inventory management, and order tracking.",
            tech: ["React", "TypeScript", "Chart.js", "Firebase"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "Task Management App",
            description: "A collaborative task manager allowing teams to organize workflows. Supports Kanban boards, real-time updates, and file sharing.",
            tech: ["Next.js", "Socket.io", "MongoDB", "Tailwind"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "AI Image Generator",
            description: "An application that uses generative AI to create unique images from text descriptions. Integrates with OpenAI DALL-E API.",
            tech: ["React", "Node.js", "OpenAI API", "AWS S3"],
            demoLink: "#",
            codeLink: "#"
        }
    ];

    return (
        <section id="projects" className="projects-section">
            <div className="container">
                <h2 className="section-title">Featured Projects</h2>
                <p className="section-subtitle">
                    Here are some of the projects I've worked on. Each one presented its own unique challenges and learning opportunities.
                </p>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <div className="project-image">
                                {/* Image placeholder handled by CSS */}
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-desc">{project.description}</p>
                                <div className="project-tech">
                                    {project.tech.map((tech, idx) => (
                                        <span key={idx} className="tech-tag">{tech}</span>
                                    ))}
                                </div>
                                <div className="project-links">
                                    <a href={project.codeLink} className="project-link" target="_blank" rel="noopener noreferrer">
                                        <Github size={18} /> Code
                                    </a>
                                    <a href={project.demoLink} className="project-link" target="_blank" rel="noopener noreferrer">
                                        <ExternalLink size={18} /> Live Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
