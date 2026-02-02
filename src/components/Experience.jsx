
import { Briefcase, Calendar } from 'lucide-react';
import './Experience.css';

const Experience = () => {
    const experiences = [
        {
            role: "Senior Software Engineer",
            company: "Tech Corp Inc.",
            date: "2023 - Present",
            description: "Leading frontend architecture and mentoring junior developers. Implemented Micro-frontend architecture improving deployment speed by 40%."
        },
        {
            role: "Software Developer",
            company: "Creative Solutions",
            date: "2021 - 2023",
            description: "Developed and maintained multiple React applications. Collaborated with UX/UI designers to implement pixel-perfect designs."
        },
        {
            role: "Junior Web Developer",
            company: "Startup Co.",
            date: "2019 - 2021",
            description: "Built responsive landing pages and integrated REST APIs. Optimized website performance achieving 95+ LightHouse scores."
        }
    ];

    return (
        <section id="experience" className="experience-section">
            <div className="container">
                <h2 className="section-title">Experience</h2>
                <p className="section-subtitle">
                    My professional journey and the organizations I've had the privilege to work with.
                </p>

                <div className="timeline">
                    {experiences.map((exp, index) => (
                        <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h3 className="role">{exp.role}</h3>
                                <div className="company">
                                    <Briefcase size={16} /> {exp.company}
                                </div>
                                <div className="date">
                                    <Calendar size={16} /> {exp.date}
                                </div>
                                <p className="description">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
