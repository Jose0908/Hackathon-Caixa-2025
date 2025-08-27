import axios from "axios";
import * as produtoService from "../produtoService";
import { Produto, ProdutoInput } from "../../types/Produto";

jest.mock("axios"); 

describe("produtoService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar um produto pelo ID", async () => {
    const produtoMock: Produto = { id: "1", nome: "Empréstimo Teste", juros: 10, prazo: 12 };
    (axios.get as jest.Mock).mockResolvedValue({ data: produtoMock });

    const produto = await produtoService.getProduto("1");

    expect(axios.get).toHaveBeenCalledWith("/produtos/1");
    expect(produto).toEqual(produtoMock);
  });

  it("deve retornar null se não encontrar o produto", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("Erro"));

    const produto = await produtoService.getProduto("999");

    expect(produto).toBeNull();
  });

  it("deve retornar a lista de produtos", async () => {
    const produtosMock: Produto[] = [
      { id: "1", nome: "Empréstimo A", juros: 10, prazo: 12 },
      { id: "2", nome: "Empréstimo B", juros: 12, prazo: 24 },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: produtosMock });

    const produtos = await produtoService.getProdutos();

    expect(axios.get).toHaveBeenCalledWith("/produtos");
    expect(produtos).toEqual(produtosMock);
  });

  it("deve retornar array vazio em caso de erro ao buscar produtos", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
    (axios.get as jest.Mock).mockRejectedValue(new Error("Erro"));

    const produtos = await produtoService.getProdutos();

    expect(produtos).toEqual([]);
    expect(axios.get).toHaveBeenCalledWith("/produtos");

    consoleSpy.mockRestore();
  });

  it("deve criar um produto", async () => {
    const novoProduto: Produto = { id: "3", nome: "Empréstimo Novo", juros: 11, prazo: 18 };
    const input: ProdutoInput = { nome: "Empréstimo Novo", juros: 11, prazo: 18 };
    (axios.post as jest.Mock).mockResolvedValue({ data: novoProduto });

    const produto = await produtoService.createProduto(input);

    expect(axios.post).toHaveBeenCalledWith("/produtos", input);
    expect(produto).toEqual(novoProduto);
  });

  it("deve deletar um produto sem erros", async () => {
    (axios.delete as jest.Mock).mockResolvedValue({});

    await produtoService.deleteProduto("1");

    expect(axios.delete).toHaveBeenCalledWith("/produtos/1");
  });

  it("deve logar erro ao deletar produto", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
    (axios.delete as jest.Mock).mockRejectedValue(new Error("Erro ao deletar"));

    await produtoService.deleteProduto("999");

    expect(consoleSpy).toHaveBeenCalledWith("Erro ao deletar produto:", "Erro ao deletar");
    consoleSpy.mockRestore();
  });
});
