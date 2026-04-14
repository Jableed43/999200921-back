import { Box, TextField, Card, Typography } from '@mui/material'

const AnalyticsFilters = ({ startDate, endDate, setStartDate, setEndDate }) => {
    return (
        <Card sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', boxShadow: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>Filtros de Análisis</Typography>
            
            <TextField
                label="Fecha Desde"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
            />

            <TextField
                label="Fecha Hasta"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
            />
        </Card>
    )
}

export default AnalyticsFilters
