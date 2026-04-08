/**
 * seed.js — Script para poblar la base de datos con datos de prueba
 * Uso: node seed.js
 */
import './src/config/config.js'
import mongoose from 'mongoose'
import { connectDB } from './src/config/db.js'
import Insumo from './src/models/insumoModel.js'
import Producto from './src/models/productoModel.js'

await connectDB()

// Limpiar colecciones
await Insumo.deleteMany()
await Producto.deleteMany()
console.log('🧹 Colecciones limpiadas')

// ── Insumos ──────────────────────────────────────────────────────────────────
const insumos = await Insumo.insertMany([
    { nombre: 'pan de hamburguesa', stock_actual: 50,   stock_minimo: 10,   unidad: 'unidad', costo_unitario: 150  },
    { nombre: 'carne molida',       stock_actual: 4000, stock_minimo: 500,  unidad: 'gr',     costo_unitario: 1.8  },
    { nombre: 'queso cheddar',      stock_actual: 800,  stock_minimo: 200,  unidad: 'gr',     costo_unitario: 2.5  },
    { nombre: 'lechuga',            stock_actual: 1200, stock_minimo: 300,  unidad: 'gr',     costo_unitario: 0.8  },
    { nombre: 'tomate',             stock_actual: 2000, stock_minimo: 400,  unidad: 'gr',     costo_unitario: 1.2  },
    { nombre: 'papa',               stock_actual: 5000, stock_minimo: 1000, unidad: 'gr',     costo_unitario: 0.5  },
    { nombre: 'aceite de girasol',  stock_actual: 3000, stock_minimo: 500,  unidad: 'ml',     costo_unitario: 0.9  },
    { nombre: 'gaseosa 500ml',      stock_actual: 8,    stock_minimo: 12,   unidad: 'unidad', costo_unitario: 400  },
])
console.log(`✅ ${insumos.length} insumos creados`)

// Helper para encontrar un insumo por nombre
const find = (nombre) => insumos.find(i => i.nombre === nombre)._id

// ── Productos ─────────────────────────────────────────────────────────────────
const productos = await Producto.insertMany([
    {
        nombre: 'hamburguesa clásica',
        precio_venta: 2500,
        tipo: 'compuesto',
        receta: [
            { insumo: find('pan de hamburguesa'), cantidad: 1 },
            { insumo: find('carne molida'),        cantidad: 150 },
            { insumo: find('lechuga'),             cantidad: 30 },
            { insumo: find('tomate'),              cantidad: 50 },
        ],
    },
    {
        nombre: 'hamburguesa con queso',
        precio_venta: 2800,
        tipo: 'compuesto',
        receta: [
            { insumo: find('pan de hamburguesa'), cantidad: 1 },
            { insumo: find('carne molida'),        cantidad: 150 },
            { insumo: find('queso cheddar'),       cantidad: 40 },
            { insumo: find('lechuga'),             cantidad: 30 },
            { insumo: find('tomate'),              cantidad: 50 },
        ],
    },
    {
        nombre: 'papas fritas',
        precio_venta: 1200,
        tipo: 'compuesto',
        receta: [
            { insumo: find('papa'),              cantidad: 250 },
            { insumo: find('aceite de girasol'), cantidad: 100 },
        ],
    },
    {
        nombre: 'gaseosa',
        precio_venta: 800,
        tipo: 'directo',
        insumo_directo: find('gaseosa 500ml'),
        receta: [],
    },
])
console.log(`✅ ${productos.length} productos creados`)
console.log('⚠️  Nota: "gaseosa 500ml" tiene stock bajo mínimo (8 < 12) — alerta activa')

await mongoose.disconnect()
console.log('\n🎉 Seed completado. Corrí: npm run dev')
