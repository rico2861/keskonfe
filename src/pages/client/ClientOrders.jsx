import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { mockOrders, ORDER_STATUSES } from '../../data/orders'
import { formatPrice } from '../../data/products'
import styles from './ClientOrders.module.css'

// ── Order list ──────────────────────────────────────────────────────────────
export function ClientOrders() {
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL' ? mockOrders : mockOrders.filter(o => o.status === filter)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mes commandes</h1>

      {/* Filter tabs */}
      <div className={styles.tabs} role="tablist">
        {[['ALL', 'Toutes'], ['PROCESSING', 'En cours'], ['SHIPPED', 'Expédiées'], ['DELIVERED', 'Livrées'], ['CANCELLED', 'Annulées']].map(([val, label]) => (
          <button
            key={val}
            role="tab"
            aria-selected={filter === val}
            className={`${styles.tab} ${filter === val ? styles.tabActive : ''}`}
            onClick={() => setFilter(val)}
          >
            {label}
            <span className={styles.tabCount}>
              {val === 'ALL' ? mockOrders.length : mockOrders.filter(o => o.status === val).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>Aucune commande dans cette catégorie.</p>
          <Link to="/catalogue">Explorer la boutique</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map(order => {
            const st = ORDER_STATUSES[order.status]
            return (
              <div key={order.id} className={styles.card}>
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderLeft}>
                    <p className={styles.orderId}>{order.id}</p>
                    <p className={styles.orderDate}>
                      Commandé le {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className={styles.cardHeaderRight}>
                    <span className={styles.statusBadge} style={{ background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                    <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Progress tracker */}
                <OrderProgress status={order.status} />

                {/* Items preview */}
                <div className={styles.itemsRow}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.itemPreview}>
                      <img src={item.images[0]} alt={item.name} />
                      <div className={styles.itemPreviewInfo}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemMeta}>
                          {[item.size, item.color].filter(Boolean).join(' · ')} · ×{item.qty}
                        </p>
                        <p className={styles.itemPrice}>{formatPrice(item.unitPrice * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                  <div className={styles.addressRow}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
                    <span>{order.address}</span>
                  </div>
                  <div className={styles.cardActions}>
                    {order.status === 'PENDING' && (
                      <button className={styles.cancelBtn}>Annuler</button>
                    )}
                    {order.status === 'DELIVERED' && (
                      <button className={styles.reviewBtn}>Laisser un avis</button>
                    )}
                    <Link to={`/mon-compte/commandes/${order.id}`} className={styles.detailBtn}>
                      Voir le détail →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Progress bar ─────────────────────────────────────────────────────────────
const STEPS_ORDER = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
const STEP_LABELS  = { PENDING: 'Reçue', CONFIRMED: 'Confirmée', PROCESSING: 'Préparation', SHIPPED: 'Expédiée', DELIVERED: 'Livrée' }

function OrderProgress({ status }) {
  if (status === 'CANCELLED') {
    return (
      <div className={styles.cancelledBar}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
        Commande annulée
      </div>
    )
  }
  const currentIdx = STEPS_ORDER.indexOf(status)
  return (
    <div className={styles.progressBar}>
      {STEPS_ORDER.map((s, i) => (
        <div key={s} className={styles.progressStep}>
          <div className={`${styles.progressDot} ${i < currentIdx ? styles.dotDone : i === currentIdx ? styles.dotActive : styles.dotPending}`}>
            {i < currentIdx ? (
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
            ) : null}
          </div>
          {i < STEPS_ORDER.length - 1 && (
            <div className={`${styles.progressLine} ${i < currentIdx ? styles.lineDone : ''}`} />
          )}
          <span className={`${styles.progressLabel} ${i === currentIdx ? styles.progressLabelActive : ''}`}>
            {STEP_LABELS[s]}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Order detail ──────────────────────────────────────────────────────────────
export function ClientOrderDetail() {
  const { id } = useParams()
  const order = mockOrders.find(o => o.id === id)

  if (!order) return (
    <div className={styles.notFound}>
      <p>Commande introuvable.</p>
      <Link to="/mon-compte/commandes">← Retour aux commandes</Link>
    </div>
  )

  const st = ORDER_STATUSES[order.status]

  return (
    <div className={styles.detailPage}>
      <Link to="/mon-compte/commandes" className={styles.backLink}>← Toutes les commandes</Link>

      <div className={styles.detailHeader}>
        <div>
          <h1 className={styles.detailId}>{order.id}</h1>
          <p className={styles.detailDate}>
            Commandé le {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={styles.statusBadge} style={{ background: st.bg, color: st.color }}>{st.label}</span>
      </div>

      <OrderProgress status={order.status} />

      <div className={styles.detailGrid}>
        {/* Articles */}
        <div className={styles.detailCard}>
          <h2 className={styles.detailCardTitle}>Articles commandés</h2>
          {order.items.map((item, i) => (
            <div key={i} className={styles.detailItem}>
              <img src={item.images[0]} alt={item.name} className={styles.detailItemImg} />
              <div className={styles.detailItemInfo}>
                <p className={styles.detailItemBrand}>{item.brand}</p>
                <p className={styles.detailItemName}>{item.name}</p>
                <p className={styles.detailItemMeta}>{[item.size, item.color].filter(Boolean).join(' · ')} · ×{item.qty}</p>
              </div>
              <span className={styles.detailItemPrice}>{formatPrice(item.unitPrice * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className={styles.detailSide}>
          {/* Totals */}
          <div className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>Récapitulatif</h2>
            <div className={styles.totals}>
              <div className={styles.totalRow}><span>Sous-total</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className={styles.totalRow}><span>Livraison</span><span>{order.delivery === 0 ? 'Gratuit' : formatPrice(order.delivery)}</span></div>
              <div className={`${styles.totalRow} ${styles.totalFinal}`}><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Address */}
          <div className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>Adresse de livraison</h2>
            <p className={styles.detailAddress}>{order.address}</p>
          </div>

          {/* Actions */}
          {(order.status === 'PENDING' || order.status === 'DELIVERED') && (
            <div className={styles.detailCard}>
              <h2 className={styles.detailCardTitle}>Actions</h2>
              {order.status === 'PENDING' && (
                <button className={styles.cancelBtnLg}>Annuler la commande</button>
              )}
              {order.status === 'DELIVERED' && (
                <button className={styles.reviewBtnLg}>Laisser un avis</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
