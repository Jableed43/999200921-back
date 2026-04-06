import { useState } from "react";
import { fetchApi } from "../services/api";

export const useCreateProductAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  const createProductAdmin = async (productData) => {
    setLoading(true);
    setError(null);

    try {
      const body = productData instanceof FormData ? productData : JSON.stringify(productData);
      
      const data = await fetchApi("/product", {
        method: "POST",
        body: body,
      });
        return { success: true, data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  return { createProductAdmin, error, loading };
};
