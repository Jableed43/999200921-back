import Venta from '../models/ventaModel.js'
import Insumo from '../models/insumoModel.js'

export const getDashboardService = async () => {
    // 1. Métricas financieras globales
    const [financiero] = await Venta.aggregate([
        {
            $group: {
                _id: null,
                ventas_brutas:   { $sum: '$total_ingresos' },
                costo_total:     { $sum: '$total_costo' },
                margen_total:    { $sum: '$margen' },
                cantidad_ventas: { $sum: 1 },
            },
        },
    ])

    // 2. Consumo del día (Físico vs Comprometido)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const ventasHoy = await Venta.find({ createdAt: { $gte: hoy } })
    
    let ingresosHoy = 0
    let itemsVendidosHoy = 0
    ventasHoy.forEach(v => {
        ingresosHoy += v.total_ingresos
        v.items.forEach(i => itemsVendidosHoy += i.cantidad)
    })

    // 3. Alertas de Reposición Proactivas (Basadas en Stock Neto)
    // El stock neto es lo que REALMENTE queda después de terminar los pedidos pendientes.
    const insumos = await Insumo.find().select('nombre stock_actual stock_reservado stock_minimo unidad')
    
    const alertasRepo = insumos.filter(i => (i.stock_actual - i.stock_reservado) <= i.stock_minimo)
        .map(i => ({
            nombre: i.nombre,
            stock_fisico: i.stock_actual,
            stock_reservado: i.stock_reservado,
            disponible_neto: i.stock_actual - i.stock_reservado,
            minimo_seguridad: i.stock_minimo,
            estado: (i.stock_actual - i.stock_reservado) <= 0 ? 'AGOTADO' : 'BAJO_MINIMO'
        }))

    const metricas = financiero || {
        ventas_brutas: 0,
        costo_total: 0,
        margen_total: 0,
        cantidad_ventas: 0,
    }

    return {
        global: {
            ventas_totales:   metricas.ventas_brutas,
            margen_total:     metricas.margen_total,
            cantidad_ventas:  metricas.cantidad_ventas,
        },
        hoy: {
            ingresos: ingresosHoy,
            cantidad_pedidos: ventasHoy.length,
            items_vendidos: itemsVendidosHoy,
        },
        inventario: {
            alertas_reposicion: alertasRepo,
            cantidad_alertas: alertasRepo.length
        }
    }
}
