import { Link } from 'react-router-dom';
import {
  ShieldCheck, BarChart2, Users, ArrowRight,
  CheckCircle, Globe, Award, TrendingUp,
} from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&q=80&fit=crop';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Merit-Based Scoring',
    desc: 'Every application is automatically scored across five dimensions — qualifications, experience, skills, cover letter quality, and overall fit — with zero human bias.',
  },
  {
    icon: Users,
    title: 'Full Anonymisation',
    desc: 'Candidates appear only as unique codes (e.g. HLX-4F8A2C). HR officers review scores and rankings, never identities, eliminating favouritism at the source.',
  },
  {
    icon: BarChart2,
    title: 'Transparent Audit Trail',
    desc: 'Every action — submission, grading, shortlisting — is recorded and auditable. Compliance bodies have full visibility into every recruitment decision.',
  },
];

const STATS = [
  { value: '100%', label: 'Bias-Free Process' },
  { value: '5-Dim', label: 'AI Scoring Model' },
  { value: 'Real-Time', label: 'Application Grading' },
  { value: 'Secure', label: 'Data Handling' },
];

const HOW = [
  { step: '01', title: 'Post a Vacancy', desc: 'HR officers create a job posting with required qualifications, skills, and experience level.' },
  { step: '02', title: 'Candidates Apply', desc: 'Applicants submit their resume and cover letter. The system assigns an anonymous candidate code.' },
  { step: '03', title: 'AI Grades Instantly', desc: 'Our local NLP engine scores every application in seconds across five weighted dimensions.' },
  { step: '04', title: 'Ranked by Merit', desc: 'HR sees only a ranked list of codes and scores. The best-qualified candidate always rises to the top.' },
];

export default function LandingPage() {
  return (
    <div style={s.page}>

      {/* ── Hero ── */}
      <section className="hero-grid" style={s.hero}>
        {/* Real photo, left half */}
        <div className="hero-image-col" style={s.heroImageCol}>
          <img
            src={HERO_IMAGE}
            alt="Professional in an office environment"
            style={s.heroImg}
          />
          <div style={s.heroImgOverlay} />
        </div>

        {/* Content, right half */}
        <div className="hero-content-col" style={s.heroContentCol}>
          <div style={s.heroBadge}>
            <Globe size={13} />
            Built for Uganda's Public Sector
          </div>
          <h1 style={s.heroTitle}>
            Fair Hiring.<br />Better Public<br />Services.
          </h1>
          <p style={s.heroSub}>
            Hirelix eliminates favouritism from public sector recruitment through
            anonymisation and merit-based AI scoring — every candidate judged
            purely on their qualifications.
          </p>
          <div style={s.heroCtas}>
            <Link to="/register" style={s.ctaPrimary}>
              Apply for a Position <ArrowRight size={16} />
            </Link>
            <Link to="/register" style={s.ctaSecondary}>
              Post a Vacancy
            </Link>
          </div>
          <div style={s.heroCertLine}>
            <CheckCircle size={14} color="var(--primary)" />
            <span>No bias. No favouritism. Just merit.</span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={s.statsBar}>
        <div style={s.statsInner}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={s.statItem}>
              <span style={s.statValue}>{value}</span>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={s.section}>
        <div className="container">
          <div style={s.sectionHeader}>
            <p style={s.sectionEyebrow}>Why Hirelix</p>
            <h2 style={s.sectionTitle}>A Recruitment Platform Built on Integrity</h2>
            <p style={s.sectionSub}>
              Three core principles guide every feature we build — anonymisation,
              transparency, and merit-based decision making.
            </p>
          </div>
          <div style={s.featureGrid}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={s.featureCard}>
                <div style={s.featureIcon}>
                  <Icon size={22} color="var(--primary)" />
                </div>
                <h3 style={s.featureTitle}>{title}</h3>
                <p style={s.featureDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={s.howSection}>
        <div className="container">
          <div style={s.sectionHeader}>
            <p style={{ ...s.sectionEyebrow, color: 'var(--primary-light)' }}>How It Works</p>
            <h2 style={{ ...s.sectionTitle, color: 'var(--white)' }}>From Posting to Shortlisting in Four Steps</h2>
          </div>
          <div style={s.howGrid}>
            {HOW.map(({ step, title, desc }) => (
              <div key={step} style={s.howCard}>
                <div style={s.howStep}>{step}</div>
                <h3 style={s.howTitle}>{title}</h3>
                <p style={s.howDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section style={s.aboutSection}>
        <div className="container">
          <div style={s.aboutGrid}>
            <div style={s.aboutText}>
              <p style={s.sectionEyebrow}>Our Mission</p>
              <h2 style={{ ...s.sectionTitle, textAlign: 'left' }}>
                Transforming Public Sector Recruitment in Uganda
              </h2>
              <p style={s.aboutPara}>
                Uganda's public institutions deserve the most qualified professionals —
                yet traditional recruitment processes are vulnerable to nepotism,
                tribalism, and corruption. Hirelix was built to change that.
              </p>
              <p style={s.aboutPara}>
                By combining anonymisation technology with AI-powered scoring, we ensure
                that every civil service recruitment decision is defensible, auditable,
                and based purely on the merit of the candidate.
              </p>
              <div style={s.aboutPoints}>
                {[
                  'Compliant with public service hiring guidelines',
                  'Full audit log for every recruitment cycle',
                  'Designed for low-bandwidth environments',
                  'Supports PDF and DOCX resumes',
                ].map((pt) => (
                  <div key={pt} style={s.aboutPoint}>
                    <CheckCircle size={15} color="var(--primary)" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.aboutVisual}>
              <div style={s.scoreCard}>
                <div style={s.scoreCardHeader}>
                  <Award size={17} color="var(--primary)" />
                  <span style={s.scoreCardTitle}>Candidate HLX-4F8A2C</span>
                  <span style={s.excellentBadge}>Excellent</span>
                </div>
                {[
                  ['Qualifications', 87],
                  ['Experience', 82],
                  ['Skills', 91],
                  ['Cover Letter', 78],
                ].map(([dim, val]) => (
                  <div key={dim} style={s.scoreRow}>
                    <span style={s.scoreDim}>{dim}</span>
                    <div style={s.scoreBarTrack}>
                      <div style={{ ...s.scoreBarFill, width: `${val}%` }} />
                    </div>
                    <span style={s.scoreNum}>{val}</span>
                  </div>
                ))}
                <div style={s.scoreTotal}>
                  <TrendingUp size={15} color="var(--primary)" />
                  <span>Final Score: <strong>85.0 / 100</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={s.ctaBanner}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ ...s.sectionTitle, color: 'var(--white)', marginBottom: '0.75rem' }}>
            Ready to Hire on Merit?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '2rem', fontSize: '1rem' }}>
            Join public institutions already using Hirelix to build transparent, fair recruitment processes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={s.ctaBannerPrimary}>
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link to="/login" style={s.ctaBannerSecondary}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div className="container" style={s.footerInner}>
          <div style={s.footerBrand}>
            <div style={s.footerLogoMark}><span style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem' }}>H</span></div>
            <span style={s.footerLogoText}>Hirelix</span>
          </div>
          <p style={s.footerTagline}>Fair Hiring. Better Public Services.</p>
          <p style={s.footerCopy}>© {new Date().getFullYear()} Hirelix. Built for Uganda's public sector.</p>
        </div>
      </footer>
    </div>
  );
}

const s = {
  page: { display: 'flex', flexDirection: 'column', background: 'var(--white)' },

  /* ── Hero ── */
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '92vh',
  },

  /* Left: image */
  heroImageCol: {
    position: 'relative',
    overflow: 'hidden',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    display: 'block',
  },
  /* Subtle dark overlay on left edge so text on right is readable if overlapping */
  heroImgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.08)',
  },

  /* Right: content */
  heroContentCol: {
    background: 'var(--action)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4rem 3.5rem',
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.8)',
    padding: '0.35rem 0.9rem', borderRadius: '100px',
    fontSize: '0.78rem', fontWeight: 500,
    marginBottom: '1.5rem', width: 'fit-content',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
    fontWeight: 800, color: 'var(--white)', lineHeight: 1.1,
    letterSpacing: '-0.03em', marginBottom: '1.25rem',
  },
  heroSub: {
    fontSize: '0.975rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75,
    marginBottom: '2rem',
  },
  heroCtas: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  ctaPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.8rem 1.5rem', borderRadius: 'var(--radius)',
    background: 'var(--primary)', color: 'var(--white)',
    fontWeight: 700, fontSize: '0.9rem', border: 'none',
  },
  ctaSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.8rem 1.5rem', borderRadius: 'var(--radius)',
    background: 'transparent', color: 'var(--white)',
    fontWeight: 600, fontSize: '0.9rem',
    border: '1.5px solid rgba(255,255,255,0.35)',
  },
  heroCertLine: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem',
  },

  /* ── Stats bar ── */
  statsBar: {
    background: 'var(--white)',
    borderBottom: '1px solid var(--gray-200)',
    boxShadow: 'var(--shadow-sm)',
  },
  statsInner: {
    maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1.5rem',
    display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap',
  },
  statItem: { textAlign: 'center' },
  statValue: { display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--action)', letterSpacing: '-0.03em' },
  statLabel: { display: 'block', fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 500, marginTop: '0.1rem' },

  /* ── Sections ── */
  section: { padding: '5rem 0' },
  sectionHeader: { textAlign: 'center', maxWidth: '580px', margin: '0 auto 3rem' },
  sectionEyebrow: { color: 'var(--primary)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' },
  sectionTitle: { fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '0.9rem' },
  sectionSub: { color: 'var(--gray-500)', lineHeight: 1.7, fontSize: '0.95rem' },

  /* ── Features ── */
  featureGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem',
  },
  featureCard: {
    background: 'var(--white)', border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)',
  },
  featureIcon: {
    width: '46px', height: '46px', borderRadius: 'var(--radius-lg)',
    background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  featureTitle: { fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.6rem' },
  featureDesc: { fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.7 },

  /* ── How it works ── */
  howSection: { background: 'var(--action)', padding: '5rem 0' },
  howGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem',
  },
  howCard: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 'var(--radius-xl)', padding: '2rem',
  },
  howStep: { fontSize: '2rem', fontWeight: 900, color: 'rgba(255,255,255,0.25)', marginBottom: '0.75rem', letterSpacing: '-0.04em' },
  howTitle: { fontSize: '0.975rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.5rem' },
  howDesc: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 },

  /* ── About ── */
  aboutSection: { padding: '5rem 0', background: 'var(--gray-50)' },
  aboutGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center',
  },
  aboutText: {},
  aboutPara: { color: 'var(--gray-600)', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.925rem' },
  aboutPoints: { display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem' },
  aboutPoint: { display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--gray-700)' },
  aboutVisual: { display: 'flex', justifyContent: 'center' },

  /* Score card */
  scoreCard: {
    background: 'var(--white)', borderRadius: 'var(--radius-xl)',
    padding: '1.75rem', boxShadow: 'var(--shadow-xl)',
    border: '1px solid var(--gray-200)', width: '100%', maxWidth: '360px',
  },
  scoreCardHeader: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-100)',
  },
  scoreCardTitle: { flex: 1, fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)', fontFamily: 'monospace' },
  excellentBadge: {
    padding: '0.2rem 0.6rem', borderRadius: '100px',
    background: 'var(--primary-bg)', color: 'var(--primary-dark)',
    fontSize: '0.72rem', fontWeight: 700,
  },
  scoreRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
  scoreDim: { width: '90px', fontSize: '0.78rem', color: 'var(--gray-500)', flexShrink: 0 },
  scoreBarTrack: { flex: 1, height: '7px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' },
  scoreBarFill: { height: '100%', background: 'var(--primary)', borderRadius: '4px' },
  scoreNum: { width: '28px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gray-700)' },
  scoreTotal: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)',
    fontSize: '0.875rem', color: 'var(--gray-700)',
  },

  /* ── CTA Banner ── */
  ctaBanner: { background: 'var(--action)', padding: '5rem 1.5rem' },
  ctaBannerPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.8rem 1.5rem', borderRadius: 'var(--radius)',
    background: 'var(--primary)', color: 'var(--white)',
    fontWeight: 700, fontSize: '0.9rem',
  },
  ctaBannerSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.8rem 1.5rem', borderRadius: 'var(--radius)',
    background: 'transparent', color: 'var(--white)',
    fontWeight: 600, fontSize: '0.9rem',
    border: '1.5px solid rgba(255,255,255,0.35)',
  },

  /* ── Footer ── */
  footer: { background: 'var(--gray-900)', padding: '2.5rem 1.5rem' },
  footerInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  footerBrand: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' },
  footerLogoMark: {
    width: '30px', height: '30px', borderRadius: '8px',
    background: 'var(--action)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  footerLogoText: { fontWeight: 700, fontSize: '1.05rem', color: 'var(--white)' },
  footerTagline: { color: 'var(--gray-400)', fontSize: '0.85rem' },
  footerCopy: { color: 'var(--gray-600)', fontSize: '0.78rem', marginTop: '0.2rem' },
};
