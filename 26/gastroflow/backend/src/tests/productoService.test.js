import { getAllProductoService, getProductoByIdService } from '../services/productoService.js'
import Insumo from '../models/insumoModel.js'
import Producto from '../models/productoModel.js'

describe('Producto Service - Lógica de Disponibilidad y Costos', () => {
    let insumoPan, insumoCarne

    beforeEach(async () => {
        insumoPan = await Insumo.create({
            nombre: 'pan',
            stock_actual: 10,
            stock_reservado: 0,
            stock_minimo: 2,
            unidad: 'unidad',
            costo_unitario: 100
        })

        insumoCarne = await Insumo.create({
            nombre: 'carne',
            stock_actual: 1000,
            stock_reservado: 0,
            stock_minimo: 200,
            unidad: 'gr',
            costo_unitario: 5
        })
    })

    test('Debe marcar producto como disponible si hay stock neto suficiente', async () => {
        const prod = await Producto.create({
            nombre: 'Burguer Simple',
            precio_venta: 1500,
            tipo: 'compuesto',
            receta: [
                { insumo: insumoPan._id, cantidad: 1 },
                { insumo: insumoCarne._id,   cantidad: 200 }
            ]
        })

        const res = await getProductoByIdService(prod._id)
        expect(res.disponible).toBe(true)
        expect(res.costo_calculado).toBe(1100) // 100 + (200*5)
    })

    test('Debe marcar como NO disponible si el stock neto cae por debajo del mínimo', async () => {
        // Reservamos 9 panes. Stock físico 10, reservados 9 -> Neto 1.
        // El mínimo es 2. Como 1 < 2, debería dar no disponible.
        insumoPan.stock_reservado = 9
        await insumoPan.save()

        const prod = await Producto.create({
            nombre: 'Burguer Bloqueada',
            precio_venta: 1500,
            tipo: 'compuesto',
            receta: [{ insumo: insumoPan._id, cantidad: 1 }]
        })

        const res = await getProductoByIdService(prod._id)
        expect(res.disponible).toBe(false)
    })

    test('Debe calcular correctamente el margen', async () => {
        const prod = await Producto.create({
            nombre: 'Burguer Margen',
            precio_venta: 2000,
            tipo: 'compuesto',
            receta: [{ insumo: insumoPan._id, cantidad: 1 }] // Costo 100
        })

        const res = await getProductoByIdService(prod._id)
        expect(res.margen_calculado).toBe(1900)
    })
})
