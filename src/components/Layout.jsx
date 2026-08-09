import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

function Layout() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

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
        <Link to="/" className="logo">Alijon K.</Link>

        <nav className="header-nav" style={{ display: 'flex', gap: '24px' }}>
          <Link to="/" style={{
            color: location.pathname === '/' ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: location.pathname === '/' ? 700 : 500
          }}>Home</Link>
        </nav>

        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <Outlet context={{ theme }} />

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

export default Layout;
