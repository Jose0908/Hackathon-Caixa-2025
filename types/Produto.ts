export type Produto = {
  id: string;
  nome: string;
  juros: number;
  prazo: number;
};

export type ProdutoInput = Omit<Produto, 'id'>;
