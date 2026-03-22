import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { myApplications } from '../../api/applications';

const STATUS_CONFIG = {
  submitted:    { label: 'Submitted',    bg: '#e8eaf6', color: '#3949ab', message: 'Your application has been received and is awaiting review by the hiring team.' },
  graded:       { label: 'Under Review', bg: '#e0f2f1', color: '#00695c', message: 'Your application is being assessed by the hiring team.' },
  under_review: { label: 'Under Review', bg: '#fff3e0', color: '#e65100', message: 'The hiring team is currently reviewing your application. A decision will be communicated shortly.' },
  shortlisted:  { label: 'Shortlisted',  bg: '#e8f5e9', color: '#2e7d32', message: 'Congratulations! You have been shortlisted for this position. The hiring team will be in touch with next steps.' },
  rejected:     { label: 'Unsuccessful', bg: '#fce4ec', color: '#c62828', message: 'Thank you for applying. After careful review, your application was not successful at this stage. We encourage you to apply for future opportunities.' },
};

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myApplications().then(r => setApps(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.heading}>My Applications</h1>
          <p style={s.subheading}>{apps.length} application{apps.length !== 1 ? 's' : ''} submitted</p>
        </div>
      </div>

      {/* Status notifications */}
      {!loading && apps.filter(a => ['shortlisted', 'under_review', 'rejected'].includes(a.status)).map(app => {
        const st = STATUS_CONFIG[app.status];
        return (
          <div key={app.id} style={{ ...s.notifBanner, background: st.bg, borderColor: st.color + '55' }}>
            <div style={{ ...s.notifDot, background: st.color }} />
            <div style={s.notifBody}>
              <span style={{ ...s.notifTitle, color: st.color }}>{st.label} — {app.job_title}</span>
              <span style={s.notifMsg}>{st.message}</span>
            </div>
          </div>
        );
      })}

      {loading ? (
        <div style={s.empty}>Loading...</div>
      ) : apps.length === 0 ? (
        <div style={s.empty}>
          <FileText size={40} color="var(--gray-300)" />
          <p style={{ marginTop: '0.75rem', color: 'var(--gray-500)' }}>No applications yet.</p>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {['Position', 'Department', 'Candidate Code', 'Applied On', 'Status'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map(app => {
                const stCfg = STATUS_CONFIG[app.status] || {};
                return (
                  <tr key={app.id} style={s.tr}>
                    <td style={s.td}>
                      <div style={s.jobTitle}>{app.job_title}</div>
                      <div style={s.dept}>{app.job_department}</div>
                    </td>
                    <td style={s.td}><span style={s.dept}>{app.job_department}</span></td>
                    <td style={s.td}><span style={s.code}>{app.candidate_code}</span></td>
                    <td style={s.td}>{new Date(app.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: stCfg.bg, color: stCfg.color }}>{stCfg.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  pageHeader: { marginBottom: '1.5rem' },
  heading: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.2rem' },
  subheading: { color: 'var(--gray-500)', fontSize: '0.875rem' },
  notifBanner: { display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid', marginBottom: '0.75rem' },
  notifDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px' },
  notifBody: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  notifTitle: { fontSize: '0.875rem', fontWeight: 700 },
  notifMsg: { fontSize: '0.83rem', color: 'var(--gray-600)', lineHeight: 1.55 },
  empty: { textAlign: 'center', padding: '4rem', color: 'var(--gray-400)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  tableWrap: { background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '580px' },
  th: { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-50)' },
  tr: { borderBottom: '1px solid var(--gray-50)' },
  td: { padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--gray-700)', verticalAlign: 'middle' },
  jobTitle: { fontWeight: 600, color: 'var(--gray-900)' },
  dept: { fontSize: '0.82rem', color: 'var(--gray-500)', marginTop: '0.1rem' },
  code: { fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 700, color: 'var(--action)' },
  badge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 },
};
