import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts'
import styles from './Auth.module.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // simulate API
    const ok = login(email, password)
    setLoading(false)
    if (ok) navigate('/')
    else setError('Identifiants incorrects. Essayez avec n\'importe quel email et un mot de passe de 6+ caractères.')
  }

  return (
    <div className={styles.page}>
      <div className={styles.imagePane}>
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85" alt="" aria-hidden />
        <div className={styles.imagePaneOverlay} />
        <div className={styles.imagePaneContent}>
          <p className={styles.imagePaneQuote}>"Le style est une façon d'affirmer qui l'on est sans avoir à parler."</p>
          <p className={styles.imagePaneAuthor}>— Rachel Zoe</p>
        </div>
      </div>
      <div className={styles.formPane}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.backLink}>← Retour à la boutique</Link>
          <div className={styles.formHeader}>
            <p className={styles.eyebrow}>Votre espace</p>
            <h1 className={styles.formTitle}>Connexion</h1>
            <p className={styles.formSub}>
              Pas encore de compte ? <Link to="/register" className={styles.authLink}>S'inscrire</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {error && <div className={styles.errorBox} role="alert">{error}</div>}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Adresse email</label>
              <input
                id="email" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
                placeholder="vous@example.com"
                required autoComplete="email"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Mot de passe
                <Link to="/forgot-password" className={styles.forgotLink}>Oublié ?</Link>
              </label>
              <input
                id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required autoComplete="current-password"
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Se connecter'}
            </button>
          </form>

          <div className={styles.dividerRow}><span>ou</span></div>
          <button className={styles.guestBtn} onClick={() => navigate('/')}>
            Continuer en tant qu'invité
          </button>
        </div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Requis'
    if (!form.lastName.trim()) e.lastName = 'Requis'
    if (!form.email.includes('@')) e.email = 'Email invalide'
    if (form.password.length < 6) e.password = 'Minimum 6 caractères'
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    register(form)
    setLoading(false)
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <div className={styles.imagePane}>
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85" alt="" aria-hidden />
        <div className={styles.imagePaneOverlay} />
        <div className={styles.imagePaneContent}>
          <p className={styles.imagePaneQuote}>"La mode passe, le style reste."</p>
          <p className={styles.imagePaneAuthor}>— Coco Chanel</p>
        </div>
      </div>
      <div className={styles.formPane}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.backLink}>← Retour à la boutique</Link>
          <div className={styles.formHeader}>
            <p className={styles.eyebrow}>Rejoindre Kèskonfè</p>
            <h1 className={styles.formTitle}>Créer un compte</h1>
            <p className={styles.formSub}>
              Déjà membre ? <Link to="/login" className={styles.authLink}>Se connecter</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="firstName" className={styles.label}>Prénom</label>
                <input id="firstName" type="text" value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                  placeholder="Sophie" autoComplete="given-name" />
                {errors.firstName && <p className={styles.fieldError}>{errors.firstName}</p>}
              </div>
              <div className={styles.field}>
                <label htmlFor="lastName" className={styles.label}>Nom</label>
                <input id="lastName" type="text" value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                  placeholder="Martin" autoComplete="family-name" />
                {errors.lastName && <p className={styles.fieldError}>{errors.lastName}</p>}
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="reg-email" className={styles.label}>Adresse email</label>
              <input id="reg-email" type="email" value={form.email}
                onChange={e => set('email', e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="vous@example.com" autoComplete="email" />
              {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="reg-password" className={styles.label}>Mot de passe</label>
              <input id="reg-password" type="password" value={form.password}
                onChange={e => set('password', e.target.value)}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Minimum 6 caractères" autoComplete="new-password" />
              {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="confirm" className={styles.label}>Confirmer le mot de passe</label>
              <input id="confirm" type="password" value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                className={`${styles.input} ${errors.confirm ? styles.inputError : ''}`}
                placeholder="••••••••" autoComplete="new-password" />
              {errors.confirm && <p className={styles.fieldError}>{errors.confirm}</p>}
            </div>
            <p className={styles.terms}>
              En créant un compte, vous acceptez nos <a href="#">Conditions d'utilisation</a> et notre <a href="#">Politique de confidentialité</a>.
            </p>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
