import { useState } from 'react'
import { fetchApi } from '../services/api'

export const useDeleteUser = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const deleteUser = async (id) => {
        try {
            setLoading(true)
           await fetchApi(`/user/${id}`, {method: "DELETE"})
           return {success: true}
        } catch (error) {
            setError(error.message)
            return {success: false, error: error.message}
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, deleteUser }
}

