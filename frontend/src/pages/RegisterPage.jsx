import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Briefcase, UserCheck, AlertCircle } from 'lucide-react';
import { register as apiRegister } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiRegister(data);
      login(res.data);
      navigate(data.role === 'hr' ? '/hr/dashboard' : '/applicant/dashboard');
    } catch (err) {
      const d = err.response?.data;
      setError(d ? Object.values(d).flat().join(' ') : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.logoMark}><span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>H</span></div>
          <h1 style={s.title}>Create your account</h1>
          <p style={s.subtitle}>Join Hirelix — it's free</p>
        </div>

        {error && (
          <div style={s.errorBox}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>First Name</label>
              <div style={s.inputWrap}>
                <User size={15} style={s.inputIcon} />
                <input style={{ ...s.input, ...(errors.first_name ? s.inputError : {}) }}
                  placeholder="Jane" {...register('first_name', { required: 'Required' })} />
              </div>
              {errors.first_name && <p style={s.fieldError}>{errors.first_name.message}</p>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Last Name</label>
              <div style={s.inputWrap}>
                <User size={15} style={s.inputIcon} />
                <input style={{ ...s.input, ...(errors.last_name ? s.inputError : {}) }}
                  placeholder="Doe" {...register('last_name', { required: 'Required' })} />
              </div>
              {errors.last_name && <p style={s.fieldError}>{errors.last_name.message}</p>}
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <div style={s.inputWrap}>
              <Mail size={15} style={s.inputIcon} />
              <input style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
                type="email" placeholder="you@example.com"
                {...register('email', { required: 'Required' })} />
            </div>
            {errors.email && <p style={s.fieldError}>{errors.email.message}</p>}
          </div>

          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <Lock size={15} style={s.inputIcon} />
                <input style={{ ...s.input, ...(errors.password ? s.inputError : {}) }}
                  type="password" placeholder="Min. 8 characters"
                  {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} />
              </div>
              {errors.password && <p style={s.fieldError}>{errors.password.message}</p>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Confirm Password</label>
              <div style={s.inputWrap}>
                <Lock size={15} style={s.inputIcon} />
                <input style={{ ...s.input, ...(errors.confirm_password ? s.inputError : {}) }}
                  type="password" placeholder="Repeat password"
                  {...register('confirm_password', {
                    required: 'Required',
                    validate: (v) => v === watch('password') || 'Passwords do not match',
                  })} />
              </div>
              {errors.confirm_password && <p style={s.fieldError}>{errors.confirm_password.message}</p>}
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>I am joining as</label>
            <div style={s.roleGrid}>
              {[
                { val: 'applicant', label: 'Job Applicant', sub: 'Browse and apply for vacancies', Icon: UserCheck },
                { val: 'hr', label: 'HR Officer', sub: 'Post jobs and review candidates', Icon: Briefcase },
              ].map(({ val, label, sub, Icon }) => (
                <label key={val} style={{ ...s.roleCard, ...(selectedRole === val ? s.roleCardActive : {}) }}>
                  <input type="radio" value={val} {...register('role', { required: 'Select a role' })} style={{ display: 'none' }} />
                  <Icon size={20} color={selectedRole === val ? 'var(--action)' : 'var(--gray-400)'} />
                  <div>
                    <div style={{ ...s.roleLabel, ...(selectedRole === val ? { color: 'var(--action)' } : {}) }}>{label}</div>
                    <div style={s.roleSub}>{sub}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && <p style={s.fieldError}>{errors.role.message}</p>}
          </div>

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--gray-50)', padding: '2rem 1rem',
  },
  card: {
    width: '100%', maxWidth: '560px',
    background: 'var(--white)', borderRadius: 'var(--radius-xl)',
    padding: '2.5rem', boxShadow: 'var(--shadow-xl)',
    border: '1px solid var(--gray-100)',
  },
  cardHeader: { textAlign: 'center', marginBottom: '1.75rem' },
  logoMark: {
    width: '48px', height: '48px', borderRadius: '14px', margin: '0 auto 1.25rem',
    background: 'var(--action)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--gray-500)', fontSize: '0.875rem' },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  row: { display: 'flex', gap: '1rem' },
  field: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '0.7rem 0.7rem 0.7rem 2.25rem',
    borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-200)',
    fontSize: '0.9rem', color: 'var(--gray-800)', background: 'var(--white)',
    outline: 'none', boxSizing: 'border-box',
  },
  inputError: { borderColor: '#fca5a5' },
  fieldError: { color: '#ef4444', fontSize: '0.775rem' },
  roleGrid: { display: 'flex', gap: '0.75rem' },
  roleCard: {
    flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.85rem 1rem', borderRadius: 'var(--radius)',
    border: '1.5px solid var(--gray-200)', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  roleCardActive: { border: '1.5px solid var(--action)', background: '#e8eaf6' },
  roleLabel: { fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)' },
  roleSub: { fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: '0.1rem' },
  submitBtn: {
    padding: '0.85rem', borderRadius: 'var(--radius)',
    background: 'var(--action)', color: 'var(--white)',
    border: 'none', fontWeight: 700, fontSize: '0.95rem',
    cursor: 'pointer', marginTop: '0.25rem',
    boxShadow: '0 4px 12px rgba(26,35,126,0.3)',
  },
  footer: { textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-500)' },
  link: { color: 'var(--action)', fontWeight: 600 },
};
