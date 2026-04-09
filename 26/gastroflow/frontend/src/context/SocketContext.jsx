import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import Swal from 'sweetalert2'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
    const { user } = useAuth()
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        if (user) {
            const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000')
            setSocket(newSocket)

            newSocket.on('connect', () => {
                console.log('🔗 Conectado al servidor de Sockets')
                // Unirse a la sala personal (como Mozo)
                newSocket.emit('join', user.id)
                
                // Si es Chef, unirse a sala de cocina
                if (user.role === 'CHEF') {
                    newSocket.emit('join_chef')
                }
            })

            // Escuchar notificaciones de pedido listo (Mozo)
            newSocket.on('ORDEN_LISTA', (data) => {
                Swal.fire({
                    title: '¡Pedido Listo!',
                    text: data.message,
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true
                })
            })

            // Escuchar nuevas comandas (Chef)
            newSocket.on('ORDEN_NUEVA', (data) => {
                Swal.fire({
                    title: 'Nuevo Pedido',
                    text: data.message,
                    icon: 'info',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true
                })
            })

            return () => newSocket.close()
        }
    }, [user])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)
