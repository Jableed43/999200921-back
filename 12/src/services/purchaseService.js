import {addDoc, collection} from 'firebase/firestore'
import {dbFirebase} from '../config/firebase.js'

// id: string,
// userId: string,
// items: [
// {	productId: string,
// 	quantity: number,
// 	finalPrice: number
//  }
// ],
// totalAmount: number (precio total de la compra),
// purchaseDate: Date,
// status: string (enum: COMPLETED, CANCELED, PENDING)

// Create
export const createPurchaseService = async (purchaseData) => {
    // Validaciones
    // Validar que nos hayan llegado productos, que sea un array y no este vacio
    if(!purchaseData.items || !Array.isArray(purchaseData.items) || purchaseData.items.length === 0){
        const error = new Error("Items array is required and must not be empty")
        error.statusCode = 400
        throw error
    }

    const purchaseWithTimeStamp = {
        ...purchaseData,
        purchaseDate: new Date(),
        status: "COMPLETED"
    }

   const docRef = await addDoc(collection(dbFirebase, "purchases"), purchaseWithTimeStamp)

   console.log({docRef})

   return {
    id: docRef.id,
    ...purchaseWithTimeStamp
   }
}

// Get all

// Get By purchase id

// Get by user id