import { useState } from "react";
import { fetchApi } from "../services/api";

export const useDeleteProductAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteProductAdmin = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi(`/product/${id}`, {
        method: "DELETE",
      });
        return { success: true, data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  return { deleteProductAdmin, error, loading };
};
