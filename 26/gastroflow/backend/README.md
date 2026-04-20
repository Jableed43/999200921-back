# Aplicacion de gestión gastronómica - Gastroflow

Este proyecto es una API REST contruida con **Node.js** y **Express** para gestionar un local gastronomico. Incluye funcionalidad completas para que los mozos tomen pedidos, carguen el pedido en sistema, hacia la cocina se genere una peticion generando una comanda. Ademas desde cualquier parte del sistema se pueden ver los pedidos y su estado.

## Tecnologías Utilizadas

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Base de Datos**: MongoDB y Mongoose
- **Autenticacion**: JSON web token (JWT), Bcrypt
- **Otros**: CORS, Dotenv, Jest (Testing)

## Prerequisitos

- **MongoDB Community server**
- **Node.js**

## Instalacion y Configuración

1. **Clonar el repositorio**:
 ```bash
    git clone https://github.com/Jableed43/999200921-back.git
    cd 26/gastroflow/backend
 ```

2. **Instalar dependencias**:
 ```bash
    npm install
 ```

 3. **Configurar variables de entorno**:
 ```env
    PORT= ...
    MONGO_URI= mongodb://localhost:27017/<DB>
    SECRET= ...
    MP_ACCESS_TOKEN= ...
    MP_PUBLIC_KEY= ...
 ```

4. **Iniciar el servidor**:
    - En modo desarrollo: `npm run dev`
    - En modo produccion: `npm run start`
    - En modo generar datos de prueba: `npm run seed`
    - En modo de test: `npm run test`
    - En modo de test con coverage: `test:coverage`

## 📂 Estructura del Proyecto

## Ejemplos de peticiones (Mocks)

Para facilitar las pruebas, aqui tienes ejemplos de los cuerpos JSON utilizados en las peticiones:

### Registro de usuario (Autoregistro como MOZO)
**Endpoint:** `POST /api/usuario/register`
```json
{
    "nombre": "Juan",
    "apellido": "Gomez",
    "email": "juanGomez@gmail.com",
    "password": "Password123"
}
```

### Inicio de sesión
**Endpoint:** `POST /api/usuario/login`
```json
{
    "email": "juanGomez@gmail.com",
    "password": "Password123"
}
```

### Registro de personal (Solo ADMIN)
**Endpoint:** `POST /api/usuario/register-admin`
```json
{
    "nombre": "Pedro",
    "apellido": "Chef",
    "email": "pedroChef@gmail.com",
    "password": "Password123",
    "role": "CHEF"
}
```

### Creación de Insumo (Solo ADMIN)
**Endpoint:** `POST /api/insumo`
```json
{
    "nombre": "carne de res",
    "stock_actual": 1000,
    "stock_minimo": 200,
    "unidad": "gr",
    "costo_unitario": 5.5
}
```

### Creación de Producto - Directo (Solo ADMIN)
**Endpoint:** `POST /api/producto`
```json
{
    "nombre": "Coca Cola 500ml",
    "precio_venta": 1500,
    "tipo": "directo",
    "insumo_directo": "ID_DEL_INSUMO" 
}
```

### Creación de Producto - Compuesto (Solo ADMIN)
**Endpoint:** `POST /api/producto`
```json
{
    "nombre": "Hamburguesa Clásica",
    "precio_venta": 8500,
    "tipo": "compuesto",
    "receta": [
        { "insumo": "ID_INSUMO_1", "cantidad": 200 },
        { "insumo": "ID_INSUMO_2", "cantidad": 1 }
    ]
}
```

### Creación de Venta / Comanda (MOZO y ADMIN)
**Endpoint:** `POST /api/venta`
```json
{
    "items": [
        {
            "producto": "ID_DEL_PRODUCTO",
            "cantidad": 2,
            "notas": "Sin cebolla"
        }
    ]
}
```

### Generación de QR Mercado Pago (Público/Autenticado)
**Endpoint:** `POST /api/pago/:ventaId/qr`
*No requiere body. Genera la orden en Mercado Pago y vincula el QR a la venta.*


