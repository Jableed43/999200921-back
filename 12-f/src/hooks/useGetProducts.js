export const useGetProducts = (initialParams = {}) => {
  const getProducts = async (params = initialParams) => {};

  return { products: [], loading: true, error: null, refetch: getProducts };
};
