import { useEffect, useState } from 'react'
import { 
    Box, Typography, Paper, Chip, IconButton, Button, 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, MenuItem, Stack 
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { 
    Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, 
    Refresh as RefreshIcon 
} from '@mui/icons-material'
import { useInsumos } from '../../hooks/useInsumos'

const unidades = ['kg', 'gr', 'ml', 'lt', 'unidad']

const Insumos = () => {
    const { insumos, loading, fetchInsumos, saveInsumo, deleteInsumo } = useInsumos()
    
    // Estado para el Modal
    const [open, setOpen] = useState(false)
    const [editingInsumo, setEditingInsumo] = useState(null)
    const [formData, setFormData] = useState({
        nombre: '',
        unidad: 'unidad',
        stock_actual: 0,
        stock_minimo: 0,
        costo_unitario: 0
    })

    useEffect(() => {
        fetchInsumos()
    }, [fetchInsumos])

    const handleOpen = (insumo = null) => {
        if (insumo) {
            setEditingInsumo(insumo)
            setFormData({
                nombre: insumo.nombre,
                unidad: insumo.unidad,
                stock_actual: insumo.stock_actual,
                stock_minimo: insumo.stock_minimo,
                costo_unitario: insumo.costo_unitario || 0
            })
        } else {
            setEditingInsumo(null)
            setFormData({ nombre: '', unidad: 'unidad', stock_actual: 0, stock_minimo: 0, costo_unitario: 0 })
        }
        setOpen(true)
    }

    const handleClose = () => setOpen(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await saveInsumo(formData, editingInsumo?._id)
        if (success) handleClose()
    }

    const columns = [
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'unidad', headerName: 'Unidad', width: 100 },
        { 
            field: 'stock_actual', 
            headerName: 'Stock Físico', 
            width: 130,
            renderCell: (params) => {
                const isLow = params.row.stock_actual <= params.row.stock_minimo
                return (
                    <Typography color={isLow ? 'error.main' : 'inherit'} sx={{ fontWeight: isLow ? 700 : 400 }}>
                        {params.value}
                    </Typography>
                )
            }
        },
        { field: 'stock_reservado', headerName: 'Reservado', width: 130 },
        { 
            field: 'disponible', 
            headerName: 'Disponible Neto', 
            width: 150,
            valueGetter: (params, row) => row.stock_actual - row.stock_reservado,
            renderCell: (params) => (
                <Chip 
                    label={params.value.toFixed(2)} 
                    color={params.value <= 0 ? 'error' : 'success'} 
                    size="small" 
                    variant="outlined"
                />
            )
        },
        { field: 'stock_minimo', headerName: 'Mínimo', width: 100 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton size="small" color="primary" onClick={() => handleOpen(params.row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteInsumo(params.row._id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ]

    return (
        <Box sx={{ height: '80vh', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Inventario de <span style={{ color: '#ff9800' }}>Insumos</span>
                </Typography>
                <Box>
                    <IconButton onClick={fetchInsumos} sx={{ mr: 1 }}><RefreshIcon /></IconButton>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => handleOpen()}
                    >
                        Nuevo Insumo
                    </Button>
                </Box>
            </Box>

            <Paper elevation={3} sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={insumos}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loading}
                    initialState={{ pagination: { paginationModel: { pageSize: 15 } } }}
                    pageSizeOptions={[15, 30, 50]}
                />
            </Paper>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        {editingInsumo ? 'Editar Insumo' : 'Nuevo Insumo'}
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField label="Nombre" name="nombre" fullWidth required value={formData.nombre} onChange={handleChange} />
                            <TextField select label="Unidad" name="unidad" fullWidth required value={formData.unidad} onChange={handleChange}>
                                {unidades.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                            </TextField>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField label="Stock Actual" name="stock_actual" type="number" fullWidth required value={formData.stock_actual} onChange={handleChange} />
                                <TextField label="Stock Mínimo" name="stock_minimo" type="number" fullWidth required value={formData.stock_minimo} onChange={handleChange} />
                            </Box>
                            <TextField label="Costo Unitario ($)" name="costo_unitario" type="number" fullWidth required value={formData.costo_unitario} onChange={handleChange} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" variant="contained">{editingInsumo ? 'Guardar' : 'Crear'}</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    )
}

export default Insumos
