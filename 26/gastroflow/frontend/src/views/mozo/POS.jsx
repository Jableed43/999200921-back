import { useEffect, useState, useMemo } from 'react'
import { 
    Grid, Box, Typography, Paper, Card, CardContent, CardActionArea, 
    Button, Divider, List, IconButton, TextField, Stack, Chip, Avatar,
    Tabs, Tab, Tooltip as MuiTooltip
} from '@mui/material'
import { 
    ShoppingCart as CartIcon, Delete as DeleteIcon, 
    Send as SendIcon, RestaurantMenu as FoodIcon,
    Add as AddIcon, Remove as RemoveIcon,
    LocalDrink as DrinkIcon, ListAlt as ListIcon
} from '@mui/icons-material'
import { useProductos } from '../../hooks/useProductos'
import { useVentas } from '../../hooks/useVentas'
import QRPaymentModal from '../../components/QRPaymentModal'
import Swal from 'sweetalert2'

const POS = () => {
    const { productos, loading: loadingProd, fetchProductos } = useProductos()
    const { crearVenta, generarQR, consultarPago } = useVentas()
    const [cart, setCart] = useState([])
    const [tabValue, setTabValue] = useState(0)

    // Estado del modal QR
    const [qrModal, setQrModal] = useState({ open: false, qrData: null, total: null, ventaId: null })

    useEffect(() => {
        fetchProductos({ activo: true, disponible: true })
    }, [fetchProductos])

    const categories = useMemo(() => {
        const cats = ['Todos', ...new Set(productos.map(p => p.tipo))]
        return cats
    }, [productos])

    const filteredProductos = useMemo(() => {
        const cat = categories[tabValue]
        if (cat === 'Todos') return productos
        return productos.filter(p => p.tipo === cat)
    }, [productos, tabValue, categories])

    const addToCart = (producto) => {
        const exists = cart.find(item => item.producto === producto._id)
        if (exists) {
            setCart(cart.map(item => 
                item.producto === producto._id ? { ...item, cantidad: item.cantidad + 1 } : item
            ))
        } else {
            setCart([...cart, { 
                producto: producto._id, 
                nombre_producto: producto.nombre, 
                cantidad: 1, 
                precio_unitario: producto.precio_venta,
                costo_unitario: producto.costo_estimado || (producto.precio_venta * 0.3),
                notas: '' 
            }])
        }
    }

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.producto !== id))
    }

    const updateCantidad = (id, delta) => {
        setCart(cart.map(item => {
            if (item.producto === id) {
                const newCant = item.cantidad + delta
                return newCant > 0 ? { ...item, cantidad: newCant } : item
            }
            return item
        }))
    }

    const updateNotas = (id, nota) => {
        setCart(cart.map(item => item.producto === id ? { ...item, notas: nota } : item))
    }

    const handleSendOrder = async () => {
        const result = await Swal.fire({
            title: '¿Confirmar pedido?',
            text: `Se enviará una comanda por $${total.toLocaleString()}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, enviar',
            confirmButtonColor: '#EB8D29'
        })

        if (result.isConfirmed) {
            const venta = await crearVenta(cart)
            if (venta) {
                // Comanda creada → generar QR de pago
                const qrResult = await generarQR(venta._id)
                if (qrResult && qrResult.qrData) {
                    setQrModal({
                        open: true,
                        qrData: qrResult.qrData,
                        total: qrResult.total,
                        ventaId: venta._id
                    })
                } else {
                    Swal.fire('✅ Enviado', 'La cocina ha recibido la comanda (sin QR de pago)', 'success')
                }
                setCart([])
                fetchProductos({ activo: true, disponible: true })
            }
        }
    }

    const closeQrModal = () => {
        setQrModal({ open: false, qrData: null, total: null, ventaId: null })
    }

    const total = cart.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0)

    return (
        <>
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 120px)' }}>
            {/* Lado Izquierdo: Menú */}
            <Grid item xs={12} md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Menú Salon</Typography>
                
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={(e, v) => setTabValue(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        {categories.map((cat, idx) => (
                            <Tab key={cat} label={cat} />
                        ))}
                    </Tabs>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                    <Grid container spacing={2}>
                        {filteredProductos.map(p => (
                            <Grid item xs={12} sm={6} lg={4} key={p._id}>
                                <Card sx={{ 
                                    height: '100%', 
                                    transition: '0.2s', 
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                }}>
                                    <CardActionArea onClick={() => addToCart(p)} sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Avatar sx={{ bgcolor: 'rgba(235, 141, 41, 0.1)', color: '#EB8D29' }}>
                                                    <FoodIcon />
                                                </Avatar>
                                                <Chip label={p.tipo} size="small" variant="outlined" />
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, minHeight: 48 }}>{p.nombre}</Typography>
                                            <Typography variant="h6" color="#EB8D29">${p.precio_venta.toLocaleString()}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Grid>

            {/* Lado Derecho: Carrito/Comanda */}
            <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                <Paper elevation={6} sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.05)' 
                }}>
                    <Box sx={{ p: 2, bgcolor: '#EB8D29', color: 'white' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CartIcon />
                            <Typography sx={{ fontWeight: 700 }}>Comanda Actual</Typography>
                        </Stack>
                    </Box>

                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                        {cart.length === 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10, opacity: 0.3 }}>
                                <ListIcon sx={{ fontSize: 60, mb: 2 }} />
                                <Typography>No hay productos seleccionados</Typography>
                            </Box>
                        ) : (
                            <List disablePadding>
                                {cart.map(item => (
                                    <Paper key={item.producto} variant="outlined" sx={{ mb: 2, p: 2, bgcolor: 'rgba(255,152,0,0.02)' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, flexGrow: 1 }}>{item.nombre_producto}</Typography>
                                            <IconButton size="small" color="error" onClick={() => removeFromCart(item.producto)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ border: '1px solid #444', borderRadius: 2, px: 0.5 }}>
                                                <IconButton size="small" onClick={() => updateCantidad(item.producto, -1)} disabled={item.cantidad <= 1}>
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ minWidth: 20, textAlign: 'center', fontWeight: 'bold' }}>{item.cantidad}</Typography>
                                                <IconButton size="small" onClick={() => updateCantidad(item.producto, 1)}>
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                            <Typography sx={{ fontWeight: 'bold', color: '#EB8D29' }}>
                                                ${(item.precio_unitario * item.cantidad).toLocaleString()}
                                            </Typography>
                                        </Stack>
                                        <TextField 
                                            placeholder="Aclaraciones..." 
                                            fullWidth 
                                            size="small" 
                                            variant="standard" 
                                            value={item.notas} 
                                            onChange={(e) => updateNotas(item.producto, e.target.value)} 
                                            sx={{ mt: 1 }}
                                        />
                                    </Paper>
                                ))}
                            </List>
                        )}
                    </Box>

                    <Divider />
                    <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#EB8D29' }}>${total.toLocaleString()}</Typography>
                        </Stack>
                        <Button 
                            fullWidth 
                            variant="contained" 
                            size="large" 
                            onClick={handleSendOrder} 
                            disabled={cart.length === 0}
                            sx={{ height: 50, bgcolor: '#EB8D29', '&:hover': { bgcolor: '#d87b1c' } }}
                        >
                            ENVIAR PEDIDO
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
        
        {/* Modal de Pago QR */}
        <QRPaymentModal
            open={qrModal.open}
            onClose={closeQrModal}
            qrData={qrModal.qrData}
            total={qrModal.total}
            ventaId={qrModal.ventaId}
            consultarPago={consultarPago}
        />
        </>
    )
}

export default POS
