import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const {user, isAuthenticated, token} = useAuth()

    // Si no esta autenticado
    if(!isAuthenticated && !token){
        return <Navigate to="/login" replace />
    }

    // Si hay roles permitidos y los roles no incluyen el rol del usuario, lo mandamos a la home
    if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    return <Navigate to="/" replace />
}
    return children
}