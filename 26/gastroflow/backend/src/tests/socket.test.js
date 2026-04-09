import { io as Client } from 'socket.io-client'
import { server } from '../../index.js'
import { getIO } from '../config/socket.js'

describe('Socket.io Integration Tests', () => {
    let clientSocket
    const PORT_TEST = 4001

    beforeAll((done) => {
        // En entorno de test, el server no arranca automáticamente en index.js
        server.listen(PORT_TEST, () => {
            clientSocket = new Client(`http://localhost:${PORT_TEST}`)
            clientSocket.on('connect', done)
        })
    })

    afterAll(() => {
        server.close()
        clientSocket.disconnect()
    })

    test('Mozo se une a su sala y recibe notificación de pedido listo', (done) => {
        const mozoId = 'mozo_123'
        
        // 1. Escuchamos el evento ANTES de emitir nada
        clientSocket.on('ORDEN_LISTA', (data) => {
            try {
                expect(data.message).toBe('¡Tu pedido está listo!')
                expect(data.ventaId).toBe('venta_abc')
                done()
            } catch (error) {
                done(error)
            }
        })

        // 2. Mozo se une a su sala privada con callback para evitar race condition
        clientSocket.emit('join', mozoId, (response) => {
            expect(response.status).toBe('ok')
            
            // 3. Una vez unido, simulamos emisión desde el servidor
            const io = getIO()
            io.to(mozoId).emit('ORDEN_LISTA', {
                message: '¡Tu pedido está listo!',
                ventaId: 'venta_abc'
            })
        })
    })

    test('Chef se une a cocina y recibe notificación de nueva comanda', (done) => {
        // 1. Escuchamos el evento
        clientSocket.on('ORDEN_NUEVA', (data) => {
            try {
                expect(data.message).toBe('Nueva comanda recibida')
                expect(data.total_items).toBe(2)
                done()
            } catch (error) {
                done(error)
            }
        })

        // 2. Chef se une a sala de cocina con callback
        clientSocket.emit('join_chef', (response) => {
            expect(response.status).toBe('ok')

            // 3. Una vez unido, simulamos emisión desde el servidor
            const io = getIO()
            io.to('chef').emit('ORDEN_NUEVA', {
                message: 'Nueva comanda recibida',
                total_items: 2
            })
        })
    })
})
