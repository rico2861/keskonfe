import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, categories, brands, formatPrice } from '../data/products'
import styles from './Catalogue.module.css'

const SORTS = [
  { value: 'default', label: 'Par défaut' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'new', label: 'Nouveautés' },
]

export default function Catalogue() {
  const [params, setParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeCat = params.get('cat') || ''
  const activeBrand = params.get('brand') || ''
  const activeSort = params.get('sort') || 'default'
  const priceMax = parseInt(params.get('priceMax') || '200000')

  const set = (key, val) => {
    const next = new URLSearchParams(params)
    if (val) next.set(key, val)
    else next.delete(key)
    setParams(next)
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCat) list = list.filter(p => p.category === activeCat)
    if (activeBrand) list = list.filter(p => p.brand === activeBrand)
    list = list.filter(p => p.price <= priceMax)
    switch (activeSort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'new': list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew)); break
    }
    return list
  }, [activeCat, activeBrand, activeSort, priceMax])

  const activeFiltersCount = [activeCat, activeBrand].filter(Boolean).length

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <p className={styles.eyebrow}>Boutique</p>
        <h1 className={styles.title}>
          {activeCat ? categories.find(c => c.slug === activeCat)?.name : 'Toute la collection'}
        </h1>
        <p className={styles.count}>{filtered.length} article{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className={styles.layout}>
        {/* Sidebar overlay mobile */}
        {sidebarOpen && (
          <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Filters sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Filtres</h2>
            {activeFiltersCount > 0 && (
              <button className={styles.clearAll} onClick={() => {
                const next = new URLSearchParams()
                if (activeSort !== 'default') next.set('sort', activeSort)
                setParams(next)
              }}>
                Effacer ({activeFiltersCount})
              </button>
            )}
            <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          {/* Category */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterLabel}>Catégorie</h3>
            <ul className={styles.filterList}>
              <li>
                <button
                  className={`${styles.filterItem} ${!activeCat ? styles.filterActive : ''}`}
                  onClick={() => set('cat', '')}
                >Toutes</button>
              </li>
              {categories.map(c => (
                <li key={c.id}>
                  <button
                    className={`${styles.filterItem} ${activeCat === c.slug ? styles.filterActive : ''}`}
                    onClick={() => set('cat', activeCat === c.slug ? '' : c.slug)}
                  >{c.name}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterLabel}>Marque</h3>
            <ul className={styles.filterList}>
              {brands.map(b => (
                <li key={b}>
                  <button
                    className={`${styles.filterItem} ${activeBrand === b ? styles.filterActive : ''}`}
                    onClick={() => set('brand', activeBrand === b ? '' : b)}
                  >{b}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterLabel}>
              Prix max — <strong>{formatPrice(priceMax)}</strong>
            </h3>
            <input
              type="range"
              min={10000}
              max={200000}
              step={5000}
              value={priceMax}
              onChange={e => set('priceMax', e.target.value)}
              className={styles.slider}
              aria-label="Prix maximum"
            />
            <div className={styles.sliderLabels}>
              <span>{formatPrice(10000)}</span>
              <span>{formatPrice(200000)}</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <button className={styles.filterToggle} onClick={() => setSidebarOpen(true)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3 6h18M8 12h8M11 18h2"/>
              </svg>
              Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            <span className={styles.toolbarCount}>{filtered.length} résultats</span>
            <select
              value={activeSort}
              onChange={e => set('sort', e.target.value)}
              className={styles.sortSelect}
              aria-label="Trier par"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Active filter chips */}
          {activeFiltersCount > 0 && (
            <div className={styles.chips}>
              {activeCat && (
                <button className={styles.chip} onClick={() => set('cat', '')}>
                  {categories.find(c => c.slug === activeCat)?.name} ✕
                </button>
              )}
              {activeBrand && (
                <button className={styles.chip} onClick={() => set('brand', '')}>
                  {activeBrand} ✕
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>Aucun article ne correspond à votre sélection.</p>
              <button onClick={() => setParams(new URLSearchParams())}>Effacer les filtres</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
