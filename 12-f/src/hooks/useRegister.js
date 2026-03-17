import { useState } from "react";
import { fetchApi } from "../services/api";

export const useRegister = () => {
  // Estados 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
     const data = await fetchApi("/user", {
        method: "POST",
        body: JSON.stringify(userData)
      })

      return { success: true, data }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  };
  return {register, loading, error }
};
