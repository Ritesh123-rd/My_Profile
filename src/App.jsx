import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Github, Terminal, Menu, X, Send, ArrowUpRight,
  Code2, Smartphone, Server, Database, Layers, Activity,
  MapPin, Calendar, Cpu, Globe, Zap
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════ */

function useTypewriter(text, speed = 45, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let t;
    const start = setTimeout(() => {
      let i = 0;
      t = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(t); setDone(true); }
      }, speed);
    }, delay);
    return () => { clearTimeout(start); clearInterval(t); };
  }, [text, speed, delay]);
  return { displayed, done };
}

/* Live uptime since page load */
function UptimeStat() {
  const [elapsed, setElapsed] = useState(0);
  const start = useRef(Date.now());
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');
  return <span style={{ color: 'var(--primary)', fontWeight: 700, textShadow: 'var(--glow-sm)' }}>{h}:{m}:{s}</span>;
}

function AsciiDivider({ char = '─', label }) {
  const fill = char.repeat(20);
  return (
    <div className="ascii-divider">
      {label
        ? `${fill}[ ${label} ]${fill}`
        : char.repeat(60)}
    </div>
  );
}

function ProgressBar({ label, pct }) {
  const filled = Math.round(pct / 5);
  const empty  = 20 - filled;
  return (
    <div className="progress-bar" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ minWidth: 180, color: 'var(--t2)' }}>{label}</span>
      <span style={{ color: 'var(--primary)', textShadow: 'var(--glow-sm)' }}>
        [{'█'.repeat(filled)}{'░'.repeat(empty)}]
      </span>
      <span style={{ color: 'var(--secondary)' }}>{pct}%</span>
    </div>
  );
}

function TermWindow({ title, status = 'OK', children, style = {} }) {
  return (
    <div className="term-window" style={style}>
      <div className="term-titlebar">
        <span>+--- {title} ---+</span>
        <span className={status === 'OK' ? 'status-ok' : 'status-err'}>[{status}]</span>
      </div>
      <div className="term-body">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ASCII LOGO
═══════════════════════════════════════════════════════ */
const ASCII_LOGO = `
 ██████╗ ██╗████████╗███████╗███████╗██╗  ██╗
 ██╔══██╗██║╚══██╔══╝██╔════╝██╔════╝██║  ██║
 ██████╔╝██║   ██║   █████╗  ███████╗███████║
 ██╔══██╗██║   ██║   ██╔══╝  ╚════██║██╔══██║
 ██║  ██║██║   ██║   ███████╗███████║██║  ██║
 ╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝`;

/* ═══════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: '--about',      href: '#about' },
    { label: '--skills',     href: '#skills' },
    { label: '--projects',   href: '#projects' },
    { label: '--experience', href: '#experience' },
    { label: '--contact',    href: '#contact' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: scrolled ? 10 : 0, left: 0, right: 0, zIndex: 200,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: 'var(--font)',
      pointerEvents: 'none'
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        pointerEvents: 'auto'
      }}>
        <div className="term-window" style={{ 
          background: scrolled ? 'rgba(10,10,10,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px var(--border)' : 'none',
          border: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}>
          <div className="term-titlebar" style={{ padding: '4px 12px', background: scrolled ? 'var(--border)' : 'transparent' }}>
             <a href="#" style={{
              fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.12em',
              color: scrolled ? '#000' : 'var(--primary)', textShadow: scrolled ? 'none' : 'var(--glow)', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Terminal size={14} />
              <span>~/ritesh_os<span style={{opacity: 0.5}}>.sys</span></span>
            </a>
            <div style={{ display: 'flex', gap: 8 }}>
               <span style={{ fontSize: '0.7rem', color: scrolled ? '#000' : 'var(--dim)' }}>[ CTRL+K ]</span>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 16px', height: scrolled ? 40 : 60,
            transition: 'height 0.3s ease'
          }}>
            {/* Desktop Links */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }} className="nav-desktop">
              {links.map(l => (
                <a key={l.href} href={l.href} style={{
                  fontSize: '0.72rem', color: 'var(--t3)', fontWeight: 600,
                  letterSpacing: '0.06em', padding: '4px 8px',
                  transition: 'all 0.15s', textDecoration: 'none', textTransform: 'uppercase'
                }}
                  onMouseEnter={e => { e.target.style.color = 'var(--primary)'; e.target.style.textShadow = 'var(--glow-sm)'; }}
                  onMouseLeave={e => { e.target.style.color = 'var(--t3)'; e.target.style.textShadow = ''; }}
                >{l.label}</a>
              ))}
            </div>

            {/* Hamburger */}
            <button onClick={() => setOpen(!open)} style={{
              display: 'none', background: 'none', border: '1px solid var(--border)',
              color: 'var(--primary)', cursor: 'pointer', padding: '4px 8px', fontSize: '0.7rem'
            }} className="nav-toggle">
              {open ? 'CLOSE' : 'MENU'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 180, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, height: '100vh', width: 280,
                background: 'var(--bg)', borderLeft: '1px solid var(--border)',
                padding: '80px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8,
                zIndex: 190
              }}
            >
              <div style={{ color: 'var(--dim)', fontSize: '0.7rem', marginBottom: 12 }}>SYSTEM_MENU v1.0</div>
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="btn-term"
                  style={{ fontSize: '0.8rem', width: '100%', justifyContent: 'flex-start' }}>
                  <span style={{ opacity: 0.5 }}>$&gt; </span> {l.label}
                </a>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-toggle  { display: block !important; }
        }
      `}</style>
    </nav>
  );
}


/* ═══════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════ */
function Hero() {
  const line1 = useTypewriter('RITESH RAM DHEBE', 60, 300);
  const line2 = useTypewriter('Full Stack Developer', 50, 1400);
  const line3 = useTypewriter('Building scalable web systems with React, Node.js, Spring Boot & Cloud.', 28, 2600);

  return (
    <section id="home" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '120px 24px 80px',
      position: 'relative', zIndex: 1, overflow: 'clip'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* System Status Header */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ marginBottom: 32, display: 'flex', gap: 16, fontSize: '0.7rem', color: 'var(--dim)' }}
        >
          <div style={{ border: '1px solid var(--dim)', padding: '2px 8px' }}>SESSION: ACTIVE</div>
          <div style={{ border: '1px solid var(--dim)', padding: '2px 8px' }}>OS: RITESH_V3</div>
          <div style={{ border: '1px solid var(--dim)', padding: '2px 8px' }}>IP: 127.0.0.1</div>
        </motion.div>

        {/* ASCII Logo */}
        <motion.pre
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
          style={{
            color: 'var(--primary)', fontSize: 'clamp(4px, 1.1vw, 12px)',
            lineHeight: 1.2, marginBottom: 48, textShadow: 'var(--glow)',
            userSelect: 'none', background: 'rgba(51,255,0,0.03)', padding: '20px',
            borderLeft: '2px solid var(--primary)', overflow: 'auto'
          }}
          className="hero-pre"
        >
          {ASCII_LOGO}
        </motion.pre>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--secondary)', fontWeight: 800 }}>&gt; LOGIN:</span>
            <h1 style={{
              fontSize: 'clamp(2rem, 6vw, 4.5rem)',
              color: 'var(--primary)',
              letterSpacing: '-0.02em',
              fontWeight: 900,
              textTransform: 'uppercase',
              textShadow: 'var(--glow-sm)',
              fontFamily: 'var(--font)'
            }}>
              {line1.displayed}<span className="cursor">_</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--secondary)', fontWeight: 800 }}>&gt; ROLE: </span>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
              color: 'var(--secondary)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {line2.displayed}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 12 }}>
             <span style={{ color: 'var(--secondary)', fontWeight: 800 }}>&gt; DESC: </span>
             <p style={{
              fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)',
              color: 'var(--t3)',
              maxWidth: '600px',
              lineHeight: 1.6,
              letterSpacing: '0.02em'
            }}>
              {line3.displayed}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.5 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}
        >
          <a href="#projects" className="btn-term" id="cta-projects">
            EXECUTE --projects
          </a>
          <a href="#contact" className="btn-term btn-amber" id="cta-contact" style={{ boxShadow: '0 0 20px rgba(255,176,0,0.2)' }}>
            ./contact.sh --now
          </a>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6, duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: 16, maxWidth: 800
          }}
        >
          {[
            { key: 'experience', val: '2+ years' },
            { key: 'projects',   val: '15+ built' },
            { key: 'tech_stack', val: '12+ tools' },
            { key: 'session_uptime', val: null },
          ].map((s, i) => (
            <div key={i} style={{
              border: '1px solid var(--border)', padding: '16px',
              background: 'rgba(51,255,0,0.02)', position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: 4, background: 'var(--primary)' }} />
              <div style={{ color: 'var(--dim)', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 4 }}>{s.key}:</div>
              {s.val !== null
                ? <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>{s.val}</div>
                : <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}><UptimeStat /></div>
              }
            </div>
          ))}
        </motion.div>
      </div>

      <AsciiDivider char="─" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION WRAPPER
═══════════════════════════════════════════════════════ */
function Section({ id, title, cmd, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0, 1, 1, 0.8]);

  return (
    <motion.section
      ref={ref} id={id}
      style={{ padding: '100px 24px', position: 'relative', zIndex: 1, opacity }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}
        >
          <div style={{ color: 'var(--secondary)', fontSize: '0.78rem', marginBottom: 8 }}>
            root@portfolio:~$ {cmd}
          </div>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
            color: 'var(--primary)', textShadow: 'var(--glow)',
            letterSpacing: '0.1em', marginBottom: 16
          }}>
            {title}
          </h2>
          <AsciiDivider label={id.toUpperCase()} />
        </motion.div>

        {children}
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════════ */
function About() {
  return (
    <Section id="about" title="ABOUT.TXT" cmd="cat about.txt">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <TermWindow title="PROFILE" status="OK" style={{ maxWidth: 760 }}>
          <div style={{ fontSize: '0.87rem', lineHeight: 2, color: 'var(--t2)' }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: 'var(--primary)' }}>NAME</span>
              <span style={{ color: 'var(--dim)' }}>……… </span>
              Ritesh Ram Dhebe
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: 'var(--primary)' }}>ROLE</span>
              <span style={{ color: 'var(--dim)' }}>……… </span>
              Full Stack Developer
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: 'var(--primary)' }}>LOCATION</span>
              <span style={{ color: 'var(--dim)' }}>…… </span>
              Pune, India
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: 'var(--primary)' }}>STATUS</span>
              <span style={{ color: 'var(--dim)' }}>……… </span>
              <span className="status-ok">[OPEN TO OPPORTUNITIES]</span>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed var(--dim)', paddingTop: 20, marginTop: 8 }}>
            <div style={{ color: 'var(--secondary)', fontSize: '0.78rem', marginBottom: 10 }}>$ cat bio.md</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--t2)', lineHeight: 1.9 }}>
              Full Stack Developer with <span style={{ color: 'var(--primary)' }}>2+ years</span> of experience
              building scalable web architectures using <span style={{ color: 'var(--primary)' }}>React.js</span>,{' '}
              <span style={{ color: 'var(--primary)' }}>Node.js</span>, and{' '}
              <span style={{ color: 'var(--primary)' }}>Java Spring Boot</span>. Passionate about clean code,
              performance optimization, and seamless user experiences. Currently focused on enterprise software
              development and real-time systems at <span style={{ color: 'var(--secondary)' }}>Crystal Web, Pune</span>.
            </p>
          </div>
        </TermWindow>
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════
   SKILLS
═══════════════════════════════════════════════════════ */
function Skills() {
  const techBars = [
    { label: 'React.js / Next.js',      pct: 90 },
    { label: 'Java / Spring Boot',       pct: 80 },
    { label: 'Node.js / Express.js',    pct: 85 },
    { label: 'MongoDB / PostgreSQL',     pct: 82 },
    { label: 'Docker / AWS',            pct: 75 },
    { label: 'WebSockets / Redis',      pct: 78 },
    { label: 'TypeScript',              pct: 80 },
    { label: 'Linux / Shell / DevOps',  pct: 72 },
  ];

  const skillCards = [
    { icon: Smartphone, name: 'FRONTEND DEV',    desc: 'React.js, Next.js, TypeScript, responsive UI, modern CSS', color: '#33ff00' },
    { icon: Server,     name: 'BACKEND DEV',     desc: 'Node.js, Express.js, Java Spring Boot, REST APIs, GraphQL', color: '#ffb000' },
    { icon: Database,   name: 'DATABASE',        desc: 'MongoDB, MySQL, Redis, PostgreSQL — modeling & tuning',    color: '#33ff00' },
    { icon: Terminal,   name: 'DEVOPS & CLOUD',  desc: 'Docker, AWS, CI/CD pipelines, Linux server management',   color: '#ffb000' },
    { icon: Layers,     name: 'ARCHITECTURE',    desc: 'Spring MVC, event-driven systems, microservices, API design', color: '#33ff00' },
    { icon: Activity,   name: 'REAL-TIME',       desc: 'WebSockets, high concurrency, gaming platforms, streams', color: '#ffb000' },
  ];

  return (
    <Section id="skills" title="SKILLS.SH --list-all" cmd="./skills.sh --verbose">

      {/* Progress bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 36 }}
      >
        <TermWindow title="PROFICIENCY_MATRIX" status="OK">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {techBars.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <ProgressBar label={b.label} pct={b.pct} />
              </motion.div>
            ))}
          </div>
        </TermWindow>
      </motion.div>

      {/* Skill cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16
      }}>
        {skillCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ borderColor: s.color }}
            style={{
              border: '1px solid var(--border)', padding: '20px 22px',
              background: 'var(--bg)', position: 'relative', overflow: 'hidden',
              cursor: 'default', transition: 'border-color 0.2s'
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: s.color, opacity: 0.5
            }} />
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <s.icon size={18} style={{ color: s.color, flexShrink: 0, marginTop: 2, filter: `drop-shadow(0 0 4px ${s.color})` }} />
              <div>
                <div style={{
                  fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em',
                  color: s.color, textShadow: `0 0 6px ${s.color}80`, marginBottom: 6
                }}>{s.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--t3)', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════════════ */
function Projects() {
  const projects = [
    {
      id: 'proj_01',
      title: 'Dynamic Web & Mobile Apps',
      desc: 'Responsive client websites and scalable mobile applications with modern frameworks, performance optimization, and seamless UX across all devices.',
      tech: ['React.js', 'Node.js', 'Express.js', 'REST APIs'],
      status: 'DEPLOYED',
      color: '#33ff00'
    },
    {
      id: 'proj_02',
      title: 'Enterprise Software Solutions',
      desc: 'Core business workflows for CRM and LMS platforms with role-based access control, real-time analytics dashboards, and comprehensive admin panels.',
      tech: ['MongoDB', 'Node.js', 'React', 'Docker'],
      status: 'DEPLOYED',
      color: '#ffb000'
    },
    {
      id: 'proj_03',
      title: 'Multiplayer Gaming Platforms',
      desc: 'Real-time probability and skill-based gaming architectures with high concurrency, low-latency communication, and robust security measures.',
      tech: ['WebSockets', 'Node.js', 'Linux', 'Redis'],
      status: 'RUNNING',
      color: '#33ff00'
    },
  ];

  return (
    <Section id="projects" title="PROJECTS --show-all" cmd="ls -la ./projects/">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ borderColor: p.color }}
            style={{
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              transition: 'border-color 0.2s',
              overflow: 'hidden'
            }}
          >
            {/* Title bar */}
            <div style={{
              background: p.color, padding: '8px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ color: '#000', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                {p.id}.exe
              </span>
              <span style={{ color: '#000', fontSize: '0.72rem', fontWeight: 700 }}>
                [{p.status}]
              </span>
            </div>

            <div style={{ padding: '22px 20px' }}>
              <div style={{ color: 'var(--secondary)', fontSize: '0.72rem', marginBottom: 6 }}>
                $ cat {p.id}/README.md
              </div>
              <h3 style={{
                fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--primary)',
                textShadow: 'var(--glow-sm)', marginBottom: 12
              }}>{p.title}</h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--t3)', lineHeight: 1.75, marginBottom: 18 }}>
                {p.desc}
              </p>

              {/* Tech tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.tech.map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPERIENCE
═══════════════════════════════════════════════════════ */
function Experience() {
  const items = [
    {
      date: 'Apr 2024 — Present',
      title: 'Full Stack Developer',
      company: 'Crystal Web, Pune',
      desc: 'Building scalable web applications and enterprise solutions using React.js, Node.js, and Java Spring Boot. Leading architecture decisions for real-time systems, REST API design, and cloud infrastructure. Implementing CI/CD pipelines and DevOps best practices.',
      status: 'ACTIVE'
    },
    {
      date: '2018 — 2022',
      title: 'BSc Computer Science',
      company: 'TJ College Khadki, Pune University',
      desc: 'Computer science fundamentals — data structures, algorithms, databases, operating systems, and software engineering. Completed capstone projects in web development.',
      status: 'COMPLETED'
    },
  ];

  return (
    <Section id="experience" title="EXPERIENCE.LOG" cmd="cat experience.log | grep -v empty">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            <TermWindow
              title={`RECORD_${String(i + 1).padStart(2, '0')}`}
              status={it.status === 'ACTIVE' ? 'OK' : 'DONE'}
            >
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ minWidth: 160, flexShrink: 0 }}>
                  <div style={{ color: 'var(--dim)', fontSize: '0.72rem', marginBottom: 4 }}>TIMESTAMP</div>
                  <div style={{ color: 'var(--secondary)', fontSize: '0.82rem', fontWeight: 600 }}>{it.date}</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 800, marginBottom: 4, textShadow: 'var(--glow-sm)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {it.title}
                  </div>
                  <div style={{ color: 'var(--secondary)', fontSize: '0.8rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={12} /> {it.company}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--t3)', lineHeight: 1.8 }}>{it.desc}</p>
                </div>
              </div>
            </TermWindow>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════ */
function Contact() {
  return (
    <Section id="contact" title="CONTACT.SH" cmd="./contact.sh --init-session">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 640 }}
      >
        <TermWindow title="COMM_CHANNEL" status="OK">
          <div style={{ color: 'var(--t3)', fontSize: '0.87rem', lineHeight: 1.9, marginBottom: 28 }}>
            <div style={{ color: 'var(--secondary)', marginBottom: 8 }}>$ ping ritesh --message</div>
            <p>
              Interested in working together? Whether you have a project in mind or just want to chat,
              feel free to reach out via the channels below.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href="https://wa.me/919552115645?text=Hi%20Ritesh,%20I%20have%20an%20inquiry%20regarding%20a%20project."
              target="_blank" rel="noreferrer"
              className="btn-term btn-amber"
              id="contact-whatsapp"
              style={{ justifyContent: 'center' }}
            >
              <Send size={15} /> WhatsApp Inquiry
            </a>

            <a
              href="https://github.com/Ritesh123-rd"
              target="_blank" rel="noreferrer"
              className="btn-term"
              id="contact-github"
              style={{ justifyContent: 'center' }}
            >
              <Github size={15} /> GitHub Profile
            </a>
          </div>

          <div style={{ marginTop: 24, borderTop: '1px dashed var(--dim)', paddingTop: 16, fontSize: '0.75rem', color: 'var(--dim)' }}>
            <div>ping response: &lt;50ms (usually same-day)</div>
            <div>timezone: IST (UTC+5:30)</div>
          </div>
        </TermWindow>
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{
      padding: '32px 24px',
      borderTop: '1px solid var(--border)',
      position: 'relative', zIndex: 1,
      fontFamily: 'var(--font)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textShadow: 'var(--glow-sm)' }}>
          <span style={{ color: 'var(--secondary)' }}>~/</span>ritesh-portfolio
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--dim)' }}>
          © 2026 Ritesh Ram Dhebe — Built with React &amp; Framer Motion
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--dim)' }}>
          <span className="status-ok">[OK]</span> All systems nominal
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   MATRIX RAIN — subtle bg canvas
═══════════════════════════════════════════════════════ */
function MatrixBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const chars = '01ABCDEF</>{}[]$#@!%^&*;:';
    let w, h, cols, drops;
    const fontSize = 13;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols  = Math.floor(w / fontSize);
      drops = Array(cols).fill(1);
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.055)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#0a2a0a';
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(c, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    resize();
    const raf = setInterval(draw, 60);
    window.addEventListener('resize', resize);
    return () => { clearInterval(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        opacity: 0.35, pointerEvents: 'none'
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   BOOT LOADER
═══════════════════════════════════════════════════════ */
const BOOT_SEQ = [
  { t: 0,    text: 'RITESH PORTFOLIO OS v3.1.4 — BOOTING...',             color: 'var(--secondary)' },
  { t: 280,  text: 'Initializing hardware interfaces...',                  color: 'var(--dim)' },
  { t: 560,  text: '[OK]  CPU: Intel Core i9 — 3.6GHz × 16',             color: 'var(--primary)' },
  { t: 780,  text: '[OK]  RAM: 64GB DDR5 ECC',                            color: 'var(--primary)' },
  { t: 960,  text: '[OK]  GPU: NVIDIA RTX 4090 — CUDA ready',             color: 'var(--primary)' },
  { t: 1120, text: '[OK]  Disk: NVMe 2TB — mounted at /',                 color: 'var(--primary)' },
  { t: 1300, text: 'Loading modules...',                                   color: 'var(--dim)' },
  { t: 1480, text: '[OK]  react@18.3 — UI renderer loaded',               color: 'var(--primary)' },
  { t: 1650, text: '[OK]  framer-motion@11 — animation engine ready',     color: 'var(--primary)' },
  { t: 1820, text: '[OK]  node.js@22 — runtime environment ready',        color: 'var(--primary)' },
  { t: 2000, text: '[OK]  vite@5 — build system initialized',             color: 'var(--primary)' },
  { t: 2180, text: '[  ]  Checking network connection...',                color: 'var(--dim)' },
  { t: 2400, text: '[OK]  Network: CONNECTED — 1Gbps fiber',              color: 'var(--primary)' },
  { t: 2600, text: 'Mounting portfolio filesystem...',                    color: 'var(--dim)' },
  { t: 2780, text: '[OK]  /about    → loaded',                           color: 'var(--primary)' },
  { t: 2900, text: '[OK]  /skills   → loaded',                           color: 'var(--primary)' },
  { t: 3020, text: '[OK]  /projects → loaded',                           color: 'var(--primary)' },
  { t: 3140, text: '[OK]  /contact  → loaded',                           color: 'var(--primary)' },
  { t: 3300, text: '════ ALL SYSTEMS NOMINAL — WELCOME, OPERATOR ════',  color: 'var(--secondary)' },
];

function BootLoader({ onDone }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const timers = BOOT_SEQ.map((item, i) =>
      setTimeout(() => {
        setLines(prev => [...prev, item]);
        setProgress(Math.round(((i + 1) / BOOT_SEQ.length) * 100));
        if (i === BOOT_SEQ.length - 1) {
          setTimeout(() => { setExiting(true); setTimeout(onDone, 700); }, 700);
        }
      }, item.t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);


  const filled = Math.round(progress / 5);
  const empty  = 20 - filled;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9997,
        background: '#000', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        padding: 'clamp(20px, 5vw, 80px)', fontFamily: 'var(--font)',
        overflow: 'hidden'
      }}
    >
      {/* Big ASCII brand */}
      <pre style={{
        color: 'var(--muted)', fontSize: 'clamp(4px, 0.9vw, 10px)',
        lineHeight: 1.2, marginBottom: 32, textShadow: 'none', userSelect: 'none'
      }}>{`
 ██████╗  ██████╗ ██████╗ ████████╗    ██████╗ ███████╗
 ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝    ██╔═══██╗██╔════╝
 ██████╔╝██║   ██║██████╔╝   ██║       ██║   ██║███████╗
 ██╔═══╝ ██║   ██║██╔══██╗   ██║       ██║   ██║╚════██║
 ██║     ╚██████╔╝██║  ██║   ██║       ╚██████╔╝███████║
 ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝        ╚═════╝ ╚══════╝`}
      </pre>

      {/* Boot log */}
      <div style={{ width: '100%', maxWidth: 720, marginBottom: 28 }}>
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 'clamp(11px, 1.1vw, 13px)', lineHeight: 1.9, color: l.color }}
          >
            {l.text}
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ fontSize: 13, color: 'var(--primary)', marginBottom: 8 }}>
        LOADING [{'█'.repeat(filled)}{'░'.repeat(empty)}] {progress}%
      </div>
      <div style={{ fontSize: 11, color: 'var(--dim)' }}>press any key to skip...</div>

      {/* Scanlines over boot screen */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 4px)'
      }} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   INTERACTIVE TERMINAL
═══════════════════════════════════════════════════════ */
const COMMANDS = {
  'java': [
    { text: 'Java / Spring Boot — Backend Expertise', color: 'var(--secondary)' },
    { text: '  Spring MVC     → RESTful web services & MVC architecture', color: 'var(--t2)' },
    { text: '  Spring Boot    → Rapid microservice & API development',     color: 'var(--t2)' },
    { text: '  Spring Data JPA→ ORM with Hibernate, MySQL, PostgreSQL',    color: 'var(--t2)' },
    { text: '  Spring Security→ JWT auth, OAuth2, role-based access',       color: 'var(--t2)' },
    { text: '  Maven / Gradle → Build & dependency management',             color: 'var(--t2)' },
    { text: '  Proficiency: [████████████████░░░░] 80%',                   color: 'var(--primary)' },
  ],
  help: [
    { text: 'Available commands:', color: 'var(--secondary)' },
    { text: '  about       → Who is Ritesh?',         color: 'var(--t2)' },
    { text: '  skills      → Technical skill matrix', color: 'var(--t2)' },
    { text: '  java        → Java/Spring Boot stack', color: 'var(--t2)' },
    { text: '  projects    → List all projects',      color: 'var(--t2)' },
    { text: '  contact     → Get in touch',           color: 'var(--t2)' },
    { text: '  experience  → Work history',           color: 'var(--t2)' },
    { text: '  whoami      → Quick identity check',   color: 'var(--t2)' },
    { text: '  clear       → Clear terminal',         color: 'var(--t2)' },
    { text: '  hire me     → Best decision ever 🚀',  color: 'var(--t2)' },
  ],
  about: [
    { text: 'Name    : Ritesh Ram Dhebe',                    color: 'var(--primary)' },
    { text: 'Role    : Full Stack Developer',                color: 'var(--primary)' },
    { text: 'Company : Crystal Web, Pune',                  color: 'var(--primary)' },
    { text: 'Exp     : 2+ years',                           color: 'var(--primary)' },
    { text: 'Stack   : React · Node.js · Spring Boot · Docker', color: 'var(--primary)' },
    { text: 'Status  : [OPEN TO OPPORTUNITIES]',            color: 'var(--secondary)' },
  ],
  whoami: [
    { text: 'uid=1000(ritesh) gid=1000(devs)',           color: 'var(--primary)' },
    { text: 'groups=devs,sudo,cloud,fullstack,crafts',   color: 'var(--t2)' },
  ],
  skills: [
    { text: 'React.js / Next.js  [████████████████████] 90%', color: 'var(--primary)' },
    { text: 'Java / Spring Boot  [████████████████░░░░] 80%', color: 'var(--primary)' },
    { text: 'Node.js / Express   [█████████████████░░░] 85%', color: 'var(--primary)' },
    { text: 'MongoDB / PostgreSQL [████████████████░░░░] 82%', color: 'var(--primary)' },
    { text: 'Docker / AWS        [███████████████░░░░░] 75%', color: 'var(--primary)' },
    { text: 'WebSockets / Redis  [███████████████░░░░░] 78%', color: 'var(--primary)' },
    { text: 'TypeScript          [████████████████░░░░] 80%', color: 'var(--primary)' },
  ],
  projects: [
    { text: '[1] Dynamic Web & Mobile Apps    → React, Node, APIs',     color: 'var(--primary)' },
    { text: '[2] Enterprise Software Solutions → MongoDB, Spring Boot',  color: 'var(--primary)' },
    { text: '[3] Multiplayer Gaming Platforms  → WebSockets, Redis',     color: 'var(--primary)' },
    { text: 'Scroll to #projects for full details ↓',                    color: 'var(--secondary)' },
  ],
  experience: [
    { text: '2024–Now  Full Stack Developer @ Crystal Web, Pune', color: 'var(--primary)' },
    { text: '2018–2022 BSc Computer Science @ TJ College Khadki', color: 'var(--t2)' },
  ],
  contact: [
    { text: 'WhatsApp : wa.me/919552115645',      color: 'var(--primary)' },
    { text: 'GitHub   : github.com/Ritesh123-rd', color: 'var(--primary)' },
    { text: 'TZ       : IST (UTC+5:30)',           color: 'var(--t2)' },
    { text: 'Response : < 24 hours',               color: 'var(--t2)' },
  ],
  'hire me': [
    { text: '✔ Initiating hire sequence...',              color: 'var(--secondary)' },
    { text: '✔ Checking candidate profile...',            color: 'var(--primary)' },
    { text: '✔ QUALIFICATION VERIFIED',                  color: 'var(--primary)' },
    { text: '✔ Sending offer letter...',                  color: 'var(--secondary)' },
    { text: 'ERROR: You need to contact Ritesh first! 😄', color: 'var(--error)' },
    { text: 'Run: contact',                              color: 'var(--t3)' },
  ],
};


function InteractiveTerminal() {
  const [history, setHistory] = useState([
    { type: 'system', lines: [{ text: 'Portfolio Terminal v3.1.4 — Type `help` for commands.', color: 'var(--secondary)' }] }
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const runCmd = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setCmdHistory(prev => [cmd, ...prev]);
    setHistIdx(-1);

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    const output = COMMANDS[cmd] || [{ text: `bash: ${cmd}: command not found. Try \`help\`.`, color: 'var(--error)' }];
    setHistory(prev => [
      ...prev,
      { type: 'cmd',    cmd },
      { type: 'output', lines: output }
    ]);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') { runCmd(input); setInput(''); }
    else if (e.key === 'ArrowUp') {
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] || '');
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? '' : cmdHistory[next]);
      e.preventDefault();
    }
  };

  return (
    <div
      className="term-window"
      onClick={() => inputRef.current?.focus()}
      style={{ maxWidth: 760, cursor: 'text' }}
    >
      <div className="term-titlebar">
        <span>+--- INTERACTIVE TERMINAL ---+</span>
        <span className="status-ok">[LIVE]</span>
      </div>
      <div style={{
        padding: '16px 20px',
        minHeight: 260, maxHeight: 380, overflowY: 'auto',
        fontFamily: 'var(--font)', fontSize: 13
      }}>
        {history.map((entry, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            {entry.type === 'cmd' && (
              <div style={{ color: 'var(--secondary)' }}>
                <span style={{ color: 'var(--dim)' }}>ritesh@portfolio:~$ </span>{entry.cmd}
              </div>
            )}
            {entry.type !== 'cmd' && entry.lines?.map((l, j) => (
              <div key={j} style={{ color: l.color, lineHeight: 1.85 }}>{l.text}</div>
            ))}
          </div>
        ))}

        {/* Input line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ color: 'var(--dim)', whiteSpace: 'nowrap' }}>ritesh@portfolio:~$ </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            autoComplete="off"
            spellCheck={false}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--primary)', fontFamily: 'var(--font)',
              fontSize: 13, flex: 1, caretColor: 'var(--primary)',
              textShadow: 'var(--glow-sm)'
            }}
          />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Hint bar */}
      <div style={{
        borderTop: '1px dashed var(--dim)', padding: '6px 20px',
        fontSize: 11, color: 'var(--dim)', display: 'flex', gap: 20
      }}>
        <span>↑↓ history</span>
        <span>ENTER execute</span>
        <span>type `help` to start</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STATUS BAR  (tmux-style, fixed bottom)
═══════════════════════════════════════════════════════ */
function StatusBar() {
  const [time, setTime] = useState(new Date());
  const [scroll, setScroll] = useState(0);
  const [section, setSection] = useState('HOME');

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      setScroll(isNaN(pct) ? 0 : pct);
      const sections = ['contact', 'experience', 'projects', 'skills', 'about', 'home'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setSection(id.toUpperCase());
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata'
  });
  const dateStr = time.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'
  });

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300,
      background: 'var(--primary)', height: 26,
      display: 'flex', alignItems: 'center',
      fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700,
      letterSpacing: '0.06em', userSelect: 'none'
    }}>
      {/* Left — mode */}
      <div style={{
        background: '#000', color: 'var(--primary)',
        padding: '0 14px', height: '100%',
        display: 'flex', alignItems: 'center', gap: 8,
        textShadow: 'var(--glow-sm)', flexShrink: 0
      }}>
        <Terminal size={12} /> NORMAL
      </div>

      {/* Git branch style */}
      <div style={{
        background: 'var(--muted)', color: 'var(--primary)',
        padding: '0 14px', height: '100%',
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0
      }}>
        ⎇ main
      </div>

      {/* Section */}
      <div style={{
        background: 'rgba(0,0,0,0.3)', color: '#000',
        padding: '0 14px', height: '100%',
        display: 'flex', alignItems: 'center', flexShrink: 0
      }}>
        §&nbsp;{section}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1, height: '100%', background: 'var(--primary)' }} />

      {/* Scroll % */}
      <div style={{
        background: 'rgba(0,0,0,0.2)', color: '#000',
        padding: '0 12px', height: '100%',
        display: 'flex', alignItems: 'center', flexShrink: 0
      }}>
        {scroll}%
      </div>

      {/* File */}
      <div style={{
        background: 'rgba(0,0,0,0.15)', color: '#000',
        padding: '0 12px', height: '100%',
        display: 'flex', alignItems: 'center', flexShrink: 0
      }}>
        ritesh-portfolio/App.jsx
      </div>

      {/* Date */}
      <div style={{
        background: 'var(--muted)', color: 'var(--primary)',
        padding: '0 12px', height: '100%',
        display: 'flex', alignItems: 'center', flexShrink: 0,
        textShadow: 'none'
      }}>
        {dateStr}
      </div>

      {/* Clock */}
      <div style={{
        background: '#000', color: 'var(--primary)',
        padding: '0 14px', height: '100%',
        display: 'flex', alignItems: 'center',
        textShadow: 'var(--glow-sm)', flexShrink: 0
      }}>
        {timeStr} IST
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMMAND PALETTE (CTRL+K)
═══════════════════════════════════════════════════════ */
function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const options = [
    { label: 'Jump to Home',        action: () => (window.location.hash = '#home') },
    { label: 'Jump to About',       action: () => (window.location.hash = '#about') },
    { label: 'Jump to Skills',      action: () => (window.location.hash = '#skills') },
    { label: 'Jump to Projects',    action: () => (window.location.hash = '#projects') },
    { label: 'Jump to Experience',  action: () => (window.location.hash = '#experience') },
    { label: 'Jump to Contact',     action: () => (window.location.hash = '#contact') },
    { label: 'Open Terminal',       action: () => { window.location.hash = '#contact'; setTimeout(() => document.querySelector('input')?.focus(), 200); } },
    { label: 'Check Java Skills',   action: () => (window.location.hash = '#skills') },
  ];

  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const fn = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  useEffect(() => { if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 10); } }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }} />
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.98 }} style={{ width: '100%', maxWidth: 640, background: 'var(--bg)', border: '1px solid var(--primary)', position: 'relative', zIndex: 501, boxShadow: '0 0 50px rgba(51,255,0,0.15)' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Terminal size={18} style={{ color: 'var(--primary)' }} />
              <input ref={inputRef} placeholder="Search commands or sections..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && filtered[0]) { filtered[0].action(); setOpen(false); } }} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--primary)', fontFamily: 'var(--font)', fontSize: '1.1rem', flex: 1, caretColor: 'var(--primary)' }} />
              <span style={{ color: 'var(--dim)', fontSize: '0.7rem', border: '1px solid var(--dim)', padding: '2px 6px' }}>ESC</span>
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto', padding: '8px 0' }}>
              {filtered.map((o, i) => (
                <button key={i} onClick={() => { o.action(); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'transparent', border: 'none', color: 'var(--t3)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font)', transition: 'all 0.1s' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#000'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t3)'; }}>
                  <Zap size={14} />
                  <span>{o.label}</span>
                </button>
              ))}
              {filtered.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: 'var(--dim)', fontSize: '0.9rem' }}>No results found for "{query}"</div>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   KONAMI EGG 🎮
═══════════════════════════════════════════════════════ */
function KonamiEgg() {
  const [active, setActive] = useState(false);
  const seq = useRef([]);
  const konami = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';

  useEffect(() => {
    const fn = (e) => {
      seq.current.push(e.key);
      if (seq.current.length > 10) seq.current.shift();
      if (seq.current.join('').includes(konami)) { setActive(true); setTimeout(() => setActive(false), 5000); seq.current = []; }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2 }} style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(51,255,0,0.1)', backdropFilter: 'hue-rotate(90deg)' }}>
          <div style={{ padding: '40px', background: '#000', border: '4px solid var(--primary)', textAlign: 'center', boxShadow: '0 0 100px var(--primary)' }}>
            <h1 style={{ color: 'var(--primary)', fontSize: '4rem', marginBottom: 20 }}>CHEATS ENABLED</h1>
            <p style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}>WELCOME TO THE MATRIX, OPERATOR.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════ */
export default function App() {
  const [booted, setBooted] = useState(false);

  // Skip boot on keypress / click
  useEffect(() => {
    if (booted) return;
    const skip = () => setBooted(true);
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('click',   skip, { once: true });
    return () => { window.removeEventListener('keydown', skip); window.removeEventListener('click', skip); };
  }, [booted]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', paddingBottom: 26, cursor: 'crosshair' }}>
      <AnimatePresence>
        {!booted && <BootLoader key="boot" onDone={() => setBooted(true)} />}
      </AnimatePresence>

      <MatrixBg />
      <Nav />
      <CommandPalette />
      <KonamiEgg />
      
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />

      {/* Contact section now has Interactive Terminal */}
      <motion.section
        id="contact"
        style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 40 }}
          >
            <div style={{ color: 'var(--secondary)', fontSize: '0.78rem', marginBottom: 8 }}>
              root@portfolio:~$ ./contact.sh --init-session
            </div>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
              color: 'var(--primary)', textShadow: 'var(--glow)',
              letterSpacing: '0.1em', marginBottom: 16, fontFamily: 'var(--font)', textTransform: 'uppercase'
            }}>
              CONTACT.SH
            </h2>
            <AsciiDivider label="CONTACT" />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Left – quick links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="term-window" style={{ height: '100%' }}>
                <div className="term-titlebar">
                  <span>+--- COMM_CHANNEL ---+</span>
                  <span className="status-ok">[OK]</span>
                </div>
                <div className="term-body">
                  <div style={{ color: 'var(--t3)', fontSize: '0.87rem', lineHeight: 1.9, marginBottom: 28 }}>
                    <div style={{ color: 'var(--secondary)', marginBottom: 8 }}>$ ping ritesh --message</div>
                    <p>Interested in working together? Reach out via any channel below.</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <a
                      href="https://wa.me/919552115645?text=Hi%20Ritesh,%20I%20have%20an%20inquiry%20regarding%20a%20project."
                      target="_blank" rel="noreferrer"
                      className="btn-term btn-amber"
                      id="contact-whatsapp"
                      style={{ justifyContent: 'center' }}
                    >
                      <Send size={15} /> WhatsApp Inquiry
                    </a>
                    <a
                      href="https://github.com/Ritesh123-rd"
                      target="_blank" rel="noreferrer"
                      className="btn-term"
                      id="contact-github"
                      style={{ justifyContent: 'center' }}
                    >
                      <Github size={15} /> GitHub Profile
                    </a>
                  </div>
                  <div style={{ marginTop: 24, borderTop: '1px dashed var(--dim)', paddingTop: 16, fontSize: '0.75rem', color: 'var(--dim)' }}>
                    <div>ping response: &lt;50ms (usually same-day)</div>
                    <div>timezone: IST (UTC+5:30)</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right – interactive terminal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <InteractiveTerminal />
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
      <StatusBar />
    </div>
  );
}

