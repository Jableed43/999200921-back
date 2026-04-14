import { Box, Typography, Button, Container, Grid, Paper, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import teamImage from '../assets/team_gastro.png'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import KitchenIcon from '@mui/icons-material/Kitchen'

const Home = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const theme = useTheme()

    const roleActions = {
        ADMIN: [
            { label: 'Ver Analíticas', icon: <DashboardIcon />, path: '/admin/dashboard', color: theme.palette.primary.main },
            { label: 'Gestionar Productos', icon: <ReceiptLongIcon />, path: '/admin/productos', color: theme.palette.secondary.main }
        ],
        MOZO: [
            { label: 'Nueva Comanda', icon: <ReceiptLongIcon />, path: '/pos', color: theme.palette.primary.main }
        ],
        CHEF: [
            { label: 'Monitor de Cocina', icon: <KitchenIcon />, path: '/kds', color: theme.palette.secondary.main },
            { label: 'Control de Insumos', icon: <DashboardIcon />, path: '/admin/insumos', color: theme.palette.primary.main }
        ]
    }

    const actions = roleActions[user?.role] || []

    return (
        <Box>
            {/* Hero Section */}
            <Box sx={{ 
                position: 'relative', 
                height: '70vh', 
                width: '100%', 
                borderRadius: 4, 
                overflow: 'hidden',
                mb: 6,
                boxShadow: 10
            }}>
                <img 
                    src={teamImage} 
                    alt="GastroFlow Team" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: { xs: 4, md: 10 }
                }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', mb: 2, maxWidth: 600 }}>
                        Bienvenido a <span style={{ color: theme.palette.primary.main }}>GastroFlow</span>
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 500, fontWeight: 300, fontStyle: 'italic' }}>
                        "Cocinando soluciones tecnológicas para el corazón de tu restaurante."
                    </Typography>
                </Box>
            </Box>

            {/* Quick Actions */}
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
                    Accesos Rápidos
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {actions.map((action, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper 
                                elevation={4}
                                sx={{ 
                                    p: 4, 
                                    textAlign: 'center', 
                                    borderRadius: 4, 
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    minHeight: 220,
                                    '&:hover': { transform: 'translateY(-10px)', boxShadow: 20 }
                                }}
                                onClick={() => navigate(action.path)}
                            >
                                <Box sx={{ 
                                    bgcolor: `${action.color}22`, 
                                    color: action.color, 
                                    width: 80, 
                                    height: 80, 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    {action.icon}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {action.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}

export default Home
