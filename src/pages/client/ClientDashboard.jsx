import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts'
import { mockOrders, ORDER_STATUSES } from '../../data/orders'
import { formatPrice } from '../../data/products'
import styles from './ClientDashboard.module.css'

export default function ClientDashboard() {
  const { user } = useAuth()
  const recent = mockOrders.slice(0, 2)
  const totalSpent = mockOrders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0)

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>Bonjour, <em>{user.firstName}</em> 👋</h1>
        <p className={styles.welcomeSub}>Bienvenue dans votre espace personnel Kèskonfè.</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {[
          { label: 'Commandes passées', value: mockOrders.length, icon: '◈' },
          { label: 'Total dépensé', value: formatPrice(totalSpent), icon: '◇' },
          { label: 'Articles achetés', value: mockOrders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0), icon: '✦' },
          { label: 'En cours de livraison', value: mockOrders.filter(o => ['SHIPPED','PROCESSING','CONFIRMED'].includes(o.status)).length, icon: '◉' },
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Commandes récentes</h2>
          <Link to="/mon-compte/commandes" className={styles.seeAll}>Tout voir →</Link>
        </div>
        <div className={styles.orderList}>
          {recent.map(order => {
            const st = ORDER_STATUSES[order.status]
            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <p className={styles.orderId}>{order.id}</p>
                    <p className={styles.orderDate}>{new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={styles.statusBadge} style={{ background: st.bg, color: st.color }}>{st.label}</span>
                </div>
                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.orderItem}>
                      <img src={item.images[0]} alt={item.name} className={styles.orderItemImg} />
                      <div>
                        <p className={styles.orderItemName}>{item.name}</p>
                        <p className={styles.orderItemMeta}>{item.size && `${item.size}`}{item.color && ` · ${item.color}`} · ×{item.qty}</p>
                      </div>
                      <span className={styles.orderItemPrice}>{formatPrice(item.unitPrice * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.orderFooter}>
                  <span className={styles.orderTotal}>Total : <strong>{formatPrice(order.total)}</strong></span>
                  <Link to={`/mon-compte/commandes/${order.id}`} className={styles.orderDetail}>Voir le détail →</Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className={styles.quickLinks}>
        {[
          { to: '/catalogue', label: 'Explorer la boutique', sub: 'Découvrir les nouveautés', icon: '→' },
          { to: '/mon-compte/adresses', label: 'Gérer mes adresses', sub: 'Ajouter ou modifier', icon: '⊕' },
          { to: '/mon-compte/profil', label: 'Mon profil', sub: 'Informations personnelles', icon: '◎' },
        ].map(l => (
          <Link key={l.to} to={l.to} className={styles.quickLink}>
            <div>
              <p className={styles.quickLinkLabel}>{l.label}</p>
              <p className={styles.quickLinkSub}>{l.sub}</p>
            </div>
            <span className={styles.quickLinkIcon}>{l.icon}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
