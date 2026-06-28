import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart, useAuth } from '../contexts'
import { formatPrice } from '../data/products'
import haitiData from '../data/haiti_administrative.json'
import styles from './Checkout.module.css'

const STEPS = ['Mode', 'Adresse', 'Livraison', 'Paiement', 'Confirmation']

const PICKUP_POINTS = [
  { id: 'pap', label: 'Port-au-Prince – Centre-Ville', address: 'Rue Capois, en face du Champ de Mars', phone: '+509 3X XX XX XX' },
  { id: 'petionville', label: 'Pétion-Ville', address: 'Rue Grégoire, près de la Place Boyer', phone: '+509 3X XX XX XX' },
  { id: 'delmas', label: 'Delmas 33', address: 'Delmas 33, akote Epi dOr', phone: '+509 3X XX XX XX' },
]

export default function Checkout() {
  const { items, total, dispatch } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const [deliveryMode, setDeliveryMode] = useState('') // 'recuperation' | 'livraison'
  const [pickup, setPickup] = useState({ point: '', person: '' })

  const [address, setAddress] = useState({
    recipient: '',
    street: '',
    details: '',
    departement: '',
    commune: '',
    quartier: '',
    phone1: '',
    phone2: '',
  })

  const communes = useMemo(() => {
    if (!address.departement) return []
    return haitiData.departements.find(d => d.id === address.departement)?.communes || []
  }, [address.departement])

  const quartiers = useMemo(() => {
    if (!address.commune) return []
    return communes.find(c => c.nom === address.commune)?.quartiers || []
  }, [communes, address.commune])

  const setAddrField = (field, value) => {
    setAddress(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'departement') { next.commune = ''; next.quartier = '' }
      if (field === 'commune') { next.quartier = '' }
      return next
    })
  }

  const addressFilled = !!(address.recipient && address.street && address.departement && address.commune && address.phone1)
  const pickupFilled = !!(pickup.point && pickup.person)

  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState({ method: '', proof: null })

  const deliveryCost = deliveryMode === 'recuperation' ? 0 : delivery === 'express' ? 2500 : total >= 50000 ? 0 : 1500
  const orderTotal = total + deliveryCost

  // A step i is "done" in the stepper if we've passed it, including skipped steps for récupération
  const isStepDone = (i) => {
    if (deliveryMode === 'recuperation' && (i === 1 || i === 2) && step >= 3) return true
    return i < step
  }

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
              <div className={`${styles.stepDot} ${isStepDone(i) ? styles.stepDone : i === step ? styles.stepActive : styles.stepPending}`}>
                {isStepDone(i) ? (
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                ) : i + 1}
              </div>
              <span className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ''}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${isStepDone(i) ? styles.stepLineDone : ''}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.left}>

          {/* Step 0: Mode */}
          {step === 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Comment voulez-vous recevoir votre commande ?</h2>
              <div className={styles.modeOptions}>
                <button
                  type="button"
                  className={`${styles.modeOpt} ${deliveryMode === 'recuperation' ? styles.modeOptActive : ''}`}
                  onClick={() => setDeliveryMode('recuperation')}
                >
                  <div className={styles.modeOptIcon}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <div className={styles.modeOptText}>
                    <span className={styles.modeOptTitle}>Récupération en magasin</span>
                    <span className={styles.modeOptSub}>Venez chercher votre colis à l'un de nos points de retrait</span>
                  </div>
                  <div className={`${styles.modeOptDot} ${deliveryMode === 'recuperation' ? styles.modeOptDotActive : ''}`} />
                </button>

                <button
                  type="button"
                  className={`${styles.modeOpt} ${deliveryMode === 'livraison' ? styles.modeOptActive : ''}`}
                  onClick={() => setDeliveryMode('livraison')}
                >
                  <div className={styles.modeOptIcon}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                  </div>
                  <div className={styles.modeOptText}>
                    <span className={styles.modeOptTitle}>Livraison à domicile</span>
                    <span className={styles.modeOptSub}>Recevez votre commande directement chez vous</span>
                  </div>
                  <div className={`${styles.modeOptDot} ${deliveryMode === 'livraison' ? styles.modeOptDotActive : ''}`} />
                </button>
              </div>

              {deliveryMode === 'recuperation' && (
                <>
                  <p className={styles.payGroupLabel} style={{ marginBottom: 10 }}>Choisir un point de retrait</p>
                  <div className={styles.pickupList}>
                    {PICKUP_POINTS.map(pt => (
                      <button
                        key={pt.id}
                        type="button"
                        className={`${styles.pickupOpt} ${pickup.point === pt.id ? styles.pickupOptActive : ''}`}
                        onClick={() => setPickup(p => ({ ...p, point: pt.id }))}
                      >
                        <div className={styles.pickupOptText}>
                          <span className={styles.pickupOptLabel}>{pt.label}</span>
                          <span className={styles.pickupOptAddr}>{pt.address}</span>
                          <span className={styles.pickupOptPhone}>{pt.phone}</span>
                        </div>
                        <div className={`${styles.modeOptDot} ${pickup.point === pt.id ? styles.modeOptDotActive : ''}`} />
                      </button>
                    ))}
                  </div>

                  <div className={styles.field} style={{ marginTop: 16 }}>
                    <label className={styles.label}>Nom de la personne qui viendra récupérer</label>
                    <input
                      type="text"
                      value={pickup.person}
                      onChange={e => setPickup(p => ({ ...p, person: e.target.value }))}
                      placeholder="Nom complet"
                      className={styles.input}
                    />
                  </div>
                </>
              )}

              <button
                className={styles.nextBtn}
                style={(!deliveryMode || (deliveryMode === 'recuperation' && !pickupFilled)) ? { opacity: 0.45, cursor: 'not-allowed', marginTop: 24 } : { marginTop: 24 }}
                disabled={!deliveryMode || (deliveryMode === 'recuperation' && !pickupFilled)}
                onClick={() => deliveryMode === 'recuperation' ? setStep(3) : setStep(1)}
              >
                Continuer →
              </button>
            </div>
          )}

          {/* Step 1: Address (livraison only) */}
          {step === 1 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Adresse de livraison</h2>
              <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label}>Personne qui recevra le colis</label>
                  <input
                    type="text"
                    value={address.recipient}
                    onChange={e => setAddrField('recipient', e.target.value)}
                    placeholder="Nom complet du destinataire"
                    className={styles.input}
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label}>Adresse</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={e => setAddrField('street', e.target.value)}
                    placeholder="Rue, numéro, repère…"
                    className={styles.input}
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label}>Détails <span style={{ textTransform: 'none', fontWeight: 400, opacity: 0.6 }}>(optionnel)</span></label>
                  <input
                    type="text"
                    value={address.details}
                    onChange={e => setAddrField('details', e.target.value)}
                    placeholder="Ex : Deye do legliz, akote boutik la…"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Département</label>
                  <select value={address.departement} onChange={e => setAddrField('departement', e.target.value)} className={styles.input}>
                    <option value="">— Choisir —</option>
                    {haitiData.departements.map(d => (
                      <option key={d.id} value={d.id}>{d.nom}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Commune</label>
                  <select value={address.commune} onChange={e => setAddrField('commune', e.target.value)} className={styles.input} disabled={!address.departement}>
                    <option value="">— Choisir —</option>
                    {communes.map(c => (
                      <option key={c.nom} value={c.nom}>{c.nom}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Quartier / Localité</label>
                  <select value={address.quartier} onChange={e => setAddrField('quartier', e.target.value)} className={styles.input} disabled={!address.commune}>
                    <option value="">— Choisir —</option>
                    {quartiers.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Téléphone 1</label>
                  <input
                    type="tel"
                    value={address.phone1}
                    onChange={e => setAddrField('phone1', e.target.value)}
                    placeholder="+509 ____ ____"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Téléphone 2 <span style={{ textTransform: 'none', fontWeight: 400, opacity: 0.6 }}>(optionnel)</span></label>
                  <input
                    type="tel"
                    value={address.phone2}
                    onChange={e => setAddrField('phone2', e.target.value)}
                    placeholder="+509 ____ ____"
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.navBtns}>
                <button className={styles.backBtn} onClick={() => setStep(0)}>← Retour</button>
                <button
                  className={styles.nextBtn}
                  onClick={() => setStep(2)}
                  disabled={!addressFilled}
                  style={!addressFilled ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
                >
                  Continuer → Livraison
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Delivery type (livraison only) */}
          {step === 2 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Mode de livraison</h2>
              <div className={styles.addrSummary}>
                <p className={styles.addrSummaryLine}>{address.recipient} · {address.phone1}</p>
                <p className={styles.addrSummaryLine}>{address.street}{address.details ? ` — ${address.details}` : ''}{address.quartier ? `, ${address.quartier}` : ''}</p>
                <p className={styles.addrSummaryLine}>{address.commune} · {haitiData.departements.find(d => d.id === address.departement)?.nom}</p>
              </div>
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
                <button className={styles.backBtn} onClick={() => setStep(1)}>← Retour</button>
                <button className={styles.nextBtn} onClick={() => setStep(3)}>Continuer → Paiement</button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Paiement sécurisé</h2>

              {[
                {
                  group: 'Banques',
                  options: [
                    { id: 'sogebank', label: 'SOGEBANK', currency: 'HTG', holder: 'Kèskonfè S.A.', account: '0-001-123456-7' },
                    { id: 'unibank',  label: 'UNIBANK',  currency: 'HTG', holder: 'Kèskonfè S.A.', account: '1234-56789-0' },
                    { id: 'buh',      label: 'BUH',      currency: 'HTG', holder: 'Kèskonfè S.A.', account: '987-654321-0' },
                    { id: 'capital',  label: 'CAPITAL',  currency: 'HTG', holder: 'Kèskonfè S.A.', account: '456-789012-3' },
                    { id: 'bnc',      label: 'BNC',      currency: 'HTG', holder: 'Kèskonfè S.A.', account: '321-098765-4' },
                  ],
                },
                {
                  group: 'Mobile Money',
                  options: [
                    { id: 'moncash', label: 'MONCASH', holder: 'Kèskonfè', account: '+509 3X XX XX XX' },
                    { id: 'natcash', label: 'NATCASH', holder: 'Kèskonfè', account: '+509 4X XX XX XX' },
                  ],
                },
              ].map(({ group, options }) => (
                <div key={group} className={styles.payGroup}>
                  <p className={styles.payGroupLabel}>{group}</p>
                  <div className={styles.payOptions}>
                    {options.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`${styles.payOpt} ${payment.method === opt.id ? styles.payOptActive : ''}`}
                        onClick={() => setPayment(p => ({ ...p, method: opt.id }))}
                      >
                        <span className={styles.payOptLabel}>{opt.label}</span>
                        {opt.currency && <span className={styles.payOptCurrency}>{opt.currency}</span>}
                        <div className={`${styles.payOptDot} ${payment.method === opt.id ? styles.payOptDotActive : ''}`} />
                      </button>
                    ))}
                  </div>

                  {options.some(o => o.id === payment.method) && (() => {
                    const selected = options.find(o => o.id === payment.method)
                    return (
                      <div className={styles.payDetails}>
                        <div className={styles.payDetailsRow}>
                          <span className={styles.payDetailsKey}>Banque / Service</span>
                          <span className={styles.payDetailsVal}>{selected.label}</span>
                        </div>
                        <div className={styles.payDetailsRow}>
                          <span className={styles.payDetailsKey}>Nom du compte</span>
                          <span className={styles.payDetailsVal}>{selected.holder}</span>
                        </div>
                        <div className={styles.payDetailsRow}>
                          <span className={styles.payDetailsKey}>Numéro de compte</span>
                          <span className={styles.payDetailsVal}>{selected.account}</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              ))}

              {payment.method && (
                <div className={styles.uploadSection}>
                  <p className={styles.uploadLabel}>Preuve de paiement</p>
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className={styles.srOnly}
                      onChange={e => setPayment(p => ({ ...p, proof: e.target.files[0] || null }))}
                    />
                    {payment.proof ? (
                      <span className={styles.uploadFileName}>{payment.proof.name}</span>
                    ) : (
                      <>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                        <span>Cliquer pour uploader <span className={styles.uploadHint}>(JPG, PNG, PDF)</span></span>
                      </>
                    )}
                  </label>
                </div>
              )}

              <div className={styles.navBtns}>
                <button className={styles.backBtn} onClick={() => setStep(deliveryMode === 'recuperation' ? 0 : 2)}>← Retour</button>
                <button
                  className={styles.nextBtn}
                  onClick={() => setStep(4)}
                  disabled={!payment.method || !payment.proof}
                  style={!payment.method || !payment.proof ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
                >
                  Vérifier ma commande
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Récapitulatif</h2>

              {deliveryMode === 'recuperation' ? (
                <div className={styles.reviewSection}>
                  <p className={styles.reviewLabel}>Récupération en magasin</p>
                  <p className={styles.reviewValue}>{PICKUP_POINTS.find(p => p.id === pickup.point)?.label}</p>
                  <p className={styles.reviewValue} style={{ opacity: 0.7 }}>{PICKUP_POINTS.find(p => p.id === pickup.point)?.address}</p>
                  <p className={styles.reviewValue}>Récupéré par : {pickup.person}</p>
                </div>
              ) : (
                <div className={styles.reviewSection}>
                  <p className={styles.reviewLabel}>Livraison à</p>
                  <p className={styles.reviewValue}>{address.recipient}</p>
                  <p className={styles.reviewValue}>{address.street}{address.details ? ` — ${address.details}` : ''}</p>
                  <p className={styles.reviewValue}>{address.quartier ? `${address.quartier}, ` : ''}{address.commune}</p>
                  <p className={styles.reviewValue}>{haitiData.departements.find(d => d.id === address.departement)?.nom || ''} · Haïti</p>
                  <p className={styles.reviewValue}>Tél : {address.phone1}{address.phone2 ? ` / ${address.phone2}` : ''}</p>
                </div>
              )}

              <div className={styles.reviewSection}>
                <p className={styles.reviewLabel}>Mode de livraison</p>
                <p className={styles.reviewValue}>
                  {deliveryMode === 'recuperation' ? 'Récupération (gratuit)' : delivery === 'express' ? 'Express (2–3j)' : 'Standard (5–7j)'}
                </p>
              </div>

              <div className={styles.reviewSection}>
                <p className={styles.reviewLabel}>Paiement</p>
                <p className={styles.reviewValue}>{payment.method?.toUpperCase()}</p>
                {payment.proof && <p className={styles.reviewValue} style={{ opacity: 0.6, fontSize: 12 }}>{payment.proof.name}</p>}
              </div>

              <button
                className={styles.placeBtn}
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? <><span className={styles.spinner} /> Traitement en cours…</> : `Confirmer et payer — ${formatPrice(orderTotal)}`}
              </button>
              <button className={styles.backBtn} onClick={() => setStep(3)} style={{ marginTop: 12 }}>← Retour</button>
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
