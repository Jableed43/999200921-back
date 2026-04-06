import { useState } from "react";
import { fetchApi } from "../services/api";

export const useUpdateProductAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProductAdmin = async (id, productData) => {
    setLoading(true);
    setError(null);

    try {
      const body = productData instanceof FormData ? productData : JSON.stringify(productData);

      const data = await fetchApi(`/product/${id}`, {
        method: "PATCH",
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
  return { updateProductAdmin, error, loading };
};
