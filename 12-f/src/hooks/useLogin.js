import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchApi } from "../services/api";

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const {login} = useAuth()

  const loginUser = async (credentials) => {
    try {
      setLoading(true)
      setError(null)

     const data = await fetchApi("/user/login",{
        method: "POST",
        body: JSON.stringify(credentials)
      })

      if(data.token){
        login(data.token)
      }

      return {success: true, data}
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  };

  return { loginUser, loading, error };
};
