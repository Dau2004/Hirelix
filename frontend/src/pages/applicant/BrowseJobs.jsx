import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ChevronRight, Search } from 'lucide-react';
import { listJobs } from '../../api/jobs';
import { myApplications } from '../../api/applications';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [applied, setApplied] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([listJobs(), myApplications()]).then(([jobRes, appRes]) => {
      setJobs(jobRes.data);
      setApplied(new Set(appRes.data.map(a => a.job)));
    }).finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.heading}>Open Vacancies</h1>
          <p style={s.subheading}>{jobs.length} position{jobs.length !== 1 ? 's' : ''} available</p>
        </div>
      </div>

      {/* Search */}
      <div style={s.searchBar}>
        <Search size={17} style={s.searchIcon} />
        <input
          style={s.searchInput}
          placeholder="Search by title or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={s.loading}>Loading vacancies...</div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>
          <Briefcase size={40} color="var(--gray-300)" />
          <p style={{ marginTop: '0.75rem', color: 'var(--gray-500)' }}>
            {search ? 'No jobs match your search.' : 'No open vacancies right now.'}
          </p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(job => {
            const hasApplied = applied.has(job.id);
            const skills = job.skills.split(',').filter(Boolean);
            return (
              <div key={job.id} style={s.card}>
                <div style={s.cardTop}>
                  <div style={s.jobIconWrap}>
                    <Briefcase size={20} color="var(--action)" />
                  </div>
                  {hasApplied && <span style={s.appliedBadge}>Applied</span>}
                </div>

                <h3 style={s.jobTitle}>{job.title}</h3>
                <div style={s.jobMeta}>
                  <span style={s.metaItem}><MapPin size={13} /> {job.department}</span>
                  {job.experience_years > 0 && (
                    <span style={s.metaItem}><Clock size={13} /> {job.experience_years}+ yrs</span>
                  )}
                </div>

                <p style={s.jobDesc}>{job.description.slice(0, 130)}{job.description.length > 130 ? '...' : ''}</p>

                {skills.length > 0 && (
                  <div style={s.skills}>
                    {skills.slice(0, 4).map(sk => (
                      <span key={sk} style={s.skill}>{sk.trim()}</span>
                    ))}
                    {skills.length > 4 && <span style={s.skillMore}>+{skills.length - 4}</span>}
                  </div>
                )}

                {job.deadline && (
                  <p style={s.deadline}>Deadline: {new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                )}

                <button
                  style={{ ...s.applyBtn, ...(hasApplied ? s.applyBtnDone : {}) }}
                  disabled={hasApplied}
                  onClick={() => navigate(`/applicant/jobs/${job.id}/apply`)}
                >
                  {hasApplied ? 'Already Applied' : <>Apply Now <ChevronRight size={15} /></>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  heading: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.2rem' },
  subheading: { color: 'var(--gray-500)', fontSize: '0.875rem' },
  searchBar: {
    position: 'relative', marginBottom: '1.75rem',
  },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' },
  searchInput: {
    width: '100%', padding: '0.8rem 1rem 0.8rem 2.75rem',
    borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--gray-200)',
    fontSize: '0.9rem', color: 'var(--gray-800)', background: 'var(--white)',
    outline: 'none', boxSizing: 'border-box',
    boxShadow: 'var(--shadow-sm)',
  },
  loading: { textAlign: 'center', color: 'var(--gray-400)', padding: '4rem' },
  emptyState: { textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' },
  card: {
    background: 'var(--white)', borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--gray-200)', padding: '1.5rem',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex', flexDirection: 'column', gap: '0.75rem',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  jobIconWrap: {
    width: '42px', height: '42px', borderRadius: 'var(--radius)',
    background: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  appliedBadge: {
    padding: '0.2rem 0.65rem', borderRadius: '100px',
    background: 'var(--primary-bg)', color: 'var(--primary-dark)',
    fontSize: '0.75rem', fontWeight: 700,
  },
  jobTitle: { fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.3 },
  jobMeta: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--gray-500)' },
  jobDesc: { fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.6, flex: 1 },
  skills: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  skill: {
    padding: '0.2rem 0.6rem', borderRadius: '100px',
    background: 'var(--gray-100)', color: 'var(--gray-600)',
    fontSize: '0.75rem', fontWeight: 500,
  },
  skillMore: {
    padding: '0.2rem 0.6rem', borderRadius: '100px',
    background: 'var(--gray-100)', color: 'var(--gray-400)',
    fontSize: '0.75rem',
  },
  deadline: { fontSize: '0.78rem', color: '#e65100', fontWeight: 500 },
  applyBtn: {
    marginTop: 'auto', padding: '0.7rem 1rem',
    borderRadius: 'var(--radius)', border: 'none',
    background: 'var(--action)', color: 'var(--white)',
    fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
  },
  applyBtnDone: { background: 'var(--gray-100)', color: 'var(--gray-400)', cursor: 'not-allowed' },
};
