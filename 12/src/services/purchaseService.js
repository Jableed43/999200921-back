import {addDoc, collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
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
// export const getAllPurchaseService = async () => {
//     const querySnapshot = await getDocs(collection(dbFirebase, "purchases"))
//     const purchases = []

//     console.log({querySnapshot})

//     querySnapshot.forEach((doc) => {
//         purchases.push({
//             id: doc.id,
//             ...doc.data()
//         })
//     })

//     return purchases
// }
export const getAllPurchaseService = async () => {
    const purchasesRef = collection(dbFirebase, "purchases")
    const q = query(purchasesRef, orderBy("purchaseDate", "desc"))

    const querySnapshot = await getDocs(q)
    const purchases = []

    querySnapshot.forEach((doc) => {
        const data = doc.data()

        purchases.push({
            id: doc.id,
            ...data,
            purchaseDate: data.purchaseDate?.toDate ? data.purchaseDate.toDate() : data.purchaseDate
        })
    })

    return purchases
}

// Get By purchase id
export const getByIdPurchaseService = async (purchaseId) => {
    const docRef = doc(dbFirebase, "purchases", purchaseId)

    const docSnap = await getDoc(docRef)

    if(!docSnap.exists()){
        const error = new Error("Purchase not found")
        error.statusCode = 404
        throw error
    }

    return {
        ...docSnap.data(),
        id: docSnap.id,
        purchaseDate: docSnap.data().purchaseDate?.toDate ? docSnap.data().purchaseDate.toDate() : docSnap.data().purchaseDate
    }
}

// Get by user id

export const getByUserIdPurchaseService = async (userId) => {
    const q = query(
        collection(dbFirebase, "purchases"),
        where("userId", "==", userId),
        orderBy("purchaseDate", "desc")
    )

    const querySnapshot = await getDocs(q)

    const purchases = querySnapshot.docs.map(doc => (
        {
        ...doc.data(),
        id: doc.id,
        purchaseDate: doc.data().purchaseDate?.toDate ? doc.data().purchaseDate.toDate() : doc.data().purchaseDate
    }))

    return purchases

}