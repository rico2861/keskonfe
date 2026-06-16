import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart, useAuth } from '../contexts'
import CartDrawer from './CartDrawer'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClass = [
    styles.nav,
    scrolled || !isHome ? styles.solid : styles.transparent,
  ].join(' ')

  return (
    <>
      <nav className={navClass} role="navigation" aria-label="Navigation principale">
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo} aria-label="Kèskonfè — Accueil">
            Kèskonfè
          </Link>

          {/* Desktop links */}
          <ul className={styles.links}>
            {[
              ['Vêtements', '/catalogue?cat=vetements'],
              ['Chaussures', '/catalogue?cat=chaussures'],
              ['Parfums', '/catalogue?cat=parfums'],
              ['Accessoires', '/catalogue?cat=accessoires'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className={styles.link}>{label}</Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={styles.actions}>
            {user ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>{user.firstName}</span>
                <button className={styles.iconBtn} onClick={logout} title="Déconnexion">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button className={styles.iconBtn} onClick={() => navigate('/login')} title="Se connecter" aria-label="Se connecter">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                </svg>
              </button>
            )}
            <button
              className={styles.cartBtn}
              onClick={() => setDrawerOpen(true)}
              aria-label={`Panier — ${count} article${count !== 1 ? 's' : ''}`}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </button>
            {/* Mobile burger */}
            <button className={styles.burger} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            {[['Nouveautés', '/catalogue'], ['Vêtements', '/catalogue?cat=vetements'],
              ['Chaussures', '/catalogue?cat=chaussures'], ['Parfums', '/catalogue?cat=parfums'],
              ['Accessoires', '/catalogue?cat=accessoires']].map(([l, h]) => (
              <Link key={l} to={h} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{l}</Link>
            ))}
          </div>
        )}
      </nav>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
