import { Link } from 'react-router-dom'
import { adminStats, allOrders, ORDER_STATUSES } from '../../data/orders'
import { formatPrice } from '../../data/products'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const { revenue, orders, customers, avgBasket, salesByMonth, topProducts, recentActivity } = adminStats
  const maxRevenue = Math.max(...salesByMonth.map(m => m.revenue))
  const pendingOrders = allOrders.filter(o => ['PENDING','CONFIRMED','PROCESSING'].includes(o.status))

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Tableau de bord</h1>
        <p className={styles.subtitle}>Vue d'ensemble de votre boutique</p>
      </div>

      {/* KPI cards */}
      <div className={styles.kpiGrid}>
        {[
          { label: 'Chiffre d\'affaires', value: formatPrice(revenue.value), change: revenue.change, icon: '◈', color: 'gold' },
          { label: 'Commandes', value: orders.value, change: orders.change, icon: '◇', color: 'blue' },
          { label: 'Clients', value: customers.value, change: customers.change, icon: '◉', color: 'teal' },
          { label: 'Panier moyen', value: formatPrice(avgBasket.value), change: avgBasket.change, icon: '✦', color: 'purple' },
        ].map(kpi => (
          <div key={kpi.label} className={`${styles.kpiCard} ${styles[`kpi_${kpi.color}`]}`}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiIcon}>{kpi.icon}</span>
              <span className={`${styles.kpiChange} ${kpi.change >= 0 ? styles.changeUp : styles.changeDown}`}>
                {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}%
              </span>
            </div>
            <p className={styles.kpiValue}>{kpi.value}</p>
            <p className={styles.kpiLabel}>{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Sales chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Ventes — 6 derniers mois</h2>
            <span className={styles.cardBadge}>{formatPrice(revenue.value)} total</span>
          </div>
          <div className={styles.chart}>
            {salesByMonth.map(m => {
              const pct = Math.round((m.revenue / maxRevenue) * 100)
              return (
                <div key={m.month} className={styles.barGroup}>
                  <div className={styles.barWrap}>
                    <div className={styles.barTooltip}>{formatPrice(m.revenue)}</div>
                    <div className={styles.bar} style={{ height: `${pct}%` }} />
                  </div>
                  <span className={styles.barLabel}>{m.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activity */}
        <div className={styles.activityCard}>
          <h2 className={styles.cardTitle}>Activité récente</h2>
          <ul className={styles.activityList}>
            {recentActivity.map((a, i) => (
              <li key={i} className={styles.activityItem}>
                <span className={`${styles.activityDot} ${styles[`dot_${a.type}`]}`} />
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>{a.text}</p>
                  <p className={styles.activityTime}>{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        {/* Top products */}
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Top produits</h2>
            <Link to="/admin/produits" className={styles.cardLink}>Gérer →</Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th><th>Produit</th><th>Ventes</th><th>Revenu</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.name}>
                  <td className={styles.rank}>{i + 1}</td>
                  <td className={styles.productName}>{p.name}</td>
                  <td><span className={styles.salesPill}>{p.sales} ventes</span></td>
                  <td className={styles.revenue}>{formatPrice(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending orders */}
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Commandes à traiter</h2>
            <Link to="/admin/commandes" className={styles.cardLink}>Tout voir →</Link>
          </div>
          <div className={styles.pendingList}>
            {pendingOrders.slice(0, 5).map(order => {
              const st = ORDER_STATUSES[order.status]
              return (
                <div key={order.id} className={styles.pendingItem}>
                  <div>
                    <p className={styles.pendingId}>{order.id}</p>
                    <p className={styles.pendingCustomer}>{order.customer || 'Sophie Martin'}</p>
                  </div>
                  <div className={styles.pendingRight}>
                    <span className={styles.miniStatus} style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    <p className={styles.pendingTotal}>{formatPrice(order.total)}</p>
                  </div>
                </div>
              )
            })}
            {pendingOrders.length === 0 && (
              <p className={styles.noPending}>Aucune commande en attente 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
