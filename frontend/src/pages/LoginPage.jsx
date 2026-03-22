import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { login as apiLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiLogin({ username: data.email, password: data.password });
      login(res.data);
      const decoded = JSON.parse(atob(res.data.access.split('.')[1]));
      navigate(decoded.role === 'hr' ? '/hr/dashboard' : '/applicant/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.cardHeader}>
          <div style={s.logoMark}><span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>H</span></div>
          <h1 style={s.title}>Welcome back</h1>
          <p style={s.subtitle}>Sign in to your Hirelix account</p>
        </div>

        {error && (
          <div style={s.errorBox}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <div style={s.inputWrap}>
              <Mail size={16} style={s.inputIcon} />
              <input
                style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
            </div>
            {errors.email && <p style={s.fieldError}>{errors.email.message}</p>}
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <Lock size={16} style={s.inputIcon} />
              <input
                style={{ ...s.input, ...(errors.password ? s.inputError : {}) }}
                type="password"
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            {errors.password && <p style={s.fieldError}>{errors.password.message}</p>}
          </div>

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? (
              <span style={s.loadingInner}>
                <span style={s.spinner} />
                Signing in...
              </span>
            ) : (
              <span style={s.btnInner}><LogIn size={17} /> Sign In</span>
            )}
          </button>
        </form>

        <p style={s.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={s.link}>Create one free</Link>
        </p>
      </div>

      {/* Right panel — decorative */}
      <div style={s.panel}>
        <div style={s.panelContent}>
          <div style={s.panelIcon}><Lock size={32} color="rgba(255,255,255,0.6)" /></div>
          <h2 style={s.panelTitle}>Secure & Transparent Recruitment</h2>
          <p style={s.panelText}>
            Every login, every action, every decision is logged and auditable.
            Hirelix gives public institutions the accountability tools they need.
          </p>
          {[
            'Anonymised candidate profiles',
            'AI-powered merit scoring',
            'Full audit trail',
          ].map((pt) => (
            <div key={pt} style={s.panelPoint}>
              <div style={s.panelDot} />
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex',
    background: 'var(--gray-50)',
  },
  card: {
    flex: '0 0 480px', padding: '3rem 3rem',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    background: 'var(--white)', boxShadow: '2px 0 20px rgba(0,0,0,0.04)',
  },
  cardHeader: { marginBottom: '2rem', textAlign: 'center' },
  logoMark: {
    width: '48px', height: '48px', borderRadius: '14px', margin: '0 auto 1.25rem',
    background: 'var(--action)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--gray-500)', fontSize: '0.9rem' },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-200)',
    fontSize: '0.925rem', color: 'var(--gray-800)',
    background: 'var(--white)', outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  },
  inputError: { borderColor: '#fca5a5' },
  fieldError: { color: '#ef4444', fontSize: '0.8rem' },
  submitBtn: {
    padding: '0.85rem', borderRadius: 'var(--radius)',
    background: 'var(--action)', color: 'var(--white)',
    border: 'none', fontWeight: 700, fontSize: '0.95rem',
    cursor: 'pointer', marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(26,35,126,0.3)',
  },
  btnInner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  loadingInner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  spinner: {
    width: '16px', height: '16px', borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white', animation: 'spin 0.6s linear infinite',
  },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' },
  link: { color: 'var(--action)', fontWeight: 600 },
  panel: {
    flex: 1,
    background: 'var(--action)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem',
  },
  panelContent: { maxWidth: '400px' },
  panelIcon: { marginBottom: '1.5rem' },
  panelTitle: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--white)', lineHeight: 1.3, marginBottom: '1rem', letterSpacing: '-0.02em' },
  panelText: { color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '1.5rem' },
  panelPoint: { display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginBottom: '0.6rem' },
  panelDot: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-light)', flexShrink: 0 },
};
