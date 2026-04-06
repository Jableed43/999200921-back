import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { MainLayout } from './layout/MainLayout'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import AdminCategories from './pages/AdminCategories.jsx'
import AdminPurchases from './pages/AdminPurchases.jsx'
import { AdminProducts } from './pages/AdminProducts.jsx'
import { UserProfile } from './pages/UserProfile'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
          {/* Rutas Estáticas Principales */}
          <Route index element={<Home />} />
          <Route path="productos" element={<Products />} />
          
          {/* Rutas Dinámicas */}
          <Route path="producto/:id" element={<ProductDetail />} />
          
          {/* Checkout / Auth / Profile */}
          <Route path="carrito" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Register />} />
            <Route path="perfil" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />

            {/* Añadir rutas de administrador - Usuarios */}
            <Route path='admin/usuarios' element={
              <ProtectedRoute allowedRoles={["ADMIN"]} >
                <AdminUsers />
              </ProtectedRoute>
            } />

            {/* Añadir rutas de administrador - Categorias */}
            <Route path='admin/categorias' element={
              <ProtectedRoute allowedRoles={["ADMIN", "SELLER"]} >
                <AdminCategories />
              </ProtectedRoute>
            } />

            {/* Añadir rutas de administrador - Ventas */}
            <Route path='admin/ventas' element={
              <ProtectedRoute allowedRoles={["ADMIN", "SELLER"]} >
                <AdminPurchases />
              </ProtectedRoute>
            } />

            {/* Añadir rutas de administrador - Productos */}
            <Route path='admin/productos' element={
              <ProtectedRoute allowedRoles={["ADMIN", "SELLER"]} >
                <AdminProducts />
              </ProtectedRoute>
            } />
          </Route>



        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
