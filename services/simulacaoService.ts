import { ResultadoSimulacao } from '@/types/ResultadoSimulacao';

const calcularPorcentagemMensal = (porcentagemAnual: number, meses: number): number => {
  porcentagemAnual = Number(String(porcentagemAnual).replace(',', '.'));
  const taxaMensal = Math.pow(1 + porcentagemAnual / 100, 1 / meses) - 1;
  return taxaMensal * 100;
};

const calculaValorTotal = (
  valor: number,
  meses: number,
  taxaJurosMensal: number
): number => {
  const valorTotal = valor * (1 + taxaJurosMensal / 100) ** meses;
  return valorTotal;
};

const calcularPMT = (valor: number, meses: number, taxaMensal: number): number => {
  const i = taxaMensal / 100; 
  if (i === 0) return valor / meses; 
  return (valor * i) / (1 - Math.pow(1 + i, -meses));
};

// Mock de simulação
export const simularProduto = async ({
  produtoId,
  valor,
  meses,
  porcentagemAnual,
}: {
  produtoId: string;
  valor: number;
  meses: number;
  porcentagemAnual: number;
}): Promise<ResultadoSimulacao> => {
  return new Promise((resolve) => {
    const txJurosMensalEfetiva = calcularPorcentagemMensal(porcentagemAnual, meses);
    const valorTotal = calculaValorTotal(valor, meses, txJurosMensalEfetiva);
    const valorParcela = calcularPMT(valor, meses, txJurosMensalEfetiva);

    let saldo = valor;
    const memoria = Array.from({ length: meses }, (_, i) => {
      const juros = saldo * (txJurosMensalEfetiva / 100);
      const amortizacao = valorParcela - juros;
      saldo -= amortizacao;

      return {
        mes: i + 1,
        parcela: Number(valorParcela.toFixed(2)),
        juros: Number(juros.toFixed(2)),
        amortizacao: Number(amortizacao.toFixed(2)),
        saldo: Number(saldo.toFixed(2)),
      };
    });
    setTimeout(() => {
      const resultado: ResultadoSimulacao = {
        txJurosMensalEfetiva: txJurosMensalEfetiva,
        valorTotal: valorTotal,
        valorParcelaMensal: (valorTotal / meses),
        memoria: memoria,
      };
      resolve(resultado);
    }, 500); 
  });
};


