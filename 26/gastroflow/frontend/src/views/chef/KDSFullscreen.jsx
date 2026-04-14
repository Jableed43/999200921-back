import { useEffect, useState, useCallback } from 'react'
import {
    Box, Typography, Card, CardContent, Button,
    Divider, Stack, Chip, IconButton
} from '@mui/material'
import {
    CheckCircle as CheckIcon, Timer as TimerIcon,
    Notes as NotesIcon, Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon, ArrowBack as BackIcon,
    DeliveryDining as DeliveryIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useVentas } from '../../hooks/useVentas'
import { useSocket } from '../../context/SocketContext'

/**
 * KDS Fullscreen — Pantalla exclusiva para la cocina.
 * Diseño: 2 filas.
 *   Fila 1: PENDIENTES (orden ascendente por fecha — la más vieja primero)
 *   Fila 2: LISTOS + ENTREGADOS (orden descendente — el más reciente primero)
 */
const KDSFullscreen = () => {
    const { ventas, loading, fetchVentas, marcarComoListo, entregarPedido } = useVentas()
    const socket = useSocket()
    const navigate = useNavigate()
    const [now, setNow] = useState(new Date())
    const [isFullscreen, setIsFullscreen] = useState(false)

    const loadAll = useCallback(() => {
        fetchVentas({ today: 'true' })
    }, [fetchVentas])

    // Carga inicial + polling cada 15 seg
    useEffect(() => {
        loadAll()
        const interval = setInterval(loadAll, 15000)
        return () => clearInterval(interval)
    }, [loadAll])

    // Reloj
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 30000)
        return () => clearInterval(timer)
    }, [])

    // Socket
    useEffect(() => {
        if (socket) {
            socket.on('ORDEN_NUEVA', loadAll)
            return () => socket.off('ORDEN_NUEVA')
        }
    }, [socket, loadAll])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const handleMarcarListo = async (id) => {
        await marcarComoListo(id)
        loadAll()
    }

    const handleEntregado = async (id) => {
        await entregarPedido(id)
        loadAll()
    }

    const getMinutes = (date) => Math.max(0, Math.floor((now - new Date(date)) / 60000))

    // Separar pedidos por estado
    const pendientes = ventas
        .filter(v => v.estado === 'PENDIENTE')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Más viejo primero

    const listos = ventas
        .filter(v => v.estado === 'LISTO')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const entregados = ventas
        .filter(v => v.estado === 'ENTREGADO')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const clock = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

    return (
        <Box sx={{
            width: '100vw',
            height: '100vh',
            bgcolor: '#0a0a0a',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* === TOP BAR === */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3, py: 1.5,
                bgcolor: '#111',
                borderBottom: '2px solid #222',
                flexShrink: 0
            }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton onClick={() => navigate('/kds')} sx={{ color: 'white' }}>
                        <BackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 1 }}>
                        🔥 COCINA <span style={{ color: '#4caf50' }}>EN VIVO</span>
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={3}>
                    <Chip label={`${pendientes.length} pendientes`} sx={{ bgcolor: '#ff9800', color: 'white', fontWeight: 800, fontSize: 14 }} />
                    <Chip label={`${listos.length} listos`} sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 800, fontSize: 14 }} />
                    <Chip label={`${entregados.length} entregados`} sx={{ bgcolor: '#2196f3', color: 'white', fontWeight: 800, fontSize: 14 }} />
                    <Typography variant="h4" sx={{ fontWeight: 300, fontFamily: 'monospace', color: '#888' }}>
                        {clock}
                    </Typography>
                    <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                </Stack>
            </Box>

            {/* === FILA 1: PENDIENTES === */}
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', borderBottom: '2px solid #333' }}>
                <Box sx={{ px: 3, py: 1, bgcolor: 'rgba(255,152,0,0.1)', flexShrink: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#ff9800', textTransform: 'uppercase', letterSpacing: 2 }}>
                        ⏳ Pendientes — Cocinar ahora ({pendientes.length})
                    </Typography>
                </Box>
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    px: 3, py: 2,
                    '&::-webkit-scrollbar': { height: 6 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#ff9800', borderRadius: 3 }
                }}>
                    {pendientes.length === 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', opacity: 0.3 }}>
                            <Typography variant="h5">✅ Sin pedidos pendientes</Typography>
                        </Box>
                    ) : (
                        pendientes.map(p => {
                            const mins = getMinutes(p.createdAt)
                            const isLate = mins > 15
                            const isUrgent = mins > 25

                            return (
                                <Card key={p._id} sx={{
                                    minWidth: 280,
                                    maxWidth: 320,
                                    flexShrink: 0,
                                    bgcolor: isUrgent ? 'rgba(244,67,54,0.15)' : isLate ? 'rgba(255,152,0,0.1)' : '#1a1a1a',
                                    border: `2px solid ${isUrgent ? '#f44336' : isLate ? '#ff9800' : '#333'}`,
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    animation: isUrgent ? 'pulse 1.5s infinite' : 'none',
                                    '@keyframes pulse': {
                                        '0%, 100%': { borderColor: '#f44336' },
                                        '50%': { borderColor: '#ff1744' }
                                    }
                                }}>
                                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: 'white' }}>
                                                #{p._id.slice(-4).toUpperCase()}
                                            </Typography>
                                            <Chip
                                                icon={<TimerIcon sx={{ fontSize: 16 }} />}
                                                label={`${mins} min`}
                                                size="small"
                                                sx={{
                                                    bgcolor: isUrgent ? '#f44336' : isLate ? '#ff9800' : '#555',
                                                    color: 'white', fontWeight: 800
                                                }}
                                            />
                                        </Box>

                                        {p.mozo && (
                                            <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 1 }}>
                                                Mozo: {p.mozo.nombre} {p.mozo.apellido}
                                            </Typography>
                                        )}

                                        <Divider sx={{ borderColor: '#333', mb: 1 }} />

                                        {p.items.map((item, idx) => (
                                            <Box key={idx} sx={{ mb: 1 }}>
                                                <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'white' }}>
                                                    {item.cantidad}x {item.nombre_producto}
                                                </Typography>
                                                {item.notas && (
                                                    <Box sx={{ mt: 0.5, p: 0.5, pl: 1, bgcolor: 'rgba(255,152,0,0.1)', borderLeft: '3px solid #ff9800', borderRadius: 1 }}>
                                                        <Typography variant="caption" sx={{ color: '#ff9800', fontStyle: 'italic' }}>
                                                            {item.notas}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </CardContent>

                                    <Box sx={{ p: 1.5 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckIcon />}
                                            onClick={() => handleMarcarListo(p._id)}
                                            sx={{ fontWeight: 900, height: 44, borderRadius: 2, fontSize: 14 }}
                                        >
                                            LISTO
                                        </Button>
                                    </Box>
                                </Card>
                            )
                        })
                    )}
                </Box>
            </Box>

            {/* === FILA 2: LISTOS + ENTREGADOS === */}
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
                {/* LISTOS */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '2px solid #333' }}>
                    <Box sx={{ px: 3, py: 1, bgcolor: 'rgba(76,175,80,0.1)', flexShrink: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#4caf50', textTransform: 'uppercase', letterSpacing: 2 }}>
                            ✅ Listos para retirar ({listos.length})
                        </Typography>
                    </Box>
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        px: 3, py: 2,
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#4caf50', borderRadius: 3 }
                    }}>
                        {listos.length === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', opacity: 0.3 }}>
                                <Typography>Sin pedidos listos</Typography>
                            </Box>
                        ) : (
                            listos.map(p => (
                                <Card key={p._id} sx={{
                                    minWidth: 220,
                                    maxWidth: 280,
                                    flexShrink: 0,
                                    bgcolor: '#1a1a1a',
                                    border: '2px solid #4caf50',
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#4caf50', mb: 1 }}>
                                            #{p._id.slice(-4).toUpperCase()}
                                        </Typography>
                                        {p.mozo && (
                                            <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 1 }}>
                                                → {p.mozo.nombre}
                                            </Typography>
                                        )}
                                        {p.items.map((item, idx) => (
                                            <Typography key={idx} variant="body2" sx={{ color: '#ccc' }}>
                                                {item.cantidad}x {item.nombre_producto}
                                            </Typography>
                                        ))}
                                    </CardContent>
                                    <Box sx={{ p: 1.5 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<DeliveryIcon />}
                                            onClick={() => handleEntregado(p._id)}
                                            sx={{ 
                                                fontWeight: 900, height: 40, borderRadius: 2, fontSize: 13,
                                                bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' }
                                            }}
                                        >
                                            RETIRADO
                                        </Button>
                                    </Box>
                                </Card>
                            ))
                        )}
                    </Box>
                </Box>

                {/* ENTREGADOS */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ px: 3, py: 1, bgcolor: 'rgba(33,150,243,0.1)', flexShrink: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2196f3', textTransform: 'uppercase', letterSpacing: 2 }}>
                            📦 Entregados hoy ({entregados.length})
                        </Typography>
                    </Box>
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        px: 3, py: 2,
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#2196f3', borderRadius: 3 }
                    }}>
                        {entregados.length === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', opacity: 0.3 }}>
                                <Typography>Sin entregas hoy</Typography>
                            </Box>
                        ) : (
                            entregados.map(p => (
                                <Card key={p._id} sx={{
                                    minWidth: 200,
                                    maxWidth: 250,
                                    flexShrink: 0,
                                    bgcolor: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: 3,
                                    opacity: 0.6
                                }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2196f3', mb: 1 }}>
                                            #{p._id.slice(-4).toUpperCase()}
                                        </Typography>
                                        {p.items.map((item, idx) => (
                                            <Typography key={idx} variant="body2" sx={{ color: '#888' }}>
                                                {item.cantidad}x {item.nombre_producto}
                                            </Typography>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default KDSFullscreen
