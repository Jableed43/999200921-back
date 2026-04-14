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

export const getAnalyticsService = async (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999) // Incluir el día completo

    const matchStage = {
        $match: {
            createdAt: { $gte: start, $lte: end }
        }
    }

    // 1. Ventas por Mozo
    const ventasPorMozo = await Venta.aggregate([
        matchStage,
        {
            $lookup: {
                from: 'usuarios',
                localField: 'mozo',
                foreignField: '_id',
                as: 'mozoInfo'
            }
        },
        { $unwind: '$mozoInfo' },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    mozo: '$mozoInfo.nombre'
                },
                total: { $sum: '$total_ingresos' }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id.date',
                mozo: '$_id.mozo',
                total: 1
            }
        },
        { $sort: { date: 1 } }
    ])

    // 2. Ventas por Producto
    const ventasPorProducto = await Venta.aggregate([
        matchStage,
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.nombre_producto',
                total: { $sum: { $multiply: ['$items.cantidad', '$items.precio_unitario'] } }
            }
        },
        {
            $project: {
                _id: 0,
                nombre: '$_id',
                total: 1
            }
        },
        { $sort: { total: -1 } }
    ])

    // 3. Insumos por Tiempo (Estimado por ventas)
    // Nota: Aquí simplificamos el consumo basado en la suma de items vendidos
    const insumosPorTiempo = await Venta.aggregate([
        matchStage,
        { $unwind: '$items' },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                cantidad: { $sum: '$items.cantidad' }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                cantidad: 1
            }
        },
        { $sort: { date: 1 } }
    ])

    // 4. Margen de Ganancia (Contribución Marginal)
    const contribucionMarginal = await Venta.aggregate([
        matchStage,
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.nombre_producto',
                margenTotal: { $sum: { $subtract: [{ $multiply: ['$items.cantidad', '$items.precio_unitario'] }, { $multiply: ['$items.cantidad', '$items.costo_unitario'] }] } },
                costoTotal: { $sum: { $multiply: ['$items.cantidad', '$items.costo_unitario'] } }
            }
        },
        {
            $project: {
                _id: 0,
                nombre: '$_id',
                margenTotal: 1,
                costoTotal: 1
            }
        }
    ])

    return {
        ventasPorMozo,
        ventasPorProducto,
        insumosPorTiempo,
        contribucionMarginal
    }
}
