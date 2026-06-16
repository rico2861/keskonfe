import { useState } from 'react'
import { useAuth } from '../../contexts'
import styles from './ClientProfile.module.css'

export function ClientProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: '+509 3712 4455' })
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 500))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mon profil</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Informations personnelles</h2>
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Prénom</label>
                <input className={styles.input} value={form.firstName} onChange={e => set('firstName', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Nom</label>
                <input className={styles.input} value={form.lastName} onChange={e => set('lastName', e.target.value)} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Téléphone</label>
              <input className={styles.input} value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <button type="submit" className={`${styles.saveBtn} ${saved ? styles.saveBtnSuccess : ''}`}>
              {saved ? '✓ Modifications enregistrées' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Sécurité</h2>
          <form className={styles.form} onSubmit={e => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
            <div className={styles.field}>
              <label className={styles.label}>Mot de passe actuel</label>
              <input className={styles.input} type="password" placeholder="••••••••" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Nouveau mot de passe</label>
              <input className={styles.input} type="password" placeholder="Minimum 6 caractères" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirmer</label>
              <input className={styles.input} type="password" placeholder="••••••••" />
            </div>
            <button type="submit" className={styles.saveBtn}>Changer le mot de passe</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export function ClientAddresses() {
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Domicile', street: '12 Rue des Palmiers', city: 'Pétion-Ville', postal: 'HT-6120', country: 'Haïti', isDefault: true },
    { id: 2, label: 'Bureau', street: '45 Ave Panaméricaine', city: 'Port-au-Prince', postal: 'HT-6110', country: 'Haïti', isDefault: false },
  ])
  const [adding, setAdding] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: '', street: '', city: '', postal: '', country: 'Haïti' })

  const setDefault = (id) => setAddresses(a => a.map(addr => ({ ...addr, isDefault: addr.id === id })))
  const remove = (id) => setAddresses(a => a.filter(addr => addr.id !== id))
  const add = () => {
    setAddresses(a => [...a, { ...newAddr, id: Date.now(), isDefault: false }])
    setNewAddr({ label: '', street: '', city: '', postal: '', country: 'Haïti' })
    setAdding(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Mes adresses</h1>
        <button className={styles.addAddrBtn} onClick={() => setAdding(true)}>+ Ajouter une adresse</button>
      </div>

      <div className={styles.addrGrid}>
        {addresses.map(addr => (
          <div key={addr.id} className={`${styles.addrCard} ${addr.isDefault ? styles.addrCardDefault : ''}`}>
            {addr.isDefault && <span className={styles.defaultBadge}>Par défaut</span>}
            <p className={styles.addrLabel}>{addr.label}</p>
            <p className={styles.addrText}>{addr.street}</p>
            <p className={styles.addrText}>{addr.city} {addr.postal}</p>
            <p className={styles.addrText}>{addr.country}</p>
            <div className={styles.addrActions}>
              {!addr.isDefault && (
                <button className={styles.addrAction} onClick={() => setDefault(addr.id)}>Définir par défaut</button>
              )}
              <button className={styles.addrAction} onClick={() => remove(addr.id)} style={{ color: 'var(--red)' }}>Supprimer</button>
            </div>
          </div>
        ))}

        {adding && (
          <div className={styles.addrCardNew}>
            <p className={styles.cardTitle}>Nouvelle adresse</p>
            {[
              { k: 'label', placeholder: 'Étiquette (ex : Domicile)' },
              { k: 'street', placeholder: 'Rue et numéro' },
              { k: 'city', placeholder: 'Ville' },
              { k: 'postal', placeholder: 'Code postal' },
            ].map(f => (
              <input key={f.k} className={styles.input} placeholder={f.placeholder}
                value={newAddr[f.k]} onChange={e => setNewAddr(a => ({ ...a, [f.k]: e.target.value }))} />
            ))}
            <div className={styles.newAddrBtns}>
              <button className={styles.saveBtn} onClick={add}>Enregistrer</button>
              <button className={styles.cancelNewBtn} onClick={() => setAdding(false)}>Annuler</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
