import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { products, formatPrice } from '../data/products'
import { useCart } from '../contexts'
import ProductCard from '../components/ProductCard'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const { dispatch } = useCart()
  const navigate = useNavigate()
  const product = products.find(p => p.slug === slug)

  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Produit introuvable</h1>
        <Link to="/catalogue">Retour au catalogue</Link>
      </div>
    )
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discount = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    for (let i = 0; i < qty; i++) {
      dispatch({
        type: 'ADD',
        item: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.images[0],
          size: selectedSize,
          color: selectedColor,
        }
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/catalogue">Catalogue</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className={styles.main}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.thumbs}>
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`Image ${i + 1}`}
              >
                <img src={img} alt={`${product.name} ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
          <div className={styles.mainImg}>
            <img
              key={activeImg}
              src={product.images[activeImg]}
              alt={product.name}
              className={styles.mainImgEl}
            />
            {product.isNew && <span className={styles.badgeNew}>Nouveau</span>}
            {hasDiscount && <span className={styles.badgeSale}>−{discount}%</span>}
            {product.stock <= 3 && (
              <span className={styles.stockAlert}>Dernières pièces — {product.stock} restant{product.stock > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <p className={styles.brand}>{product.brand}</p>
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.ratingRow}>
            <div className={styles.stars} aria-label={`Note : ${product.rating}/5`}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(product.rating) ? 'var(--gold)' : 'var(--cream-dark)'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className={styles.ratingNum}>{product.rating}</span>
            <span className={styles.reviewCount}>({product.reviews} avis)</span>
          </div>

          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {hasDiscount && (
              <>
                <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                <span className={styles.savings}>Économisez {formatPrice(product.originalPrice - product.price)}</span>
              </>
            )}
          </div>

          <div className={styles.divider} />

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className={styles.optionGroup}>
              <p className={styles.optionLabel}>
                Couleur {selectedColor && <strong>— {selectedColor}</strong>}
              </p>
              <div className={styles.colorList}>
                {product.colors.map(c => (
                  <button
                    key={c}
                    className={`${styles.colorBtn} ${selectedColor === c ? styles.colorActive : ''}`}
                    onClick={() => setSelectedColor(c)}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className={styles.optionGroup}>
              <p className={`${styles.optionLabel} ${sizeError ? styles.optionError : ''}`}>
                {product.sizes.length > 1 ? 'Taille' : 'Format'}
                {selectedSize && <strong> — {selectedSize}</strong>}
                {sizeError && <span className={styles.errorMsg}> · Veuillez choisir une taille</span>}
              </p>
              <div className={styles.sizeList}>
                {product.sizes.map(s => (
                  <button
                    key={s}
                    className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeActive : ''}`}
                    onClick={() => { setSelectedSize(s); setSizeError(false) }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add */}
          <div className={styles.addRow}>
            <div className={styles.qtyControl}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuer">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} aria-label="Augmenter">+</button>
            </div>
            <button
              className={`${styles.addBtn} ${added ? styles.addBtnSuccess : ''}`}
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Ajouté au panier
                </>
              ) : 'Ajouter au panier'}
            </button>
          </div>

          {/* Description */}
          <div className={styles.divider} />
          <div className={styles.description}>
            <h2 className={styles.descTitle}>Description</h2>
            <p className={styles.descText}>{product.description}</p>
          </div>

          {/* Meta */}
          <div className={styles.metas}>
            {[
              ['Référence', `MAI-${product.id.toString().padStart(4, '0')}`],
              ['Disponibilité', product.stock > 0 ? `En stock (${product.stock} pièces)` : 'Rupture de stock'],
              ['Livraison', 'Gratuite dès 50 000 HTG'],
              ['Retours', 'Sous 30 jours'],
            ].map(([k, v]) => (
              <div key={k} className={styles.meta}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedInner}>
            <p className={styles.relatedEyebrow}>Vous aimerez aussi</p>
            <h2 className={styles.relatedTitle}>Dans la même catégorie</h2>
            <div className={styles.relatedGrid}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
