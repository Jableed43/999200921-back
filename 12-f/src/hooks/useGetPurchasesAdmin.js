import { useCallback } from "react"
import { useState } from "react"
import { fetchApi } from "../services/api"
import { useEffect } from "react"

export const useGetPurchasesAdmin = () => {
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const getPurchasesAdmin = useCallback( async () => {
        setLoading(true)
        try {
            const data = await fetchApi("/purchase")
            setPurchases(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }, [] )

    useEffect(() => {
        getPurchasesAdmin()
    }, [getPurchasesAdmin])

    return { purchases, loading, error, refetch: getPurchasesAdmin }
}