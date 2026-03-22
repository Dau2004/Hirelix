import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Briefcase, Clock, ArrowLeft } from 'lucide-react';
import { getJob } from '../../api/jobs';
import { submitApplication } from '../../api/applications';

function ScoreBar({ label, value }) {
  const color = value >= 70 ? 'var(--primary)' : value >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={sb.row}>
      <span style={sb.label}>{label}</span>
      <div style={sb.track}>
        <div style={{ ...sb.fill, width: `${value}%`, background: color }} />
      </div>
      <span style={{ ...sb.num, color }}>{value}</span>
    </div>
  );
}
const sb = {
  row: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' },
  label: { width: '110px', fontSize: '0.82rem', color: 'var(--gray-500)', flexShrink: 0 },
  track: { flex: 1, height: '7px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' },
  num: { width: '28px', textAlign: 'right', fontSize: '0.82rem', fontWeight: 700, flexShrink: 0 },
};

export default function ApplyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => { getJob(id).then(r => setJob(r.data)); }, [id]);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) return setError('File rejected. Please upload a PDF or DOCX under 5MB.');
    if (accepted[0]) { setFile(accepted[0]); setError(''); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please upload your resume.');
    if (coverLetter.trim().length < 100) return setError('Cover letter must be at least 100 characters.');
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('job', id);
      fd.append('cover_letter', coverLetter);
      fd.append('resume_file', file);
      const res = await submitApplication(fd);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const score = result.score;
    const finalScore = parseFloat(score?.final_score || 0);
    const getLabel = (s) => s >= 80 ? ['Excellent', '#00695c', '#e0f2f1'] : s >= 65 ? ['Good', '#00838f', '#e0f7fa'] : s >= 50 ? ['Fair', '#e65100', '#fff8e1'] : ['Weak', '#c62828', '#fce4ec'];
    const [label, labelColor, labelBg] = getLabel(finalScore);

    return (
      <div style={s.page}>
        <div style={s.successCard}>
          <div style={s.successIcon}><CheckCircle size={36} color="var(--primary)" /></div>
          <h2 style={s.successTitle}>Application Submitted</h2>
          <p style={s.successSub}>Your application has been received and graded automatically.</p>

          <div style={s.codeBox}>
            <span style={s.codeLabel}>Your Candidate Code</span>
            <span style={s.code}>{result.candidate_code}</span>
            <span style={s.codeNote}>Keep this code for your records. HR will only see this identifier.</span>
          </div>

          {score && (
            <div style={s.scoreSection}>
              <div style={s.scoreSummaryRow}>
                <div style={s.finalScoreCircle}>
                  <span style={s.finalScoreNum}>{Math.round(finalScore)}</span>
                  <span style={s.finalScoreOf}>/100</span>
                </div>
                <div>
                  <span style={{ ...s.scoreLabelBadge, background: labelBg, color: labelColor }}>{label}</span>
                  <p style={s.scoreSummaryText}>{score.summary}</p>
                </div>
              </div>
              <div style={s.bars}>
                <ScoreBar label="Qualifications" value={score.qualification_score} />
                <ScoreBar label="Experience" value={score.experience_score} />
                <ScoreBar label="Skills" value={score.skills_score} />
                <ScoreBar label="Cover Letter" value={score.cover_letter_score} />
              </div>
            </div>
          )}

          <button style={s.doneBtn} onClick={() => navigate('/applicant/applications')}>
            View My Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <button style={s.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div style={s.layout}>
        {/* Form */}
        <div style={s.formCard}>
          <h1 style={s.heading}>Submit Your Application</h1>
          {job && <p style={s.jobMeta}><Briefcase size={14} /> {job.title} — {job.department}</p>}

          {error && (
            <div style={s.errorBox}>
              <AlertCircle size={15} /> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>
                Cover Letter
                <span style={{ ...s.charCount, color: coverLetter.length >= 100 ? 'var(--primary)' : 'var(--gray-400)' }}>
                  {coverLetter.length} / 100 min
                </span>
              </label>
              <textarea
                style={s.textarea}
                rows={8}
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Explain why you are the ideal candidate for this position. Describe your relevant experience, key skills, and motivation for applying..."
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Resume <span style={s.hint}>PDF or DOCX · Max 5MB</span></label>
              <div {...getRootProps()} style={{ ...s.dropzone, ...(isDragActive ? s.dropActive : {}), ...(file ? s.dropFilled : {}) }}>
                <input {...getInputProps()} />
                {file ? (
                  <div style={s.filePreview}>
                    <FileText size={22} color="var(--primary)" />
                    <div>
                      <div style={s.fileName}>{file.name}</div>
                      <div style={s.fileSize}>{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                  </div>
                ) : (
                  <div style={s.dropContent}>
                    <UploadCloud size={28} color={isDragActive ? 'var(--primary)' : 'var(--gray-300)'} />
                    <p style={s.dropText}>{isDragActive ? 'Drop your resume here' : 'Drag & drop your resume, or click to browse'}</p>
                    <p style={s.dropHint}>PDF or DOCX up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={s.spinner} /> Grading your application...
                </span>
              ) : 'Submit Application'}
            </button>
          </form>
        </div>

        {/* Job sidebar */}
        {job && (
          <div style={s.sidebar}>
            <div style={s.sideCard}>
              <h3 style={s.sideTitle}>Position Details</h3>
              <div style={s.sideRow}><Briefcase size={15} color="var(--gray-400)" /><span>{job.title}</span></div>
              <div style={s.sideRow}><FileText size={15} color="var(--gray-400)" /><span>{job.department}</span></div>
              {job.experience_years > 0 && <div style={s.sideRow}><Clock size={15} color="var(--gray-400)" /><span>{job.experience_years}+ years experience</span></div>}
              {job.deadline && <div style={s.sideRow}><Clock size={15} color="#e65100" /><span style={{ color: '#e65100' }}>Deadline: {job.deadline}</span></div>}
              {job.skills && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Required Skills</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {job.skills.split(',').filter(Boolean).map(sk => (
                      <span key={sk} style={s.skill}>{sk.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={s.tipCard}>
              <p style={s.tipTitle}>Scoring Tips</p>
              <p style={s.tipText}>Your application is scored automatically across qualifications, experience, skills, and cover letter quality. Be specific and thorough.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--gray-500)', fontSize: '0.875rem', cursor: 'pointer', marginBottom: '1.5rem', padding: '0' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' },
  formCard: { background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '2rem', boxShadow: 'var(--shadow-sm)' },
  heading: { fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.4rem' },
  jobMeta: { display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  hint: { fontSize: '0.78rem', fontWeight: 400, color: 'var(--gray-400)' },
  charCount: { fontSize: '0.78rem', fontWeight: 500, transition: 'color 0.2s' },
  textarea: { padding: '0.85rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-200)', fontSize: '0.9rem', color: 'var(--gray-800)', resize: 'vertical', outline: 'none', lineHeight: 1.6 },
  dropzone: { border: '2px dashed var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--gray-50)', transition: 'all 0.2s' },
  dropActive: { borderColor: 'var(--primary)', background: 'var(--primary-bg)' },
  dropFilled: { borderColor: 'var(--primary)', background: 'var(--primary-bg)', borderStyle: 'solid' },
  dropContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  dropText: { fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 500 },
  dropHint: { fontSize: '0.8rem', color: 'var(--gray-400)' },
  filePreview: { display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' },
  fileName: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-700)' },
  fileSize: { fontSize: '0.8rem', color: 'var(--gray-400)' },
  submitBtn: { padding: '0.9rem', borderRadius: 'var(--radius)', background: 'var(--action)', color: 'var(--white)', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.25)' },
  spinner: { width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.6s linear infinite', display: 'inline-block' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  sideCard: { background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' },
  sideTitle: { fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1rem' },
  sideRow: { display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.6rem' },
  skill: { padding: '0.2rem 0.6rem', borderRadius: '100px', background: 'var(--gray-100)', color: 'var(--gray-600)', fontSize: '0.75rem', fontWeight: 500 },
  tipCard: { background: '#e8eaf6', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid #c5cae9' },
  tipTitle: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--action)', marginBottom: '0.4rem' },
  tipText: { fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.6 },
  // Success state
  successCard: { background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '3rem 2.5rem', boxShadow: 'var(--shadow-lg)', maxWidth: '600px', margin: '0 auto', textAlign: 'center' },
  successIcon: { display: 'flex', justifyContent: 'center', marginBottom: '1rem' },
  successTitle: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.5rem' },
  successSub: { color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '2rem' },
  codeBox: { background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  codeLabel: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  code: { fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 800, color: 'var(--action)', letterSpacing: '0.05em' },
  codeNote: { fontSize: '0.78rem', color: 'var(--gray-400)' },
  scoreSection: { background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' },
  scoreSummaryRow: { display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' },
  finalScoreCircle: { width: '64px', height: '64px', borderRadius: '50%', background: 'var(--action)', display: 'flex', alignItems: 'baseline', justifyContent: 'center', flexShrink: 0, paddingTop: '18px' },
  finalScoreNum: { color: 'white', fontWeight: 800, fontSize: '1.2rem' },
  finalScoreOf: { color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' },
  scoreLabelBadge: { display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem' },
  scoreSummaryText: { fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.6 },
  bars: {},
  doneBtn: { padding: '0.8rem 2rem', borderRadius: 'var(--radius)', background: 'var(--action)', color: 'var(--white)', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' },
};
