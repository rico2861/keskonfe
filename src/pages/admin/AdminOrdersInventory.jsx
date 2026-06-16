import { useState } from 'react'
import { allOrders, ORDER_STATUSES } from '../../data/orders'
import { products as initialProducts, formatPrice } from '../../data/products'
import styles from './AdminOrdersInventory.module.css'

// ── ORDERS ────────────────────────────────────────────────────────────────────
export function AdminOrders() {
  const [orders, setOrders] = useState(allOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [toast, setToast] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const updateStatus = (id, newStatus) => {
    setOrders(os => os.map(o => o.id === id ? { ...o, status: newStatus } : o))
    showToast('Statut mis à jour — ' + ORDER_STATUSES[newStatus].label)
  }

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    return (!q || o.id.toLowerCase().includes(q) || (o.customer || 'Sophie Martin').toLowerCase().includes(q))
      && (!statusFilter || o.status === statusFilter)
  })

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Commandes</h1>
          <p className={styles.subtitle}>{orders.length} commandes au total</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input type="search" placeholder="N° commande, client…" value={search}
          onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={styles.filterSelect}>
          <option value="">Tous les statuts</option>
          {Object.entries(ORDER_STATUSES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <span className={styles.resultCount}>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Articles</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Changer le statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => {
              const st = ORDER_STATUSES[order.status]
              const isExpanded = expandedId === order.id
              return (
                <>
                  <tr key={order.id} className={styles.orderRow} onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                    <td>
                      <p className={styles.orderId}>{order.id}</p>
                      <p className={styles.expandHint}>{isExpanded ? '▲ Réduire' : '▼ Voir articles'}</p>
                    </td>
                    <td>
                      <p className={styles.customerName}>{order.customer || 'Sophie Martin'}</p>
                      <p className={styles.customerEmail}>{order.email || 'sophie@example.com'}</p>
                    </td>
                    <td className={styles.orderDate}>
                      {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className={styles.itemCount}>{order.items.reduce((s, i) => s + i.qty, 0)} article{order.items.reduce((s,i) => s+i.qty,0) > 1 ? 's' : ''}</td>
                    <td className={styles.orderTotal}>{formatPrice(order.total)}</td>
                    <td>
                      <span className={styles.statusBadge} style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={styles.statusSelect}
                        style={{ borderColor: st.color, color: st.color }}
                      >
                        {Object.entries(ORDER_STATUSES).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={order.id + '-detail'} className={styles.expandRow}>
                      <td colSpan={7}>
                        <div className={styles.expandContent}>
                          <div className={styles.expandItems}>
                            {order.items.map((item, i) => (
                              <div key={i} className={styles.expandItem}>
                                <img src={item.images[0]} alt={item.name} className={styles.expandImg} />
                                <div>
                                  <p className={styles.expandName}>{item.name}</p>
                                  <p className={styles.expandMeta}>{[item.size, item.color].filter(Boolean).join(' · ')} · x{item.qty}</p>
                                </div>
                                <span className={styles.expandPrice}>{formatPrice(item.unitPrice * item.qty)}</span>
                              </div>
                            ))}
                          </div>
                          <div className={styles.expandAddr}>
                            <p className={styles.expandAddrLabel}>Livraison</p>
                            <p className={styles.expandAddrText}>{order.address}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className={styles.empty}>Aucune commande trouvée.</div>}
      </div>
    </div>
  )
}

// ── INVENTORY ─────────────────────────────────────────────────────────────────
export function AdminInventory() {
  const [products, setProducts] = useState(initialProducts)
  const [toast, setToast] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editVal, setEditVal] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const startEdit = (p) => { setEditingId(p.id); setEditVal(String(p.stock)) }
  const saveStock = (id) => {
    const val = parseInt(editVal)
    if (!isNaN(val) && val >= 0) {
      setProducts(ps => ps.map(p => p.id === id ? { ...p, stock: val } : p))
      showToast('Stock mis à jour')
    }
    setEditingId(null)
  }

  const lowStock = products.filter(p => p.stock <= 5)

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Inventaire & Stocks</h1>
          <p className={styles.subtitle}>{products.length} références gérées</p>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className={styles.alertBanner}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <strong>{lowStock.length} produit{lowStock.length > 1 ? 's' : ''}</strong> en stock faible (≤ 5 unités) :
          {lowStock.map(p => <span key={p.id} className={styles.alertChip}>{p.name} ({p.stock})</span>)}
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock actuel</th>
              <th>Niveau</th>
              <th>Modifier le stock</th>
            </tr>
          </thead>
          <tbody>
            {products.sort((a, b) => a.stock - b.stock).map(p => {
              const level = p.stock === 0 ? 'rupture' : p.stock <= 3 ? 'critique' : p.stock <= 10 ? 'bas' : 'ok'
              const isEditing = editingId === p.id
              return (
                <tr key={p.id}>
                  <td>
                    <div className={styles.productCell}>
                      <img src={p.images[0]} alt={p.name} className={styles.productImg} />
                      <div>
                        <p className={styles.productName}>{p.name}</p>
                        <p className={styles.productBrand}>{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className={styles.catChip}>{p.category}</span></td>
                  <td className={styles.priceCol}>{formatPrice(p.price)}</td>
                  <td>
                    <span className={`${styles.stockNum} ${styles['stock_' + level]}`}>{p.stock}</span>
                  </td>
                  <td>
                    <div className={styles.stockBar}>
                      <div className={styles.stockBarFill} style={{
                        width: `${Math.min(100, (p.stock / 30) * 100)}%`,
                        background: level === 'ok' ? '#639922' : level === 'bas' ? '#BA7517' : '#E24B4A'
                      }} />
                    </div>
                    <span className={`${styles.stockLevel} ${styles['level_' + level]}`}>
                      {level === 'rupture' ? 'Rupture' : level === 'critique' ? 'Critique' : level === 'bas' ? 'Stock bas' : 'Normal'}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <div className={styles.editRow}>
                        <input
                          type="number" min="0" value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          className={styles.stockInput}
                          onKeyDown={e => { if (e.key === 'Enter') saveStock(p.id); if (e.key === 'Escape') setEditingId(null) }}
                          autoFocus
                        />
                        <button className={styles.saveStockBtn} onClick={() => saveStock(p.id)}>✓</button>
                        <button className={styles.cancelStockBtn} onClick={() => setEditingId(null)}>✕</button>
                      </div>
                    ) : (
                      <button className={styles.editStockBtn} onClick={() => startEdit(p)}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        Modifier
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── CLIENTS ───────────────────────────────────────────────────────────────────
export function AdminClients() {
  const mockClients = [
    { id: 1, name: 'Sophie Martin', email: 'sophie@example.com', orders: 4, spent: 234500, joined: '2026-01-15', active: true },
    { id: 2, name: 'Marie Dupont', email: 'marie@example.com', orders: 1, spent: 38000, joined: '2026-03-22', active: true },
    { id: 3, name: 'Jean Pierre', email: 'jean@example.com', orders: 2, spent: 118700, joined: '2026-02-08', active: true },
    { id: 4, name: 'Nathalie Joseph', email: 'nathalie@example.com', orders: 2, spent: 85000, joined: '2026-04-01', active: true },
    { id: 5, name: 'Paul Morin', email: 'paul@example.com', orders: 1, spent: 127500, joined: '2026-05-10', active: false },
  ]
  const [clients, setClients] = useState(mockClients)
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search.toLowerCase()))

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Clients</h1>
          <p className={styles.subtitle}>{clients.length} clients enregistrés</p>
        </div>
      </div>
      <div className={styles.toolbar}>
        <input type="search" placeholder="Nom, email…" value={search} onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>Client</th><th>Email</th><th>Commandes</th><th>Total dépensé</th><th>Inscrit le</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div className={styles.clientCell}>
                    <div className={styles.clientAvatar}>{c.name.split(' ').map(n => n[0]).join('')}</div>
                    <span className={styles.clientName}>{c.name}</span>
                  </div>
                </td>
                <td className={styles.clientEmail}>{c.email}</td>
                <td className={styles.clientOrders}>{c.orders}</td>
                <td className={styles.clientSpent}>{formatPrice(c.spent)}</td>
                <td className={styles.clientDate}>{new Date(c.joined).toLocaleDateString('fr-FR')}</td>
                <td>
                  <span className={`${styles.clientStatus} ${c.active ? styles.clientActive : styles.clientInactive}`}>
                    {c.active ? 'Actif' : 'Suspendu'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
