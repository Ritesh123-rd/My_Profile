import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Github, ExternalLink, Code2, Smartphone, Server,
  Database, Terminal, ChevronDown, MapPin, Calendar,
  ArrowUpRight, Send, Sparkles, Zap, Layers, Cpu,
  Globe, Activity, Menu, X
} from 'lucide-react';

const up = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
  })
};

const container = {
  show: { transition: { staggerChildren: 0.08 } }
};

/* ─── Fog / Cloud Layer ─── */
function FogLayer() {
  const { scrollYProgress } = useScroll();
  const leftX = useTransform(scrollYProgress, [0, 1], [-220, -40]);
  const rightX = useTransform(scrollYProgress, [0, 1], [220, 40]);
  const fogY = useTransform(scrollYProgress, [0, 1], [120, -40]);
  const fogOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.35, 0.25]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        opacity: fogOpacity
      }}
      aria-hidden="true"
    >
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '55vw',
          height: '40vh',
          x: leftX,
          y: fogY,
          background:
            'radial-gradient(70% 60% at 30% 70%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%)',
          filter: 'blur(18px)'
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '55vw',
          height: '40vh',
          x: rightX,
          y: fogY,
          background:
            'radial-gradient(70% 60% at 70% 70%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%)',
          filter: 'blur(18px)'
        }}
      />
    </motion.div>
  );
}

/* ─── Animated Network Background ─── */
function NetworkBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let raf = 0;
    const points = [];
    const POINTS = 60;
    const MAX_DIST = 170;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      points.length = 0;
      for (let i = 0; i < POINTS; i += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 1.6 + 1.2
        });
      }
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      // soft gradient wash to match reference feel
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(255,255,255,0.45)');
      grad.addColorStop(1, 'rgba(239,246,255,0.35)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // subtle triangle faces
      for (let i = 0; i < points.length; i += 1) {
        let n1 = null;
        let n2 = null;
        let d1 = Infinity;
        let d2 = Infinity;
        const p = points[i];
        for (let j = 0; j < points.length; j += 1) {
          if (i === j) continue;
          const q = points[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < d1) {
            d2 = d1; n2 = n1;
            d1 = d; n1 = q;
          } else if (d < d2) {
            d2 = d; n2 = q;
          }
        }
        if (n1 && n2 && d1 < MAX_DIST && d2 < MAX_DIST) {
          ctx.fillStyle = 'rgba(56,189,248,0.08)';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.closePath();
          ctx.fill();
        }
      }

      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = 1 - dist / MAX_DIST;
            ctx.strokeStyle = `rgba(29,78,216,${alpha * 0.35})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        ctx.fillStyle = 'rgba(56,189,248,0.6)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    const onResize = () => {
      resize();
      init();
    };

    resize();
    init();
    step();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        opacity: 0.75,
        mixBlendMode: 'multiply',
        pointerEvents: 'none'
      }}
    />
  );
}

/* ─── Glowing Orb Background ─── */
function Orbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <motion.div
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '10%', left: '15%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <motion.div
        animate={{ x: [0, -60, 50, 0], y: [0, 80, -30, 0], scale: [1, 0.8, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,146,60,0.18) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      <motion.div
        animate={{ x: [0, 40, -60, 0], y: [0, -40, 60, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.16) 0%, transparent 70%)',
          filter: 'blur(60px)', transform: 'translate(-50%,-50%)'
        }}
      />
    </div>
  );
}

/* ─── Grid Background ─── */
function GridBg() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: `
        linear-gradient(rgba(20,12,6,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(20,12,6,0.06) 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
      maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
    }} />
  );
}

/* ─── Navigation ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? 'rgba(255,255,255,0.65)' : 'transparent',
      backdropFilter: scrolled ? 'blur(18px) saturate(1.2)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.4s ease'
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        height: 70
      }}>
        <a href="#" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.03em' }}>
          <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>R</span>itesh
        </a>

        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="nav-desktop">
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              fontSize: '0.85rem', color: 'var(--t2)', fontWeight: 500,
              transition: 'color 0.2s', position: 'relative'
            }}
              onMouseEnter={e => e.target.style.color = 'var(--t1)'}
              onMouseLeave={e => e.target.style.color = 'var(--t2)'}
            >{l.label}</a>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} style={{
          display: 'none', background: 'none', border: 'none', color: 'var(--t1)',
          cursor: 'pointer', padding: 8
        }} className="nav-toggle">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(10,14,25,0.25)',
              backdropFilter: 'blur(4px)', zIndex: 180
            }}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{
              position: 'fixed', top: 0, right: 0, height: '100vh', width: '78vw',
              maxWidth: 360, padding: '80px 26px 24px',
              display: 'flex', flexDirection: 'column', gap: 16,
              zIndex: 190
            }}
            className="glass-strong glass-outline"
          >
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                style={{ fontSize: '1.05rem', color: 'var(--t2)', fontWeight: 700, padding: '8px 0' }}>
                {l.label}
              </a>
            ))}
          </motion.div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const [kick, setKick] = useState({ key: 0, dx: 0, dy: 0 });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  const textY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const glowRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const chipsY = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const backY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const frontY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const driftX = useTransform(scrollYProgress, [0, 1], [-24, 24]);
  const driftY = useTransform(scrollYProgress, [0, 1], [18, -18]);

  const skillCards = [
    { icon: Code2, title: 'React', sub: 'Frontend Expert', style: { top: '6%', right: '-10%' } },
    { icon: Server, title: 'AWS', sub: 'Cloud Deployment', style: { left: '-12%', top: '46%' } },
    { icon: Database, title: 'Java', sub: 'Spring Boot', style: { right: '-12%', bottom: '10%' } },
    { icon: Smartphone, title: 'UI/UX', sub: 'Design Systems', style: { left: '6%', bottom: '-8%' } },
  ];
  const floaters = [
    { label: 'React + Framer', x: '6%', y: '18%', delay: 0.1 },
    { label: 'Node + APIs', x: '78%', y: '22%', delay: 0.3 },
    { label: 'Cloud Ready', x: '10%', y: '68%', delay: 0.2 },
    { label: 'Realtime UX', x: '70%', y: '72%', delay: 0.4 }
  ];

  return (
    <section ref={sectionRef} style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '100px 32px 60px', position: 'relative', zIndex: 1,
      overflow: 'clip'
    }}>
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          y: backY
        }}
      >
        <motion.div style={{
          position: 'absolute',
          top: '8%',
          left: '4%',
          width: 240,
          height: 240,
          borderRadius: '40% 60% 65% 35% / 45% 35% 65% 55%',
          background: 'radial-gradient(circle at 30% 30%, rgba(56,189,248,0.28), rgba(29,78,216,0.08), transparent 70%)',
          filter: 'blur(4px)',
          x: driftX
        }} />
        <motion.div style={{
          position: 'absolute',
          right: '3%',
          top: '14%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(125,211,252,0.24), rgba(29,78,216,0.05), transparent 70%)',
          filter: 'blur(4px)',
          y: driftY
        }} />
        <motion.div style={{
          position: 'absolute',
          left: '15%',
          bottom: '6%',
          width: '70%',
          height: 120,
          background: 'linear-gradient(90deg, transparent, rgba(29,78,216,0.08), rgba(56,189,248,0.12), rgba(29,78,216,0.08), transparent)',
          filter: 'blur(22px)',
          y: frontY
        }} />
      </motion.div>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} className="hero-floats">
        {floaters.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: f.delay, duration: 0.6 }}
            style={{
              position: 'absolute', left: f.x, top: f.y,
              padding: '8px 14px', borderRadius: 999,
              background: 'rgba(255,255,255,0.65)', border: '1px solid var(--border)',
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--t2)',
              backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 6
            }}
            className="float"
          >
            <Sparkles size={12} /> {f.label}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial="hidden" animate="show" variants={container}
        style={{
          maxWidth: 1200, width: '100%',
          display: 'grid', gridTemplateColumns: '1.1fr 0.9fr',
          gap: 40, alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}
        className="hero-grid"
      >
        <motion.div style={{ y: textY }}>
          <motion.div variants={up} custom={0} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 20px', borderRadius: 100,
            background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border)',
            marginBottom: 26
          }} className="shimmer glass">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--acc)', boxShadow: '0 0 12px var(--acc)' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--t2)', fontWeight: 600, letterSpacing: '0.02em' }}>
              Open to opportunities
            </span>
          </motion.div>

          <motion.h1 variants={up} custom={1} style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.6rem)', fontWeight: 900,
            letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 14
          }}>
            Ritesh Ram <span className="text-grad">Dhebe</span>
          </motion.h1>

          <motion.p variants={up} custom={2} style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: 'var(--t2)',
            fontWeight: 600, marginBottom: 10
          }}>
            Full Stack Developer
          </motion.p>

          <motion.p variants={up} custom={3} style={{
            fontSize: '0.98rem', color: 'var(--t3)', maxWidth: 520,
            marginBottom: 30, lineHeight: 1.7
          }}>
            Crafting scalable web experiences with React.js, Node.js & modern cloud infrastructure. Building the future, one commit at a time.
          </motion.p>

          <motion.div variants={up} custom={4} style={{
            display: 'flex', gap: 14, flexWrap: 'wrap'
          }}>
            <a href="#projects" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 12, fontWeight: 700,
              fontSize: '0.9rem', background: 'var(--grad)', color: '#fff',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(249,115,22,0.35)'
            }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 16px 40px rgba(249,115,22,0.45)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 30px rgba(249,115,22,0.35)'; }}
            >
              View Projects <ArrowUpRight size={17} />
            </a>
            <a href="#contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 12, fontWeight: 700,
              fontSize: '0.9rem', background: 'rgba(255,255,255,0.7)',
              border: '1px solid var(--border-h)', color: 'var(--t1)',
              cursor: 'pointer', transition: 'all 0.3s'
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--acc)'; e.target.style.background = 'rgba(255,255,255,0.9)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border-h)'; e.target.style.background = 'rgba(255,255,255,0.7)'; }}
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={up}
          custom={5}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 460,
            display: 'grid',
            placeItems: 'center'
          }}
          className="hero-image-wrap"
        >
          <motion.div style={{ y: imageY }}>
            <motion.div style={{ rotate: glowRotate }}>
              <div style={{
            position: 'absolute',
            width: 460, height: 460, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, rgba(56,189,248,0.35), rgba(29,78,216,0.15), transparent 60%)',
            filter: 'blur(12px)'
              }} />
            </motion.div>

          <div style={{
            width: 360, height: 360, borderRadius: '50%',
            padding: 8,
            background: 'var(--grad)',
            boxShadow: '0 30px 80px rgba(29,78,216,0.35)',
            display: 'grid', placeItems: 'center'
          }} className="hero-ring">
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: '#fff', padding: 6,
              display: 'grid', placeItems: 'center'
            }} className="hero-avatar glass-strong glass-outline">
              <motion.img
                src="/profile.png"
                  alt="Ritesh"
                  initial={{ scale: 0.96, opacity: 0 }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const dir = clickX < rect.width / 2 ? -1 : 1;
                    setKick({ key: Date.now(), dx: 18 * dir, dy: 16 });
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: kick.dx ? [0, kick.dx, 0] : 0,
                    y: kick.dy ? [0, kick.dy, 0] : 0
                  }}
                  transition={{
                    duration: kick.dx ? 1.2 : 0.8,
                    ease: 'easeInOut'
                  }}
                  key={kick.key}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    borderRadius: '50%', display: 'block',
                    filter: 'saturate(1.15) contrast(1.05) brightness(1.02)'
                  }}
                />
              </div>
            </div>
          </motion.div>

          {skillCards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
              style={{
                position: 'absolute', ...c.style,
                padding: '14px 16px', borderRadius: 16,
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid var(--border)',
                boxShadow: '0 16px 40px rgba(29,78,216,0.2)',
                minWidth: 170,
                y: chipsY
              }}
              className="glass skill-float"
            >
              <motion.div
                animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'flex', gap: 12, alignItems: 'center' }}
              >
                <c.icon size={20} color="var(--acc)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{c.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--t3)', fontWeight: 600 }}>{c.sub}</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .hero-floats { display: none; }
        }
        @media (max-width: 860px) {
          section { padding-top: 110px !important; }
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-image-wrap {
            min-height: 320px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Section Wrapper ─── */
function Section({ id, title, sub, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  });
  const liftY = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -70]);
  const fade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.75]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.98]);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{
        padding: '120px 32px',
        position: 'relative',
        zIndex: 1,
        y: liftY,
        opacity: fade,
        scale
      }}
    >
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        variants={container}
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <motion.div variants={up} style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--acc)', boxShadow: '0 0 12px var(--acc)'
            }} />
            <span style={{
              fontSize: '0.78rem', color: 'var(--acc2)', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase'
            }}>{sub}</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 900,
            letterSpacing: '-0.03em', lineHeight: 1.1
          }}>{title}</h2>
        </motion.div>
        {children}
      </motion.div>
    </motion.section>
  );
}

/* ─── Skill Card ─── */
function SkillCard({ icon: Icon, name, desc, color, idx }) {
  return (
    <motion.div variants={up} custom={idx} whileHover={{ y: -6, borderColor: color + '50' }} style={{
      padding: 28, borderRadius: 16,
      background: 'var(--card)', border: '1px solid var(--border)',
      transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)', cursor: 'default',
      position: 'relative', overflow: 'hidden'
    }} className="card glass">
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
        opacity: 0, transition: 'opacity 0.3s'
      }} className="skill-bar" />
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: color + '12', display: 'flex',
        alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        border: `1px solid ${color}20`
      }}>
        <Icon size={22} color={color} />
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>{name}</h3>
      <p style={{ fontSize: '0.87rem', color: 'var(--t3)', lineHeight: 1.65 }}>{desc}</p>
    </motion.div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ title, desc, tech, color, idx }) {
  return (
    <motion.div variants={up} custom={idx} whileHover={{ y: -6 }} style={{
      borderRadius: 20, overflow: 'hidden',
      background: 'var(--card)', border: '1px solid var(--border)',
      transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
      position: 'relative'
    }} className="card glass">
      <div style={{
        height: 4, background: `linear-gradient(90deg, ${color}, ${color}40)`
      }} />
      <div style={{ padding: 32 }}>
        <h3 style={{
          fontSize: '1.25rem', fontWeight: 800, marginBottom: 12,
          letterSpacing: '-0.02em'
        }}>{title}</h3>
        <p style={{
          fontSize: '0.92rem', color: 'var(--t2)',
          lineHeight: 1.75, marginBottom: 24
        }}>{desc}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {tech.map(t => (
            <span key={t} style={{
              fontSize: '0.72rem', fontWeight: 600,
              padding: '5px 14px', borderRadius: 8,
              background: color + '10', border: `1px solid ${color}25`,
              color: color, letterSpacing: '0.02em'
            }}>{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Experience Item ─── */
function ExpItem({ date, title, company, desc, idx }) {
  return (
    <motion.div variants={up} custom={idx} style={{
      display: 'flex', gap: 28, padding: '32px 0',
      borderBottom: '1px solid var(--border)',
      position: 'relative'
    }}>
      <div style={{
        minWidth: 150, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={13} color="var(--t3)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--t3)', fontWeight: 600 }}>{date}</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.01em' }}>{title}</h3>
        <p style={{
          fontSize: '0.88rem', color: 'var(--acc2)', fontWeight: 600,
          marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6
        }}>
          <MapPin size={13} /> {company}
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--t2)', lineHeight: 1.75 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── Contact ─── */
function Contact() {
  return (
    <Section id="contact" title="Let's Connect" sub="Get in Touch">
      <motion.div variants={up} style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '52px 48px', maxWidth: 650,
        position: 'relative', overflow: 'hidden'
      }} className="card glass">
        <div style={{
          position: 'absolute', top: -50, right: -50,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,92,231,0.08), transparent)',
          filter: 'blur(40px)'
        }} />
        <p style={{
          fontSize: '1.05rem', color: 'var(--t2)', lineHeight: 1.75, marginBottom: 36,
          position: 'relative'
        }}>
          Interested in working together? Whether you have a project in mind or just want to chat, feel free to reach out.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
          <a href="https://wa.me/919552115645?text=Hi%20Ritesh,%20I%20have%20an%20inquiry%20regarding%20a%20project." target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '16px 28px', borderRadius: 14,
            background: 'var(--grad2)', color: '#000', fontWeight: 700,
            fontSize: '0.95rem', transition: 'all 0.3s', border: 'none',
            boxShadow: '0 4px 20px rgba(0,230,118,0.25)'
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(0,230,118,0.4)'; }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0,230,118,0.25)'; }}
          >
            <Send size={17} /> WhatsApp Inquiry
          </a>
          <a href="https://github.com/Ritesh123-rd" target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '16px 28px', borderRadius: 14,
            background: 'rgba(255,255,255,0.04)', color: 'var(--t1)',
            fontWeight: 700, fontSize: '0.95rem',
            border: '1px solid var(--border-h)', transition: 'all 0.3s'
          }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--acc)'; e.target.style.background = 'rgba(108,92,231,0.08)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border-h)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <Github size={17} /> GitHub Profile
          </a>
        </div>
      </motion.div>
    </Section>
  );
}

/* ─── Stats ─── */
function Stats() {
  const items = [
    { num: '2+', label: 'Years Experience' },
    { num: '15+', label: 'Projects Completed' },
    { num: '10+', label: 'Technologies' },
    { num: '100%', label: 'Client Satisfaction' },
  ];
  return (
    <section style={{ padding: '60px 32px', position: 'relative', zIndex: 1 }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24
      }}>
        {items.map((it, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{
              textAlign: 'center', padding: 28,
              background: 'var(--card)', borderRadius: 16,
              border: '1px solid var(--border)'
            }}
            className="card glass"
          >
            <div style={{
              fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em',
              background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 4
            }}>{it.num}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{
      padding: '48px 32px', textAlign: 'center',
      borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1
    }}>
      <div style={{
        fontWeight: 800, fontSize: '1.1rem', marginBottom: 12,
        background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
      }}>Ritesh Ram Dhebe</div>
      <p style={{ fontSize: '0.82rem', color: 'var(--t3)' }}>
        &copy; 2026 All rights reserved. Built with React & Framer Motion.
      </p>
    </footer>
  );
}

/* ─── Main App ─── */
export default function App() {
  const skills = [
    { icon: Smartphone, name: 'Frontend Development', desc: 'React.js, Next.js, TypeScript, responsive UI with modern CSS frameworks', color: '#6c5ce7' },
    { icon: Server, name: 'Backend Development', desc: 'Node.js, Express.js, REST APIs, GraphQL, microservices architecture', color: '#00e676' },
    { icon: Database, name: 'Database Management', desc: 'MongoDB, MySQL, Redis, PostgreSQL, data modeling and optimization', color: '#f39c12' },
    { icon: Terminal, name: 'DevOps & Cloud', desc: 'Docker, AWS, CI/CD pipelines, Linux server management', color: '#e74c3c' },
    { icon: Layers, name: 'System Architecture', desc: 'Scalable design patterns, event-driven systems, API design', color: '#a29bfe' },
    { icon: Activity, name: 'Real-Time Systems', desc: 'WebSockets, high concurrency, gaming platforms, event streaming', color: '#00cec9' },
  ];

  const projects = [
    {
      title: 'Dynamic Web & Mobile Apps',
      desc: 'Responsive client websites and scalable mobile applications with modern frameworks, performance optimization, and seamless user experiences across all devices.',
      tech: ['React.js', 'Node.js', 'Express.js', 'REST APIs'],
      color: '#6c5ce7'
    },
    {
      title: 'Enterprise Software Solutions',
      desc: 'Core business workflows for CRM and LMS platforms featuring role-based access control, real-time analytics dashboards, and comprehensive admin panels.',
      tech: ['MongoDB', 'Node.js', 'React', 'Docker'],
      color: '#00e676'
    },
    {
      title: 'Multiplayer Gaming Platforms',
      desc: 'Real-time probability and skill-based gaming architectures with high concurrency, low-latency communication, and robust security measures.',
      tech: ['WebSockets', 'Node.js', 'Linux', 'Redis'],
      color: '#fd79a8'
    },
  ];

  const experiences = [
    {
      date: 'Apr 2024 — Present',
      title: 'Full Stack Developer',
      company: 'Crystal Web, Pune',
      desc: 'Building scalable web applications and enterprise solutions using React.js and Node.js. Leading architecture decisions for real-time systems and cloud infrastructure. Implementing CI/CD pipelines and DevOps best practices.'
    },
    {
      date: '2018 — 2022',
      title: 'BSc Computer Science',
      company: 'TJ College Khadki, Pune University',
      desc: 'Studied computer science fundamentals including data structures, algorithms, databases, operating systems, and software engineering principles. Completed capstone projects in web development.'
    },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <NetworkBg />
      <FogLayer />
      <Nav />
      <Hero />
      <Stats />

      <Section id="about" title="About Me" sub="Introduction">
        <motion.div variants={up} style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '40px 44px', maxWidth: 750,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 150, height: 150, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,92,231,0.06), transparent)',
            filter: 'blur(30px)'
          }} />
          <p style={{ fontSize: '1.05rem', color: 'var(--t2)', lineHeight: 1.85, position: 'relative' }}>
            Full Stack Developer with <strong style={{ color: 'var(--t1)' }}>2+ years</strong> of experience building scalable web architectures using <strong style={{ color: 'var(--acc2)' }}>React.js</strong> and <strong style={{ color: 'var(--acc2)' }}>Node.js</strong>. Passionate about clean code, performance optimization, and creating seamless user experiences. Currently focused on enterprise software development and real-time systems at Crystal Web, Pune.
          </p>
        </motion.div>
      </Section>

      <Section id="skills" title="Technical Skills" sub="Expertise">
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18
        }}>
          {skills.map((s, i) => <SkillCard key={i} {...s} idx={i} />)}
        </div>
      </Section>

      <Section id="projects" title="Featured Projects" sub="Selected Work">
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 22
        }}>
          {projects.map((p, i) => <ProjectCard key={i} {...p} idx={i} />)}
        </div>
      </Section>

      <Section id="experience" title="Experience & Education" sub="My Journey">
        {experiences.map((e, i) => <ExpItem key={i} {...e} idx={i} />)}
      </Section>

      <Contact />
      <Footer />
    </div>
  );
}
