import axios, { AxiosError } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { AvailableProduct } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>(
    "available-products",
    async () => {
      return await axios
        .get<{ data: AvailableProduct[] }>(`${API_PATHS.bff}/product`)
        .then((response) => response.data.data);
    }
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export const fetchAvailableProductById = async (id: string) => {
  const res = await axios.get<{ data: AvailableProduct }>(
    `${API_PATHS.bff}/product/${id}`
  );
  return res.data.data;
};

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct | undefined, AxiosError>(
    ["product", { id }],
    async () => (id ? await fetchAvailableProductById(id) : undefined),
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct(id?: string) {
  return useMutation((values: AvailableProduct) => {
    if(!id) {
      return axios.post<AvailableProduct>(
          `${API_PATHS.bff}/product`,
          values,
          {
            headers: {
              "Content-type": "aplication/json",
            },
          }
      );
    }
    return axios.put<AvailableProduct>(
      `${API_PATHS.bff}/product/${id}`,
      values,
      {
        headers: {
          "Content-type": "aplication/json",
        },
      }
    );
  });
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>

    axios.delete(`${API_PATHS.bff}/product/${id}`)
  );
}
