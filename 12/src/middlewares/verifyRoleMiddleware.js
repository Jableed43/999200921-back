export const verifyRoleMiddleware = (rolesPermitidos) => {
    return (req, res, next) => {
        try {
            if(!req.user){
                console.log(req, req.user)
                return res.status(401).json({message: "No se encontro informacion del usuario en la solicitud"})
            }

            const userRole = req.user.role

            if(!rolesPermitidos.includes(userRole)){
                return res.status(403).json({message: "Acceso denegado, permisos insuficientes"})
            }

            next()
        } catch (error) {
            return res.status(500).json({ message: "Error al verificar los roles", error: error.message })
        }
    }
}