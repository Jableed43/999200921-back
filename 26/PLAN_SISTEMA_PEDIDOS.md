# 🗺️ Plan Estratégico: Sistema de Pedidos y Stock Comprometido

Este documento detalla la evolución de **GastroFlow** hacia un sistema de gestión integrado de pedidos, cocina (KDS) y control de inventario dinámico.

---

## ✅ Estado Actual de Implementación (Backend)

| Componente | Descripción | Estado |
| :--- | :--- | :--- |
| **Auth & RBAC** | Registro, Login y Protección por Roles (Admin/Chef/Mozo) | **COMPLETADO** |
| **Stock Flow** | Gestión en 3 etapas: Reserva -> Deducción -> Entrega | **COMPLETADO** |
| **Transacciones** | Atomicidad en operaciones de stock (Mongoose sessions) | **COMPLETADO** |
| **Control Mínimos** | Bloqueo de comandas si vulneran el stock de seguridad | **COMPLETADO** |
| **Testing** | Suite de 20 tests con 100% éxito y ~83% cobertura | **COMPLETADO** |
| **Real-time** | Notificaciones instantáneas (Chef -> Mozo) via Socket.io | **EN PROGRESO** |

---

## 🏗️ Propuesta Técnica: Socket.io Integration

Para evitar que el Mozo tenga que actualizar manualmente la pantalla para ver si un plato está listo, implementaremos un servidor de WebSockets.

### 🛠️ Cambios Propuestos

#### 1. [NEW] API Socket Service
- Inicialización de `server.http` en `index.js` para soportar tanto Express como Socket.io.
- Creación de un helper global para emitir eventos desde los controladores.

#### 2. [MODIFY] [ventaController.js](file:///c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/backend/src/controllers/ventaController.js)
- Al completar con éxito la transición a `LISTO`, se emitirá un evento `{ event: 'ORDEN_LISTA', data: { ventaId, mozoId } }`.

#### 3. [MODIFY] [dashboardService.js](file:///c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/backend/src/services/dashboardService.js)
- Emisión de alerta global `STOCK_CRITICO` cuando un insumo cae por debajo del mínimo tras una deducción.

---

## 🏗️ Configuración del Insumo y Producto (Arquitectura Original)

#### 1. [MODIFY] [insumoModel.js](file:///c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/backend/src/models/insumoModel.js) [COMPLETADO]
- **Campo:** `stock_reservado`.
- **Virtual `disponible`:** `stock_actual - stock_reservado`.

#### 2. [MODIFY] [ventaModel.js](file:///c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/backend/src/models/ventaModel.js) [COMPLETADO]
- **Estado:** `PENDIENTE`, `LISTO`, `ENTREGADO`.
- **Tiempos:** `preparadoAt` y `entregadoAt`.

---

## ❓ Consideraciones Futuras (Post-Socket)

- **Imágenes en Productos:** El frontend requerirá un campo `imagen` en el modelo de Producto.
- **Categorías:** Clasificación por Bebidas, Entradas, Platos, etc.
- **Reconexión:** Gestión de sockets cuando el Mozo pierde señal de Wi-Fi.

---

## 🧪 Plan de Verificación de Tiempo Real
- **Test manual:** Conectar dos clientes de prueba, marcar un pedido como listo en uno y verificar recepción inmediata en el otro.
- **Test de integración:** Validar que el evento de stock crítico se dispare exactamente cuando el stock neto cruza el umbral.
