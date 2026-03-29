import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Github, Mail, Code2, Smartphone, Gamepad2, Send,
  Terminal, Globe, Award, Layers, ChevronRight,
  DatabaseZap, Cpu, Zap, Star, Shield, Activity
} from 'lucide-react';

// =========================================================
//  REAL PLANET SPHERE COMPONENT — High-fidelity CSS 3D
// =========================================================
function SpherePlanet({ texture, size, glowColor, hasRings = false, atmosphere = true, duration = 120 }) {
  return (
    <div style={{
      position: 'relative', width: size, height: size,
      transformStyle: 'preserve-3d',
      transform: 'rotateX(15deg) rotateZ(-25deg)',
      animation: 'orbitalFloat 18s ease-in-out infinite', // Simulate revolving/drifting
      userSelect: 'none', pointerEvents: 'none'
    }}>
      {/* 3D RINGS (Ice + Dust) */}
      {hasRings && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: size * 2.2, height: size * 2.2,
          marginLeft: -(size * 1.1), marginTop: -(size * 1.1),
          borderRadius: '50%',
          transform: 'rotateX(75deg)',
          background: `radial-gradient(circle, transparent 48%, ${glowColor}20 50%, ${glowColor}40 54%, transparent 55%, ${glowColor}30 58%, ${glowColor}10 65%, transparent 70%)`,
          border: `1px solid ${glowColor}10`,
          boxShadow: `0 0 30px ${glowColor}20`,
          zIndex: 0,
        }} />
      )}

      {/* Main Spherical Body */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        overflow: 'hidden', backgroundColor: '#111',
        transform: 'translateZ(20px)',
        boxShadow: `0 0 80px ${glowColor}10`,
        zIndex: 5
      }}>
        {/* Surface Texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${texture})`,
          backgroundSize: 'auto 100%',
          backgroundRepeat: 'repeat-x',
          animation: `rotatePlanet ${duration}s linear infinite`,
          filter: 'contrast(1.1) brightness(0.9)',
        }} />

        {/* Fixed Lighting Overlay */}
        <div style={{
          position: 'absolute', inset: -1, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 30%, transparent 60%, rgba(0,0,0,0.85) 95%)`,
          zIndex: 6
        }} />
      </div>

      <style>{`
        @keyframes rotatePlanet {
          from { background-position: 0 0; }
          to { background-position: 800% 0; }
        }
        @keyframes orbitalFloat {
          0% { transform: rotateX(15deg) rotateZ(-25deg) translate(0, 0); }
          25% { transform: rotateX(20deg) rotateZ(-20deg) translate(60px, -40px); }
          50% { transform: rotateX(15deg) rotateZ(-28deg) translate(20px, 80px); }
          75% { transform: rotateX(10deg) rotateZ(-30deg) translate(-60px, -40px); }
          100% { transform: rotateX(15deg) rotateZ(-25deg) translate(0, 0); }
        }
      `}</style>
    </div>
  );
}

function PlanetSection({ id, texture, title, subtitle, children, align = 'left', glowColor = '#22d3ee', planetSize = 400, hasRings = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], align === 'left' ? [-100, 0, 0, -100] : [100, 0, 0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.8, 1, 1, 0.8]);

  return (
    <section id={id} ref={ref} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        width: '100%', maxWidth: 1400, margin: '0 auto',
        display: 'flex', flexDirection: align === 'left' ? 'row' : 'row-reverse',
        alignItems: 'center', gap: '5%', flexWrap: 'wrap'
      }}>
        {/* Planet Side — THE REAL 3D SPHERE */}
        <motion.div style={{ flex: '1 1 45%', minWidth: 320, display: 'flex', justifyContent: 'center', x, opacity, scale }}>
           <SpherePlanet texture={texture} size={planetSize} glowColor={glowColor} hasRings={hasRings} duration={align === 'left' ? 140 : 180} />
        </motion.div>

        {/* Content Side */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}
          style={{ flex: '1 1 50%', minWidth: 320, zIndex: 10 }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#22d3ee', letterSpacing: 5, textTransform: 'uppercase', marginBottom: '1.2rem' }}>// {subtitle}</p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(to right, #fff, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '2.5rem' }}>{title}</h2>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

// =========================================================
//  GUARANTEED STARS — High-Density SVG Twinkle Field
// =========================================================
const Background = React.memo(() => {
  const stars = React.useMemo(() => Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    color: Math.random() > 0.8 ? '#22d3ee' : '#ffffff',
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5
  })), []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map(star => (
        <motion.div key={star.id} className="star-element"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: star.top, left: star.left,
            width: star.size, height: star.size, borderRadius: '50%',
            backgroundColor: star.color,
            boxShadow: `0 0 8px ${star.color}`
          }}
        />
      ))}
      
      {/* Heavy Drift for the background */}
      <motion.div animate={{ x: [-20, 20, -20], y: [-15, 15, -15] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: -100, opacity: 0.3, backgroundImage: 'radial-gradient(1px 1px at 50px 50px, rgba(255,255,255,0.8), transparent)', backgroundSize: '120px 120px' }} />
    </div>
  );
});

function TerminalLoader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPercent(p => {
        if (p >= 100) { clearInterval(id); setTimeout(onComplete, 400); return 100; }
        return p + 5;
      });
    }, 40);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'monospace', color: '#22d3ee', fontSize: '0.8rem', letterSpacing: 4, marginBottom: 20 }}>INITIALIZING PROTOCOL... {percent}%</div>
        <div style={{ width: 200, height: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} style={{ height: '100%', background: '#22d3ee', boxShadow: '0 0 15px #22d3ee' }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = [
    { name: 'Frontend (React.js)', icon: Smartphone, color: '#22d3ee' },
    { name: 'Backend (Node.js)', icon: Cpu, color: '#34d399' },
    { name: 'DB (MongoDB & MySQL)', icon: DatabaseZap, color: '#a855f7' },
    { name: 'DevOps & Linux', icon: Terminal, color: '#f59e0b' },
    { name: 'System Architecture', icon: Layers, color: '#ef4444' },
    { name: 'Real-Time Systems', icon: Activity, color: '#3b82f6' },
  ];

  const projects = [
    { title: 'Dynamic Web & Apps', desc: 'Responsive client websites and scalable mobile applications.', tech: ['React.js', 'Node.js', 'Express.js'], color: '#a855f7' },
    { title: 'Enterprise Software', desc: 'Designed core business workflows for CRM and LMS with role-based access.', tech: ['MongoDB', 'Node.js', 'React'], color: '#34d399' },
    { title: 'Multiplayer Gaming Platforms', desc: 'Real-time probability and skill-based gaming architectures with high concurrency.', tech: ['WebSockets', 'Node.js', 'Linux'], color: '#22d3ee' }
  ];

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: "'Rajdhani', sans-serif" }}>
      <AnimatePresence>
        {isLoading && <TerminalLoader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      <Background />

      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 1000,
        padding: scrolled ? '15px 5%' : '25px 5%',
        background: scrolled ? 'rgba(0,0,5,0.85)' : 'transparent',
        backdropFilter: 'blur(10px)', borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.4s'
      }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.2rem', fontWeight: 900, letterSpacing: 4 }}>
          <span style={{ color: '#22d3ee' }}>RITESH</span>.SPACE
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Skills', 'Work', 'Life', 'Connect'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'monospace' }}>{item}</a>
          ))}
        </div>
      </nav>

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }} transition={{ duration: 1 }}>
        <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: '60px' }}>
          <div style={{ textAlign: 'center', zIndex: 10 }}>
            {/* PROFILE IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}
            >
              <div style={{
                position: 'relative', width: '180px', height: '180px',
                borderRadius: '50%', padding: '6px',
                background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
                boxShadow: '0 0 50px rgba(34,211,238,0.4)',
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
                  background: '#000', position: 'relative'
                }}>
                  {/* Note for User: The photo will be loaded here. Please ensure 'profile.png' is in the public folder. */}
                  <img src="/profile.png" alt="Ritesh Ram Dhebe" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) brightness(1.05)' }} />
                </div> 
                
                {/* Rotating Tech Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', top: -15, left: -15, right: -15, bottom: -15,
                    border: '2px dashed rgba(34,211,238,0.5)', borderRadius: '50%',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }}>
              <span style={{ display: 'inline-block', padding: '10px 25px', borderRadius: 100, background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.2)', color: '#22d3ee', fontSize: '0.65rem', fontFamily: 'monospace', letterSpacing: 3, marginBottom: 30 }}>// UNIVERSAL ENGINEER</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", lineHeight: 1, marginBottom: 20 }}>RITESH RAM DHEBE</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} style={{ fontSize: '1.2rem', color: '#94a3b8', fontStyle: 'italic' }}>Full Stack Developer • Scalable Web Architectures • React.js & Node.js</motion.p>
          </div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{ width: 2, height: 60, background: 'linear-gradient(to bottom, #22d3ee, transparent)' }} />
          </motion.div>
        </section>

        <PlanetSection id="skills" texture="/tex_purple.png" planetSize={380} glowColor="#a855f7" hasRings={true} title="Technical Core" subtitle="Engine Capabilities" align="left">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {skills.map((s, i) => (
              <div key={i} style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 15 }}>
                <s.icon size={20} color={s.color} />
                <span style={{ fontWeight: 600 }}>{s.name}</span>
              </div>
            ))}
          </div>
        </PlanetSection>

        <PlanetSection id="work" texture="/tex_blue.png" planetSize={420} glowColor="#22d3ee" hasRings={true} title="Missions Log" subtitle="Project Explorer" align="right">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
            {projects.map((p, i) => (
              <div key={i} style={{ padding: 25, borderRadius: 16, background: 'rgba(5,5,15,0.7)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: "'Orbitron', sans-serif", color: p.color, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ color: '#94a3b8', marginBottom: 15 }}>{p.desc}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {p.tech.map(t => <span key={t} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 4 }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </PlanetSection>

        <PlanetSection id="life" texture="/tex_lava.png" planetSize={360} glowColor="#ef4444" title="Expansion Path" subtitle="Chronology" align="left">
          <div style={{ position: 'relative', paddingLeft: 30 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #22d3ee, #a855f7, transparent)' }} />
            {[
              { year: 'APR 2024 - PRESENT', title: 'FULL STACK DEVELOPER', place: 'Crystal Web, Pune' },
              { year: '2018 - 2022', title: 'BSC COMPUTER SCIENCE', place: 'TJ College Khadki, Pune University' }
            ].map((e, i) => (
              <div key={i} style={{ marginBottom: 40 }}>
                <div style={{ color: '#22d3ee', fontWeight: 700, fontSize: '0.8rem', marginBottom: 5 }}>{e.year}</div>
                <div style={{ fontSize: '1.2rem', fontFamily: "'Orbitron', sans-serif" }}>{e.title}</div>
                <div style={{ color: '#94a3b8' }}>{e.place}</div>
              </div>
            ))}
          </div>
        </PlanetSection>

        <PlanetSection id="connect" texture="/tex_purple.png" planetSize={340} glowColor="#22d3ee" title="Secure Link" subtitle="Subspace Connection" align="right">
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 40, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: 30 }}>Ready for new architectural missions. Signal established via secure frequency.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <a href="https://wa.me/919552115645?text=Hi%20Ritesh,%20I%20have%20an%20inquiry%20regarding%20a%20project." target="_blank" rel="noreferrer" style={{ flex: 1, padding: '15px', borderRadius: 12, background: '#25D366', color: '#000', textAlign: 'center', textDecoration: 'none', fontWeight: 800 }}>WHATSAPP INQUIRY</a>
              <a href="https://github.com/Ritesh123-rd" target="_blank" rel="noreferrer" style={{ flex: 1, padding: '15px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textAlign: 'center', textDecoration: 'none', fontWeight: 800 }}>GITHUB ARCHIVE</a>
            </div>
          </div>
        </PlanetSection>
      </motion.main>

      <footer style={{ padding: '60px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ opacity: 0.5, fontFamily: "'Orbitron', sans-serif", fontSize: '0.8rem', letterSpacing: 5 }}>RITESH.SPACE // © 2026</div>
      </footer>

      <style>{`
        * { scroll-behavior: smooth; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #22d3ee; border-radius: 10px; }
      `}</style>
    </div>
  );
}
