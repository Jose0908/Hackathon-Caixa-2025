import axios from "axios";
import { Produto, ProdutoInput } from "../types/Produto";

const api = axios.create({
  baseURL: "https://68ad0757b996fea1c08b64c5.mockapi.io/mock"
});

export const getProduto = async (id: string): Promise<Produto | null> => {
  try {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const getProdutos = async (): Promise<Produto[]> => {
  try {
    const response = await api.get<Produto[]>("/produtos");
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar produtos:", error.message || error);
    return [];
  }
};

export const createProduto = async (produto: ProdutoInput): Promise<Produto> => {
  const response = await api.post<Produto>("/produtos", produto);
  return response.data;
};

export const deleteProduto = async (id: string): Promise<void> => {
  try {
    await api.delete(`/produtos/${id}`);
  } catch (error: any) {
    console.error("Erro ao deletar produto:", error.message || error);
  }
};
