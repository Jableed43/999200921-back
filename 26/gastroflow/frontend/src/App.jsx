import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import MainLayout from './layouts/MainLayout'
import Login from './views/Login'
import Dashboard from './views/admin/Dashboard'
import Insumos from './views/admin/Insumos'
import Productos from './views/admin/Productos'
import POS from './views/mozo/POS'
import KDS from './views/chef/KDS'
import KDSFullscreen from './views/chef/KDSFullscreen'
import Home from './views/Home'

// Definición de componente para protección de rutas
const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth()

    if (loading) return null // O un spinner
    if (!user) return <Navigate to="/login" />
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />

    return <MainLayout>{children}</MainLayout>
}

// Ruta protegida SIN layout (para pantallas fullscreen como KDS)
const ProtectedRaw = ({ children, roles }) => {
    const { user, loading } = useAuth()
    if (loading) return null
    if (!user) return <Navigate to="/login" />
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />
    return children
}

function AppContent() {
    const { user } = useAuth()

    return (
        <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            
            {/* Rutas Protegidas */}
            <Route path="/" element={<ProtectedRoute roles={['ADMIN', 'CHEF', 'MOZO']}><Home /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/insumos" element={<ProtectedRoute roles={['ADMIN', 'CHEF']}><Insumos /></ProtectedRoute>} />
            <Route path="/admin/productos" element={<ProtectedRoute roles={['ADMIN']}><Productos /></ProtectedRoute>} />
            <Route path="/pos" element={<ProtectedRoute roles={['ADMIN', 'MOZO']}><POS /></ProtectedRoute>} />
            <Route path="/kds" element={<ProtectedRoute roles={['ADMIN', 'CHEF']}><KDS /></ProtectedRoute>} />
            <Route path="/kds/live" element={<ProtectedRaw roles={['ADMIN', 'CHEF']}><KDSFullscreen /></ProtectedRaw>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute roles={['ADMIN']}><div>Usuarios</div></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <SocketProvider>
                    <BrowserRouter>
                        <AppContent />
                    </BrowserRouter>
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
