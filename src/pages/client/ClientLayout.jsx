import { useState } from 'react'
import { Link, useNavigate, Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts'
import styles from './ClientLayout.module.css'

const NAV = [
  { to: '/mon-compte', label: 'Tableau de bord', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  ), end: true },
  { to: '/mon-compte/commandes', label: 'Mes commandes', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
  )},
  { to: '/mon-compte/adresses', label: 'Mes adresses', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
  )},
  { to: '/mon-compte/profil', label: 'Mon profil', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
  )},
]

export default function ClientLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileNav, setMobileNav] = useState(false)

  if (!user) {
    return (
      <div className={styles.authWall}>
        <p className={styles.authWallTitle}>Connexion requise</p>
        <p className={styles.authWallSub}>Connectez-vous pour accéder à votre espace personnel.</p>
        <Link to="/login" className={styles.authWallBtn}>Se connecter</Link>
      </div>
    )
  }

  return (
    <div className={styles.shell}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <Link to="/" className={styles.topLogo}>← Kèskonfè</Link>
        <span className={styles.topTitle}>Mon espace</span>
        <button className={styles.topLogout} onClick={() => { logout(); navigate('/') }}>
          Déconnexion
        </button>
      </header>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{user.firstName[0]}{user.lastName[0]}</div>
            <div>
              <p className={styles.userName}>{user.firstName} {user.lastName}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          <nav className={styles.nav}>
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
