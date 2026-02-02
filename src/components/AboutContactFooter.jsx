
import { Mail, Github, Linkedin, ArrowRight } from 'lucide-react';
import './AboutContactFooter.css';

export const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="container about-container">
                <div className="about-image">
                    <div className="about-img-frame">
                        {/* Image would go here */}
                    </div>
                </div>
                <div className="about-text">
                    <h2>About Me</h2>
                    <p>
                        I am a passionate Software Engineer with a strong foundation in modern web technologies.
                        I enjoy solving complex problems and creating intuitive, user-friendly applications.
                    </p>
                    <p>
                        When I'm not coding, I'm likely exploring new technologies, contributing to open source,
                        or sharing my knowledge with the developer community.
                    </p>

                    <div className="stats">
                        <div className="stat-item">
                            <h3>2+</h3>
                            <p>Years Experience</p>
                        </div>
                        <div className="stat-item">
                            <h3>20+</h3>
                            <p>Projects Completed</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const Contact = () => {
    return (
        <section id="contact" className="contact-section">
            <div className="container contact-container">
                <h2 className="section-title">Get In Touch</h2>
                <p className="contact-text">
                    I'm currently looking for new opportunities. Whether you have a question or just want to say hi,
                    I'll try my best to get back to you!
                </p>
                <a href="mailto:contact@alijon.dev" className="btn btn-primary">
                    Say Hello <Mail size={20} />
                </a>
            </div>
        </section>
    );
};

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p className="footer-text">
                    &copy; {new Date().getFullYear()} Alijon.dev. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
