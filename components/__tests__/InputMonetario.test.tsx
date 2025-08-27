import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import InputMonetario from "@/components/InputMonetario";

describe("InputMonetario", () => {
  it("deve renderizar o label quando fornecido", () => {
    const { getByText } = render(
      <InputMonetario value={null} onChangeValue={() => {}} label="Valor" />
    );
    expect(getByText("Valor")).toBeTruthy();
  });

  it("deve atualizar o valor ao digitar", () => {
    let valor: number | null = null;
    const { getByPlaceholderText } = render(
      <InputMonetario
        value={valor}
        onChangeValue={v => (valor = v)}
        placeholder="Digite um valor"
      />
    );

    const input = getByPlaceholderText("Digite um valor");
    fireEvent.changeText(input, "123,45");
    expect(valor).toBeCloseTo(123.45);
  });

  it("deve mostrar o prefixo corretamente", () => {
    const { getByDisplayValue } = render(
      <InputMonetario value={100} onChangeValue={() => {}} />
    );

    expect(getByDisplayValue("R$ 100,00")).toBeTruthy();
  });
});
