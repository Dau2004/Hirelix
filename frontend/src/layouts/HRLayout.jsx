import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, LogOut, Briefcase,
  ChevronRight, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listJobs } from '../api/jobs';

const SIDEBAR_W = 248;

export default function HRLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    listJobs().then(r => {
      setJobs(r.data);
    }).catch(() => {});
  }, [user, location.pathname]); // refresh when navigating (e.g. after posting a job)

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={s.root}>
      {/* ── Sidebar ── */}
      <aside style={{ ...s.sidebar, width: collapsed ? '64px' : `${SIDEBAR_W}px` }}>

        {/* Logo */}
        <div style={s.logoRow}>
          <div style={s.logoMark}>
            <span style={s.logoLetter}>H</span>
          </div>
          {!collapsed && (
            <div style={s.logoText}>
              <span style={s.logoName}>Hirelix</span>
              <span style={s.logoSub}>HR Portal</span>
            </div>
          )}
          <button style={s.collapseBtn} onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand' : 'Collapse'}>
            {collapsed ? <ChevronRight size={15} color="rgba(255,255,255,0.5)" /> : <X size={15} color="rgba(255,255,255,0.5)" />}
          </button>
        </div>

        {/* Divider */}
        <div style={s.divider} />

        {/* Main nav */}
        <nav style={s.nav}>
          <SideLink
            to="/hr/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            active={isActive('/hr/dashboard')}
            collapsed={collapsed}
          />
          <SideLink
            to="/hr/jobs/new"
            icon={PlusCircle}
            label="Post Vacancy"
            active={isActive('/hr/jobs/new')}
            collapsed={collapsed}
          />
        </nav>

        {/* Vacancies sub-list */}
        {!collapsed && jobs.length > 0 && (
          <>
            <div style={s.sectionLabel}>MY VACANCIES</div>
            <div style={s.jobsList}>
              {jobs.map(job => {
                const active = location.pathname === `/hr/jobs/${job.id}/rankings`;
                return (
                  <NavLink
                    key={job.id}
                    to={`/hr/jobs/${job.id}/rankings`}
                    style={{ ...s.jobItem, ...(active ? s.jobItemActive : {}) }}
                  >
                    <div style={s.jobDot}>
                      <Briefcase size={12} color={active ? 'var(--primary)' : 'rgba(255,255,255,0.4)'} />
                    </div>
                    <div style={s.jobItemText}>
                      <span style={{ ...s.jobTitle, ...(active ? { color: '#fff' } : {}) }}>
                        {job.title.length > 22 ? job.title.slice(0, 22) + '…' : job.title}
                      </span>
                      <span style={s.jobMeta}>
                        {job.application_count ?? 0} applicant{job.application_count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {job.status === 'open' && <span style={s.openDot} />}
                  </NavLink>
                );
              })}
            </div>
          </>
        )}

        {/* Spacer pushes user to bottom */}
        <div style={{ flex: 1 }} />

        {/* Divider */}
        <div style={s.divider} />

        {/* User card */}
        <div style={s.userCard}>
          <div style={s.userAvatar}>
            {user?.full_name?.[0] || user?.email?.[0] || 'U'}
          </div>
          {!collapsed && (
            <div style={s.userInfo}>
              <span style={s.userName}>{user?.full_name || user?.email}</span>
              <span style={s.userRole}>HR Officer</span>
            </div>
          )}
          <button style={s.logoutBtn} onClick={handleLogout} title="Sign out">
            <LogOut size={15} color="rgba(255,255,255,0.55)" />
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ ...s.main, marginLeft: collapsed ? '64px' : `${SIDEBAR_W}px` }}>
        <Outlet />
      </main>
    </div>
  );
}

function SideLink({ to, icon: Icon, label, active, collapsed }) {
  return (
    <NavLink
      to={to}
      style={{ ...sl.link, ...(active ? sl.active : {}) }}
      title={collapsed ? label : undefined}
    >
      <Icon size={17} color={active ? '#fff' : 'rgba(255,255,255,0.6)'} />
      {!collapsed && <span style={{ ...sl.label, ...(active ? sl.labelActive : {}) }}>{label}</span>}
    </NavLink>
  );
}

const sl = {
  link:        { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.15s', margin: '0 0.5rem' },
  active:      { background: 'rgba(255,255,255,0.12)', borderLeft: '3px solid var(--primary)', paddingLeft: 'calc(1rem - 3px)' },
  label:       { fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' },
  labelActive: { color: '#fff', fontWeight: 600 },
};

const s = {
  root: { display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' },

  /* sidebar */
  sidebar: {
    position: 'fixed', top: 0, left: 0, height: '100vh',
    background: 'var(--action)',
    display: 'flex', flexDirection: 'column',
    zIndex: 40,
    transition: 'width 0.2s ease',
    overflowX: 'hidden', overflowY: 'auto',
    boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
  },

  /* logo row */
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '1.25rem 1rem 1.1rem',
    flexShrink: 0,
  },
  logoMark: {
    width: '34px', height: '34px', borderRadius: '9px',
    background: 'var(--primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  logoLetter: { color: '#fff', fontWeight: 800, fontSize: '1rem' },
  logoText:   { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.05rem' },
  logoName:   { color: '#fff', fontWeight: 700, fontSize: '0.975rem', letterSpacing: '-0.01em' },
  logoSub:    { color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontWeight: 500 },
  collapseBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', flexShrink: 0, display: 'flex', marginLeft: 'auto' },

  /* nav */
  divider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.5rem 0' },
  nav:     { display: 'flex', flexDirection: 'column', gap: '0.15rem', padding: '0.5rem 0' },

  /* vacancies section */
  sectionLabel: { padding: '0.9rem 1.5rem 0.4rem', fontSize: '0.67rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' },
  jobsList:     { display: 'flex', flexDirection: 'column', gap: '0.1rem', paddingBottom: '0.5rem' },
  jobItem:      { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem 0.5rem 1.25rem', textDecoration: 'none', borderRadius: '8px', margin: '0 0.5rem', transition: 'background 0.15s' },
  jobItemActive: { background: 'rgba(255,255,255,0.1)' },
  jobDot:       { flexShrink: 0 },
  jobItemText:  { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.05rem', minWidth: 0 },
  jobTitle:     { fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  jobMeta:      { fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' },
  openDot:      { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 },

  /* user card */
  userCard: { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '1rem', flexShrink: 0 },
  userAvatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', flexShrink: 0,
  },
  userInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.05rem', minWidth: 0 },
  userName: { fontSize: '0.82rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' },
  logoutBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', flexShrink: 0, display: 'flex' },

  /* main content */
  main: { flex: 1, transition: 'margin-left 0.2s ease', minHeight: '100vh' },
};
