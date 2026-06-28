import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import styles from './Home.module.css'

const featured = products.filter(p => p.isBestSeller || p.isNew).slice(0, 4)
const newArrivals = products.filter(p => p.isNew).slice(0, 3)

const heroSlides = [
  {
    eyebrow: 'Nouvelle Collection',
    title: "L'élégance", 
    em: 'au naturel',
    sub: 'Vêtements, chaussures, parfums et accessoires sélectionnés pour leur caractère.',
    cta: 'Découvrir la collection',
    secondary: 'Vêtements femme',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85',
    alt: 'Femme en robe élégante',
  },
  {
    eyebrow: 'Edition limitée',
    title: 'Le confort',
    em: 'en version luxe',
    sub: 'Des matières raffinées et des coupes intemporelles pour un dressing résolument chic.',
    cta: 'Voir les nouveautés',
    secondary: 'Chaussures à la mode',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=85',
    alt: 'Mode femme moderne',
  },
  {
    eyebrow: 'Coup de cœur',
    title: 'La saison',
    em: 'à portée de main',
    sub: 'Une sélection de pièces signature pour sublimer chaque moment de la journée.',
    cta: 'Explorer les looks',
    secondary: 'Accessoires raffinés',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=85',
    alt: 'Look mode raffinée',
  },
]

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % heroSlides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const currentSlide = heroSlides[activeSlide]

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              className={`${styles.heroImg} ${index === activeSlide ? styles.heroImgActive : ''}`}
            />
          ))}
          <div className={styles.heroOverlay} />
          <div className={styles.carouselControls}>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={() => setActiveSlide(current => (current - 1 + heroSlides.length) % heroSlides.length)}
              aria-label="Image précédente"
            >
              ‹
            </button>
            <div className={styles.carouselDots}>
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  className={`${styles.carouselDot} ${index === activeSlide ? styles.carouselDotActive : ''}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Afficher la diapositive ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={() => setActiveSlide(current => (current + 1) % heroSlides.length)}
              aria-label="Image suivante"
            >
              ›
            </button>
          </div>
        </div>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>{currentSlide.eyebrow}</p>
          <h1 className={styles.heroTitle}>
            {currentSlide.title}<br />
            <em>{currentSlide.em}</em>
          </h1>
          <p className={styles.heroSub}>{currentSlide.sub}</p>
          <div className={styles.heroCtas}>
            <Link to="/catalogue" className={styles.ctaPrimary}>{currentSlide.cta}</Link>
            <Link to="/catalogue?cat=vetements" className={styles.ctaSecondary}>{currentSlide.secondary}</Link>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <span>Défiler</span>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* Categories */}
      <section className={styles.cats}>
        <div className={styles.catsInner}>
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Explorer par univers</p>
            <h2 className={styles.sectionTitle}>Nos catégories</h2>
          </header>
          <div className={styles.catsGrid}>
            {[
              { label: 'Vêtements', slug: 'vetements', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80' },
              { label: 'Chaussures', slug: 'chaussures', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80' },
              { label: 'Parfums', slug: 'parfums', img: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80' },
              { label: 'Accessoires', slug: 'accessoires', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
            ].map(cat => (
              <Link key={cat.slug} to={`/catalogue?cat=${cat.slug}`} className={styles.catCard}>
                <img src={cat.img} alt={cat.label} className={styles.catImg} loading="lazy" />
                <div className={styles.catOverlay} />
                <span className={styles.catLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className={styles.featured}>
        <div className={styles.featuredInner}>
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Sélection du moment</p>
            <h2 className={styles.sectionTitle}>Pièces incontournables</h2>
            <Link to="/catalogue" className={styles.seeAll}>Tout voir →</Link>
          </header>
          <div className={styles.productGrid}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <p className={styles.bannerEyebrow}>Notre engagement</p>
          <h2 className={styles.bannerTitle}>Mode éthique,<br /><em>style intemporel</em></h2>
          <p className={styles.bannerText}>
            Chaque pièce est sélectionnée pour sa qualité et son impact réduit.
            Matières certifiées, production artisanale, livraison compensée.
          </p>
          <Link to="/catalogue" className={styles.bannerCta}>Découvrir</Link>
        </div>
      </section>

      {/* New arrivals */}
      <section className={styles.newArrivals}>
        <div className={styles.newInner}>
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Vient d'arriver</p>
            <h2 className={styles.sectionTitle}>Nouveautés</h2>
            <Link to="/catalogue?sort=new" className={styles.seeAll}>Toutes les nouveautés →</Link>
          </header>
          <div className={styles.productGrid3}>
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className={styles.trust}>
        {[
          { icon: '✦', title: 'Livraison offerte', sub: 'Dès 50 000 HTG d\'achat' },
          { icon: '◈', title: 'Retours 30 jours', sub: 'Échanges et remboursements' },
          { icon: '◇', title: 'Authenticité garantie', sub: 'Produits certifiés d\'origine' },
          { icon: '◉', title: 'Service client', sub: 'Disponible 7j/7' },
        ].map(t => (
          <div key={t.title} className={styles.trustItem}>
            <span className={styles.trustIcon}>{t.icon}</span>
            <p className={styles.trustTitle}>{t.title}</p>
            <p className={styles.trustSub}>{t.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
