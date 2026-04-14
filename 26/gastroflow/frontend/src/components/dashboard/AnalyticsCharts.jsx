import { useState, useMemo } from 'react'
import { Grid, Paper, Typography, Box, useTheme, Dialog, DialogContent, DialogTitle, IconButton, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Brush } from 'recharts'
import { Close as CloseIcon, Fullscreen as FullscreenIcon } from '@mui/icons-material'

const CHART_COLORS = ['#ff9800', '#4caf50', '#2196f3', '#9c27b0', '#f44336']
const ALL_MOZOS = ['Ramón', 'Lucía', 'Marcos', 'Sofía']

const ChartCard = ({ title, children, onMaximize, extraControls }) => (
    <Paper 
        sx={{ 
            p: 3, 
            height: 500, 
            position: 'relative', 
            transition: '0.2s',
            '&:hover': { boxShadow: 8 },
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
                {extraControls}
            </Box>
            <IconButton onClick={onMaximize} size="small" sx={{ bgcolor: 'action.hover' }}>
                <FullscreenIcon />
            </IconButton>
        </Box>
        <ResponsiveContainer width="100%" height="80%">
            {children}
        </ResponsiveContainer>
    </Paper>
)

const AnalyticsCharts = ({ dataByMozo, dataByProducto, dataInsumos, dataMargen }) => {
    const theme = useTheme()
    const [maximized, setMaximized] = useState(null)
    const [visibleMozos, setVisibleMozos] = useState(ALL_MOZOS)

    const toggleMozo = (mozo) => {
        setVisibleMozos(prev => 
            prev.includes(mozo) ? prev.filter(m => m !== mozo) : [...prev, mozo]
        )
    }

    const mozoControls = (
        <FormGroup row sx={{ mt: 1 }}>
            {ALL_MOZOS.map(mozo => (
                <FormControlLabel
                    key={mozo}
                    control={
                        <Checkbox 
                            size="small" 
                            checked={visibleMozos.includes(mozo)} 
                            onChange={() => toggleMozo(mozo)} 
                            sx={{ color: CHART_COLORS[ALL_MOZOS.indexOf(mozo)] }}
                        />
                    }
                    label={<Typography variant="caption">{mozo}</Typography>}
                />
            ))}
        </FormGroup>
    )

    const charts = [
        {
            id: 'mozo',
            title: 'Ventas por Mozo (Filtro por Mozo + Zoom)',
            controls: mozoControls,
            component: (
                <LineChart data={dataByMozo}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
                    <Legend />
                    {ALL_MOZOS.map((mozo, index) => (
                        <Line 
                            key={mozo}
                            type="monotone" 
                            dataKey={mozo} 
                            stroke={CHART_COLORS[index]} 
                            strokeWidth={3} 
                            dot={false}
                            hide={!visibleMozos.includes(mozo)}
                        />
                    ))}
                    <Brush dataKey="date" height={30} stroke={theme.palette.primary.main} fill="#333" />
                </LineChart>
            )
        },
        {
            id: 'producto',
            title: 'Ventas por Producto',
            component: (
                <BarChart data={dataByProducto}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="nombre" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
                    <Bar dataKey="total" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
            )
        },
        {
            id: 'insumos',
            title: 'Consumo de Insumos (Con Zoom Temporal)',
            component: (
                <LineChart data={dataInsumos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
                    <Line type="stepAfter" dataKey="cantidad" stroke={theme.palette.secondary.main} strokeWidth={3} dot={false} />
                    <Brush dataKey="date" height={30} stroke={theme.palette.secondary.main} fill="#333" />
                </LineChart>
            )
        },
        {
            id: 'margen',
            title: 'Contribución Marginal',
            component: (
                <PieChart>
                    <Pie
                        data={dataMargen}
                        dataKey="margenTotal"
                        nameKey="nombre"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({nombre, percent}) => `${nombre} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {dataMargen.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            )
        }
    ]

    return (
        <>
            <Grid container spacing={6}>
                {charts.map((chart) => (
                    <Grid item xs={12} key={chart.id}>
                        <ChartCard title={chart.title} extraControls={chart.controls} onMaximize={() => setMaximized(chart)}>
                            {chart.component}
                        </ChartCard>
                    </Grid>
                ))}
            </Grid>

            {/* Modal para ver gráfico maximizado */}
            <Dialog 
                open={Boolean(maximized)} 
                onClose={() => setMaximized(null)}
                maxWidth="xl"
                fullWidth
                PaperProps={{ sx: { bgcolor: 'background.paper', p: 2, borderRadius: 4 } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{maximized?.title}</Typography>
                        {maximized?.controls}
                    </Box>
                    <IconButton onClick={() => setMaximized(null)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ height: '75vh', minHeight: 600 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {maximized?.component || <div />}
                    </ResponsiveContainer>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AnalyticsCharts
