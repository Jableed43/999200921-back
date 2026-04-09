import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const login = (token) => {
        localStorage.setItem('token', token)
        const decoded = jwtDecode(token)
        setUser({
            id: decoded.id,
            role: decoded.role,
            token
        })
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const decoded = jwtDecode(token)
                setUser({
                    id: decoded.id,
                    role: decoded.role,
                    token
                })
            } catch (error) {
                console.error('Invalid token', error)
                logout()
            }
        }
        setLoading(false)
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
