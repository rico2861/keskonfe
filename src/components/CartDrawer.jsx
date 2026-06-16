import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts'
import { formatPrice } from '../data/products'
import styles from './CartDrawer.module.css'

export default function CartDrawer({ open, onClose }) {
  const { items, total, count, dispatch } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`} onClick={onClose} aria-hidden />
      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} role="dialog" aria-label="Panier" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>Mon Panier {count > 0 && <span className={styles.count}>{count}</span>}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Fermer le panier">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <svg width="48" height="48" fill="none" stroke="var(--cream-dark)" strokeWidth="1" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Votre panier est vide</p>
              <button className={styles.continueShopping} onClick={onClose}>Explorer la boutique</button>
            </div>
          ) : (
            <ul className={styles.itemList}>
              {items.map(item => (
                <li key={item.key} className={styles.item}>
                  <img src={item.image} alt={item.name} className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemBrand}>{item.brand}</p>
                    <p className={styles.itemName}>{item.name}</p>
                    {item.size && <p className={styles.itemMeta}>{item.size}{item.color ? ` · ${item.color}` : ''}</p>}
                    <div className={styles.itemFooter}>
                      <div className={styles.qtyControl}>
                        <button onClick={() => item.qty === 1
                          ? dispatch({ type: 'REMOVE', key: item.key })
                          : dispatch({ type: 'UPDATE_QTY', key: item.key, qty: item.qty - 1 })}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => dispatch({ type: 'UPDATE_QTY', key: item.key, qty: item.qty + 1 })}>+</button>
                      </div>
                      <span className={styles.itemPrice}>{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => dispatch({ type: 'REMOVE', key: item.key })}
                    aria-label="Retirer du panier"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Sous-total</span>
              <span className={styles.totalAmount}>{formatPrice(total)}</span>
            </div>
            <p className={styles.footerNote}>Livraison calculée à la commande</p>
            <button
              className={styles.checkoutBtn}
              onClick={() => { onClose(); navigate('/checkout') }}
            >
              Passer la commande
            </button>
            <button className={styles.continueBtn} onClick={onClose}>
              Continuer mes achats
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
