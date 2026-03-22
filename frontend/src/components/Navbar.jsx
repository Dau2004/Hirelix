import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Briefcase, LayoutDashboard, FileText, PlusCircle, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const navLinks = user?.role === 'applicant'
    ? [
        { to: '/applicant/dashboard',    label: 'Dashboard',       icon: LayoutDashboard },
        { to: '/applicant/jobs',          label: 'Browse Jobs',     icon: Briefcase },
        { to: '/applicant/applications',  label: 'My Applications', icon: FileText },
      ]
    : user?.role === 'hr'
    ? [
        { to: '/hr/dashboard',  label: 'Dashboard',    icon: LayoutDashboard },
        { to: '/hr/jobs/new',   label: 'Post Vacancy', icon: PlusCircle },
      ]
    : [];

  const isActive = (path) => location.pathname === path;

  return (
    <header style={s.header}>
      <div style={s.inner}>
        {/* Logo */}
        <Link to="/" style={s.logo}>
          <div style={s.logoMark}>
            <span style={s.logoH}>H</span>
          </div>
          <span style={s.logoText}>Hirelix</span>
        </Link>

        {/* Desktop nav — hidden on mobile via CSS class */}
        <nav className="nav-desktop" style={s.desktopNav}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} style={{ ...s.navLink, ...(isActive(to) ? s.navLinkActive : {}) }}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth — hidden on mobile */}
        <div className="nav-auth" style={s.authArea}>
          {!user ? (
            <>
              <Link to="/login" style={s.loginBtn}>Sign In</Link>
              <Link to="/register" style={s.registerBtn}>Get Started</Link>
            </>
          ) : (
            <div style={s.userMenu}>
              <div style={s.avatar}>{user.full_name?.[0] || user.email?.[0] || 'U'}</div>
              <div style={s.userInfo}>
                <span style={s.userName}>{user.full_name?.split(' ')[0] || 'User'}</span>
                <span style={{ ...s.roleChip, ...(user.role === 'hr' ? s.roleChipHR : s.roleChipApp) }}>
                  {user.role === 'hr' ? 'HR Officer' : 'Applicant'}
                </span>
              </div>
              <button onClick={handleLogout} style={s.logoutBtn} title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger — visible only on mobile */}
        <button className="nav-hamburger" style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={s.mobileMenu}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} style={s.mobileLink} onClick={() => setMenuOpen(false)}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          {!user ? (
            <>
              <Link to="/login" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" style={{ ...s.mobileLink, color: 'var(--primary)', fontWeight: 600 }} onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          ) : (
            <button onClick={handleLogout} style={{ ...s.mobileLink, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}

const s = {
  header: {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'var(--white)',
    borderBottom: '1px solid var(--gray-200)',
    boxShadow: 'var(--shadow-sm)',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem',
    height: '64px', display: 'flex', alignItems: 'center', gap: '2rem',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 },
  logoMark: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'var(--action)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoH: { color: 'white', fontWeight: 800, fontSize: '1.1rem' },
  logoText: { fontWeight: 700, fontSize: '1.2rem', color: 'var(--action)', letterSpacing: '-0.02em' },
  desktopNav: {
    display: 'flex', gap: '0.25rem', flex: 1,
    '@media (max-width: 768px)': { display: 'none' },
  },
  navLink: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.45rem 0.75rem', borderRadius: 'var(--radius)',
    fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-600)',
    transition: 'all 0.15s',
  },
  navLinkActive: { color: 'var(--action)', background: 'var(--action-light)', fontWeight: 600 },
  authArea: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexShrink: 0 },
  loginBtn: {
    padding: '0.45rem 1rem', borderRadius: 'var(--radius)',
    fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)',
    border: '1px solid var(--gray-200)',
  },
  registerBtn: {
    padding: '0.45rem 1rem', borderRadius: 'var(--radius)',
    fontSize: '0.875rem', fontWeight: 600,
    background: 'var(--action)', color: 'var(--white)',
  },
  userMenu: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  userInfo: { display: 'flex', flexDirection: 'column', gap: '0.1rem' },
  roleChip: { fontSize: '0.67rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '100px', letterSpacing: '0.03em' },
  roleChipHR:  { background: '#e8eaf6', color: 'var(--action)' },
  roleChipApp: { background: 'var(--primary-bg)', color: 'var(--primary-dark)' },
  avatar: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: 'var(--action)',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase',
  },
  userName: { fontSize: '0.825rem', fontWeight: 600, color: 'var(--gray-800)', lineHeight: 1.2 },
  logoutBtn: {
    padding: '0.4rem', borderRadius: 'var(--radius)', background: 'var(--gray-100)',
    border: '1px solid var(--gray-200)', color: 'var(--gray-500)',
    display: 'flex', alignItems: 'center',
  },
  hamburger: {
    display: 'none', padding: '0.4rem', border: 'none', background: 'none',
    color: 'var(--gray-600)', marginLeft: 'auto',
  },
  mobileMenu: {
    borderTop: '1px solid var(--gray-100)', background: 'var(--white)',
    padding: '0.75rem 1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
  },
  mobileLink: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.65rem 0.75rem', borderRadius: 'var(--radius)',
    fontSize: '0.9rem', fontWeight: 500, color: 'var(--gray-700)',
  },
};
