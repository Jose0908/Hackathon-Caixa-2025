import { simularProduto } from "../simulacaoService";
import { ResultadoSimulacao } from "@/types/ResultadoSimulacao";

describe("Simulação de Produto", () => {
  it("deve calcular corretamente a simulação", async () => {
    const resultado: ResultadoSimulacao = await simularProduto({
      produtoId: "123",
      valor: 1000,
      meses: 12,
      porcentagemAnual: 12,
    });

    expect(resultado.txJurosMensalEfetiva).toBeGreaterThan(0);
    expect(resultado.valorTotal).toBeGreaterThan(1000);
    expect(resultado.memoria).toHaveLength(12);

    const ultimoMes = resultado.memoria[resultado.memoria.length - 1];
    expect(ultimoMes.saldo).toBeCloseTo(0, 1);
  });

  it("deve lidar com taxa zero corretamente", async () => {
    const resultado: ResultadoSimulacao = await simularProduto({
      produtoId: "zero",
      valor: 1200,
      meses: 12,
      porcentagemAnual: 0,
    });

    expect(resultado.txJurosMensalEfetiva).toBe(0);
    expect(resultado.valorTotal).toBe(1200);
    expect(resultado.memoria.every((m) => (m.juros + m.amortizacao) === 100)).toBe(true);

    const ultimoMes = resultado.memoria[resultado.memoria.length - 1];
    expect(ultimoMes.saldo).toBeCloseTo(0, 1);
  });
});
