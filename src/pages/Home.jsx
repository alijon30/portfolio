import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
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

const GITHUB_ACCOUNTS = [
    { username: 'alijon30', label: 'Personal' },
    { username: 'alijonk-30', label: 'Work' },
];

// Compact rail beside the case studies — chronology only. The narrative lives in the
// case studies, so entries here stay to title + dates and never restate their content.
const EXPERIENCE = [
    { title: "Software Engineer", company: "Datatruck, Inc.", date: "Feb 2026 — Now", current: true },
    { title: "Software Engineer Lead", company: "Stone Brothers Int'l", date: "Sep 2025 – Feb 2026" },
    { title: "Software Engineer Intern", company: "Stone Brothers Int'l", date: "May – Aug 2025" },
    { title: "Co-Founder", company: "SimplePrep", date: "May 2024 – Apr 2025" },
    { title: "Software Engineer Intern", company: "Radical X", date: "Sep – Dec 2023" },
    { title: "Student Software Developer", company: "USF Honors College", date: "Feb – Aug 2023" },
    { title: "Undergraduate Research Asst.", company: "USF EnCoDe Lab", date: "Jan – Jun 2023" }
];

// Consecutive roles at the same employer share one company heading.
const EXPERIENCE_GROUPS = EXPERIENCE.reduce((groups, role) => {
    const open = groups[groups.length - 1];
    if (open && open.company === role.company) {
        open.roles.push(role);
    } else {
        groups.push({ company: role.company, roles: [role] });
    }
    return groups;
}, []);

function Home() {
    // Layout owns the theme; the calendars need it because react-github-calendar
    // picks its own palette rather than inheriting CSS custom properties.
    const { theme } = useOutletContext() ?? {};
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Fixed experience rail — collapsed to dots, expands on hover */}
            {/* tabIndex makes the rail reachable by keyboard — :focus-within needs a
                focusable element, and nothing inside is interactive. */}
            <aside
                id="experience"
                className="xp-rail"
                aria-label="Experience timeline"
                tabIndex={0}
            >
                <div className="xp-rail-title">Experience</div>
                <ol className="xp-list">
                    <li className="xp-track" aria-hidden="true">
                        <span
                            className="xp-track-fill"
                            style={{ height: `${scrollProgress}%` }}
                        />
                    </li>
                    {EXPERIENCE_GROUPS.map((group) => (
                        <li className="xp-group" key={group.company}>
                            <span
                                className={`xp-dot${group.roles.some((r) => r.current) ? ' current' : ''}`}
                                aria-hidden="true"
                            />
                            <div className="xp-labels">
                                <div className="xp-company">{group.company}</div>
                                {group.roles.map((role) => (
                                    <div className="xp-role" key={`${role.title}-${role.date}`}>
                                        <span className="xp-title">{role.title}</span>
                                        <span className="xp-date">{role.date}</span>
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ol>
            </aside>

            <main className="main">
                {/* Left - Intro */}
                <div className="intro">
                    <h1 className="name">Alijon<br />Karimberdiev</h1>
                    <p className="title">
                        Software Engineer <span>— Full Stack & Agentic AI</span>
                    </p>
                    <p className="bio">
                        Software engineer at Datatruck, leading agentic AI, safety, and migration
                        initiatives across 28+ engineers. I shipped the multi-agent system that took
                        first-pass support triage off 40+ engineers — 91% verified accuracy, 600+
                        engineering hours returned — and rebuilt dispatcher payroll end to end.
                        Previously led engineering on a logistics platform used by 500+ companies
                        and 30,000+ users.
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
                        <div className="card-label">Leadership</div>
                        <div className="stat-value">28+</div>
                        <div className="stat-label">engineers led across 3 teams</div>
                    </div>
                    <div className="info-card">
                        <div className="card-label">AI Systems</div>
                        <div className="stat-value">4</div>
                        <div className="stat-label">production agents shipped</div>
                    </div>
                    <div className="info-card">
                        <div className="card-label">Efficiency</div>
                        <div className="stat-value">600+</div>
                        <div className="stat-label">engineering hours saved</div>
                    </div>
                    <div className="info-card">
                        <div className="card-label">Scale</div>
                        <div className="stat-value">1M+</div>
                        <div className="stat-label">lines of code shipped</div>
                    </div>
                </div>
            </main>

            {/* GitHub Activity & Tech Stack */}
            <section className="github-section">
                <div className="section-label">GitHub Activity & Tech Stack</div>
                <div className="github-tech-row">
                    <div className="github-calendar-wrapper">
                        {GITHUB_ACCOUNTS.map(({ username, label }) => (
                            <div className="github-account" key={username}>
                                <div className="github-account-header">
                                    <span className="github-account-label">{label}</span>
                                    <span className="github-account-name">@{username}</span>
                                </div>
                                <GitHubCalendar
                                    username={username}
                                    colorScheme={theme === 'light' ? 'light' : 'dark'}
                                    blockSize={12}
                                    blockMargin={4}
                                    fontSize={14}
                                />
                                <a
                                    href={`https://github.com/${username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="github-link"
                                >
                                    View @{username} on GitHub
                                </a>
                            </div>
                        ))}
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
                <div className="section-label">Professional Experience</div>

                {/* Datatruck */}
                <article className="work-item">
                    <div className="work-header">
                        <h2 className="work-title">Datatruck TMS</h2>
                        <span className="work-meta">Software Engineer · Datatruck, Inc.</span>
                    </div>

                    <p className="work-summary">
                        Datatruck's TMS is what trucking companies run their business on — dispatch, settlements,
                        compliance, payroll. I joined in February 2026 and now lead three initiatives across
                        <strong> 28+ engineers</strong> — agentic AI, safety, and client migrations — while still
                        shipping in the core product.
                    </p>

                    <h3 className="work-subheading">Owning the Surface That Pays People</h3>
                    <p className="work-summary">
                        I rebuilt dispatcher payroll end to end. It is the one surface where a bug doesn't produce an
                        error page — it pays someone the wrong amount, and they notice. Settlements aggregate a
                        dispatcher's trips across a pay period, apply percentage-based and fixed pay structures, layer
                        on one-time charges and recurring deductions, and generate the statement that goes out.
                    </p>

                    <p className="work-summary">
                        Shipping v2 meant owning the entire vertical slice at once — <strong>Django REST Framework</strong>
                        and <strong>PostgreSQL</strong> underneath, <strong>React</strong> and <strong>TypeScript</strong>
                        above — and the difficulty was never the happy path. It was year-to-date figures that must count
                        only settled earnings, fractional quantities that cannot lose precision on the way into a PDF, and
                        cached statements that must regenerate the instant an unposted settlement changes. Correctness
                        here <em>is</em> the product.
                    </p>

                    <p className="work-summary">
                        I also made the platform survive its most fragile dependency. Client signup and broker search both
                        call the federal <strong>FMCSA</strong> API; when it goes down, onboarding stops dead. I put a
                        mirror behind it with automatic failover — an outage in a government service stopped being an
                        outage in our product.
                    </p>

                    <h3 className="work-subheading">Taking Triage Off Engineers Entirely</h3>
                    <p className="work-summary">
                        Every support ticket used to begin with an engineer abandoning their own work to dig — reading
                        logs, running database lookups, tracing code across repositories. I replaced that first pass with
                        a multi-agent system I designed and shipped — <strong>four specialised agents</strong> sharing one
                        harness that enforces what each is allowed to touch. It is now the
                        default first step for on-call and customer requests across <strong>40+ engineers</strong>: what
                        took <strong>hours</strong> takes <strong>minutes</strong>, and at even one hour saved per
                        investigation that is <strong>600+ engineering hours</strong> returned to building.
                    </p>

                    <p className="work-summary">
                        <strong>Atlas</strong> (Agent) investigates and posts a written root-cause diagnosis into the thread
                        before a human opens it, in about <strong>5 minutes</strong>. Across
                        <strong> 604 investigations</strong> it lands correct or partly correct on <strong>91%</strong> of
                        the answers a developer independently verified — up from <strong>55%</strong> on the
                        first-generation agent I built before it. I scored both against the same rubric, which is how I
                        knew the first one needed replacing rather than tuning. Its own sign-off never counts toward that
                        score; only a human confirming it in the thread does. <strong>Vulcan</strong> (Agent) turns approved tickets into draft pull requests and shepherds
                        them through CI and review. <strong>Mercury</strong> (Agent) serves <strong>20+ customer success
                        specialists, product managers and support staff</strong> who need product answers without pulling
                        an engineer off their work. <strong>Falcon</strong> (Agent) runs personal ops — queues, briefs, watches.
                    </p>

                    <p className="work-summary">
                        The engineering that matters here is not the prompts. Prompts shape behaviour but cannot guarantee
                        it, so every hard rule lives in the harness — code the model cannot reach. Atlas has no write
                        tools at all and its SQL is gated read-only. Vulcan can only push through the harness, draft mode
                        hardcoded, no merge rights. Falcon proposes; a human click executes. That separation is what makes
                        these safe to leave running against production.
                    </p>

                    <p className="work-summary">
                        They have surfaced <strong>57 tracked defects</strong>, including revenue leaks nobody had
                        reported — a tariff quietly paying $0 per mile from a duplicate zero-value price row, a fuel sync
                        double-counting because <em>"Diesel"</em> and <em>"Diésel"</em> were treated as different
                        products. Tickets come out better scoped too: each opens with a root cause and an impact
                        assessment instead of a symptom. Daily throughput is up <strong>64%</strong> while the error rate
                        fell, and the whole system runs for roughly <strong>$100 a month</strong>.
                    </p>

                    <h3 className="work-subheading">A Second Front Door for Agents</h3>
                    <p className="work-summary">
                        Agentic clients needed programmatic access to TMS data, and every existing entrance was wrong for
                        them: the REST API is shaped around the human frontend, raw SQL bypasses every business
                        invariant, and the partner API has neither the right surface nor the right auth. I authored the
                        architecture decision and am building the answer — an <strong>MCP server</strong> as a second
                        front door beside the REST API, both of them thin adapters over the same service layer, so
                        permission scoping and write validation live in exactly one place and the two doors cannot drift
                        apart.
                    </p>

                    <p className="work-summary">
                        The decisions that matter here are the ones about trust. Tenancy is schema-per-tenant, so the
                        tenant is resolved <em>only</em> from validated token claims and never from a tool argument — an
                        agent cannot reach another company's data by passing a different id. Auth is
                        <strong> OAuth 2.1</strong> resource-server validation against the existing identity pool on
                        every request, with read and write as separate scopes: an invalid token gets 401, a valid token
                        without the right scope gets 403. Read tools return explicit allowlist DTOs guarded by snapshot
                        tests, so a new database column can never silently start leaking to an agent, and write tools
                        carry accurate destructive annotations so a client knows when to ask a human first.
                    </p>

                    <p className="work-summary">
                        The read vertical is built and unit-tested; write tools and server assembly are in progress.
                    </p>

                    <h3 className="work-subheading">Raising the Floor for 20+ Engineers</h3>
                    <p className="work-summary">
                        Getting a team to use AI coding tools well is a different problem from using them well yourself.
                        I lead Datatruck's agentic AI initiative and built the two toolkits behind it — one for the
                        backend monolith, one for the frontend — so good practice is the default rather than something
                        each engineer rediscovers alone: <strong>30+ invokable skills</strong> for the workflows people
                        repeat, <strong>14 specialised review subagents</strong> spanning architecture, migrations,
                        performance and accessibility, <strong>28 automation hooks</strong>, and
                        <strong> 26 path-scoped rule files</strong> the agent reads on its own, so the right guidance
                        arrives without anyone remembering to ask for it. Both ship as drop-in configs with MCP servers
                        wired up and a 30-minute walkthrough from clone to working setup.
                    </p>

                    <h3 className="work-subheading">Making Enterprise Onboarding Survivable</h3>
                    <p className="work-summary">
                        Every new enterprise client arrives with years of operational history locked inside a
                        competitor's system, and the migration is the part of the deal most likely to break it. I lead
                        the squad that builds those pipelines — extracting drivers, trucks, trailers and loads from a
                        legacy TMS, matching records across schemas that disagree about nearly everything, and reporting
                        exactly what will and will not migrate before a single row is written.
                    </p>

                    <p className="work-summary">
                        Fuzzy matching on human-entered names and unit numbers is where this gets real: an unmatched
                        driver means a person's records vanish at cutover, so the matchers carry their own test suites.
                        One recent migration moved <strong>2,000+ driver documents</strong> into production.
                    </p>

                    <div className="work-tech">
                        <span className="tech-tag">Python</span>
                        <span className="tech-tag">Django</span>
                        <span className="tech-tag">DRF</span>
                        <span className="tech-tag">PostgreSQL</span>
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">Mantine</span>
                        <span className="tech-tag">Claude</span>
                        <span className="tech-tag">Slack Bolt</span>
                        <span className="tech-tag">Inngest</span>
                        <span className="tech-tag">MCP</span>
                        <span className="tech-tag">OAuth 2.1</span>
                        <span className="tech-tag">OpenAPI</span>
                        <span className="tech-tag">AWS</span>
                        <span className="tech-tag">Docker</span>
                    </div>
                </article>

                <div className="work-divider" />
                {/* HuntME */}
                <article className="work-item">
                    <div className="work-header">
                        <h2 className="work-title">HuntME Platform</h2>
                        <span className="work-meta">Software Engineer Lead · Stone Brothers International</span>
                    </div>

                    <p className="work-summary">
                        I led HuntME from an empty repository to the system <strong>500+ logistics companies</strong> now
                        run their hiring on. It connects truck drivers with carriers across the USA and CIS, and it grew
                        into seven interconnected products sharing <strong>24 backend services</strong>. Today it carries
                        <strong> 31,000+ registered users</strong> and has facilitated
                        <strong> 10,000+ job placements</strong> — a new posting draws
                        <strong> 200+ applications within 48 hours</strong>.
                    </p>

                    <h3 className="work-subheading">Replacing the Screening Call</h3>
                    <p className="work-summary">
                        Recruiters were spending hours a week on first-round phone screens that mostly confirmed what a
                        résumé already said. I built a real-time voice interview system on <strong>Google's Gemini Live
                        API</strong> that holds the conversation instead: candidates speak to an interviewer with a
                        custom voice persona, and the system transcribes live, evaluates answers against the job's
                        requirements, and returns structured scoring. Making it feel like a conversation rather than a
                        form was the hard part — <strong>WebRTC</strong> stream handling, audio chunking, and a latency
                        budget tight enough that the pauses land where a human would put them.
                    </p>

                    <h3 className="work-subheading">Cutting Support Volume by 40%</h3>
                    <p className="work-summary">
                        Support was fielding the same platform questions over and over, from two audiences who needed
                        opposite answers. I shipped a <strong>RAG</strong>-backed assistant on <strong>OpenAI</strong>
                        models with role-aware prompting, so an employer and a job seeker asking the same question each
                        get the answer their side actually needs. It handles document queries and walks users through the
                        multi-step flows that generated the most tickets. Ticket volume fell
                        <strong> 40% in the first quarter</strong> after launch.
                    </p>

                    <h3 className="work-subheading">Seven Products on One Spine</h3>
                    <p className="work-summary">
                        The architecture had to let seven products share one platform without fusing into a single
                        untouchable lump. <strong>FastAPI</strong> backs 24 service modules — jobs, offers, employment,
                        interviews, payments, notifications, FMCSA compliance — each with its own router, models and
                        business logic, over <strong>PostgreSQL</strong> via <strong>SQLAlchemy</strong>, with
                        <strong> MongoDB</strong> for chat and real-time events. The frontend is
                        <strong> Next.js 15</strong>, deliberately splitting global state in
                        <strong> Redux Toolkit</strong> from server state in <strong>TanStack Query</strong>, with
                        <strong> Socket.io</strong> carrying live updates.
                    </p>

                    <p className="work-summary">
                        Messaging runs as its own service rather than a feature bolted onto the monolith —
                        <strong> MongoDB</strong> with an async driver, <strong>Socket.io</strong> for delivery, presence
                        and read receipts, <strong>WebRTC</strong> voice calls, and <strong>Kafka</strong> streaming
                        events out for analytics. Separately, a <strong>Telegram</strong> bot wired to the
                        <strong> Samsara</strong> telematics API gives carriers real-time fleet alerts — speeding, harsh
                        braking, route deviation, maintenance — with <strong>Stripe</strong> subscriptions behind it.
                        Telegram because that is where these operators already work; a dashboard they had to remember to
                        open would have gone unread.
                    </p>

                    <h3 className="work-subheading">Building the Team's Engineering Practice</h3>
                    <p className="work-summary">
                        I led <strong>4 engineers</strong> and owned the decisions that outlast any single feature —
                        technology choices, architectural patterns, and the review bar. I introduced unit testing
                        standards where there had been none, reviewed every major pull request, and mentored junior
                        developers on the FastAPI and React patterns the team still builds against.
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
                        <span className="work-meta">Co-Founder &amp; Lead Engineer</span>
                    </div>

                    <p className="work-summary">
                        I co-founded SimplePrep and took it from an idea to <strong>500+ active students</strong> as its
                        only engineer. Prep books waste a student's scarcest resource on questions they can already
                        answer; the bet was that software could spend that time better.
                    </p>

                    <h3 className="work-subheading">Teaching to the Weak Spot</h3>
                    <p className="work-summary">
                        I integrated <strong>GPT-4o</strong> and <strong>Claude</strong> to read a student's answers,
                        infer which skills were actually failing, and generate practice aimed there. The distinction that
                        mattered was between random questions and targeted ones — the system modelled SAT question
                        patterns closely enough to produce genuine variations of a specific skill, so a student who kept
                        missing a particular inference type got more of that, not more of everything.
                    </p>

                    <h3 className="work-subheading">Making It Feel Instant</h3>
                    <p className="work-summary">
                        Students abandon a study tool that stalls, so latency was a retention problem before it was an
                        engineering one. I cut backend response time <strong>40%</strong> — restructuring API endpoints
                        to kill round trips, optimising <strong>PostgreSQL</strong> queries, and adding
                        <strong> Redis</strong> caching for the content served on every session — on a
                        <strong> Django</strong> and <strong>DRF</strong> backend deployed to <strong>AWS</strong> with
                        <strong> Docker</strong> across real staging and production environments.
                    </p>

                    <p className="work-summary">
                        I owned the entire technical stack while my co-founder ran content and acquisition: the
                        <strong> Stripe</strong> billing with role-based access and feature gating, the analytics
                        students used to see their own progress, and the page-speed and SEO work that grew organic
                        traffic <strong>3x</strong>.
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
                        <span className="work-meta">Creator · Personal Project</span>
                    </div>

                    <p className="work-summary">
                        A voice-interactive technical interview simulator: you talk, it answers in natural speech, and it
                        pushes back. Text-based practice rehearses the answers but not the thing that actually makes
                        interviews hard — reasoning out loud, under time pressure, with someone waiting on you.
                    </p>

                    <h3 className="work-subheading">Closing the Latency Loop</h3>
                    <p className="work-summary">
                        The pipeline is <strong>speech-to-text</strong> → <strong>OpenAI</strong> →
                        <strong> ElevenLabs</strong>, and chained naively it feels like a walkie-talkie: every hop waits
                        for the last one to finish, and the dead air breaks the illusion instantly. Making it
                        conversational meant attacking each stage — streaming model output rather than waiting for a
                        complete response, pre-loading and buffering audio, and overlapping synthesis with generation, so
                        the reply begins while the rest is still being written.
                    </p>

                    <p className="work-summary">
                        A <strong>Three.js</strong> and <strong>React Three Fiber</strong> avatar sits on top, with lip
                        movement synced to the generated speech and small idle motions — nodding, shifts of expression.
                        It sounds cosmetic and isn't: a still image during the pause before an answer reads as a frozen
                        program, and the pressure the tool exists to simulate evaporates.
                    </p>

                    <h3 className="work-subheading">Feedback Worth Reading</h3>
                    <p className="work-summary">
                        Scoring runs across four dimensions — technical accuracy, communication clarity, problem-solving
                        approach, and confidence indicators — through structured model output, so the result is
                        consistent between sessions instead of a differently-worded "good job" each time. Retrieval-
                        augmented guidance supplies role-specific and best-practice context, and red-team style follow-up
                        questions probe whether an answer holds up under a second push or was memorised.
                    </p>

                    <p className="work-summary">
                        Model outputs and user responses are logged to build evaluation and fine-tuning datasets, which
                        is what turns "the answers seem good" into something measurable. That was the real subject of the
                        project: what it takes to make a real-time AI interaction feel natural, and how you would ever
                        know whether it does.
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
        </>
    );
}

export default Home;
