import { useEffect, useState, useMemo } from 'react'
import { Grid, Paper, Typography, Box, Card, CardContent, Divider, useTheme, List, ListItem, ListItemText } from '@mui/material'
import { TrendingUp as TrendingUpIcon, ShoppingCart as ShoppingCartIcon, Warning as WarningIcon, BarChart as BarChartIcon } from '@mui/icons-material'
import { useDashboard } from '../../hooks/useDashboard'
import AnalyticsFilters from '../../components/dashboard/AnalyticsFilters'
import AnalyticsCharts from '../../components/dashboard/AnalyticsCharts'
import { 
    generateMockAnalytics, 
    getFilteredAnalytics, 
    transformVentasByMozo, 
    transformVentasByProducto, 
    transformInsumosByTime, 
    transformMarginalContribution 
} from '../../utils/mockAnalytics'
import { format, subMonths } from 'date-fns'

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

    // Estados para Analíticas
    const [startDate, setStartDate] = useState(format(subMonths(new Date(), 1), 'yyyy-MM-dd'))
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    
    // Mock Data (Persistente durante la sesión)
    const [allAnalytics] = useState(() => generateMockAnalytics())

    const filteredAnalytics = useMemo(() => {
        return getFilteredAnalytics(allAnalytics, startDate, endDate)
    }, [allAnalytics, startDate, endDate])

    const chartData = useMemo(() => ({
        mozo: transformVentasByMozo(filteredAnalytics),
        producto: transformVentasByProducto(filteredAnalytics),
        insumos: transformInsumosByTime(filteredAnalytics),
        margen: transformMarginalContribution(filteredAnalytics)
    }), [filteredAnalytics])

    useEffect(() => {
        fetchDashboard()
    }, [fetchDashboard])

    if (loading || !data) return <Typography sx={{ m: 4 }}>Cargando Dashboard...</Typography>

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    GastroFlow <span style={{ color: theme.palette.primary.main }}>BI & Analytics</span>
                </Typography>
                <BarChartIcon sx={{ fontSize: 40, opacity: 0.5 }} />
            </Box>

            {/* Fila de Estadísticas Rápidas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
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
            </Grid>

            <Divider sx={{ mb: 4 }} />

            {/* SECCIÓN DE ANALÍTICAS DINÁMICAS */}
            <AnalyticsFilters 
                startDate={startDate} 
                endDate={endDate} 
                setStartDate={setStartDate} 
                setEndDate={setEndDate} 
            />

            <AnalyticsCharts 
                dataByMozo={chartData.mozo}
                dataByProducto={chartData.producto}
                dataInsumos={chartData.insumos}
                dataMargen={chartData.margen}
            />

            {/* Sección de Inventario Crítico (Original) */}
            <Grid container sx={{ mt: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, bgcolor: 'background.paper', border: '1px solid #333' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Insumos Críticos de la Operación</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {data.inventario.alertas_reposicion.length === 0 ? (
                            <Typography color="text.secondary">Todo en orden. No hay alertas de stock actuales.</Typography>
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
