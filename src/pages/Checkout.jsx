import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart, useAuth } from '../contexts'
import { formatPrice } from '../data/products'
import styles from './Checkout.module.css'

const STEPS = ['Adresse', 'Livraison', 'Paiement', 'Confirmation']

export default function Checkout() {
  const { items, total, dispatch } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const [address, setAddress] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', street: '', city: '', postal: '', country: 'Haïti' })
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState({ card: '', name: '', expiry: '', cvv: '' })

  const deliveryCost = delivery === 'express' ? 2500 : delivery === 'standard' && total >= 50000 ? 0 : 1500
  const orderTotal = total + deliveryCost

  if (orderPlaced) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <svg width="32" height="32" fill="none" stroke="var(--gold)" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h1 className={styles.successTitle}>Commande confirmée</h1>
          <p className={styles.successSub}>Merci pour votre achat ! Un email de confirmation vous a été envoyé à <strong>{user?.email || 'votre adresse'}</strong>.</p>
          <p className={styles.orderId}>Référence : <strong>MAI-{Math.floor(Math.random() * 90000) + 10000}</strong></p>
          <div className={styles.successActions}>
            <button className={styles.successPrimary} onClick={() => navigate('/')}>Retour à la boutique</button>
            <Link to="/catalogue" className={styles.successSecondary}>Continuer mes achats</Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <p>Votre panier est vide.</p>
        <Link to="/catalogue">Retour au catalogue</Link>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    await new Promise(r => setTimeout(r, 1500))
    dispatch({ type: 'CLEAR' })
    setOrderPlaced(true)
    setPlacing(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link to="/" className={styles.logo}>Kèskonfè</Link>
        <div className={styles.stepper} role="list">
          {STEPS.map((s, i) => (
            <div key={s} className={styles.stepItem} role="listitem">
              <div className={`${styles.stepDot} ${i < step ? styles.stepDone : i === step ? styles.stepActive : styles.stepPending}`}>
                {i < step ? (
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                ) : i + 1}
              </div>
              <span className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ''}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.left}>
          {/* Step 0: Address */}
          {step === 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Adresse de livraison</h2>
              <div className={styles.formGrid}>
                {[
                  { key: 'firstName', label: 'Prénom', type: 'text', placeholder: 'Sophie' },
                  { key: 'lastName', label: 'Nom', type: 'text', placeholder: 'Martin' },
                  { key: 'street', label: 'Adresse', type: 'text', placeholder: '12 rue de la Paix', full: true },
                  { key: 'city', label: 'Ville', type: 'text', placeholder: 'Port-au-Prince' },
                  { key: 'postal', label: 'Code postal', type: 'text', placeholder: 'HT-6120' },
                ].map(f => (
                  <div key={f.key} className={`${styles.field} ${f.full ? styles.fieldFull : ''}`}>
                    <label className={styles.label}>{f.label}</label>
                    <input
                      type={f.type}
                      value={address[f.key]}
                      onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className={styles.input}
                    />
                  </div>
                ))}
                <div className={styles.field}>
                  <label className={styles.label}>Pays</label>
                  <select value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value }))} className={styles.input}>
                    <option>Haïti</option><option>France</option><option>Canada</option><option>USA</option>
                  </select>
                </div>
              </div>
              <button className={styles.nextBtn} onClick={() => setStep(1)}>Continuer → Livraison</button>
            </div>
          )}

          {/* Step 1: Delivery */}
          {step === 1 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Mode de livraison</h2>
              <div className={styles.deliveryOptions}>
                {[
                  { value: 'standard', label: 'Livraison standard', sub: '5–7 jours ouvrés', price: total >= 50000 ? 'Gratuit' : formatPrice(1500) },
                  { value: 'express', label: 'Livraison express', sub: '2–3 jours ouvrés', price: formatPrice(2500) },
                ].map(opt => (
                  <label key={opt.value} className={`${styles.deliveryOpt} ${delivery === opt.value ? styles.deliveryOptActive : ''}`}>
                    <input type="radio" name="delivery" value={opt.value} checked={delivery === opt.value} onChange={() => setDelivery(opt.value)} className={styles.srOnly} />
                    <div className={styles.deliveryInfo}>
                      <span className={styles.deliveryLabel}>{opt.label}</span>
                      <span className={styles.deliverySub}>{opt.sub}</span>
                    </div>
                    <span className={styles.deliveryPrice}>{opt.price}</span>
                    <div className={styles.deliveryRadio} />
                  </label>
                ))}
              </div>
              <div className={styles.navBtns}>
                <button className={styles.backBtn} onClick={() => setStep(0)}>← Retour</button>
                <button className={styles.nextBtn} onClick={() => setStep(2)}>Continuer → Paiement</button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Paiement sécurisé</h2>
              <div className={styles.cardIcons}>
                {['Visa', 'MC', 'Amex'].map(c => (
                  <span key={c} className={styles.cardIcon}>{c}</span>
                ))}
                <span className={styles.secureNote}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Connexion SSL sécurisée
                </span>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field + ' ' + styles.fieldFull}>
                  <label className={styles.label}>Numéro de carte</label>
                  <input type="text" value={payment.card} onChange={e => setPayment(p => ({ ...p, card: e.target.value }))} placeholder="1234 5678 9012 3456" className={styles.input} maxLength={19} />
                </div>
                <div className={styles.field + ' ' + styles.fieldFull}>
                  <label className={styles.label}>Nom sur la carte</label>
                  <input type="text" value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} placeholder="SOPHIE MARTIN" className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Date d'expiration</label>
                  <input type="text" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} placeholder="MM/AA" className={styles.input} maxLength={5} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>CVV</label>
                  <input type="text" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} placeholder="123" className={styles.input} maxLength={4} />
                </div>
              </div>
              <div className={styles.navBtns}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>← Retour</button>
                <button className={styles.nextBtn} onClick={() => setStep(3)}>Vérifier ma commande</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Récapitulatif</h2>
              <div className={styles.reviewSection}>
                <p className={styles.reviewLabel}>Livraison à</p>
                <p className={styles.reviewValue}>{address.firstName} {address.lastName}</p>
                <p className={styles.reviewValue}>{address.street}, {address.city} {address.postal}</p>
                <p className={styles.reviewValue}>{address.country}</p>
              </div>
              <div className={styles.reviewSection}>
                <p className={styles.reviewLabel}>Mode de livraison</p>
                <p className={styles.reviewValue}>{delivery === 'express' ? 'Express (2–3j)' : 'Standard (5–7j)'}</p>
              </div>
              <button
                className={styles.placeBtn}
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? <><span className={styles.spinner} /> Traitement en cours…</> : `Confirmer et payer — ${formatPrice(orderTotal)}`}
              </button>
              <button className={styles.backBtn} onClick={() => setStep(2)} style={{ marginTop: 12 }}>← Retour</button>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Votre commande</h2>
          <ul className={styles.summaryItems}>
            {items.map(item => (
              <li key={item.key} className={styles.summaryItem}>
                <img src={item.image} alt={item.name} className={styles.summaryImg} />
                <div className={styles.summaryInfo}>
                  <p className={styles.summaryName}>{item.name}</p>
                  {item.size && <p className={styles.summaryMeta}>{item.size}{item.color ? ` · ${item.color}` : ''}</p>}
                  <p className={styles.summaryQty}>× {item.qty}</p>
                </div>
                <span className={styles.summaryPrice}>{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.summaryTotals}>
            <div className={styles.totalRow}><span>Sous-total</span><span>{formatPrice(total)}</span></div>
            <div className={styles.totalRow}><span>Livraison</span><span>{deliveryCost === 0 ? 'Gratuit' : formatPrice(deliveryCost)}</span></div>
            <div className={`${styles.totalRow} ${styles.totalFinal}`}>
              <span>Total</span><span>{formatPrice(orderTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
