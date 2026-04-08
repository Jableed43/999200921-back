# 🗺️ Plan Estratégico: Sistema de Pedidos y Stock Comprometido

Este documento detalla la evolución de **GastroFlow** hacia un sistema de gestión integrado de pedidos, cocina (KDS) y control de inventario dinámico.

---

## 📝 Requerimiento del Sistema (Refinado)

El flujo operativo se basa en la trazabilidad total del pedido y la materia prima:

1.  **Toma de Pedido (Mozo):** El mozo selecciona productos del menú y añade notas de personalización (ej: "sin cebolla"). Durante esta etapa, el sistema muestra la **disponibilidad real**, que considera tanto el stock físico como el ya comprometido por otros pedidos en espera.
2.  **Preparación (Cocina):** Al confirmar, la comanda aparece en tiempo real en la pantalla de cocina. El Chef procesa el pedido y, al finalizar, lo marca como "Listo".
3.  **Entrega (Mozo):** La aprobación del Chef alerta al mozo, quien retira el pedido y lo entrega en la mesa.
4.  **Gestión de Inventario en 3 Etapas:**
    *   **Etapa Inicial (Comprometido):** El ingrediente se bloquea para asegurar su existencia.
    - **Etapa de Realización (Descuento):** Una vez que el plato se termina, el stock se resta físicamente del inventario global.
    - **Control y Alerta:** El mozo es notificado si algún ingrediente llega a su stock mínimo.
5.  **Métricas y Cierre:** Se guarda la venta final en el historial y se mide el tiempo transcurrido en cada fase para análisis de eficiencia.

---

## 🏗️ Propuesta Técnica: Arquitectura Dinámica

### 🚦 User Review Required

> [!IMPORTANT]
> El sistema implementará **Transacciones de MongoDB** para asegurar que el `stock_reservado` y el cambio de estado del pedido ocurran de forma atómica. Esto evita "ingredientes fantasma" si ocurre un error en el servidor.

---

### 🛠️ Cambios Propuestos

#### 1. [MODIFY] [insumoModel.js](file:///c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/backend/src/models/insumoModel.js)
- **Nuevo campo:** `stock_reservado` (Number, default: 0).
- **Virtual `disponible`:** Se redefine como `stock_actual - stock_reservado`. Este es el valor que verá el mozo al vender.
- **Validación:** No se puede reservar stock si el `disponible` resultante es < 0.

#### 2. [MODIFY] [ventaModel.js](file:///c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/backend/src/models/ventaModel.js)
- **Estado del Pedido:** `enum: ['PENDIENTE', 'LISTO', 'ENTREGADO', 'CANCELADO']`.
- **Personalización:** Campo `notas` (String) por cada item del pedido para instrucciones de cocina.
- **Asignación:** Campo `mozo` (referencia al usuario que inicia el pedido).
- **Métricas de Tiempo:** Campos `preparadoAt` (Date) y `entregadoAt` (Date).

#### 3. [MODIFY] [ventaService.js](file:///c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/backend/src/services/ventaService.js)
- **Refactor `createVenta`**: Al crear, el pedido nace como "PENDIENTE". Incrementa el `stock_reservado` de los insumos según la receta.
- **Nueva función `prepararPedido` (CHEF)**: 
    - Cambia estado a "LISTO".
    - Resta la cantidad de `stock_actual`.
    - Resta (libera) la cantidad de `stock_reservado`.
    - Registra el timestamp en `preparadoAt`.
- **Nueva función `entregarPedido` (MOZO)**:
    - Cambia estado a "ENTREGADO".
    - Registra el timestamp final.

#### 4. [MODIFY] [productoService.js](file:///c:/Users/jl/Downloads/utn-2026/999200921/26/gastroflow/backend/src/services/productoService.js)
- **Cálculo de Disponibilidad:** Se ajusta para comparar la receta contra el stock neto disponible (`fisico - reservado`).

---

### ❓ Preguntas Abiertas y Consideraciones

- **¿Personalización Selectiva?**: ¿Si el mozo anota "sin cebolla", el sistema debería NO reservar cebolla? 
    - *Decisión MVP:* Por ahora, el stock se reserva según la receta estándar para evitar complejidad lógica excesiva en la primera fase. Las notas son instrucciones visuales para el Chef.
- **Alertas Stock Mínimo:** Se activará un "Toast" o alerta visual en la UI del Mozo cuando el stock neto de un ingrediente crítico esté cerca del límite.

---

### 🧪 Plan de Verificación

- **Escenario 1 (Reserva):** Crear un pedido de 5 pizzas. Verificar que el stock de harina no baje, pero que la disponibilidad baje para el resto de los mozos.
- **Escenario 2 (Deducción):** Chef marca el pedido como "Listo". Verificar que el stock físico baje y la reserva se limpie.
- **Escenario 3 (Tiempo):** Validar que el Dashboard reporte correctamente el tiempo entre la toma del pedido y la aprobación de cocina.
