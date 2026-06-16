import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discount = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  return (
    <article className={styles.card}>
      <Link to={`/produit/${product.slug}`} className={styles.imageWrap} tabIndex={0}>
        <img
          src={product.images[0]}
          alt={product.name}
          className={styles.img}
          loading="lazy"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} — vue 2`}
            className={`${styles.img} ${styles.imgHover}`}
            loading="lazy"
          />
        )}
        <div className={styles.overlay}>
          <span className={styles.overlayText}>Voir le produit</span>
        </div>
        <div className={styles.badges}>
          {product.isNew && <span className={styles.badgeNew}>Nouveau</span>}
          {product.isBestSeller && <span className={styles.badgeBest}>Best-seller</span>}
          {hasDiscount && <span className={styles.badgeSale}>−{discount}%</span>}
        </div>
      </Link>
      <div className={styles.info}>
        <p className={styles.brand}>{product.brand}</p>
        <Link to={`/produit/${product.slug}`} className={styles.name}>{product.name}</Link>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className={styles.rating}>
          <Stars rating={product.rating} />
          <span className={styles.reviewCount}>({product.reviews})</span>
        </div>
      </div>
    </article>
  )
}

function Stars({ rating }) {
  return (
    <div className={styles.stars} aria-label={`Note : ${rating}/5`}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? 'var(--gold)' : 'var(--cream-dark)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}
