// Contiene la configuracion global de la documentacion
import swaggerJSDoc from "swagger-jsdoc"
import {PORT} from "./config.js"

/**
 * Configuración general de Swagger para nuestra API
 * Se define la informacion del proyecto y los servidores
 */

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentacion de API de ecommerce",
            version: "1.0.0",
            description: "API robusta para la gestión integral de un sistema de E-commerce: Productos, usuarios y categorias",
            contact: {
                name: "Soporte tecnico",
                email: "soporte@ecommerce.com"
            },
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Servidor de desarrollo local"
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
            schemas: {
                User: {
                    type: "object",
                    required: ["name", "lastName", "email", "password"],
                    properties: {
                        name: { type: "string", example: "Juan" },
                        lastName: { type: "string", example: "Perez" },
                        email: { type: "string", format: "email", example: "juan@perez.com" },
                        password: { type: "string", format: "password", example: "Pass123" },
                        role: { type: "string", enum: ["ADMIN", "SELLER", "CUSTOMER"], example: "CUSTOMER" },
                        avatar: { type: "string", example: "https://example.com/avatar.png" }
                    }
                },
                Product: {
                    type: "object",
                    required: ["name", "price"],
                    properties: {
                        name: { type: "string", example: "Smartphone Pro" },
                        price: { type: "number", example: 899.99 },
                        profitRate: { type: "number", example: 1.21 },
                        description: { type: "string", example: "Última generación de smartphones" },
                        quantity: { type: "number", example: 50 },
                        category: { type: "string", example: "65f1a9..." },
                        status: { type: "string", enum: ["AVAILABLE", "NOT_AVAILABLE", "DISCONTINUED"], example: "AVAILABLE" },
                        image: { type: "string", example: "https://example.com/product.png" }
                    }
                },
                Category: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: { type: "string", example: "Electrónica" }
                    }
                },
                Purchase: {
                    type: "object",
                    required: ["userId", "items", "totalAmount"],
                    properties: {
                        userId: { type: "string", example: "65f1a9..." },
                        items: { 
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    productId: { type: "string", example: "65f1a9..." },
                                    name: { type: "string", example: "Smartphone Pro" },
                                    quantity: { type: "number", example: 2 },
                                    price: { type: "number", example: 1088.98 }
                                }
                            }
                        },
                        totalAmount: { type: "number", example: 2177.96 },
                        status: { type: "string", example: "COMPLETED" },
                        purchaseDate: { type: "string", format: "date-time" }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
    },
    // Rutas donde swagger buscará los comentarios @swagger para generar la documentacion
    apis: ["./src/routes/*.js"]
}

// Generacion de especificaciones tecnicas en formato json
const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec