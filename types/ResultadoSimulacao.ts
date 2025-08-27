export type ResultadoSimulacao = {
  txJurosMensalEfetiva: number;
  valorTotal: number;
  valorParcelaMensal: number;
  memoria: {
    mes: number;
    juros: number;
    amortizacao: number;
    saldo: number;
  }[];
};