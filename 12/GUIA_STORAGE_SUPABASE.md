# Guía Maestra: Integración de Supabase Storage y Multer (Subida de Imágenes)

Esta guía detalla los pasos para integrar la subida de imágenes en tu API utilizando **Multer** para el manejo de archivos en Node.js y **Supabase Storage** para el almacenamiento en la nube.

## 🏛️ 1. Introducción: ¿Qué es Supabase?

**Supabase** es una plataforma Backend-as-a-Service (BaaS) de código abierto diseñada para escalar aplicaciones de forma rápida. En esta clase la usaremos como nuestro **proveedor de almacenamiento en la nube (Cloud Storage)**.

### ✅ Beneficios clave:
*   **Velocidad de carga (CDN)**: Las imágenes se sirven desde servidores cercanos al usuario, lo que mejora la experiencia.
*   **Escalabilidad**: Podrás subir miles de imágenes sin llenar el disco duro de tu servidor de Node.js.
*   **Seguridad**: Permite crear carpetas públicas o privadas con reglas de acceso detalladas.
*   **Sencillez**: Su SDK para JavaScript es extremadamente fácil de integrar en comparación con otras alternativas.

### 🎯 ¿Qué haremos hoy?
En esta clase aprenderemos a:
1.  Configurar un **Bucket** público en Supabase.
2.  Usar **Multer** para recibir archivos en el backend (en memoria).
3.  Crear una **función de utilidad** que suba la imagen a Supabase y nos devuelva una URL.
4.  Guardar esa **URL** en nuestra base de datos **MongoDB**.
5.  Enviar datos y archivos desde **React** usando `FormData`.

---

## 2. Configuración de Supabase (Dashboard)

1.  **Crear Proyecto**: Regístrate en [Supabase](https://supabase.com/) y crea un "New Project".
2.  **Organización**: Ponle nombre, selecciona tipo **Personal**, plan **Free** y región **Americas**.
3.  **Seguridad**: Asegúrate de tener activado **Enable Data API**.
4.  **Ubicar Credenciales**:
    *   Ve a **Project Settings** -> **Integrations** -> **Data API**.
    *   Copia la **API URL** (será tu `SUPABASE_URL`).
    *   Ve a **Project Settings** -> **API keys**.
    *   **IMPORTANTE**: Copia la **service_role key** (clave secreta) para el backend.
5.  **Crear los Buckets**:
    *   Ve al menú **Storage** lateral.
    *   Crea un nuevo **Bucket** llamado `imagenes` (para productos).
    *   Crea otro nuevo **Bucket** llamado `profile` (para usuarios).
    *   **¡CLAVE!**: Activa la opción **Public bucket** en ambos para que las imágenes se vean en el navegador directamente.

---

## 3. Configuración del Servidor (Backend)

### Instalación de Dependencias
```bash
npm install @supabase/supabase-js multer jsonwebtoken
```

### Variables de Entorno (`.env`)
```env
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=tu_service_role_key_secreta
```

---

## 4. Lógica de Almacenamiento

### Conexión (`src/config/supabase.js`)
```javascript
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

### El "Encargado" de Subir (`src/utils/supabaseStorage.js`)
Esta función toma el archivo de Multer y lo manda a la nube.
```javascript
import { supabase } from "../config/supabase.js";

export const uploadImageToSupabase = async (file, bucketName) => {
    try {
        // 1. Nombre único para evitar colisiones
        const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

        // 2. Subida del Buffer (memoria) a Supabase
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false 
            });

        if (error) throw error;

        // 3. Obtener URL pública (requiere Bucket Público)
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error("Error en Supabase:", error);
        throw new Error("Error al subir la imagen");
    }
};
```

### Middleware de Multer (`src/middlewares/multerMiddleware.js`)
```javascript
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
```

---

## 5. El "Otro Lado" (Frontend): ¿Cómo enviamos la imagen?

Para enviar una imagen desde React al backend, no podemos enviar un objeto JSON tradicional. Debemos usar la API nativa de **`FormData`**.

### El Input de Archivo
En tu formulario, necesitas un input especial. No uses `value`, usa `onChange`.
```jsx
<input 
  type="file" 
  accept="image/*" 
  onChange={(e) => setImage(e.target.files[0])} 
/>
```

### Preparando el Envío (El Hook)
Debes "empaquetar" todos tus datos (textos y archivos) en el contenedor `FormData`.

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  // 1. Creamos el contenedor
  const data = new FormData();
  
  // 2. Agregamos los campos de texto
  data.append('name', 'Producto de Ejemplo');
  data.append('price', 1500);
  
  // 3. ¡Agregamos el archivo! 
  // El nombre 'image' debe coincidir con upload.single('image') del backend
  if (imageFile) {
    data.append('image', imageFile);
  }

  // 4. Enviamos el 'data' directamente al fetch (sin JSON.stringify)
  onSubmit(data);
};
```

### El Gran Secreto: ¡Sin Content-Type!
Cuando usas `FormData`, **NUNCA** debes ponerle el header `'Content-Type': 'application/json'` a tu petición `fetch`.

*   **¿Por qué?**: El navegador necesita generar un código de seguridad único (*boundary*) para separar los textos de la imagen binaria. Si tú fuerzas el Content-Type a JSON, el backend no podrá interpretar la imagen.

---

## 6. Definición de los Modelos (MongoDB)

Para que nuestra base de datos pueda almacenar la dirección de la imagen que nos da Supabase, debemos preparar los esquemas de Mongoose.

### Modelo de Producto (`src/models/productModel.js`)
Añadimos el campo `image` de tipo String.
```javascript
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    // Campo para la URL de la imagen
    image: { 
        type: String, 
        default: "https://via.placeholder.com/300" // Opcional: imagen por defecto
    },
    // ... otros campos
});
```

### Modelo de Usuario (`src/models/userModel.js`)
Añadimos el campo `avatar` de tipo String.
```javascript
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Campo para la foto de perfil
    avatar: { 
        type: String, 
        default: "https://p7.itc.cn/images01/20201103/6fb4e9c71c6d482688b5ef078f44ff53.jpeg" 
    },
    // ... otros campos
});
```

---

## 7. Integración en Rutas y Controladores

### Las Rutas (`src/routes/productRoute.js`)
```javascript
import upload from '../middlewares/multerMiddleware.js';
router.post("/", upload.single('image'), createProduct);
```

### El Controlador Robusto (`src/controllers/productController.js`)
```javascript
export const createProduct = async (req, res) => {
    try {
        let productData = { ...(req.body || {}) };

        if (req.file) {
            // Helper ubicado en: src/utils/supabaseStorage.js
            const imageUrl = await uploadImageToSupabase(req.file, "imagenes");
            productData.image = imageUrl;
        }

        const savedProduct = await createProductService(productData);
        res.status(201).json(savedProduct);
    } catch (error) {
        handleError(error, res);
    }
};
```

---

## 8. Caso Especial: Foto de Perfil (Avatar) 👤

Subir una foto de perfil es similar a un producto, pero tiene dos diferencias clave:
1.  **Seguridad**: Debemos validar que el usuario que intenta subir la foto sea el dueño de la cuenta.
2.  **Token**: Tras actualizar la foto, debemos devolver un **nuevo Token** al frontend, para que la imagen se actualice en el Navbar sin cerrar sesión.

### Las Rutas (`src/routes/userRoute.js`)
Usamos `PATCH` y el campo `'avatar'`:
```javascript
userRoute.patch("/:id", verifyTokenMiddleware, upload.single('avatar'), updateUser);
```

### El Controlador de Usuario (`src/controllers/userController.js`)
```javascript
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Validar que el usuario logueado (req.user) sea el mismo que el del ID
        if(String(req.user.userId) !== String(id)){
            return res.status(403).json({message: "No autorizado"});
        }

        let userData = { ...(req.body || {}) };

        // 2. Si hay archivo, subirlo a Supabase al bucket 'profile'
        if (req.file) {
            const avatarUrl = await uploadImageToSupabase(req.file, "profile");
            userData.avatar = avatarUrl;
        }

        const updatedUser = await updateUserService(id, userData);
        
        // 3. ¡IMPORTANTE! Generar nuevo token con el nuevo avatar
        const newToken = generateToken({
            userId: updatedUser._id,
            userEmail: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar // <--- Foto nueva aquí
        });

        res.status(201).json({ user: updatedUser, token: newToken });

    } catch (error) {
        handleError(error, res);
    }
};
```

---

## 9. Resolución de Problemas (Troubleshooting)

1.  **req.body vacío**: Si `req.body` llega vacío, revisa que no estés enviando el header `application/json` desde el frontend.
2.  **req.file is undefined**: Revisa que el nombre en `data.append('image', ...)` sea igual al de `upload.single('image')`.
3.  **Error de comparación de IDs**: Siempre usa `String(id1) === String(id2)` al validar dueños de perfil.
4.  **JWT desactualizado**: Asegúrate de guardar el nuevo token que devuelve el backend tras actualizar el perfil para que el avatar cambie en el header.

---
> [!IMPORTANT]
> **CONSEJO PARA VERCEL**: Si usas Multer, pon siempre los campos de texto del formulario **ANTES** que el archivo en tu código de Frontend (`data.append`). Esto asegura una lectura correcta de los datos.
