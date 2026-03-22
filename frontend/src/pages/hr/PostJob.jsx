import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase, Building2, FileText, Star, Clock, Calendar, AlertCircle } from 'lucide-react';
import { createJob } from '../../api/jobs';

export default function PostJob() {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { experience_years: 0 } });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await createJob(data);
      navigate('/hr/dashboard');
    } catch (err) {
      setError(err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Failed to create vacancy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.layout}>
        <div style={s.formCard}>
          <div style={s.formHeader}>
            <div style={s.headerIcon}><Briefcase size={22} color="var(--action)" /></div>
            <div>
              <h1 style={s.heading}>Post New Vacancy</h1>
              <p style={s.subheading}>Fill in the details below to publish a new position</p>
            </div>
          </div>

          {error && (
            <div style={s.errorBox}>
              <AlertCircle size={15} /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
            {/* Title + Department */}
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}><Briefcase size={13} /> Job Title <span style={s.req}>*</span></label>
                <input
                  style={{ ...s.input, ...(errors.title ? s.inputErr : {}) }}
                  placeholder="e.g. Senior Programme Officer"
                  {...register('title', { required: 'Job title is required' })}
                />
                {errors.title && <p style={s.fieldErr}>{errors.title.message}</p>}
              </div>
              <div style={s.field}>
                <label style={s.label}><Building2 size={13} /> Department <span style={s.req}>*</span></label>
                <input
                  style={{ ...s.input, ...(errors.department ? s.inputErr : {}) }}
                  placeholder="e.g. Ministry of Health"
                  {...register('department', { required: 'Department is required' })}
                />
                {errors.department && <p style={s.fieldErr}>{errors.department.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div style={s.field}>
              <label style={s.label}><FileText size={13} /> Job Description <span style={s.req}>*</span></label>
              <textarea
                style={{ ...s.textarea, ...(errors.description ? s.inputErr : {}) }}
                rows={6}
                placeholder="Describe the role, responsibilities, and objectives of the position..."
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <p style={s.fieldErr}>{errors.description.message}</p>}
            </div>

            {/* Qualifications */}
            <div style={s.field}>
              <label style={s.label}><Star size={13} /> Minimum Qualifications</label>
              <textarea
                style={s.textarea}
                rows={3}
                placeholder="e.g. Bachelor's degree in Public Administration or related field, professional certification..."
                {...register('qualifications')}
              />
            </div>

            {/* Skills */}
            <div style={s.field}>
              <label style={s.label}><Star size={13} /> Required Skills <span style={s.hint}>(comma-separated)</span></label>
              <input
                style={s.input}
                placeholder="e.g. Policy analysis, Budget management, Stakeholder engagement, Report writing"
                {...register('skills')}
              />
            </div>

            {/* Experience + Deadline */}
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}><Clock size={13} /> Minimum Experience (years)</label>
                <input
                  style={s.input}
                  type="number"
                  min="0"
                  max="30"
                  {...register('experience_years')}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}><Calendar size={13} /> Application Deadline</label>
                <input style={s.input} type="date" {...register('deadline')} />
              </div>
            </div>

            <div style={s.formFooter}>
              <button type="button" style={s.cancelBtn} onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" style={s.submitBtn} disabled={loading}>
                {loading ? 'Publishing...' : 'Publish Vacancy'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.tipCard}>
            <h3 style={s.tipTitle}>Scoring Tips</h3>
            <p style={s.tipText}>
              The AI grading engine uses your job details to automatically score applicants.
              For best results:
            </p>
            <ul style={s.tipList}>
              {[
                'List all required skills, separated by commas',
                'Be specific in the qualifications field',
                'State the minimum years of experience clearly',
                'Write a detailed job description',
              ].map(tip => (
                <li key={tip} style={s.tipItem}>
                  <span style={s.tipDot} />{tip}
                </li>
              ))}
            </ul>
          </div>
          <div style={s.infoCard}>
            <p style={s.infoText}>
              All applicants are automatically anonymised. HR officers will only see candidate codes, not names, ensuring a fair, merit-based selection process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '2rem 2.5rem', maxWidth: '1000px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' },
  formCard: { background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '2rem', boxShadow: 'var(--shadow-sm)' },
  formHeader: { display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--gray-100)' },
  headerIcon: { width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  heading: { fontSize: '1.3rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.2rem' },
  subheading: { color: 'var(--gray-500)', fontSize: '0.85rem' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  row: { display: 'flex', gap: '1rem' },
  field: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)' },
  req: { color: '#ef4444' },
  hint: { fontWeight: 400, color: 'var(--gray-400)', fontSize: '0.78rem' },
  input: { padding: '0.75rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-200)', fontSize: '0.9rem', color: 'var(--gray-800)', background: 'var(--white)', outline: 'none', boxSizing: 'border-box', width: '100%' },
  textarea: { padding: '0.75rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-200)', fontSize: '0.9rem', color: 'var(--gray-800)', resize: 'vertical', outline: 'none', lineHeight: 1.6 },
  inputErr: { borderColor: '#fca5a5' },
  fieldErr: { color: '#ef4444', fontSize: '0.78rem' },
  formFooter: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--gray-100)', marginTop: '0.25rem' },
  cancelBtn: { padding: '0.7rem 1.25rem', borderRadius: 'var(--radius)', background: 'var(--white)', border: '1.5px solid var(--gray-200)', color: 'var(--gray-600)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
  submitBtn: { padding: '0.7rem 1.5rem', borderRadius: 'var(--radius)', background: 'var(--action)', color: 'var(--white)', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.25)' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  tipCard: { background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' },
  tipTitle: { fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.6rem' },
  tipText: { fontSize: '0.82rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '0.75rem' },
  tipList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  tipItem: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--gray-600)' },
  tipDot: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '5px' },
  infoCard: { background: '#e8eaf6', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid #c5cae9' },
  infoText: { fontSize: '0.82rem', color: 'var(--gray-700)', lineHeight: 1.7 },
};
