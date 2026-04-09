import { useEffect, useState } from 'react'
import { 
    Grid, Box, Typography, Paper, Card, CardContent, CardActionArea, 
    Button, Divider, List, IconButton, TextField, Stack, Chip, Avatar
} from '@mui/material'
import { 
    ShoppingCart as CartIcon, Delete as DeleteIcon, 
    Send as SendIcon, RestaurantMenu as FoodIcon,
    Add as AddIcon, Remove as RemoveIcon
} from '@mui/icons-material'
import { useProductos } from '../../hooks/useProductos'
import { useVentas } from '../../hooks/useVentas'
import Swal from 'sweetalert2'

const POS = () => {
    const { productos, loading: loadingProd, fetchProductos } = useProductos()
    const { crearVenta } = useVentas()
    const [cart, setCart] = useState([])

    useEffect(() => {
        fetchProductos({ activo: true, disponible: true })
    }, [fetchProductos])

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
        const success = await crearVenta(cart)
        if (success) {
            setCart([])
            fetchProductos({ activo: true, disponible: true })
        }
    }

    const total = cart.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0)

    return (
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 120px)' }}>
            <Grid item xs={12} md={8} sx={{ height: '100%', overflowY: 'auto' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Menú Salon</Typography>
                <Grid container spacing={2}>
                    {productos.map(p => (
                        <Grid item xs={12} sm={6} lg={4} key={p._id}>
                            <Card>
                                <CardActionArea onClick={() => addToCart(p)}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}><FoodIcon /></Avatar>
                                            <Chip label={p.tipo} size="small" />
                                        </Box>
                                        <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>{p.nombre}</Typography>
                                        <Typography variant="h5" color="primary">${p.precio_venta.toLocaleString()}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                <Paper elevation={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                    <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                        <Typography sx={{ fontWeight: 700 }}>Comanda Actual</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                        <List>
                            {cart.map(item => (
                                <Paper key={item.producto} variant="outlined" sx={{ mb: 1, p: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.nombre_producto}</Typography>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <IconButton size="small" onClick={() => updateCantidad(item.producto, -1)}><RemoveIcon fontSize="small" /></IconButton>
                                            <Typography>{item.cantidad}</Typography>
                                            <IconButton size="small" onClick={() => updateCantidad(item.producto, 1)}><AddIcon fontSize="small" /></IconButton>
                                        </Stack>
                                        <Typography color="primary">${(item.precio_unitario * item.cantidad).toLocaleString()}</Typography>
                                    </Stack>
                                    <TextField placeholder="Notas..." fullWidth size="small" variant="standard" value={item.notas} onChange={(e) => updateNotas(item.producto, e.target.value)} />
                                </Paper>
                            ))}
                        </List>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>Total: ${total.toLocaleString()}</Typography>
                        <Button fullWidth variant="contained" size="large" onClick={handleSendOrder} disabled={cart.length === 0}>Enviar Pedido</Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default POS
