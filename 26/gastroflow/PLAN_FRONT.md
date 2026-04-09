# 🗺️ Plan de Desarrollo: Frontend GastroFlow (Actualizado)

Este documento describe la arquitectura, funcionalidades y diseño para la interfaz de usuario de **GastroFlow**, alineada con el backend de gestión de stock y ventas.

## 🏗️ Stack Tecnológico (Implementado)
- **Core:** React 18+ con Vite.
- **UI Framework:** Material UI (MUI 9) para un diseño **Premium, Dark & Robusto**.
- **Notificaciones:** SweetAlert2 (Para alertas críticas) + MUI SnackBar/Notifications.
- **Comunicación en Tiempo Real:** Socket.io-client (Conexión automática mozo-chef).
- **Lógica de Datos:** Ecosistema de **Custom Hooks** (useInsumos, useProductos, useVentas, useDashboard).
- **Estado:** Context Provider para Auth y Sockets.
- **Cliente API:** Axios (Con interceptores para inyección de JWT).

---

## 🎭 Arquitectura por Roles (Estado Actual)

### 1. Perfil Mozo (POS - Punto de Venta) [ACTIVO ✅]
*   **Selector de Menú:** Grid de productos con precio y estado de disponibilidad dinámica.
*   **Carrito de Comanda:** Gestión de cantidades y notas por plato ("Sin sal", "Bien cocido").
*   **Gestión de Pedidos:** Envío directo a cocina con reserva automática de stock neto.
*   **Notificaciones:** Alerta emergente instantánea cuando un plato está listo en cocina.

### 2. Perfil Chef (KDS - Kitchen Display System) [ACTIVO ✅]
*   **Monitor de Cocina:** Lista de tarjetas con pedidos PENDIENTES, cronómetro de demora y visualización de notas.
*   **Deducción Automática:** Al marcar "Listo", se informa al mozo vía Socket y se descuenta el stock físico.
*   **Reactividad:** La interfaz se actualiza sola al entrar nuevas órdenes.

### 3. Perfil Admin (Dashboard & Control) [ACTIVO ✅]
*   **Dashboard de Métricas:** Visualización de ventas totales, márgenes, cantidad de pedidos y alertas de stock bajo.
*   **Control de Inventario:** CRUD completo de Insumos con indicadores de niveles críticos.
*   **Gestión de Menú:** CRUD de Productos con editor de recetas detallado (Compuestos/Directos).

---

## 🎨 Diseño y Experiencia (UX/UI)
- **Tema Premium:** Interfaz oscura (Pitch Black / Charcoal) con acentos en Naranja (#ff9800) y Verde Esmeralda.
- **Tipografía:** Outfit (Google Fonts) para un acabado moderno y legible.
- **MUI DataGrid:** Tablas de alta performance para gestionar grandes volúmenes de insumos.

---

## ✅ Logros del Proyecto (Milestones Completados)
- [x] **Setup:** Proyecto React/Vite con Material UI y arquitectura de hooks.
- [x] **Auth:** Sistema de login seguro con persistencia en localStorage y protección de rutas.
- [x] **Sockets:** Comunicación bidireccional Mozo <-> Chef funcionando al 100%.
- [x] **CRUD Insumos:** Gestión total de stock físico y mínimo.
- [x] **CRUD Productos:** Motor de recetas funcional para platos compuestos.
- [x] **POS/KDS:** Flujo de comanda completo desde salón hasta despacho de cocina.

---

## 🚧 Funcionalidades Pendientes (Próxima Fase)
- [ ] **Gestión de Usuarios (Admin):** Interfaz para crear y editar empleados (Mozo, Chef, Admin).
- [ ] **Historial de Ventas Avanzado:** Vista para el administrador donde se puedan auditar ventas pasadas, filtrar por fechas y ver el detalle de costos/márgenes por pedido.
- [ ] **Categorización en POS:** Pestañas para filtrar productos (ej: Bebidas, Platos Principales, Postres).
- [ ] **Sistema de Imágenes:** Implementar carga y visualización de fotos para los platos del menú.
- [ ] **Reportes en PDF:** Generación de resúmenes de cierre de día o reportes de reposición de insumos.
