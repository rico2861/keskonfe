import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.logo}>Kèskonfè</p>
          <p className={styles.tagline}>Mode éthique, style intemporel.</p>
          <p className={styles.tagline}>Port-au-Prince, Haïti</p>
        </div>
        <div className={styles.cols}>
          {[
            { title: 'Boutique', links: [['Vêtements', '/catalogue?cat=vetements'], ['Chaussures', '/catalogue?cat=chaussures'], ['Parfums', '/catalogue?cat=parfums'], ['Accessoires', '/catalogue?cat=accessoires']] },
            { title: 'Compte', links: [['Se connecter', '/login'], ['Créer un compte', '/register'], ['Mes commandes', '/commandes'], ['Mon profil', '/profil']] },
            { title: 'Aide', links: [['FAQ', '#'], ['Livraison & retours', '#'], ['Nous contacter', '#'], ['Authenticité', '#']] },
          ].map(col => (
            <div key={col.title} className={styles.col}>
              <p className={styles.colTitle}>{col.title}</p>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={label}><Link to={href} className={styles.colLink}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Kèskonfè — Tous droits réservés</p>
        <div className={styles.bottomLinks}>
          <a href="#">Confidentialité</a>
          <a href="#">Conditions</a>
          <a href="#">Mentions légales</a>
        </div>
      </div>
    </footer>
  )
}
