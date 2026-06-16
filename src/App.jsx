import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider, AuthProvider } from './contexts'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Public pages
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import ProductDetail from './pages/ProductDetail'
import { LoginPage, RegisterPage } from './pages/Auth'
import Checkout from './pages/Checkout'

// Client dashboard
import ClientLayout from './pages/client/ClientLayout'
import ClientDashboard from './pages/client/ClientDashboard'
import { ClientOrders, ClientOrderDetail } from './pages/client/ClientOrders'
import { ClientProfile, ClientAddresses } from './pages/client/ClientProfile'

// Admin dashboard
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import { AdminOrders, AdminInventory, AdminClients } from './pages/admin/AdminOrdersInventory'

function Layout() {
  const { pathname } = useLocation()
  const isCheckout = pathname === '/checkout'
  const isAuth = pathname === '/login' || pathname === '/register'
  const isClient = pathname.startsWith('/mon-compte')
  const isAdmin = pathname.startsWith('/admin')
  const hideShell = isCheckout || isAuth || isClient || isAdmin

  return (
    <>
      {!hideShell && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/produit/:slug" element={<ProductDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Client dashboard */}
        <Route path="/mon-compte" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="commandes" element={<ClientOrders />} />
          <Route path="commandes/:id" element={<ClientOrderDetail />} />
          <Route path="profil" element={<ClientProfile />} />
          <Route path="adresses" element={<ClientAddresses />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="produits" element={<AdminProducts />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="inventaire" element={<AdminInventory />} />
          <Route path="clients" element={<AdminClients />} />
        </Route>

        <Route path="*" element={
          <div style={{ padding: '120px 24px', textAlign: 'center', paddingTop: 'calc(var(--nav-h) + 80px)' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 16 }}>Page introuvable</h1>
            <a href="/" style={{ color: 'var(--gold-dark)', textDecoration: 'underline' }}>Retour à l'accueil</a>
          </div>
        } />
      </Routes>
      {!hideShell && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
