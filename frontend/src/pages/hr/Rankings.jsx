import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Download, X, Users, CheckCircle,
  AlertCircle, TrendingUp,
} from 'lucide-react';
import { jobRankings, getJob } from '../../api/jobs';
import { updateApplicationStatus } from '../../api/applications';

/* ── helpers ── */
function getScoreConfig(score) {
  const v = parseFloat(score);
  if (v >= 80) return { label: 'Excellent', color: '#00695c', bg: '#e0f2f1', bar: 'var(--primary)' };
  if (v >= 65) return { label: 'Good',      color: '#00838f', bg: '#e0f7fa', bar: '#0097a7' };
  if (v >= 50) return { label: 'Fair',      color: '#e65100', bg: '#fff8e1', bar: '#f59e0b' };
  return          { label: 'Weak',          color: '#c62828', bg: '#fce4ec', bar: '#ef4444' };
}

const STATUS_OPTIONS = [
  { value: 'graded',       label: 'Graded',       color: '#3949ab', bg: '#e8eaf6' },
  { value: 'under_review', label: 'Under Review', color: '#e65100', bg: '#fff3e0' },
  { value: 'shortlisted',  label: 'Shortlisted',  color: '#2e7d32', bg: '#e8f5e9' },
  { value: 'rejected',     label: 'Rejected',     color: '#c62828', bg: '#fce4ec' },
];

function statusCfg(val) {
  return STATUS_OPTIONS.find(o => o.value === val) || STATUS_OPTIONS[0];
}

/* ── score ring ── */
function ScoreRing({ score }) {
  const cfg = getScoreConfig(score);
  const r = 26, c = 2 * Math.PI * r;
  const fill = (Math.min(score, 100) / 100) * c;
  return (
    <svg width="62" height="62" viewBox="0 0 62 62">
      <circle cx="31" cy="31" r={r} fill="none" stroke="var(--gray-100)" strokeWidth="6" />
      <circle cx="31" cy="31" r={r} fill="none" stroke={cfg.bar} strokeWidth="6"
        strokeDasharray={`${fill} ${c - fill}`} strokeLinecap="round"
        transform="rotate(-90 31 31)" />
      <text x="31" y="35" textAnchor="middle" fill="var(--gray-800)" fontSize="11" fontWeight="800">
        {Math.round(score)}
      </text>
    </svg>
  );
}

/* ── score bar row ── */
function ScoreBar({ label, value }) {
  const color = value >= 70 ? 'var(--primary)' : value >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={sb.row}>
      <span style={sb.label}>{label}</span>
      <div style={sb.track}><div style={{ ...sb.fill, width: `${value}%`, background: color }} /></div>
      <span style={{ ...sb.num, color }}>{value}</span>
    </div>
  );
}
const sb = {
  row:   { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.55rem' },
  label: { width: '100px', fontSize: '0.8rem', color: 'var(--gray-500)', flexShrink: 0 },
  track: { flex: 1, height: '7px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: '4px' },
  num:   { width: '24px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 },
};

/* ── status selector ── */
function StatusSelect({ appId, current, onChange }) {
  const cfg = statusCfg(current);
  return (
    <select
      value={current}
      onChange={e => onChange(appId, e.target.value)}
      style={{ ...ss.select, background: cfg.bg, color: cfg.color }}
    >
      {STATUS_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
const ss = {
  select: { padding: '0.3rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, border: '1.5px solid transparent', cursor: 'pointer', outline: 'none', appearance: 'auto' },
};

/* ── score detail drawer ── */
function ScoreDrawer({ app, onClose }) {
  const score = app.score;
  const cfg = getScoreConfig(score?.final_score || 0);
  return (
    <div style={d.overlay} onClick={onClose}>
      <div style={d.panel} onClick={e => e.stopPropagation()}>
        <div style={d.header}>
          <div>
            <p style={d.codeLabel}>Candidate</p>
            <h3 style={d.code}>{app.candidate_code}</h3>
          </div>
          <button style={d.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div style={d.scoreRow}>
          <div style={d.bigWrap}>
            <span style={d.big}>{score?.final_score}</span>
            <span style={d.bigOf}>/100</span>
          </div>
          <span style={{ ...d.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
        </div>

        <div style={d.bars}>
          <ScoreBar label="Qualifications" value={score?.qualification_score || 0} />
          <ScoreBar label="Experience"     value={score?.experience_score     || 0} />
          <ScoreBar label="Skills"         value={score?.skills_score         || 0} />
          <ScoreBar label="Cover Letter"   value={score?.cover_letter_score   || 0} />
          <ScoreBar label="Overall"        value={score?.overall_score        || 0} />
        </div>

        {score?.summary && <p style={d.summary}>{score.summary}</p>}

        {score?.strengths?.length > 0 && (
          <div style={d.list}>
            <div style={d.listHead}><CheckCircle size={14} color="var(--primary)" /> Strengths</div>
            {score.strengths.map((s, i) => <div key={i} style={d.item}><span style={d.dotG} />{s}</div>)}
          </div>
        )}
        {score?.gaps?.length > 0 && (
          <div style={d.list}>
            <div style={d.listHead}><AlertCircle size={14} color="#ef4444" /> Gaps</div>
            {score.gaps.map((g, i) => <div key={i} style={d.item}><span style={d.dotR} />{g}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}
const d = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 200 },
  panel:   { background: 'var(--white)', width: '100%', maxWidth: '420px', height: '100%', overflowY: 'auto', padding: '2rem', boxShadow: 'var(--shadow-xl)' },
  header:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  codeLabel: { fontSize: '0.72rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' },
  code:    { fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: 'var(--action)' },
  close:   { padding: '0.35rem', border: 'none', background: 'var(--gray-100)', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--gray-500)', display: 'flex' },
  scoreRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--gray-100)' },
  bigWrap:  { display: 'flex', alignItems: 'baseline', gap: '0.15rem' },
  big:      { fontSize: '2.75rem', fontWeight: 900, color: 'var(--gray-900)', letterSpacing: '-0.04em' },
  bigOf:    { fontSize: '1rem', color: 'var(--gray-400)' },
  badge:    { display: 'inline-block', padding: '0.3rem 0.85rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700 },
  bars:     { marginBottom: '1.25rem' },
  summary:  { fontSize: '0.84rem', color: 'var(--gray-500)', lineHeight: 1.7, background: 'var(--gray-50)', padding: '0.85rem', borderRadius: 'var(--radius)', marginBottom: '1rem' },
  list:     { marginBottom: '1rem' },
  listHead: { display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '0.5rem' },
  item:     { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--gray-600)', padding: '0.25rem 0' },
  dotG:     { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '6px' },
  dotR:     { width: '6px', height: '6px', borderRadius: '50%', background: '#fca5a5',        flexShrink: 0, marginTop: '6px' },
};

/* ── main component ── */
export default function Rankings() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    Promise.all([getJob(id), jobRankings(id)])
      .then(([jRes, rRes]) => { setJob(jRes.data); setApps(rRes.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const res = await updateApplicationStatus(appId, newStatus);
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: res.data.status } : a));
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    const rows = [['Rank', 'Candidate Code', 'Final Score', 'Qualifications', 'Experience', 'Skills', 'Cover Letter', 'Overall', 'Status']];
    apps.forEach((a, i) => {
      const sc = a.score;
      rows.push([i + 1, a.candidate_code, sc?.final_score || '', sc?.qualification_score || '', sc?.experience_score || '', sc?.skills_score || '', sc?.cover_letter_score || '', sc?.overall_score || '', a.status]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hirelix-rankings-job-${id}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const excellent   = apps.filter(a => parseFloat(a.score?.final_score) >= 80).length;
  const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
  const rejected    = apps.filter(a => a.status === 'rejected').length;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.pageHeader}>
        <div>
          <p style={s.jobDept}>{job?.department}</p>
          <h1 style={s.heading}>{job?.title || 'Applicant Rankings'}</h1>
        </div>
        <button style={s.exportBtn} onClick={exportCSV}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {[
          { icon: Users,       label: 'Total Applicants', value: apps.length,  color: 'var(--action)',  bg: '#e8eaf6' },
          { icon: TrendingUp,  label: 'Excellent (80+)',  value: excellent,     color: '#00695c',        bg: '#e0f2f1' },
          { icon: CheckCircle, label: 'Shortlisted',      value: shortlisted,   color: '#2e7d32',        bg: '#e8f5e9' },
          { icon: AlertCircle, label: 'Rejected',         value: rejected,      color: '#c62828',        bg: '#fce4ec' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} style={s.statCard}>
            <div style={{ ...s.statIcon, background: bg }}><Icon size={17} color={color} /></div>
            <div>
              <div style={{ ...s.statVal, color }}>{value}</div>
              <div style={s.statLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        {loading ? (
          <div style={s.empty}>Loading applicants...</div>
        ) : apps.length === 0 ? (
          <div style={s.empty}>
            <Users size={36} color="var(--gray-300)" />
            <p style={{ marginTop: '0.75rem', color: 'var(--gray-500)' }}>No applications received yet.</p>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {['Rank', 'Score', 'Candidate Code', 'Final Score', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map((app, idx) => {
                const score = parseFloat(app.score?.final_score || 0);
                const cfg   = getScoreConfig(score);
                return (
                  <tr key={app.id} style={s.tr}>
                    {/* Rank */}
                    <td style={s.td}>
                      <span style={{ ...s.rank, ...(idx < 3 ? { color: 'var(--action)', fontWeight: 800 } : {}) }}>
                        #{idx + 1}
                      </span>
                    </td>

                    {/* Score ring */}
                    <td style={s.td}>
                      {app.score && <ScoreRing score={score} />}
                    </td>

                    {/* Candidate code */}
                    <td style={s.td}>
                      <span style={s.code}>{app.candidate_code}</span>
                    </td>

                    {/* Score bar */}
                    <td style={s.td}>
                      <div style={s.barRow}>
                        <div style={s.barTrack}>
                          <div style={{ ...s.barFill, width: `${score}%`, background: cfg.bar }} />
                        </div>
                        <span style={s.barNum}>{score}</span>
                      </div>
                    </td>

                    {/* Rating label */}
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    </td>

                    {/* Status — editable */}
                    <td style={s.td}>
                      {updatingId === app.id ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Saving...</span>
                      ) : (
                        <StatusSelect
                          appId={app.id}
                          current={app.status}
                          onChange={handleStatusChange}
                        />
                      )}
                    </td>

                    {/* Score detail */}
                    <td style={s.td}>
                      {app.score && (
                        <button style={s.detailBtn} onClick={() => setSelected(app)}>
                          View Score
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Score drawer */}
      {selected && <ScoreDrawer app={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

const s = {
  page:       { padding: '2rem 2.5rem', maxWidth: '1200px' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' },
  jobDept:    { fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' },
  heading:    { fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em' },
  exportBtn:  { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', borderRadius: 'var(--radius)', background: 'var(--white)', border: '1.5px solid var(--gray-200)', color: 'var(--gray-700)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
  statsGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' },
  statCard:   { background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.9rem', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' },
  statIcon:   { width: '38px', height: '38px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statVal:    { fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' },
  statLabel:  { fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 },
  tableWrap:  { background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', overflow: 'auto' },
  empty:      { padding: '3rem', textAlign: 'center', color: 'var(--gray-400)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  table:      { width: '100%', borderCollapse: 'collapse', minWidth: '780px' },
  th:         { padding: '0.85rem 1.1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-50)' },
  tr:         { borderBottom: '1px solid var(--gray-50)', transition: 'background 0.1s' },
  td:         { padding: '0.85rem 1.1rem', fontSize: '0.875rem', color: 'var(--gray-700)', verticalAlign: 'middle' },
  rank:       { fontWeight: 600, color: 'var(--gray-400)', fontSize: '0.875rem' },
  code:       { fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 700, color: 'var(--action)' },
  barRow:     { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  barTrack:   { width: '80px', height: '6px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' },
  barFill:    { height: '100%', borderRadius: '4px' },
  barNum:     { fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-700)', minWidth: '28px' },
  badge:      { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 },
  detailBtn:  { padding: '0.35rem 0.8rem', borderRadius: 'var(--radius)', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', color: 'var(--action)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
};
