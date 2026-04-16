# 🐳 Fundamentos de Docker: Guía Completa

Docker ha revolucionado la forma en que desarrollamos, desplegamos y escalamos aplicaciones. Esta guía explica por qué es la herramienta estándar en la industria.

---

## 🚀 ¿Qué es Docker?

Docker es una plataforma de **contenedorización** que permite empaquetar una aplicación con todas sus dependencias (librerías, configuraciones, entorno) en una unidad estandarizada llamada **contenedor**.

### Los 3 Pilares Fundamentales:

#### 1. Imagen (Image) 🖼️
- **Concepto:** Es una "receta" o una captura de solo lectura que contiene todo lo necesario para ejecutar una aplicación.
- **Analogía:** Es como una clase en programación orientada a objetos o un instalador de software que nunca cambia.
- **Características:** Son inmutables y se construyen en capas.

#### 2. Contenedor (Container) 📦
- **Concepto:** Es una instancia ejecutable de una imagen. Es el proceso en ejecución.
- **Analogía:** Si la imagen es la clase, el contenedor es el **objeto** instanciado.
- **Características:** Está aislado de otros contenedores y del sistema host, pero comparte el núcleo (kernel) del Sistema Operativo.

#### 3. Volumen (Volume) 💾
- **Concepto:** Es el mecanismo de Docker para persistir datos.
- **Analogía:** Es como un disco duro externo que conectas al contenedor.
- **¿Por qué son necesarios?:** Por defecto, si un contenedor se borra, sus datos internos desaparecen. Los volúmenes permiten que los datos (como bases de datos) sobrevivan al ciclo de vida del contenedor.

---

## ✅ Pros y Beneficios de usar Docker

| Beneficio | Descripción |
| :--- | :--- |
| **Portabilidad** | "Funciona en mi máquina y funciona en la tuya". Puedes mover un contenedor entre Windows, Linux o Mac sin cambios. |
| **Aislamiento** | Las aplicaciones no interfieren entre sí. Puedes tener dos versiones de Node.js corriendo al mismo tiempo sin conflictos. |
| **Eficiencia** | A diferencia de las Máquinas Virtuales (VM), Docker no emula hardware. Es mucho más ligero y arranca en milisegundos. |
| **Consistencia** | El entorno de desarrollo es idéntico al de producción, eliminando los errores de "configuración de servidor". |
| **Ecosistema** | Acceso a **Docker Hub**, donde hay miles de imágenes listas para usar (Redis, Postgres, Nginx, etc.). |

---

## 🛠️ Conceptos Principales del Ecosistema

- **Dockerfile:** Un archivo de texto con las instrucciones paso a paso para crear una imagen.
- **Docker Hub:** El registro de imágenes más grande del mundo (similar a GitHub, pero para imágenes).
- **Docker Compose:** Una herramienta para definir y correr aplicaciones de múltiples contenedores (ej: API + Base de Datos) usando un solo archivo YAML.
- **Docker Engine:** El motor que corre en tu sistema y gestiona los contenedores.

---

## 🎯 Casos de Uso Comunes

1. **Microservicios:** Dividir una aplicación gigante en pequeñas piezas que se comunican entre sí, cada una en su propio contenedor.
2. **CI/CD (Integración y Despliegue Continuo):** Automatizar pruebas en entornos limpios que se destruyen después de cada ejecución.
3. **Entornos de Desarrollo Locales:** Levantar una base de datos compleja (como MongoDB o SQL Server) con un solo comando sin instalar nada directamente en tu PC.
4. **Escalabilidad:** Levantar 10 instancias de tu API en segundos para soportar una alta demanda de tráfico.

---

> [!TIP]
> **Diferencia clave con Máquinas Virtuales:**
> Mientras que una VM incluye un Sistema Operativo completo (GBs de tamaño), Docker comparte el kernel del host y solo empaqueta la aplicación y sus dependencias (MBs de tamaño). ¡Mucho más rápido y eficiente!

---

## 📝 Paso a Paso: Cómo Dockerizar un Proyecto Node.js

Para contenedorizar una aplicación y que sea fácil de ejecutar en cualquier entorno, el proceso general se divide en 3 pasos principales:

### Paso 1: Crear el `Dockerfile`
Este archivo es tu receta. Se crea en la raíz de tu proyecto y le dice a Docker cómo construir la **Imagen** de tu app.

```dockerfile
# 1. Definir la imagen base (ej: node, python, ubuntu)
FROM node:18-alpine

# 2. Definir el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar solo los archivos de dependencias primero (cache optimization)
COPY package*.json ./

# 4. Instalar las dependencias (dentro del contenedor)
# Nota: ¡No necesitas Node instalado en tu PC, sucede todo aquí!
RUN npm install

# 5. Copiar el resto del código de la aplicación
COPY . .

# 6. Exponer el puerto que usa tu API
EXPOSE 3000

# 7. Comando para iniciar la aplicación
CMD ["npm", "start"]
```

### Paso 2: Crear el archivo `.dockerignore`
Al igual que `.gitignore`, este archivo evita que archivos pesados o innecesarios se copien dentro de la imagen de Docker, manteniéndola liviana.

```text
node_modules
npm-debug.log
.env
.git
```

### Paso 3: Orquestar con `docker-compose.yml` (Opcional pero recomendado)
Si tu aplicación necesita moverse junto a una Base de Datos (ej: MongoDB) u otros servicios, Docker Compose facilita levantar todo con un solo comando.

```yaml
version: '3.8'

services:
  # Servicio de tu API
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://database:27017/mi_db
    depends_on:
      - database

  # Servicio de la Base de Datos
  database:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

# Definición del volúmen para persistir datos
volumes:
  mongo_data:
```

### Paso 4: Construir y Levantar! 🚀
Ya teniendo todo configurado, abres tu terminal en la raíz del proyecto y ejecutas:

* Si usas solo el `Dockerfile` (sin compose):
  ```bash
  # Construir imagen
  docker build -t mi-app-node .
  
  # Levantar contenedor
  docker run -p 3000:3000 mi-app-node
  ```

* Si usas `docker-compose.yml` (La forma más fácil):
  ```bash
  # Levantar todos los servicios en segundo plano
  docker-compose up -d
  ```

¡Y listo! Tu aplicación se estará ejecutando en contenedores aislados.
