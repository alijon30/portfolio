import { motion } from 'framer-motion';
import {
    Briefcase,
    Code2,
    Rocket,
    Mail,
    Github,
    Linkedin,
    MapPin,
    GraduationCap,
    Sparkles,
    ChevronRight,
    Mic,
    Brain,
    Download
} from 'lucide-react';

const BentoGrid = () => {
    const experiences = [
        {
            role: "Software Engineer Lead",
            company: "Stone Brothers International LLC",
            date: "Sep 2025 - Present",
            highlight: "Scaled logistics HR platform to 30,000+ users with AI-driven automation",
            current: true
        },
        {
            role: "Co-Founder",
            company: "SimplePrep",
            date: "May 2024 - Apr 2025",
            highlight: "Built adaptive SAT prep platform with 500+ active users",
            current: false
        },
        {
            role: "Software Engineer Intern",
            company: "Radical X",
            date: "Sep 2023 - Dec 2023",
            highlight: "Real-time billing infrastructure & AI integration",
            current: false
        },
        {
            role: "Student Software Developer",
            company: "USF Honors College",
            date: "Feb 2023 - Aug 2023",
            highlight: "Research portal serving 30,000+ students & staff",
            current: false
        }
    ];

    const skills = {
        languages: ["Python", "TypeScript", "JavaScript", "Go", "C#", "C"],
        frontend: ["React", "Next.js", "Redux", "Tailwind CSS"],
        backend: ["Django", "FastAPI", "ASP.NET Core", "Node.js"],
        data: ["PostgreSQL", "MongoDB", "SQLite"],
        devops: ["Docker", "AWS", "GCP", "CI/CD"],
        ai: ["OpenAI", "Claude", "Gemini", "STT/TTS"]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            className="bento-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Experience Card - Large */}
            <motion.div className="bento-card large" variants={itemVariants}>
                <div className="card-header">
                    <div className="card-icon">
                        <Briefcase size={20} />
                    </div>
                    <span className="card-title">Experience</span>
                </div>
                <div className="experience-list">
                    {experiences.map((exp, index) => (
                        <div key={index} className={`experience-item ${exp.current ? 'current' : ''}`}>
                            <div className="experience-dot" />
                            <div className="experience-content">
                                <h3>{exp.role}</h3>
                                <div className="experience-company">{exp.company}</div>
                                <div className="experience-date">{exp.date}</div>
                                <p className="experience-highlight">{exp.highlight}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Stats Card - Small */}
            <motion.div className="bento-card small" variants={itemVariants}>
                <div className="card-header">
                    <div className="card-icon">
                        <Sparkles size={20} />
                    </div>
                    <span className="card-title">Impact</span>
                </div>
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">30K+</div>
                        <div className="stat-label">Users Served</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">6</div>
                        <div className="stat-label">Roles</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">65%</div>
                        <div className="stat-label">Workload Reduced</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">40%</div>
                        <div className="stat-label">Latency Improved</div>
                    </div>
                </div>
            </motion.div>

            {/* Skills Card - Medium */}
            <motion.div className="bento-card medium" variants={itemVariants}>
                <div className="card-header">
                    <div className="card-icon">
                        <Code2 size={20} />
                    </div>
                    <span className="card-title">Tech Stack</span>
                </div>
                <div className="skills-container">
                    {skills.languages.map((skill) => (
                        <span key={skill} className="skill-pill highlight">{skill}</span>
                    ))}
                    {skills.frontend.map((skill) => (
                        <span key={skill} className="skill-pill">{skill}</span>
                    ))}
                    {skills.backend.map((skill) => (
                        <span key={skill} className="skill-pill">{skill}</span>
                    ))}
                    {skills.devops.map((skill) => (
                        <span key={skill} className="skill-pill">{skill}</span>
                    ))}
                    {skills.ai.map((skill) => (
                        <span key={skill} className="skill-pill highlight">{skill}</span>
                    ))}
                </div>
            </motion.div>

            {/* Featured Project Card - Medium */}
            <motion.div className="bento-card medium" variants={itemVariants}>
                <div className="card-header">
                    <div className="card-icon">
                        <Rocket size={20} />
                    </div>
                    <span className="card-title">Featured Project</span>
                </div>
                <div className="project-content">
                    <h3>InterviewPrep Pro</h3>
                    <p className="project-description">
                        AI-powered technical interview simulator with voice-interactive capabilities
                    </p>
                    <div className="project-tech">
                        <span className="tech-badge">OpenAI</span>
                        <span className="tech-badge">Gemini</span>
                        <span className="tech-badge">STT/TTS</span>
                        <span className="tech-badge">WebSockets</span>
                    </div>
                    <div className="project-features">
                        <div className="feature-item">
                            <Mic size={16} />
                            <span>Voice-interactive interview simulation</span>
                        </div>
                        <div className="feature-item">
                            <Brain size={16} />
                            <span>LLM-powered structured scoring</span>
                        </div>
                        <div className="feature-item">
                            <ChevronRight size={16} />
                            <span>Retrieval-augmented guidance</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* About Card - Medium */}
            <motion.div className="bento-card medium" variants={itemVariants}>
                <div className="card-header">
                    <div className="card-icon">
                        <GraduationCap size={20} />
                    </div>
                    <span className="card-title">About</span>
                </div>
                <p className="about-text">
                    <strong>Software Engineer</strong> specializing in <strong>AI/ML integration</strong> and
                    <strong> full-stack development</strong>. I build scalable platforms that serve thousands of users,
                    with expertise in real-time systems, WebSockets, and modern cloud architecture.
                </p>
                <div className="location-badge">
                    <MapPin size={16} />
                    <span>Open to Relocation</span>
                </div>
                <div className="education-badge">
                    <GraduationCap size={16} />
                    <span>B.Sc. Cyber Security, USF 2025</span>
                </div>
            </motion.div>

            {/* Contact Card - Medium */}
            <motion.div className="bento-card medium" variants={itemVariants}>
                <div className="card-header">
                    <div className="card-icon">
                        <Mail size={20} />
                    </div>
                    <span className="card-title">Let's Connect</span>
                </div>
                <div className="contact-links">
                    <a
                        href="mailto:alijonkarimberdiev26@gmail.com"
                        className="contact-link"
                    >
                        <Mail size={20} />
                        <span>alijonkarimberdiev26@gmail.com</span>
                    </a>
                    <a
                        href="https://github.com/alijon30"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        <Github size={20} />
                        <span>github.com/alijon30</span>
                    </a>
                    <a
                        href="https://linkedin.com/in/alijonk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        <Linkedin size={20} />
                        <span>linkedin.com/in/alijonk</span>
                    </a>
                </div>
                <a href="/resume.pdf" className="cta-button" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}>
                    <Download size={18} />
                    Download Resume
                </a>
            </motion.div>
        </motion.div>
    );
};

export default BentoGrid;
