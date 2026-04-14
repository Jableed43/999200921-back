import { subDays, format, startOfDay, eachDayOfInterval } from 'date-fns'

// Configuración de Mocks
const MOZOS = ['Ramón', 'Lucía', 'Marcos', 'Sofía']
const PRODUCTOS = [
    { nombre: 'Hamb. Clásica', precio: 8500, costo: 3200 },
    { nombre: 'Cerveza Artesanal', precio: 3500, costo: 1200 },
    { nombre: 'Papas Cheddar', precio: 4500, costo: 1500 },
    { nombre: 'Ensalada Caesar', precio: 6200, costo: 2100 },
    { nombre: 'Pizza Muzza', precio: 9500, costo: 4000 }
]
const INSUMOS = ['Carne vacuna', 'Pan brioche', 'Papas', 'Cheddar', 'Malta/Lúpulo']

export const generateMockAnalytics = () => {
    const end = new Date()
    const start = subDays(end, 365) // Un año completo
    
    const days = eachDayOfInterval({ start, end })
    
    const allData = days.flatMap(date => {
        // Generar entre 10 y 30 ventas por día
        const salesCount = Math.floor(Math.random() * 20) + 10
        
        return Array.from({ length: salesCount }, () => {
            const product = PRODUCTOS[Math.floor(Math.random() * PRODUCTOS.length)]
            return {
                timestamp: date,
                dateStr: format(date, 'yyyy-MM-dd'),
                mozo: MOZOS[Math.floor(Math.random() * MOZOS.length)],
                producto: product.nombre,
                ingreso: product.precio,
                costo: product.costo,
                margen: product.precio - product.costo,
                cantidadItems: Math.floor(Math.random() * 3) + 1,
                insumosConsumidos: Math.floor(Math.random() * 5) + 1 // Simulado
            }
        })
    })

    return allData
}

export const getFilteredAnalytics = (allData, startDate, endDate) => {
    const s = startOfDay(new Date(startDate))
    const e = startOfDay(new Date(endDate))

    return allData.filter(item => {
        const itemDate = startOfDay(item.timestamp)
        return itemDate >= s && itemDate <= e
    })
}

// Transformadores para Recharts
export const transformVentasByMozo = (filteredData) => {
    const map = {}
    filteredData.forEach(item => {
        const key = item.dateStr
        if (!map[key]) {
            map[key] = { date: key }
            MOZOS.forEach(m => map[key][m] = 0)
        }
        map[key][item.mozo] += item.ingreso
    })
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date))
}

export const transformVentasByProducto = (filteredData) => {
    const map = {}
    filteredData.forEach(item => {
        map[item.producto] = (map[item.producto] || 0) + item.ingreso
    })
    return Object.entries(map).map(([nombre, total]) => ({ nombre, total }))
}

export const transformInsumosByTime = (filteredData) => {
    const map = {}
    filteredData.forEach(item => {
        const key = item.dateStr
        map[key] = (map[key] || 0) + item.insumosConsumidos
    })
    return Object.entries(map).map(([date, cantidad]) => ({ date, cantidad })).sort((a,b) => a.date.localeCompare(b.date))
}

export const transformMarginalContribution = (filteredData) => {
    const map = {}
    filteredData.forEach(item => {
        if (!map[item.producto]) {
            map[item.producto] = { nombre: item.producto, margenTotal: 0, costoTotal: 0 }
        }
        map[item.producto].margenTotal += item.margen
        map[item.producto].costoTotal += item.costo
    })
    return Object.values(map)
}
