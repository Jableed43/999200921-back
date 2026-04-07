import multer from 'multer'

// Configurar el almacenamiento en memoria para evitar archivos temporales en el servidor
const storage = multer.memoryStorage()

//filtro para aceptar solo imagenes
const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        // cb(error, success)
        cb(null, true)
    } else {
        cb(new Error('Solo se permiten imagenes'), false)
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}, // limite de 5mb, si pesa mas de 5mb lo rechaza
    fileFilter: fileFilter
})

export default upload;