import { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, InputAdornment, IconButton, Avatar, Container, Alert } from '@mui/material'
import { Email as EmailIcon, Lock as LockIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Logo from '../components/Logo'

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res = await api.post('/usuario/login', credentials)
            login(res.data.token)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Círculos decorativos de fondo */}
            <Box sx={{ position: 'absolute', width: 400, height: 400, bgcolor: 'primary.main', borderRadius: '50%', top: -200, right: -200, opacity: 0.1, filter: 'blur(50px)' }} />
            <Box sx={{ position: 'absolute', width: 300, height: 300, bgcolor: 'secondary.main', borderRadius: '50%', bottom: -150, left: -150, opacity: 0.1, filter: 'blur(50px)' }} />

            <Container maxWidth="xs">
                <Paper elevation={12} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(10px)', bgcolor: 'rgba(30, 30, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Logo size={80} color="#EB8D29" />
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                        Gastro<span style={{ color: '#ff9800' }}>Flow</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Gestión Gastronómica Inteligente
                    </Typography>

                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo Electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={credentials.email}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={credentials.password}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 4, mb: 2, height: 50, fontSize: '1rem', boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)' }}
                        >
                            {loading ? 'Iniciando...' : 'Entrar al Sistema'}
                        </Button>
                    </Box>
                </Paper>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                    Copyright © GastroFlow 2026
                </Typography>
            </Container>
        </Box>
    )
}

export default Login
