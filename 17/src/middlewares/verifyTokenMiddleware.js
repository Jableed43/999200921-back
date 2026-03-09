import { verifyToken } from "../utils/verifyToken.js"

//verifica la validez del token que recibe desde el cliente
export const verifyTokenMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        console.log({authHeader})

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(400).json({ message: "Access token is invalid" })
        }

        // "Bearer jdlkajsdkladjsakdslk44556"
        const token = authHeader.split(" ")[1]

        const decoded = verifyToken(token)

        console.log({decoded})

        req.user = decoded

        next()

    } catch (error) {
        return res.status(400).json({message: "Invalid access token", error})
    }
}