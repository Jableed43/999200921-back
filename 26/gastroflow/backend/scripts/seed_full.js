import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Insumo from '../src/models/insumoModel.js'
import Producto from '../src/models/productoModel.js'
import Venta from '../src/models/ventaModel.js'
import Usuario from '../src/models/usuarioModel.js'

dotenv.config()

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gastroflow')
        console.log('🔗 Conectado a MongoDB para Seed Completo')

        // 1. Limpiar colecciones
        await Insumo.deleteMany({})
        await Producto.deleteMany({})
        await Venta.deleteMany({})
        console.log('🧹 Base de datos limpiada (Insumos, Productos, Ventas)')

        // 2. Crear Insumos (Usando unidades válidas: gr, ml, unidad, kg, lt)
        const ins_carne = await Insumo.create({ nombre: 'Carne de Res', unidad: 'kg', stock_actual: 15, stock_minimo: 3, costo_unitario: 5000 })
        const ins_pan = await Insumo.create({ nombre: 'Pan Brioche', unidad: 'unidad', stock_actual: 40, stock_minimo: 10, costo_unitario: 200 })
        const ins_tomate = await Insumo.create({ nombre: 'Tomate', unidad: 'kg', stock_actual: 5, stock_minimo: 1, costo_unitario: 800 })
        const ins_gaseosa = await Insumo.create({ nombre: 'Gaseosa Cola', unidad: 'unidad', stock_actual: 5, stock_minimo: 6, costo_unitario: 500 }) // Alerta de stock bajo
        console.log('📦 Insumos creados')

        // 3. Crear Productos
        const prod_burger = await Producto.create({
            nombre: 'Hamburguesa Gastro',
            precio_venta: 8500,
            tipo: 'compuesto',
            activo: true,
            receta: [
                { insumo: ins_carne._id, cantidad: 0.18 },
                { insumo: ins_pan._id, cantidad: 1 },
                { insumo: ins_tomate._id, cantidad: 0.05 }
            ]
        })

        const prod_gaseosa = await Producto.create({
            nombre: 'Gaseosa 500ml',
            precio_venta: 2500,
            tipo: 'directo',
            activo: true,
            insumo_directo: ins_gaseosa._id
        })
        console.log('🍔 Productos creados')

        // 4. Crear una Venta inicial
        const mozo = await Usuario.findOne({ role: 'MOZO' })
        if (mozo) {
            await Venta.create({
                mozo: mozo._id,
                items: [
                    {
                        producto: prod_burger._id,
                        nombre_producto: prod_burger.nombre,
                        cantidad: 2,
                        precio_unitario: prod_burger.precio_venta,
                        costo_unitario: 1100,
                        notas: 'Una sin tomate'
                    }
                ],
                estado: 'ENTREGADO',
                total_ingresos: 17000,
                total_costo: 2200,
                margen: 14800,
                preparadoAt: new Date(),
                entregadoAt: new Date()
            })
            console.log('💰 Venta inicial creada')
        }

        console.log('✅ Seed finalizado con éxito')
        process.exit(0)
    } catch (error) {
        console.error('❌ Error en Seed:', error)
        process.exit(1)
    }
}

seedData()
