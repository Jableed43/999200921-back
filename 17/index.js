import express from 'express'
import { PORT } from './src/config/config.js'
import { connectDB } from './src/config/db.js'
import productRouter from "./src/routes/productRoutes.js"
import categoryRouter from './src/routes/categoryRoutes.js'
import userRouter from './src/routes/userRoutes.js'
import session from 'express-session'
import {fileURLToPath} from 'url'
import path, {dirname} from 'path'
import methodOverride from 'method-override'
import {engine} from "express-handlebars"
import { homeView } from './src/controllers/generalController.js'

// Permite acceder al nombre y ubicacion de los archivos estaticos
const __filename = fileURLToPath(import.meta.url)
// Directorio del archivo estatico
const __dirname = dirname(__filename)

const app = express()

// Permite leer los .css, iconos, imagenes, archivos de SEO
app.use(express.static(path.join(__dirname, "src", "public")))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "secret",
    resave: false, // Evita que la session se vuelva a guardar si no hay datos
    saveUninitialized: false, // Evita que la sesion se guarde si no esta inicializada
}))
// sirve para modificar los metodos nativos de los forms (GET y POST)
app.use(methodOverride("_method"))

// Configurar handlebars, definimos handlebars como nuestro template engine
//allowProtoPropertiesByDefault Permite que Handlebars acceda a propiedades del objeto que no son "propias" (es decir, que vienen de su clase o prototipo). Si usas un ORM como Mongoose o Sequelize, esto es casi obligatorio para que los datos aparezcan en la vista.
// allowProtoMethodsByDefault: true: Permite que la plantilla ejecute métodos que existan en el prototipo del objeto (por ejemplo, un método .calcularDescuento() definido en tu clase Producto).
app.engine("handlebars", engine({
    runTimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))

// Mas configuracion
// app.set( que seteas, valor)
app.set("view engine", "handlebars")
// Carpeta donde guardamos la vistas
app.set("views", "./src/views")

// sistema para leer errores o mensajes
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.message = req.session.message || null
    res.locals.success = req.session.success || false
    delete req.session.message
    delete req.session.success
    next()
})

connectDB()

app.use("/product", productRouter)
app.use("/category", categoryRouter)
app.use("/user", userRouter)
// ruta en caso de 404

// ruta inicial
app.get("/", homeView)

// Esta ruta de error ponerla al final
app.use((req, res) => {
    res.status(404).render("404", {
        title: "Pagina no encontrada",
        message2: "La pagina que buscas no existe"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})