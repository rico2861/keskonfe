import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts'
import styles from './AdminLayout.module.css'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true, icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  )},
  { to: '/admin/produits', label: 'Produits', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
  )},
  { to: '/admin/inventaire', label: 'Inventaire', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
  )},
  { to: '/admin/commandes', label: 'Commandes', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/></svg>
  )},
  { to: '/admin/clients', label: 'Clients', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
  )},
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  // Mock: allow any logged-in user as admin for demo
  if (!user) {
    return (
      <div className={styles.authWall}>
        <p>Accès réservé aux administrateurs.</p>
        <Link to="/login" className={styles.authBtn}>Se connecter</Link>
        <p className={styles.authHint}>Conseil démo : connectez-vous avec n'importe quel email pour accéder à l'admin.</p>
      </div>
    )
  }

  return (
    <div className={`${styles.shell} ${collapsed ? styles.shellCollapsed : ''}`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link to="/" className={styles.logo}>
            {collapsed ? 'M' : 'Kèskonfè'}
          </Link>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(c => !c)} aria-label="Réduire le menu">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}/>
            </svg>
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          {!collapsed && (
            <div className={styles.adminUser}>
              <div className={styles.adminAvatar}>{user.firstName[0]}{user.lastName[0]}</div>
              <div className={styles.adminInfo}>
                <p className={styles.adminName}>{user.firstName} {user.lastName}</p>
                <p className={styles.adminRole}>Administrateur</p>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/') }} title="Déconnexion">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
            </svg>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.content}>
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <Link to="/" className={styles.storeFront}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              Voir la boutique
            </Link>
          </div>
          <div className={styles.topBarRight}>
            <span className={styles.topBarDate}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </header>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
