import { useState, useCallback } from 'react'
import api from '../services/api'

export const useDashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchDashboard = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get('/dashboard')
            setData(res.data)
        } catch (err) {
            console.error('Error fetching dashboard', err)
        } finally {
            setLoading(false)
        }
    }, [])

    return { data, loading, fetchDashboard }
}
