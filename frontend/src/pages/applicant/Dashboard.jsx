import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, CheckSquare, ArrowRight, TrendingUp } from 'lucide-react';
import { myApplications } from '../../api/applications';
import { useAuth } from '../../context/AuthContext';

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', bg: '#e0f2f1', color: '#00695c' },
  graded: { label: 'Graded', bg: '#e8eaf6', color: '#3949ab' },
  shortlisted: { label: 'Shortlisted', bg: '#e8f5e9', color: '#2e7d32' },
  rejected: { label: 'Rejected', bg: '#fce4ec', color: '#c62828' },
};

function ScoreLabel({ score }) {
  const val = parseFloat(score);
  if (val >= 80) return <span style={{ ...sl.badge, background: '#e0f2f1', color: '#00695c' }}>Excellent</span>;
  if (val >= 65) return <span style={{ ...sl.badge, background: '#e0f7fa', color: '#00838f' }}>Good</span>;
  if (val >= 50) return <span style={{ ...sl.badge, background: '#fff8e1', color: '#e65100' }}>Fair</span>;
  return <span style={{ ...sl.badge, background: '#fce4ec', color: '#c62828' }}>Weak</span>;
}
const sl = { badge: { padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 } };

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myApplications().then(r => setApps(r.data)).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: apps.length,
    graded: apps.filter(a => a.status !== 'submitted').length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.heading}>Welcome back, {user?.full_name?.split(' ')[0] || 'there'}</h1>
          <p style={s.subheading}>Here's a summary of your recruitment activity</p>
        </div>
        <Link to="/applicant/jobs" style={s.primaryBtn}>
          <Briefcase size={16} /> Browse Jobs <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {[
          { icon: FileText, label: 'Total Applications', value: stats.total, color: 'var(--action)', bg: '#e8eaf6' },
          { icon: TrendingUp, label: 'Graded', value: stats.graded, color: 'var(--primary)', bg: 'var(--primary-bg)' },
          { icon: CheckSquare, label: 'Shortlisted', value: stats.shortlisted, color: '#2e7d32', bg: '#e8f5e9' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} style={s.statCard}>
            <div style={{ ...s.statIcon, background: bg }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ ...s.statValue, color }}>{value}</div>
              <div style={s.statLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Recent Applications</h2>
          <Link to="/applicant/applications" style={s.seeAll}>View all <ArrowRight size={14} /></Link>
        </div>

        {loading ? (
          <div style={s.emptyState}>Loading your applications...</div>
        ) : apps.length === 0 ? (
          <div style={s.emptyState}>
            <Briefcase size={40} color="var(--gray-300)" />
            <p style={{ marginTop: '0.75rem', color: 'var(--gray-500)' }}>No applications yet.</p>
            <Link to="/applicant/jobs" style={{ ...s.primaryBtn, marginTop: '1rem' }}>Browse Open Jobs</Link>
          </div>
        ) : (
          <div style={s.appList}>
            {apps.slice(0, 5).map(app => {
              const cfg = STATUS_CONFIG[app.status] || {};
              return (
                <div key={app.id} style={s.appRow}>
                  <div style={s.appIcon}>
                    <FileText size={18} color="var(--primary)" />
                  </div>
                  <div style={s.appMain}>
                    <div style={s.appTitle}>{app.job_title}</div>
                    <div style={s.appMeta}>{app.job_department} · {new Date(app.submitted_at).toLocaleDateString()}</div>
                  </div>
                  <div style={s.appRight}>
                    {app.score && (
                      <>
                        <span style={s.appScore}>{app.score.final_score}</span>
                        <ScoreLabel score={app.score.final_score} />
                      </>
                    )}
                    <span style={{ ...s.statusBadge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  heading: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.25rem' },
  subheading: { color: 'var(--gray-500)', fontSize: '0.9rem' },
  primaryBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.65rem 1.2rem', borderRadius: 'var(--radius)',
    background: 'var(--action)', color: 'var(--white)',
    fontWeight: 600, fontSize: '0.875rem',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: {
    background: 'var(--white)', borderRadius: 'var(--radius-lg)',
    padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
    border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)',
  },
  statIcon: { width: '44px', height: '44px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statValue: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' },
  statLabel: { fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500, marginTop: '0.15rem' },
  section: { background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-100)' },
  sectionTitle: { fontSize: '0.95rem', fontWeight: 700, color: 'var(--gray-900)' },
  seeAll: { display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--action)', fontWeight: 600 },
  emptyState: { padding: '3rem', textAlign: 'center', color: 'var(--gray-400)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  appList: { display: 'flex', flexDirection: 'column' },
  appRow: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-50)',
  },
  appIcon: { width: '38px', height: '38px', borderRadius: 'var(--radius)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  appMain: { flex: 1, minWidth: 0 },
  appTitle: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  appMeta: { fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '0.15rem' },
  appRight: { display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 },
  appScore: { fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-700)' },
  statusBadge: { padding: '0.2rem 0.65rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 },
};
