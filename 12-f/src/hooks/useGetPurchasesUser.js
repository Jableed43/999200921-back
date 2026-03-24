import { useCallback } from "react"
import { useState } from "react"
import { fetchApi } from "../services/api"
import { useEffect } from "react"

export const useGetPurchasesUser = (userId) => {
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const getPurchasesUser = useCallback( async () => {
        if(!userId){
            return null
        }
        setLoading(true)
        try {
            const data = await fetchApi(`/purchase/user/${userId}`)
            setPurchases(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }, [userId] )

    useEffect(() => {
        if(userId){
            getPurchasesUser()
        }
    }, [getPurchasesUser, userId])

    return { purchases, loading, error, refetch: getPurchasesUser }
}