import { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import { useCallback } from 'react';

export const useGetCategories = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const getCategoriesAdmin = useCallback( async () => {
        setLoading(true)
        try {
            const data = await fetchApi("/category")
            setCategories(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }, [] )

    useEffect(() => {
        getCategoriesAdmin()
    }, [getCategoriesAdmin])

    return { categories, loading, error, refetch: getCategoriesAdmin } 
  
  }