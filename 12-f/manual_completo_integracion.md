# Manual Completo: Integración Frontend-Backend y Desarrollo en React

Este documento consolida toda la información necesaria para el desarrollo del Frontend (React + Vite) de nuestro E-commerce y su integración segura con el Backend (Express/Node.js). Sirve como guía de estudio, planificación y referencia de código.

---

## 📑 Índice de Contenidos

1. [Arquitectura del Frontend](#1-arquitectura-del-frontend)
2. [Teoría y Principios de Integración](#2-teoría-y-principios-de-integración)
3. [Responsabilidades Críticas: Frontend vs Backend](#3-responsabilidades-críticas-frontend-vs-backend)
4. [Plan de Desarrollo por Fases](#4-plan-de-desarrollo-por-fases)
5. [Modificaciones Requeridas en el Backend](#5-modificaciones-requeridas-en-el-backend)
6. [Anexo: Referencia de Lógica (Hooks y Páginas)](#6-anexo-referencia-de-lógica-hooks-y-páginas)

---

## 1. Arquitectura del Frontend

El proyecto utiliza tecnologías modernas enfocadas en la eficiencia y la modularidad.

*   **Tecnologías Base:** Vite con React (`react`), enrutamiento con `react-router-dom`.
*   **Gestión de Peticiones:** Fetch API nativo encapsulado en Custom Hooks.
*   **Estructura del Proyecto (`src/`):**
    *   `components/`: Componentes modulares reutilizables (`ProductCard`, `Button`, `Input`, `Loader`).
    *   `layout/`: Contiene `MainLayout.jsx` (Header con Navbar y badge del carrito, Outlet central, Footer).
    *   `pages/`, `hooks/`, `context/`, `services/`, `assets/`.
*   **Enrutado Principal:**
    *   *Estáticas:* `/` (Home), `/productos` (Catálogo general), `/carrito` (Checkout), `/login`, `/registro`.
    *   *Dinámicas:* `/producto/:id` (Detalle del producto), `/categoria/:categoryId` (Filtro por categoría).

---

## 2. Teoría y Principios de Integración

La comunicación entre el Frontend (React) y el Backend (Express) debe seguir reglas estrictas:

*   **Separación de Responsabilidades (SoC):** El Frontend es solo presentación. La lógica de datos va en el Backend.
*   **Manejo de Asincronía:** Se deben gestionar promesas (`async/await`) y reflejar estados visuales de carga (ej. Spinners).
*   **Manejo de Errores Resiliente:** Preparar la interfaz (`try/catch`) para posibles caídas o errores del servidor, mostrando alertas amigables.
*   **Seguridad en el Cliente:** Los tokens (JWT) se manejan vía AuthContext (`src/context/AuthContext.jsx`) y se inyectan en peticiones seguras a través de un servicio baseizado (`src/services/api.js`).
*   **Única Fuente de Verdad:** Diferenciar "Estado Local" (ej. El carrito temporal en `CartContext`) del "Estado de Servidor" (ej. Stock real de productos).

*Temas avanzados para explorar:* Migración a Cookies HttpOnly, React Query para caché, React Hook Form + Zod para validaciones, o WebSockets para stock en tiempo real.

---

## 3. Responsabilidades Críticas: Frontend vs Backend

Existen acciones que **nunca** deben delegarse al Frontend por motivos de seguridad y rendimiento.

| Funcionalidad | ❌ Anti-patrón (Peligroso en Frontend) | ✅ Solución Correcta (Backend como Autoridad) |
| :--- | :--- | :--- |
| **Cálculo de Precios** | Enviar el total de la compra (`totalAmount: 5000`) desde React. | React envía solo qué IDs y qué cantidades se quieren. El Backend busca sus precios reales en BD y calcula el total. |
| **Control de Stock** | Confiar en que si el Frontend no deja sumar artículos es porque hay stock garantizado. | El Backend verifica el stock en tiempo real contra la BD justo antes de cobrar y descuenta (`$inc`). |
| **Búsqueda y Filtros** | Pedir todos los productos (MBs de datos) y filtrarlos con `array.filter()` en React. | React envía query params (`?search=teclado`). El Backend hace la búsqueda en BD y pagina la respuesta. |
| **Persistencia del Carrito** | Guardarlo solo en `sessionStorage` (se pierde entre dispositivos de un mismo usuario). | *Ideal:* Sincronizar el modelo `Cart` en BD cuando el usuario inicia sesión. |

---

## 4. Plan de Desarrollo por Fases

Un enfoque paso a paso para construir la aplicación en React:

### Fase 1: Andamiaje y Enrutamiento estructurado
*   Limpieza del proyecto base de Vite.
*   Creación de layout estático (`MainLayout`) con Navbar y Footer.
*   Configuración de `Routes` apuntando a vistas vacías.

### Fase 2: El Cerebro del Carrito (Estado Global)
*   Implementación de `CartContext.jsx` para guardar `cartItems`.
*   Funciones: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`.
*   Efecto de persistencia guardando la información en `sessionStorage`.

### Fase 3: Conexión mediante Custom Hooks
*   Configuración de URL base interactuando con `services/api.js`.
*   **Hooks de Catálogo:** `useGetProducts()`, `useGetProductById()`, `useGetCategories()`.
*   **Hooks de Autenticación:** `useLogin()` y `useRegister()`.
*   **Hooks de Compra:** `useCreatePurchase()`.

### Fase 4: Interfaces y Catálogo
*   Maquetado de `Home.jsx` (Listando Destacados) y `Products.jsx` (Catálogo con filtros laterales y buscador).
*   Diseño del `ProductDetail.jsx` leyendo el useParams() con selector de cantidad.

### Fase 5: Checkout y Control de Accesos
*   Diseño de `Cart.jsx` con resumen de la pre-compra.
*   Protección de rutas (Redirigir a `/login` si no está autenticado al pagar).
*   Consumo final de `useCreatePurchase()` y limpieza del contexto con `clearCart()`.

---

## 5. Modificaciones Requeridas en el Backend

Para soportar los requerimientos del Frontend, el Backend en la carpeta `12` necesita ajustes:

1.  **Endpoints Adicionales:**
    *   Crear un `GET /api/product/:id` para habilitar la vista de detalle de cada producto.
2.  **Soporte de Búsquedas (Query Params):**
    *   El `GET /api/product` debe ser capaz de procesar filtros (ej. `?category=id` o `?search=texto`).
3.  **Refactor del `purchaseModel.js`**:
    *   Debe soportar el registro de múltiples ítems con su precio congelado:
        ```javascript
        items: [{ productId: ObjectId, quantity: Number, priceAtPurchase: Number }],
        totalAmount: Number
        ```
4.  **Autoridad en `purchaseService.js`:**
    *   Recibir el Array de productos desde React.
    *   **Validar Stock real** vs Cantidad pedida antes de proceder (400 si falla).
    *   **Calcular el precio final** internamente interrogando a la base de datos de productos.
    *   **Descontar stock automáticamente** (`$inc`: `{ quantity: -cantidad }`).

---

## 6. Anexo: Referencia de Lógica (Hooks y Páginas)

Código completo de referencia ("Cheat Sheet") para la resolución de los Custom Hooks y el manejo de estados dentro de las Views principales.

### src/hooks/useGetProducts.js
```javascript
import { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';

export const useGetProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProducts = async (params = initialParams) => {
    try {
      setLoading(true);
      setError(null);
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/product?${queryString}` : '/product';
      
      const data = await fetchApi(endpoint);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts(initialParams);
  }, []); 

  return { products, loading, error, refetch: getProducts };
};
```

### src/hooks/useLogin.js y src/hooks/useRegister.js
<details>
<summary><b>Haz clic para ver la lógica de los Hooks de Autenticación</b></summary>

**useLogin.js**
```javascript
import { useState } from 'react';
import { fetchApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const loginUser = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApi('/user/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      if (data.token) {
        login(data.token);
      }
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  return { loginUser, loading, error };
};
```

**useRegister.js**
```javascript
import { useState } from 'react';
import { fetchApi } from '../services/api';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApi('/user', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  return { registerUser, loading, error };
};
```
</details>

### Páginas: Login.jsx y Register.jsx (Manejo de Formularios y Redirecciones)
<details>
<summary><b>Haz clic para ver la lógica de los Componentes React</b></summary>

**Login.jsx**
```javascript
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, loading, error } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParams = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser({ email, password });
    
    if (result.success) {
      navigate(redirectParams === 'cart' ? '/carrito' : '/');
    }
  };

  return (
    // ... HTML del Formulario ...
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading}>Ingresar</button>
    </form>
    // ...
  );
};
```

**Register.jsx**
```javascript
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

export const Register = () => {
  const [formData, setFormData] = useState({ name: '', lastName: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);
  const { registerUser, loading, error } = useRegister();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(formData);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    // ... HTML del Formulario ...
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} required />
      {/* ... Otros inputs mapeados con name="..." ... */}
      <button type="submit" disabled={loading || success}>Registrarme</button>
    </form>
    // ...
  );
};
```
</details>
