import { useEffect, useState } from 'react'
import { 
    Grid, Box, Typography, Paper, Card, CardContent, 
    Button, Divider, Stack, IconButton, Badge 
} from '@mui/material'
import { 
    CheckCircle as CheckIcon, Timer as TimerIcon, 
    Dining as DiningIcon, Refresh as RefreshIcon,
    Notes as NotesIcon 
} from '@mui/icons-material'
import { useVentas } from '../../hooks/useVentas'
import { useSocket } from '../../context/SocketContext'

/**
 * KDS (Kitchen Display System)
 * Monitor de Cocina para gestionar comandas pendientes en tiempo real.
 */
const KDS = () => {
    const { ventas: pedidos, loading, fetchVentas, marcarComoListo } = useVentas()
    const socket = useSocket()
    const [now, setNow] = useState(new Date())

    // Carga inicial de pedidos pendientes
    useEffect(() => {
        fetchVentas({ estado: 'PENDIENTE' })
    }, [fetchVentas])

    // Timer para actualizar los contadores de tiempo cada minuto sin re-fetch
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    // Escuchar nuevas comandas vía Socket.io
    useEffect(() => {
        if (socket) {
            socket.on('ORDEN_NUEVA', () => fetchVentas({ estado: 'PENDIENTE' }))
            return () => socket.off('ORDEN_NUEVA')
        }
    }, [socket, fetchVentas])

    const getTimeElapsed = (createdAt) => {
        const diff = Math.floor((now - new Date(createdAt)) / 60000)
        return `${diff} min`
    }

    if (loading && pedidos.length === 0) {
        return <Typography sx={{ p: 4 }}>Cargando Cocina...</Typography>
    }

    return (
        <Box sx={{ p: 1 }}>
            {/* Header del KDS */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                    Monitor de <span style={{ color: '#4caf50' }}>Cocina</span>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Badge badgeContent={pedidos.length} color="error" overlap="circular">
                        <DiningIcon color="action" />
                    </Badge>
                    <IconButton onClick={() => fetchVentas({ estado: 'PENDIENTE' })} color="primary">
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Grid de Comandas */}
            {pedidos.length === 0 ? (
                <Paper sx={{ p: 10, textAlign: 'center', opacity: 0.5, borderRadius: 4, bgcolor: 'background.paper' }}>
                    <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>¡Cocina al día!</Typography>
                    <Typography color="text.secondary">No hay pedidos pendientes en este momento.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {pedidos.map((p) => {
                        const mins = Math.floor((now - new Date(p.createdAt)) / 60000)
                        const isLate = mins > 15

                        return (
                            <Grid item xs={12} sm={6} md={4} key={p._id}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    borderTop: `8px solid ${isLate ? '#f44336' : '#4caf50'}`,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                    scale: isLate ? '1.02' : '1'
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

                                    <Divider />
                                    
                                    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                                        <Button 
                                            fullWidth 
                                            variant="contained" 
                                            color="success" 
                                            size="large"
                                            startIcon={<CheckIcon />}
                                            onClick={() => marcarComoListo(p._id)}
                                            sx={{ fontWeight: 800, height: 48, borderRadius: 2 }}
                                        >
                                            Pedido Listo
                                        </Button>
                                    </Box>
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
