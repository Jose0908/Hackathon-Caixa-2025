import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import GraficoAmortizacao from "../GraficoAmortizacao";
import { ResultadoSimulacao } from "@/types/ResultadoSimulacao";


jest.mock("react-native-gifted-charts", () => {
  const React = require('react');
  const { View, TouchableOpacity } = require('react-native');

  return {
    BarChart: ({ data }: any) => (
      <View>
        {data.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            testID={`barra-${index}`}
            onPress={item.onPress} 
          >
          </TouchableOpacity>
        ))}
      </View>
    ),
    barDataItem: () => null,
  };
});

const mockResultado: ResultadoSimulacao = {
  txJurosMensalEfetiva: 2.5,
  valorParcelaMensal: 500,
  valorTotal: 6000,
  memoria: [
    { saldo: 6000, mes: 1, amortizacao: 400, juros: 100 },
    { saldo: 5500, mes: 2, amortizacao: 420, juros: 80 },
  ],
};

describe("GraficoAmortizacao", () => {
  it("renderiza corretamente o título e gráfico", () => {
    const { getByText, queryByText } = render(<GraficoAmortizacao resultado={mockResultado} />);

    expect(getByText("Evolução do Saldo")).toBeTruthy();
    expect(queryByText(/R\$ 6.000,00/)).toBeNull(); 
  });
  it("mostra detalhes ao clicar em uma barra", () => {
    const { getByText, getByTestId } = render(
      <GraficoAmortizacao resultado={mockResultado} />
    );

    fireEvent.press(getByTestId("barra-0"));

    expect(getByText(/Saldo restante:/)).toBeTruthy();
    expect(getByText("R$ 6.000,00")).toBeTruthy();
  });

  it("não renderiza nada se o resultado for vazio", () => {
    const { toJSON } = render(<GraficoAmortizacao resultado={{ ...mockResultado, memoria: [] }} />);
    expect(toJSON()).toBeNull();
  });
});
