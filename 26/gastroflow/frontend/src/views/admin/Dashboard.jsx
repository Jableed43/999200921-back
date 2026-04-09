import { useEffect } from 'react'
import { Grid, Paper, Typography, Box, Card, CardContent, Divider, useTheme, List, ListItem, ListItemText } from '@mui/material'
import { TrendingUp as TrendingUpIcon, ShoppingCart as ShoppingCartIcon, Warning as WarningIcon } from '@mui/icons-material'
import { useDashboard } from '../../hooks/useDashboard'

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', boxShadow: 3, borderLeft: `6px solid ${color}` }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${color}15`, color: color, mr: 2 }}>
                    {icon}
                </Box>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
)

const Dashboard = () => {
    const { data, loading, fetchDashboard } = useDashboard()
    const theme = useTheme()

    useEffect(() => {
        fetchDashboard()
    }, [fetchDashboard])

    if (loading || !data) return <Typography>Cargando Dashboard...</Typography>

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                Dashboard <span style={{ color: theme.palette.primary.main }}>Global</span>
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Ventas Totales" 
                        value={`$${data.global.ventas_totales.toLocaleString()}`} 
                        icon={<TrendingUpIcon />} 
                        color={theme.palette.primary.main} 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Margen Neto" 
                        value={`$${data.global.margen_total.toLocaleString()}`} 
                        icon={<ShoppingCartIcon />} 
                        color={theme.palette.secondary.main} 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Ventas (Hoy)" 
                        value={data.hoy.cantidad_pedidos} 
                        icon={<ShoppingCartIcon />} 
                        color="#2196f3" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Alertas Stock" 
                        value={data.inventario.cantidad_alertas} 
                        icon={<WarningIcon />} 
                        color="#f44336" 
                    />
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 4, mt: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Insumos Críticos</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {data.inventario.alertas_reposicion.length === 0 ? (
                            <Typography color="text.secondary">Todo en orden. No hay alertas.</Typography>
                        ) : (
                            <List>
                                {data.inventario.alertas_reposicion.map((alerta, index) => (
                                    <ListItem key={index} divider={index !== data.inventario.alertas_reposicion.length - 1}>
                                        <ListItemText 
                                            primary={alerta.nombre} 
                                            secondary={`Stock: ${alerta.stock_fisico} | Mínimo: ${alerta.minimo_seguridad}`} 
                                        />
                                        <Typography color="error" variant="caption" sx={{ fontWeight: 700 }}>{alerta.estado}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Dashboard
