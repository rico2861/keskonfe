import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products as initialProducts, formatPrice, categories } from '../../data/products'
import styles from './AdminProducts.module.css'

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [sortCol, setSortCol] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const toggleActive = (id) => {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))
    showToast('Statut mis à jour')
  }

  const sortBy = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase()
      return (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
        && (!catFilter || p.category === catFilter)
    })
    .sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol]
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })

  const SortIcon = ({ col }) => (
    <span className={styles.sortIcon}>
      {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Produits</h1>
          <p className={styles.subtitle}>{products.length} produits au total</p>
        </div>
        <button className={styles.addBtn} onClick={() => { setEditProduct(null); setShowModal(true) }}>
          + Ajouter un produit
        </button>
      </div>

      {/* Filters */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search" placeholder="Rechercher un produit ou une marque…"
            value={search} onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className={styles.filterSelect}>
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <span className={styles.resultCount}>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thImg}>Image</th>
              <th className={styles.thSortable} onClick={() => sortBy('name')}>Produit <SortIcon col="name"/></th>
              <th>Catégorie</th>
              <th className={styles.thSortable} onClick={() => sortBy('price')}>Prix <SortIcon col="price"/></th>
              <th className={styles.thSortable} onClick={() => sortBy('stock')}>Stock <SortIcon col="stock"/></th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className={!p.isActive ? styles.rowInactive : ''}>
                <td>
                  <img src={p.images[0]} alt={p.name} className={styles.productImg} />
                </td>
                <td>
                  <p className={styles.productName}>{p.name}</p>
                  <p className={styles.productBrand}>{p.brand}</p>
                </td>
                <td>
                  <span className={styles.catChip}>{categories.find(c => c.slug === p.category)?.name}</span>
                </td>
                <td>
                  <p className={styles.price}>{formatPrice(p.price)}</p>
                  {p.originalPrice && <p className={styles.originalPrice}>{formatPrice(p.originalPrice)}</p>}
                </td>
                <td>
                  <span className={`${styles.stockBadge} ${p.stock <= 3 ? styles.stockLow : p.stock <= 10 ? styles.stockMed : styles.stockOk}`}>
                    {p.stock}
                  </span>
                </td>
                <td>
                  <label className={styles.toggle} title={p.isActive ? 'Désactiver' : 'Activer'}>
                    <input type="checkbox" checked={p.isActive ?? true} onChange={() => toggleActive(p.id)} className={styles.toggleInput} />
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                    <span className={styles.toggleLabel}>{p.isActive ? 'Actif' : 'Inactif'}</span>
                  </label>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => { setEditProduct(p); setShowModal(true) }} title="Modifier">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <Link to={`/produit/${p.slug}`} className={styles.viewBtn} target="_blank" title="Voir">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className={styles.empty}>Aucun produit ne correspond à votre recherche.</div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (editProduct) {
              setProducts(ps => ps.map(p => p.id === editProduct.id ? { ...p, ...data } : p))
              showToast('Produit modifié avec succès')
            } else {
              setProducts(ps => [...ps, { ...data, id: Date.now(), slug: data.name.toLowerCase().replace(/\s+/g, '-'), images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400'], sizes: [], colors: [], rating: 0, reviews: 0, isNew: true, isBestSeller: false }])
              showToast('Produit ajouté avec succès')
            }
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || 'vetements',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    stock: product?.stock || '',
    description: product?.description || '',
    isActive: product?.isActive ?? true,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{product ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <button onClick={onClose} className={styles.modalClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Nom du produit</label>
              <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex : Robe en Soie Ivoire" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Marque</label>
              <input className={styles.input} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Ex : Jacquemus" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Catégorie</label>
              <select className={styles.input} value={form.category} onChange={e => set('category', e.target.value)}>
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Prix (HTG)</label>
              <input className={styles.input} type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} placeholder="42500" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Prix barré (HTG) — optionnel</label>
              <input className={styles.input} type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value ? Number(e.target.value) : null)} placeholder="52000" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Stock</label>
              <input className={styles.input} type="number" value={form.stock} onChange={e => set('stock', Number(e.target.value))} placeholder="25" />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Description</label>
              <textarea className={`${styles.input} ${styles.textarea}`} value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Description du produit…" />
            </div>
            <div className={styles.field}>
              <label className={styles.toggleLabel2}>
                <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
                Produit actif (visible en boutique)
              </label>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelModalBtn} onClick={onClose}>Annuler</button>
          <button className={styles.saveModalBtn} onClick={() => onSave(form)}>
            {product ? 'Enregistrer les modifications' : 'Créer le produit'}
          </button>
        </div>
      </div>
    </div>
  )
}
