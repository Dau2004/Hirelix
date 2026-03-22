import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, PlusCircle, BarChart2, Users,
  ChevronRight, Trash2, AlertTriangle,
} from 'lucide-react';
import { listJobs, updateJob, deleteJob } from '../../api/jobs';

function DeleteConfirmModal({ job, onConfirm, onCancel }) {
  return (
    <div style={m.overlay} onClick={onCancel}>
      <div style={m.modal} onClick={e => e.stopPropagation()}>
        <div style={m.icon}><AlertTriangle size={28} color="#e65100" /></div>
        <h3 style={m.title}>Delete Vacancy?</h3>
        <p style={m.body}>
          <strong>"{job.title}"</strong> will be permanently deleted along with all
          applications and scores. This cannot be undone.
        </p>
        <div style={m.actions}>
          <button style={m.cancelBtn} onClick={onCancel}>Cancel</button>
          <button style={m.deleteBtn} onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

const m = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' },
  modal: { background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-xl)' },
  icon: { display: 'flex', justifyContent: 'center', marginBottom: '1rem' },
  title: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.6rem' },
  body: { fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '1.75rem' },
  actions: { display: 'flex', gap: '0.75rem', justifyContent: 'center' },
  cancelBtn: { padding: '0.65rem 1.5rem', borderRadius: 'var(--radius)', background: 'var(--white)', border: '1.5px solid var(--gray-200)', color: 'var(--gray-600)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
  deleteBtn: { padding: '0.65rem 1.5rem', borderRadius: 'var(--radius)', background: '#c62828', border: 'none', color: 'var(--white)', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' },
};

export default function HRDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // job to delete
  const navigate = useNavigate();

  useEffect(() => {
    listJobs().then(r => setJobs(r.data)).finally(() => setLoading(false));
  }, []);

  const openCount = jobs.filter(j => j.status === 'open').length;

  const handleCloseJob = async (id) => {
    await updateJob(id, { status: 'closed' });
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'closed' } : j));
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await deleteJob(confirmDelete.id);
    setJobs(prev => prev.filter(j => j.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div style={s.page}>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.heading}>Dashboard</h1>
          <p style={s.subheading}>Manage your vacancies and review applicant rankings</p>
        </div>
        <button style={s.primaryBtn} onClick={() => navigate('/hr/jobs/new')}>
          <PlusCircle size={16} /> Post New Vacancy
        </button>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {[
          { icon: Briefcase, label: 'Total Vacancies', value: jobs.length, color: 'var(--action)', bg: '#e8eaf6' },
          { icon: Users, label: 'Open Positions', value: openCount, color: 'var(--primary)', bg: 'var(--primary-bg)' },
          { icon: BarChart2, label: 'Closed Positions', value: jobs.length - openCount, color: 'var(--gray-500)', bg: 'var(--gray-100)' },
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

      {/* Vacancies */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Your Vacancies</h2>
          <span style={s.sectionCount}>{jobs.length} job{jobs.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div style={s.empty}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div style={s.empty}>
            <Briefcase size={36} color="var(--gray-300)" />
            <p style={{ marginTop: '0.75rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
              No vacancies posted yet.
            </p>
            <button style={s.primaryBtn} onClick={() => navigate('/hr/jobs/new')}>
              <PlusCircle size={15} /> Post First Vacancy
            </button>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {['Position', 'Department', 'Min. Experience', 'Deadline', 'Status', 'Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} style={s.tr}>
                  <td style={s.td}>
                    <div style={s.jobTitle}>{job.title}</div>
                    <div style={s.jobDate}>
                      Posted {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td style={s.td}><span style={s.dept}>{job.department}</span></td>
                  <td style={s.td}>{job.experience_years > 0 ? `${job.experience_years}+ yrs` : 'Any'}</td>
                  <td style={s.td}>
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...(job.status === 'open' ? s.badgeOpen : s.badgeClosed) }}>
                      {job.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button
                        style={s.rankBtn}
                        onClick={() => navigate(`/hr/jobs/${job.id}/rankings`)}
                      >
                        <BarChart2 size={13} /> Applicants <ChevronRight size={13} />
                      </button>
                      {job.status === 'open' && (
                        <button style={s.closeBtn} onClick={() => handleCloseJob(job.id)}>
                          Close
                        </button>
                      )}
                      <button
                        style={s.deleteBtn}
                        onClick={() => setConfirmDelete(job)}
                        title="Delete job"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirmDelete && (
        <DeleteConfirmModal
          job={confirmDelete}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

const s = {
  page: { padding: '2rem 2.5rem', maxWidth: '1200px' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  heading: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.2rem' },
  subheading: { color: 'var(--gray-500)', fontSize: '0.875rem' },
  primaryBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.2rem', borderRadius: 'var(--radius)', background: 'var(--action)', color: 'var(--white)', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: { background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' },
  statIcon: { width: '44px', height: '44px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statValue: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' },
  statLabel: { fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500, marginTop: '0.15rem' },
  section: { background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', overflow: 'auto' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-100)' },
  sectionTitle: { fontSize: '0.95rem', fontWeight: 700, color: 'var(--gray-900)' },
  sectionCount: { fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 500 },
  empty: { padding: '3rem', textAlign: 'center', color: 'var(--gray-400)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '700px' },
  th: { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-50)' },
  tr: { borderBottom: '1px solid var(--gray-50)' },
  td: { padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--gray-700)', verticalAlign: 'middle' },
  jobTitle: { fontWeight: 600, color: 'var(--gray-900)' },
  jobDate: { fontSize: '0.775rem', color: 'var(--gray-400)', marginTop: '0.15rem' },
  dept: { fontSize: '0.825rem', color: 'var(--gray-500)' },
  badge: { display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 },
  badgeOpen: { background: '#e0f2f1', color: '#00695c' },
  badgeClosed: { background: 'var(--gray-100)', color: 'var(--gray-500)' },
  actions: { display: 'flex', gap: '0.4rem', alignItems: 'center' },
  rankBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius)', background: '#e8eaf6', border: 'none', color: 'var(--action)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
  closeBtn: { padding: '0.4rem 0.75rem', borderRadius: 'var(--radius)', background: 'var(--white)', border: '1px solid var(--gray-200)', color: 'var(--gray-500)', fontSize: '0.8rem', cursor: 'pointer' },
  deleteBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: 'var(--radius)', background: '#fce4ec', border: 'none', color: '#c62828', cursor: 'pointer' },
};
