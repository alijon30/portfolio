import { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import {
  SiPython,
  SiTypescript,
  SiGo,
  SiReact,
  SiFastapi,
  SiDjango,
  SiNextdotjs,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiAmazonwebservices,
  SiOpenai,
  SiTailwindcss,
  SiFirebase,
  SiGooglecloud,
  SiAnthropic
} from 'react-icons/si';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="portfolio">
      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      {/* Header */}
      <header className="header">
        <div className="logo">Alijon K.</div>
        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className="status">
            <span className="status-dot" />
            Open to work
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Left - Intro */}
        <div className="intro">
          <h1 className="name">Alijon<br />Karimberdiev</h1>
          <p className="title">
            Software Engineer <span>— AI/ML & Full Stack</span>
          </p>
          <p className="bio">
            Engineering lead building AI-powered platforms. 1M+ lines of production code,
            500+ companies onboarded, leading teams using Agile. Also building a stealth AI-native
            product for a major market — details coming after launch.
          </p>
          <div className="cta-row">
            <a href="mailto:alijonkarimberdiev26@gmail.com" className="btn btn-primary">
              Get in Touch
            </a>
            <a href="/resume.pdf" className="btn btn-ghost">
              Resume
            </a>
          </div>
        </div>

        {/* Right - Quick Stats */}
        <div className="info-grid">
          <div className="info-card">
            <div className="card-label">Scale</div>
            <div className="stat-value">1M+</div>
            <div className="stat-label">lines of code shipped</div>
          </div>
          <div className="info-card">
            <div className="card-label">Impact</div>
            <div className="stat-value">500+</div>
            <div className="stat-label">companies onboarded</div>
          </div>
          <div className="info-card">
            <div className="card-label">Leadership</div>
            <div className="stat-value">4</div>
            <div className="stat-label">engineers led</div>
          </div>
          <div className="info-card">
            <div className="card-label">Users</div>
            <div className="stat-value">30K+</div>
            <div className="stat-label">across platforms</div>
          </div>
        </div>
      </main>

      {/* GitHub Activity & Tech Stack */}
      <section className="github-section">
        <div className="section-label">GitHub Activity & Tech Stack</div>
        <div className="github-tech-row">
          <div className="github-calendar-wrapper">
            <GitHubCalendar
              username="alijon30"
              colorScheme={theme}
              blockSize={12}
              blockMargin={4}
              fontSize={14}
            />
            <a
              href="https://github.com/alijon30"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              View Full Profile on GitHub
            </a>
          </div>
          <div className="tech-stack-grid">
            <div className="tech-icon-item">
              <SiPython />
              <span>Python</span>
            </div>
            <div className="tech-icon-item">
              <SiTypescript />
              <span>TypeScript</span>
            </div>
            <div className="tech-icon-item">
              <SiGo />
              <span>Go</span>
            </div>
            <div className="tech-icon-item">
              <SiReact />
              <span>React</span>
            </div>
            <div className="tech-icon-item">
              <SiFastapi />
              <span>FastAPI</span>
            </div>
            <div className="tech-icon-item">
              <SiDjango />
              <span>Django</span>
            </div>
            <div className="tech-icon-item">
              <SiNextdotjs />
              <span>Next.js</span>
            </div>
            <div className="tech-icon-item">
              <SiPostgresql />
              <span>PostgreSQL</span>
            </div>
            <div className="tech-icon-item">
              <SiMongodb />
              <span>MongoDB</span>
            </div>
            <div className="tech-icon-item">
              <SiDocker />
              <span>Docker</span>
            </div>
            <div className="tech-icon-item">
              <SiAmazonwebservices />
              <span>AWS</span>
            </div>
            <div className="tech-icon-item">
              <SiOpenai />
              <span>OpenAI</span>
            </div>
            <div className="tech-icon-item">
              <SiTailwindcss />
              <span>Tailwind</span>
            </div>
            <div className="tech-icon-item">
              <SiFirebase />
              <span>Firebase</span>
            </div>
            <div className="tech-icon-item">
              <SiGooglecloud />
              <span>GCP</span>
            </div>
            <div className="tech-icon-item">
              <SiAnthropic />
              <span>Claude</span>
            </div>
          </div>
        </div>
      </section>

      {/* What I Built */}
      <section className="work-section">
        <div className="section-label">What I Built</div>

        {/* HuntME */}
        <article className="work-item">
          <div className="work-header">
            <h2 className="work-title">HuntME Platform</h2>
            <span className="work-meta">Engineering Lead · Stone Brothers International</span>
          </div>

          <p className="work-summary">
            I joined Stone Brothers to build HuntME from the ground up — a logistics and recruiting platform
            connecting truck drivers with companies across USA and CIS countries. What started as a single
            application grew into an ecosystem of <strong>7 interconnected products</strong> with <strong>60,000+ files of code</strong>,
            <strong>24 microservices</strong>, and a team I led through every architectural decision.
          </p>

          <p className="work-summary">
            Today, <strong>500+ logistics companies</strong> use HuntME to manage hiring. We've onboarded
            <strong> 31,000+ registered users</strong>, facilitated <strong>10,000+ job placements</strong>,
            and process <strong>200+ applications within 48 hours</strong> of any job posting going live.
            The platform handles <strong>30+ new job listings daily</strong>.
          </p>

          <h3 className="work-subheading">Technical Architecture</h3>
          <p className="work-summary">
            The backend runs on <strong>FastAPI</strong> with <strong>24 dedicated service modules</strong> — User, Company, Jobs,
            Offers, Employment, Interview, Payment, Notification, Review, Support, FMCSA integration, and more.
            Each service has its own router, models, and business logic. Database layer uses <strong>SQLAlchemy ORM</strong> with
            <strong> PostgreSQL</strong> for relational data and <strong>MongoDB</strong> for chat messages and real-time events.
            <strong> Alembic</strong> manages all migrations across 11 model files.
          </p>

          <p className="work-summary">
            The frontend is <strong>Next.js 15</strong> with <strong>Turbopack</strong> — 51,000+ TypeScript files across
            30+ major component folders. State management combines <strong>Redux Toolkit</strong> for global state and
            <strong> TanStack Query</strong> for server state. Real-time updates flow through <strong>Socket.io</strong>,
            and we use <strong>Radix UI</strong> with <strong>Tailwind CSS</strong> for a consistent design system.
          </p>

          <h3 className="work-subheading">AI Interview System</h3>
          <p className="work-summary">
            Built a real-time voice interview system using <strong>Google's Gemini Live API</strong>. Candidates speak directly
            to an AI interviewer with a custom voice personality called "Zephyr" — synthesized speech that sounds natural,
            not robotic. The system transcribes responses in real-time, analyzes them against job requirements, and generates
            structured scoring. This replaced hours of manual screening for recruiters. Integration required careful handling of
            <strong> WebRTC streams</strong>, audio chunking, and latency optimization to feel conversational.
          </p>

          <h3 className="work-subheading">Hunter AI Assistant</h3>
          <p className="work-summary">
            Developed an AI-powered support assistant using <strong>OpenAI's GPT models</strong> with <strong>retrieval-augmented generation (RAG)</strong>.
            The assistant has role-specific prompts — it behaves differently for employers vs. job seekers, understanding
            their context and needs. It handles document queries, answers platform questions, and guides users through
            complex workflows. This reduced support ticket volume by <strong>40%</strong> in the first quarter after launch.
          </p>

          <h3 className="work-subheading">Real-time Chat Microservice</h3>
          <p className="work-summary">
            Designed and built a standalone chat service — <strong>2,000+ Python files</strong> — handling all messaging for the platform.
            <strong> MongoDB</strong> stores conversations with <strong>Motor async driver</strong> for non-blocking operations.
            <strong> Socket.io</strong> manages real-time delivery with typing indicators, read receipts, and presence detection.
            Built-in support for <strong>WebRTC voice calls</strong>, file uploads to <strong>S3</strong>, message threading,
            and conversation folders (inbox, reviewing, interviewing, negotiating, pending, closed). Events stream through
            <strong> Kafka</strong> for distributed processing and analytics.
          </p>

          <h3 className="work-subheading">Fleet Management Telegram Bot</h3>
          <p className="work-summary">
            Created "HuntME Guard" — a Telegram bot integrated with <strong>Samsara telematics API</strong> for fleet management.
            Companies connect their vehicles and get real-time alerts: speeding, harsh braking, route deviations, maintenance reminders.
            Built with <strong>aiogram</strong> for async Telegram handling, <strong>aiohttp</strong> for webhook server, and
            <strong> Stripe</strong> for subscription billing. The bot has 73KB of menu logic alone — vehicle registration,
            driver assignment, analytics dashboards, alert configuration, all accessible through Telegram's interface.
            Deployed on <strong>AWS ECS Fargate</strong> with SSL webhooks.
          </p>

          <h3 className="work-subheading">Infrastructure & DevOps</h3>
          <p className="work-summary">
            Everything runs on <strong>AWS</strong> — S3 for file storage, ECS for containers, RDS for PostgreSQL.
            <strong> Docker</strong> containers for all services with <strong>CI/CD pipelines</strong> for automated deployment.
            <strong> Sentry</strong> integration for error tracking across all services. Payment processing through <strong>Stripe</strong>
            with subscription management, invoicing, and usage-based billing.
          </p>

          <h3 className="work-subheading">Team Leadership</h3>
          <p className="work-summary">
            Led a team of <strong>4 engineers</strong> using <strong>Agile methodology</strong> — sprint planning, daily standups,
            code reviews, and retrospectives. Introduced <strong>unit testing standards</strong> and established architectural
            patterns that the team follows. Made decisions on technology choices, reviewed all major PRs, and mentored
            junior developers on FastAPI patterns and React best practices.
          </p>

          <div className="work-tech">
            <span className="tech-tag">Next.js 15</span>
            <span className="tech-tag">FastAPI</span>
            <span className="tech-tag">PostgreSQL</span>
            <span className="tech-tag">MongoDB</span>
            <span className="tech-tag">Redis</span>
            <span className="tech-tag">OpenAI</span>
            <span className="tech-tag">Gemini</span>
            <span className="tech-tag">Socket.io</span>
            <span className="tech-tag">Kafka</span>
            <span className="tech-tag">AWS</span>
            <span className="tech-tag">Docker</span>
            <span className="tech-tag">Stripe</span>
            <span className="tech-tag">Samsara</span>
            <span className="tech-tag">Telegram</span>
          </div>
        </article>

        <div className="work-divider" />

        {/* SimplePrep */}
        <article className="work-item">
          <div className="work-header">
            <h2 className="work-title">SimplePrep</h2>
            <span className="work-meta">Co-Founder & Lead Engineer</span>
          </div>

          <p className="work-summary">
            Co-founded an adaptive SAT preparation platform that grew to <strong>500+ active students</strong>.
            The idea came from seeing students struggle with one-size-fits-all prep materials — we wanted to
            build something that actually adapts to how each student learns.
          </p>

          <p className="work-summary">
            The core innovation was our <strong>AI-powered adaptive learning system</strong>. We integrated
            <strong> GPT-4</strong> and <strong>Claude</strong> to analyze student responses, identify weak areas,
            and generate personalized practice questions. Not just random questions — the AI understood SAT
            question patterns and could create variations targeting specific skills a student needed to work on.
          </p>

          <h3 className="work-subheading">Technical Deep Dive</h3>
          <p className="work-summary">
            Built the backend with <strong>Django</strong> and <strong>Django REST Framework</strong>, running on
            <strong> PostgreSQL</strong>. The frontend was <strong>React</strong> with a custom component library.
            One major challenge was response latency — students expect instant feedback. I optimized database queries,
            implemented <strong>Redis caching</strong> for frequently accessed content, and restructured API endpoints
            to reduce round trips. Result: <strong>40% reduction in backend latency</strong>.
          </p>

          <p className="work-summary">
            Deployed on <strong>AWS</strong> with <strong>Docker</strong> containers. Set up proper staging and
            production environments, automated deployments, and monitoring. Handled the entire technical stack
            from infrastructure to frontend while my co-founder focused on content and student acquisition.
          </p>

          <h3 className="work-subheading">Product Features</h3>
          <p className="work-summary">
            Real-time analytics dashboard showing student progress, time spent per question type, accuracy trends.
            Digital SAT practice tests that mimic the actual testing experience. Explanations for every question
            generated by AI but reviewed for accuracy. Mobile-responsive design because students study on their phones.
          </p>

          <div className="work-tech">
            <span className="tech-tag">React</span>
            <span className="tech-tag">Django</span>
            <span className="tech-tag">PostgreSQL</span>
            <span className="tech-tag">Redis</span>
            <span className="tech-tag">Docker</span>
            <span className="tech-tag">AWS</span>
            <span className="tech-tag">GPT-4</span>
            <span className="tech-tag">Claude</span>
          </div>
        </article>

        <div className="work-divider" />

        {/* InterviewPrep Pro */}
        <article className="work-item">
          <div className="work-header">
            <h2 className="work-title">InterviewPrep Pro</h2>
            <span className="work-meta">
              Creator · <a href="https://github.com/Cognify-Hub/interviewpreppro" target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>
            </span>
          </div>

          <p className="work-summary">
            A voice-interactive technical interview simulator — you actually talk to an AI interviewer, and it
            responds with natural speech. This isn't text-based practice; it's designed to simulate the pressure
            and flow of a real interview.
          </p>

          <h3 className="work-subheading">How It Works</h3>
          <p className="work-summary">
            The pipeline: <strong>Speech-to-Text</strong> captures your answer → <strong>OpenAI</strong> processes
            the response with context about the role and question → <strong>ElevenLabs</strong> synthesizes the
            interviewer's follow-up question with realistic voice. The entire loop feels conversational because
            I optimized for latency at every step — streaming responses, pre-loading audio, and smart buffering.
          </p>

          <p className="work-summary">
            Added <strong>3D avatars</strong> using <strong>Three.js</strong> and <strong>React Three Fiber</strong>
            to make the experience more immersive. The avatar's lip movements sync with the generated speech,
            and subtle animations (nodding, expressions) make it feel like you're talking to someone, not a screen.
          </p>

          <h3 className="work-subheading">Structured Evaluation</h3>
          <p className="work-summary">
            Built a scoring system that evaluates responses across multiple dimensions: technical accuracy,
            communication clarity, problem-solving approach, and confidence indicators. After each session,
            you get detailed feedback — not just "good" or "bad" but specific suggestions for improvement.
            The LLM uses structured output to ensure consistent, actionable feedback.
          </p>

          <p className="work-summary">
            <strong>200,000+ lines of code</strong> across the project — frontend, backend services, evaluation
            harnesses, and testing infrastructure. This was a deep exploration of real-time AI interactions
            and what it takes to make them feel natural.
          </p>

          <div className="work-tech">
            <span className="tech-tag">Next.js</span>
            <span className="tech-tag">Three.js</span>
            <span className="tech-tag">React Three Fiber</span>
            <span className="tech-tag">ElevenLabs</span>
            <span className="tech-tag">OpenAI</span>
            <span className="tech-tag">WebRTC</span>
            <span className="tech-tag">TypeScript</span>
          </div>
        </article>
      </section>

      {/* Skills */}
      <section className="skills-section">
        <div className="section-label">Tech Stack</div>
        <div className="skills-list">
          <span className="skill highlight">Python</span>
          <span className="skill highlight">TypeScript</span>
          <span className="skill highlight">React</span>
          <span className="skill highlight">FastAPI</span>
          <span className="skill highlight">AWS</span>
          <span className="skill">Django</span>
          <span className="skill">Next.js</span>
          <span className="skill">PostgreSQL</span>
          <span className="skill">Redis</span>
          <span className="skill">Docker</span>
          <span className="skill">OpenAI</span>
          <span className="skill">Claude</span>
          <span className="skill">Gemini</span>
          <span className="skill">WebSockets</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>USF '25 — B.Sc. Cyber Security</span>
        <div className="social-links">
          <a href="https://github.com/alijon30" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com/in/alijonk" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="mailto:alijonkarimberdiev26@gmail.com">
            Email
          </a>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

export default App;
