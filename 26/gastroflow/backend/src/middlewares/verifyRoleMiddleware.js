// Verifica que el usuario autenticado tenga al menos uno de los roles permitidos.
// Uso: verifyRoleMiddleware(['ADMIN', 'CHEF'])
// Si el array está vacío, cualquier rol autenticado puede acceder.

export const verifyRoleMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        const { role } = req.user

        if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
            return res.status(403).json({
                message: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`,
            })
        }

        next()
    }
}
