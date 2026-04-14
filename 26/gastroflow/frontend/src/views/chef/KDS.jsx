import { useEffect, useState } from 'react'
import { 
    Grid, Box, Typography, Paper, Card, CardContent, 
    Button, Divider, Stack, IconButton, Badge, Tabs, Tab, Chip
} from '@mui/material'
import { 
    CheckCircle as CheckIcon, Timer as TimerIcon, 
    Dining as DiningIcon, Refresh as RefreshIcon,
    Notes as NotesIcon, DeliveryDining as DeliveryIcon,
    HourglassTop as PendingIcon, Fullscreen as FullscreenIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useVentas } from '../../hooks/useVentas'
import { useSocket } from '../../context/SocketContext'

const ESTADOS = ['PENDIENTE', 'LISTO', 'ENTREGADO']
const ESTADO_CONFIG = {
    PENDIENTE: { label: 'Pendientes', color: '#ff9800', icon: <PendingIcon /> },
    LISTO:     { label: 'Listos',     color: '#4caf50', icon: <CheckIcon /> },
    ENTREGADO: { label: 'Entregados', color: '#2196f3', icon: <DeliveryIcon /> },
}

/**
 * KDS (Kitchen Display System)
 * Monitor de Cocina — muestra todos los pedidos del día organizados por estado.
 */
const KDS = () => {
    const { ventas: pedidos, loading, fetchVentas, marcarComoListo } = useVentas()
    const socket = useSocket()
    const navigate = useNavigate()
    const [now, setNow] = useState(new Date())
    const [tabEstado, setTabEstado] = useState(0)

    const estadoActual = ESTADOS[tabEstado]

    // Carga pedidos del día según tab activa
    useEffect(() => {
        fetchVentas({ estado: estadoActual, today: 'true' })
    }, [fetchVentas, estadoActual])

    // Timer para actualizar contadores de tiempo cada minuto
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    // Escuchar nuevas comandas vía Socket.io
    useEffect(() => {
        if (socket) {
            socket.on('ORDEN_NUEVA', () => fetchVentas({ estado: estadoActual, today: 'true' }))
            return () => socket.off('ORDEN_NUEVA')
        }
    }, [socket, fetchVentas, estadoActual])

    const getTimeElapsed = (createdAt) => {
        const diff = Math.floor((now - new Date(createdAt)) / 60000)
        if (diff < 1) return 'Ahora'
        return `${diff} min`
    }

    const handleMarcarListo = async (id) => {
        await marcarComoListo(id)
        fetchVentas({ estado: estadoActual, today: 'true' })
    }

    const handleRefresh = () => {
        fetchVentas({ estado: estadoActual, today: 'true' })
    }

    return (
        <Box sx={{ p: 1 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                    Monitor de <span style={{ color: '#4caf50' }}>Cocina</span>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                        label={`${pedidos.length} pedidos`} 
                        sx={{ fontWeight: 700, bgcolor: ESTADO_CONFIG[estadoActual].color, color: 'white' }} 
                    />
                    <IconButton onClick={handleRefresh} color="primary">
                        <RefreshIcon />
                    </IconButton>
                    <Button 
                        variant="outlined" 
                        color="success"
                        startIcon={<FullscreenIcon />}
                        onClick={() => navigate('/kds/live')}
                        sx={{ fontWeight: 700 }}
                    >
                        Modo Cocina
                    </Button>
                </Box>
            </Box>

            {/* Tabs de Estado */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={tabEstado} 
                    onChange={(e, v) => setTabEstado(v)}
                    textColor="inherit"
                    TabIndicatorProps={{ sx: { bgcolor: ESTADO_CONFIG[estadoActual].color } }}
                >
                    {ESTADOS.map((estado) => (
                        <Tab 
                            key={estado} 
                            icon={ESTADO_CONFIG[estado].icon}
                            iconPosition="start"
                            label={ESTADO_CONFIG[estado].label}
                            sx={{ fontWeight: 700, minHeight: 48 }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Grid de Comandas */}
            {pedidos.length === 0 ? (
                <Paper sx={{ p: 10, textAlign: 'center', opacity: 0.5, borderRadius: 4, bgcolor: 'background.paper' }}>
                    <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {estadoActual === 'PENDIENTE' ? '¡Cocina al día!' : `No hay pedidos ${ESTADO_CONFIG[estadoActual].label.toLowerCase()}`}
                    </Typography>
                    <Typography color="text.secondary">
                        No hay pedidos {ESTADO_CONFIG[estadoActual].label.toLowerCase()} en este momento.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {pedidos.map((p) => {
                        const mins = Math.floor((now - new Date(p.createdAt)) / 60000)
                        const isLate = estadoActual === 'PENDIENTE' && mins > 15

                        return (
                            <Grid item xs={12} sm={6} md={4} key={p._id}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    borderTop: `8px solid ${isLate ? '#f44336' : ESTADO_CONFIG[estadoActual].color}`,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                    transform: isLate ? 'scale(1.02)' : 'scale(1)',
                                    transition: 'transform 0.2s'
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 800, fontStyle: 'italic' }}>
                                                #{p._id.slice(-4).toUpperCase()}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <TimerIcon fontSize="small" color={isLate ? 'error' : 'action'} />
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: isLate ? 'error.main' : 'text.secondary' }}>
                                                    {getTimeElapsed(p.createdAt)}
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        {/* Mozo info */}
                                        {p.mozo && (
                                            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                                                Mozo: {p.mozo.nombre} {p.mozo.apellido}
                                            </Typography>
                                        )}

                                        <Divider sx={{ mb: 2 }} />

                                        {p.items.map((item, idx) => (
                                            <Box key={idx} sx={{ mb: 2 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                                    {item.cantidad}x {item.nombre_producto}
                                                </Typography>
                                                {item.notas && (
                                                    <Box sx={{ 
                                                        mt: 0.5, p: 1, 
                                                        bgcolor: 'action.selected', 
                                                        borderRadius: 1, 
                                                        borderLeft: '4px solid #ff9800',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        <NotesIcon sx={{ fontSize: 14, mr: 1, color: '#ff9800' }} />
                                                        <Typography variant="caption" sx={{ fontStyle: 'italic', fontWeight: 600 }}>
                                                            {item.notas}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </CardContent>

                                    {/* Acciones según estado */}
                                    {estadoActual === 'PENDIENTE' && (
                                        <>
                                            <Divider />
                                            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                                                <Button 
                                                    fullWidth 
                                                    variant="contained" 
                                                    color="success" 
                                                    size="large"
                                                    startIcon={<CheckIcon />}
                                                    onClick={() => handleMarcarListo(p._id)}
                                                    sx={{ fontWeight: 800, height: 48, borderRadius: 2 }}
                                                >
                                                    Pedido Listo
                                                </Button>
                                            </Box>
                                        </>
                                    )}

                                    {estadoActual !== 'PENDIENTE' && (
                                        <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                                            <Chip 
                                                label={estadoActual} 
                                                size="small" 
                                                sx={{ bgcolor: ESTADO_CONFIG[estadoActual].color, color: 'white', fontWeight: 700 }} 
                                            />
                                        </Box>
                                    )}
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            )}
        </Box>
    )
}

export default KDS
