import { useState } from 'react'
import { fetchApi } from '../services/api'
import { useEffect } from 'react'

export const useGetUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const getUsers = async () => {
        try {
            setLoading(true)
           const users = await fetchApi("/user")
            setUsers(users)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    return { users, loading, error, refetch: getUsers }
}

