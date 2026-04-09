import { Server } from 'socket.io'

let io

export const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        console.log(`🔌 Nuevo cliente conectado: ${socket.id}`)

        // El cliente se une a su propia sala (basada en id de usuario)
        // El frontend debe emitir 'join' con su userId al conectar
        socket.on('join', (userId, callback) => {
            if (userId) {
                socket.join(userId)
                console.log(`👤 Usuario ${userId} unido a su sala privada`)
                if (callback) callback({ status: 'ok' })
            }
        })

        // Unirse a la sala de cocina para recibir pedidos nuevos
        socket.on('join_chef', (callback) => {
            socket.join('chef')
            console.log(`👨‍🍳 Chef unido a la sala de cocina`)
            if (callback) callback({ status: 'ok' })
        })

        socket.on('disconnect', () => {
            console.log(`❌ Cliente desconectado: ${socket.id}`)
        })
    })

    return io
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io no ha sido inicializado')
    }
    return io
}

/**
 * Helper para emitir eventos de forma sencilla
 * @param {string} room - Sala a la que emitir (ej: 'chef' o userId)
 * @param {string} event - Nombre del evento
 * @param {object} data - Datos a enviar
 */
export const emitEvent = (room, event, data) => {
    if (io) {
        if (room) {
            io.to(room).emit(event, data)
        } else {
            io.emit(event, data)
        }
    }
}
