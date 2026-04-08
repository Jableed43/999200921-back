# 🍽️ GastroFlow — Especificación Técnica del Proyecto

> **Blueprint estratégico:** El objetivo es crear un ecosistema circular donde la venta de un producto final impacte automáticamente en la materia prima y en las métricas de negocio.

---

## 🏗️ 1. Arquitectura del Sistema

El sistema se basa en una relación de **dependencia jerárquica**:

| Nivel | Nombre | Descripción |
|-------|--------|-------------|
| **Nivel 1** | Insumos | La base de todo. Ingredientes individuales (gramos, mililitros, unidades). |
| **Nivel 2** | Recetas / Menú | Productos compuestos que "consumen" el Nivel 1. |
| **Nivel 3** | Operación | La interfaz que ejecuta la acción (Comanda). |
| **Nivel 4** | Inteligencia | El resultado de los datos procesados (Dashboard). |

---

## 📦 2. Definición de Módulos

### **Módulo de Inventario (La Despensa)**
- **Gestión de Stock:** Registro de materias primas con niveles de existencia actuales.
- **Umbrales Críticos:** Definición de "stock mínimo" por cada insumo.
- **Alerta de Reabastecimiento:** Sistema visual que identifica insumos agotados o por agotarse.
- **Valorización:** Seguimiento del costo de cada ingrediente para cálculos de rentabilidad.

### **Módulo de Menú y Recetas (La Ingeniería)**
- **Composición de Platos:** Vinculación de cada plato del menú con sus ingredientes específicos y cantidades exactas.
- **Diferenciación de Productos:** Categorización entre "Productos Compuestos" (requieren receta, ej: Hamburguesa) y "Productos Directos" (descuento unitario, ej: Refresco).

### **Módulo de Comanda (El Punto de Venta)**
- **Interfaz de Operación:** Selector rápido de productos para el personal de servicio.
- **Validación de Disponibilidad:** Bloqueo automático de productos en el menú si alguno de sus ingredientes base no tiene stock suficiente.
- **Ejecutor de Descuento:** Gatillo que, al confirmar la venta, procesa la resta de inventario en tiempo real.

### **Módulo Financiero (El Dashboard)**
- **Métricas de Ingresos:** Visualización de ventas brutas totales.
- **Costo de Ventas (COGS):** Cálculo automático de cuánto dinero se "consumió" en ingredientes para generar esas ventas.
- **Margen de Contribución:** Análisis de la ganancia neta por plato y total del periodo.

---

## 🔄 3. Flujo Lógico de la Información

```
[1. ENTRADA]        Se registra la compra de materia prima  →  Sube el stock
     ↓
[2. ACCIÓN]         El usuario confirma una "Comanda" en el frontend
     ↓
[3. PROCESAMIENTO]  El backend busca la receta → identifica ingredientes → resta del inventario
     ↓
[4. SALIDA VISUAL]  Dashboard actualiza gráficos + inventario muestra nuevas alertas
```

---

## 🗄️ 4. Modelo de Datos

### `insumos` — Materias Primas
```json
{
  "id": 1,
  "nombre": "Pan de hamburguesa",
  "stock_actual": 50,
  "stock_minimo": 10,
  "unidad": "unidad",
  "costo_unitario": 150.00
}
```

### `productos` — Items del Menú
```json
{
  "id": 1,
  "nombre": "Hamburguesa Clásica",
  "precio_venta": 2500.00,
  "tipo": "compuesto",
  "disponible": true
}
```
> `tipo` puede ser `"compuesto"` (requiere receta) o `"directo"` (se descuenta como unidad).

### `recetas` — Composición de Platos
```json
{
  "producto_id": 1,
  "insumo_id": 3,
  "cantidad": 200
}
```

### `ventas` y `detalle_ventas` — Registro de Comandas
```json
// ventas
{ "id": 1, "fecha": "2026-04-08T19:00:00", "total": 3800.00 }

// detalle_ventas
{ "venta_id": 1, "producto_id": 1, "cantidad": 1, "precio_unitario": 2500.00 }
```

---

## 🗂️ 5. Estructura de Carpetas (MVC Simplificado)

```
gastroflow/
│
├── backend/
│   ├── index.js                  # Entry point, setup del servidor Express
│   ├── package.json
│   ├── .env                      # Variables de entorno (puerto, DB, etc.)
│   │
│   ├── routes/
│   │   ├── insumos.routes.js     # GET, POST, PUT, DELETE de insumos
│   │   ├── productos.routes.js   # GET, POST del menú
│   │   ├── recetas.routes.js     # Vinculación producto-ingrediente
│   │   └── ventas.routes.js      # POST de comanda (la operación atómica)
│   │
│   ├── controllers/
│   │   ├── insumos.controller.js
│   │   ├── productos.controller.js
│   │   ├── recetas.controller.js
│   │   └── ventas.controller.js  # ⭐ Lógica de descuento atómico
│   │
│   └── data/
│       └── db.json               # Base de datos JSON (para MVP con json-server)
│
└── frontend/
    ├── index.html                # Dashboard / Vista principal
    ├── comanda.html              # Punto de Venta (POS)
    ├── inventario.html           # ABM de insumos
    ├── menu.html                 # ABM de productos y recetas
    │
    ├── css/
    │   └── styles.css            # Estilos globales (Dark Mode)
    │
    └── js/
        ├── api.js                # Módulo de fetch (base URL, helpers)
        ├── dashboard.js          # Gráficos y métricas
        ├── comanda.js            # Lógica del POS
        ├── inventario.js         # CRUD de insumos
        └── menu.js               # CRUD de productos/recetas
```

---

## 🔌 6. API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/insumos` | Lista todos los insumos con estado de stock |
| `POST` | `/api/insumos` | Registra un nuevo insumo |
| `PUT` | `/api/insumos/:id` | Actualiza stock o datos de un insumo |
| `GET` | `/api/productos` | Lista el menú con disponibilidad calculada |
| `POST` | `/api/productos` | Crea un producto nuevo |
| `GET` | `/api/recetas/:producto_id` | Obtiene los ingredientes de un plato |
| `POST` | `/api/recetas` | Vincula un producto con sus ingredientes |
| `POST` | `/api/ventas` | ⭐ **Confirma una comanda** (operación atómica) |
| `GET` | `/api/dashboard` | Retorna métricas: ingresos, COGS, margen |

---

## 🛠️ 7. Stack de Funcionalidades MVP

- **Acción Rápida de Compra:** Botón para "simular pedido a proveedor" que repone stock de forma masiva.
- **Reporte de Faltantes:** Lista automática de "Compras Necesarias" basada en los ingredientes por debajo del mínimo.
- **Resumen de Ganancias:** Comparativa visual entre lo que ingresó por ventas y lo que costó el inventario utilizado.

---

## 🎯 8. Reglas de Negocio Clave

- **Prioridad de Stock:** Ninguna comanda puede procesarse si el stock resultante fuera negativo.
- **Atomicidad:** La venta y el descuento de inventario deben suceder como una sola operación para evitar desfasajes en los datos.
- **Disponibilidad Dinámica:** El campo `disponible` de cada producto se recalcula en cada `GET /api/productos` comparando el stock actual vs. la receta requerida.

---

## 🚀 9. Roadmap de Construcción (Fases)

### Fase 1 — Fundación (Backend Base)
- [ ] Inicializar proyecto Node.js + Express
- [ ] Definir `db.json` con datos de prueba
- [ ] Endpoints CRUD de `/api/insumos`
- [ ] Lógica de alertas de stock mínimo

### Fase 2 — Ingeniería del Menú
- [ ] Endpoints de `/api/productos`
- [ ] Endpoints de `/api/recetas` (vinculación)
- [ ] Algoritmo de cálculo de COGS por producto

### Fase 3 — El Punto de Venta (La Operación Atómica)
- [ ] `POST /api/ventas` con lógica transaccional completa
- [ ] Validación de stock antes de confirmar
- [ ] Frontend de Comanda (POS) conectado a la API

### Fase 4 — Dashboard e Inteligencia
- [ ] `GET /api/dashboard` con métricas agregadas
- [ ] Gráficos de ingresos vs costos
- [ ] Interfaz de Inventario con alertas visuales

---

## 📐 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Backend** | Node.js + Express.js |
| **Base de Datos (MVP)** | JSON Server / `db.json` |
| **Frontend** | HTML + CSS Vanilla + JavaScript |
| **Estilos** | Dark Mode, Flexbox/Grid |
| **Despliegue** | Local (`npm run dev`) |