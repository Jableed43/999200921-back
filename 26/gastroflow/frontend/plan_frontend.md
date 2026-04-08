# 🗺️ Plan de Desarrollo: Frontend GastroFlow

Este documento describe la arquitectura, funcionalidades y diseño para la interfaz de usuario de **GastroFlow**, alineada con el backend de gestión de stock y ventas.

## 🏗️ Stack Tecnológico
- **Core:** React 18+ con Vite (Rápido y moderno).
- **Estilos:** Vanilla CSS (Flexbox/Grid) para un diseño **Premium & Custom**.
- **Estado:** React Context + Hooks (Simplicidad y eficiencia).
- **Cliente API:** Axios (Interceptors para manejo de JWT).
- **Iconografía:** Lucide React o FontAwesome.

---

## 🎭 Arquitectura por Roles

El frontend se adaptará dinámicamente según el rol del usuario logueado en el backend:

### 1. Perfil Mozo (POS - Punto de Venta)
*   **Selector de Menú:** Grid de productos con fotos, precio y estado de disponibilidad en tiempo real.
*   **Carrito de Comanda:** Lista de selección actual donde se pueden agregar notas por plato (ej: "Sin sal").
*   **Gestión de Mesas:** (Opcional) Mapa básico de mesas para asignar pedidos.
*   **Historial de Pedidos:** Vista rápida para saber si un pedido está `PENDIENTE`, `LISTO` (aviso visual) o ya fue `ENTREGADO`.

### 2. Perfil Chef (KDS - Kitchen Display System)
*   **Monitor de Cocina:** Lista de tarjetas compactas con los platos pendientes, ordenados por antigüedad.
*   **Deducción Automática:** Al presionar "LISTO", se informa al backend para que descuente el stock físico.
*   **Filtros:** Capacidad de ver solo ciertos tipos de pedidos (ej: solo postres).

### 3. Perfil Admin (Dashboard & Control)
*   **Panel de Métricas:** Gráficos (Chart.js/Recharts) con ingresos, costos y márgenes diarios.
*   **Control de Inventario:** Lista de insumos con alertas críticas para aquellos por debajo del `stock_minimo`.
*   **Gestores CRUD:** Pantallas para crear/editar Usuarios, Insumos y Productos (definiendo recetas).

---

## 🎨 Diseño y Experiencia (UX/UI)
Para lograr un acabado **Premium**, se aplicarán los siguientes principios:
- **Glassmorphism:** Efectos de desenfoque de fondo en modales y paneles laterales.
- **Dark Mode Elegante:** Fondo carbón con acentos vibrantes (Naranja para pendientes, Verde esmeralda para listos).
- **Micro-interacciones:** Animaciones suaves al agregar items al carrito o cambiar estados.
- **Responsive Design:** Optimización total para tablets (Kitchen) y móviles (Mozos).

---

## 🔍 Análisis del Backend (Detecciones)

Basado en la estructura actual del backend, se informan los siguientes puntos a reforzar:

### ✅ Lo que está listo para conectar:
- Autenticación segura (JWT).
- Lógica de compromiso de stock en 3 etapas.
- Cálculo de disponibilidad basado en stock neto.
- Endpoints de CRUD protegidos por roles.

### ⚠️ Lo que falta (Recomendado):
1.  **Imágenes:** El modelo `Producto` actual no tiene campo `imagen`. Es crítico para la experiencia del Mozo.
2.  **WebSockets:** Actualmente no hay una forma de que el Mozo sepa que el Chef terminó un plato sin refrescar o hacer polling. Se recomienda `Socket.io`.
3.  **Categorías:** Los productos deberían tener categorías (Entradas, Bebidas, etc.) para facilitar la navegación en el POS.
4.  **Buscador Avanzado:** Añadir filtros por fecha y usuario en el historial de ventas del backend para mejores reportes en el frontend.

---

## 🚀 Próximos Pasos (Milestones)
1.  **Setup:** Inicializar proyecto con Vite y configurar estructura de carpetas (`components/`, `hooks/`, `views/`).
2.  **Auth:** Pantalla de Login e integración con el interceptor de Axios.
3.  **POS Mozo:** Desarrollo del Grid de Menú y sistema de creación de comandas.
4.  **KDS Chef:** Pantalla de cola de pedidos.
5.  **Admin:** Implementación de tablas CRUD y Dashboard de métricas.
