import { createVentaService, prepararPedidoService, entregarPedidoService } from '../services/ventaService.js'
import Insumo from '../models/insumoModel.js'
import Producto from '../models/productoModel.js'
import Venta from '../models/ventaModel.js'
import Usuario from '../models/usuarioModel.js'

describe('Venta Service - Gestión de Pedidos y Stock', () => {
    let mozoId
    let insumoCarne
    let productoBurguer

    beforeEach(async () => {
        // Crear un mozo de prueba
        const mozo = await Usuario.create({
            nombre: 'Juan',
            apellido: 'Mozo',
            email: 'mozo@test.com',
            password: 'Password123',
            role: 'MOZO'
        })
        mozoId = mozo._id

        // Crear insumo (Carne)
        insumoCarne = await Insumo.create({
            nombre: 'carne',
            stock_actual: 1000,
            stock_reservado: 0,
            stock_minimo: 100,
            unidad: 'gr',
            costo_unitario: 2
        })

        // Crear producto (Hamburguesa) que usa 200gr de carne
        productoBurguer = await Producto.create({
            nombre: 'burguer',
            precio_venta: 1000,
            tipo: 'compuesto',
            receta: [{ insumo: insumoCarne._id, cantidad: 200 }]
        })
    })

    test('Etapa 1: Debe reservar stock correctamente al crear la comanda', async () => {
        const items = [{ producto_id: productoBurguer._id, cantidad: 2 }]
        const venta = await createVentaService(items, mozoId)

        expect(venta.estado).toBe('PENDIENTE')
        expect(venta.total_ingresos).toBe(2000)

        // Verificar reserva: 200gr * 2 = 400gr reservados
        const insumoPost = await Insumo.findById(insumoCarne._id)
        expect(insumoPost.stock_reservado).toBe(400)
        expect(insumoPost.stock_actual).toBe(1000) // El físico no cambia aún
    })

    test('Bloqueo por Mínimo: Debe fallar si el pedido compromete el stock mínimo', async () => {
        // Pedimos 5 burguers (1000gr). Stock actual 1000, mínimo 100.
        // Quedarían 0gr, que es < 100. Debe fallar.
        const items = [{ producto_id: productoBurguer._id, cantidad: 5 }]
        
        await expect(createVentaService(items, mozoId))
            .rejects.toThrow(/Bloqueo por Stock Mínimo/)
    })

    test('Etapa 2: Debe descontar stock físico y limpiar reserva al marcar como LISTO', async () => {
        // Paso 1: Crear reserva (400gr)
        const items = [{ producto_id: productoBurguer._id, cantidad: 2 }]
        const venta = await createVentaService(items, mozoId)

        // Paso 2: Chef aprueba
        const ventaLista = await prepararPedidoService(venta._id)

        expect(ventaLista.estado).toBe('LISTO')
        expect(ventaLista.preparadoAt).toBeDefined()

        // Verificar stock final
        const insumoPost = await Insumo.findById(insumoCarne._id)
        expect(insumoPost.stock_actual).toBe(600) // 1000 - 400
        expect(insumoPost.stock_reservado).toBe(0) // Reserva liberada
    })

    test('Etapa 3: Debe marcar como ENTREGADO correctamente', async () => {
        const items = [{ producto_id: productoBurguer._id, cantidad: 1 }]
        const venta = await createVentaService(items, mozoId)
        await prepararPedidoService(venta._id)
        
        const ventaEntregada = await entregarPedidoService(venta._id)
        
        expect(ventaEntregada.estado).toBe('ENTREGADO')
        expect(ventaEntregada.entregadoAt).toBeDefined()
    })
})
