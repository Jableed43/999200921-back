import { useEffect, useState } from 'react'
import { 
    Box, Typography, Paper, Chip, IconButton, Button, 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, MenuItem, Stack, Divider, Avatar, Select, FormControl, InputLabel
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { 
    Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, 
    Refresh as RefreshIcon, Fastfood as FoodIcon, Close as CloseIcon
} from '@mui/icons-material'
import { useProductos } from '../../hooks/useProductos'
import { useInsumos } from '../../hooks/useInsumos'

const Productos = () => {
    const { productos, loading: loadingProd, fetchProductos, saveProducto, deleteProducto } = useProductos()
    const { insumos, fetchInsumos } = useInsumos()
    
    // Estado para el Modal
    const [open, setOpen] = useState(false)
    const [editingProducto, setEditingProducto] = useState(null)
    const [formData, setFormData] = useState({
        nombre: '',
        precio_venta: 0,
        tipo: 'directo',
        insumo_directo: '',
        receta: [],
        activo: true
    })

    const loadAll = async () => {
        await Promise.all([fetchProductos(), fetchInsumos()])
    }

    useEffect(() => {
        loadAll()
    }, [fetchProductos, fetchInsumos])

    const handleOpen = (producto = null) => {
        if (producto) {
            setEditingProducto(producto)
            setFormData({
                nombre: producto.nombre,
                precio_venta: producto.precio_venta,
                tipo: producto.tipo,
                insumo_directo: producto.insumo_directo?._id || producto.insumo_directo || '',
                receta: producto.receta || [],
                activo: producto.activo !== undefined ? producto.activo : true
            })
        } else {
            setEditingProducto(null)
            setFormData({ nombre: '', precio_venta: 0, tipo: 'directo', insumo_directo: '', receta: [], activo: true })
        }
        setOpen(true)
    }

    const handleClose = () => setOpen(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAddRecetaItem = () => {
        setFormData(prev => ({
            ...prev,
            receta: [...prev.receta, { insumo: '', cantidad: 0 }]
        }))
    }

    const handleUpdateRecetaItem = (index, field, value) => {
        const newReceta = [...formData.receta]
        newReceta[index][field] = value
        setFormData(prev => ({ ...prev, receta: newReceta }))
    }

    const handleRemoveRecetaItem = (index) => {
        setFormData(prev => ({
            ...prev,
            receta: prev.receta.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = { ...formData }
        if (payload.tipo === 'directo') payload.receta = []
        if (payload.tipo === 'compuesto') payload.insumo_directo = null

        const success = await saveProducto(payload, editingProducto?._id)
        if (success) handleClose()
    }

    const columns = [
        { 
            field: 'nombre', 
            headerName: 'Producto', 
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 32, height: 32 }}>
                        <FoodIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{params.value}</Typography>
                </Box>
            )
        },
        { 
            field: 'precio_venta', 
            headerName: 'Precio Venta', 
            width: 150,
            renderCell: (params) => <Typography sx={{ fontWeight: 700 }}>${params.value.toLocaleString()}</Typography>
        },
        { 
            field: 'tipo', 
            headerName: 'Tipo', 
            width: 130,
            renderCell: (params) => (
                <Chip label={params.value.toUpperCase()} size="small" color={params.value === 'compuesto' ? 'secondary' : 'default'} />
            )
        },
        { 
            field: 'disponible', 
            headerName: 'Disp.', 
            width: 110,
            renderCell: (params) => (
                <Chip label={params.value ? 'SI' : 'NO'} color={params.value ? 'success' : 'error'} size="small" />
            )
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton size="small" color="primary" onClick={() => handleOpen(params.row)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteProducto(params.row._id)}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
            )
        }
    ]

    return (
        <Box sx={{ height: '80vh', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Gestión de <span style={{ color: '#ff9800' }}>Productos</span>
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Nuevo Producto</Button>
            </Box>

            <Paper elevation={3} sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={productos}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loadingProd}
                />
            </Paper>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        {editingProducto ? 'Editar Producto' : 'Crear Producto'}
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField label="Nombre" name="nombre" fullWidth required value={formData.nombre} onChange={handleChange} />
                                <TextField label="Precio" name="precio_venta" type="number" fullWidth required value={formData.precio_venta} onChange={handleChange} />
                            </Box>
                            
                            <TextField select label="Tipo" name="tipo" fullWidth value={formData.tipo} onChange={handleChange}>
                                <MenuItem value="directo">Directo</MenuItem>
                                <MenuItem value="compuesto">Compuesto (Receta)</MenuItem>
                            </TextField>

                            {formData.tipo === 'directo' ? (
                                <TextField select label="Insumo Directo" name="insumo_directo" fullWidth value={formData.insumo_directo} onChange={handleChange}>
                                    {insumos.map(i => <MenuItem key={i._id} value={i._id}>{i.nombre}</MenuItem>)}
                                </TextField>
                            ) : (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Receta</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {formData.receta.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Insumo</InputLabel>
                                                <Select
                                                    value={item.insumo?._id || item.insumo}
                                                    label="Insumo"
                                                    onChange={(e) => handleUpdateRecetaItem(index, 'insumo', e.target.value)}
                                                >
                                                    {insumos.map(i => <MenuItem key={i._id} value={i._id}>{i.nombre}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                            <TextField label="Cant." type="number" size="small" sx={{ width: 100 }} value={item.cantidad} onChange={(e) => handleUpdateRecetaItem(index, 'cantidad', e.target.value)} />
                                            <IconButton color="error" onClick={() => handleRemoveRecetaItem(index)}><CloseIcon /></IconButton>
                                        </Box>
                                    ))}
                                    <Button startIcon={<AddIcon />} size="small" onClick={handleAddRecetaItem}>Añadir</Button>
                                </Box>
                            )}
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" variant="contained">Guardar</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    )
}

export default Productos
