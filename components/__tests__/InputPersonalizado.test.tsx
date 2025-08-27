import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import InputPersonalizado from "../InputPersonalizado";

describe("InputPersonalizado", () => {
  it("deve renderizar o label quando fornecido", () => {
    const { getByText } = render(
      <InputPersonalizado value="" onChangeText={() => {}} label="Nome" />
    );
    expect(getByText("Nome")).toBeTruthy();
  });

  it("deve atualizar o valor do input ao digitar", () => {
    let valor = "";
    const { getByPlaceholderText } = render(
      <InputPersonalizado
        value={valor}
        onChangeText={text => (valor = text)}
        placeholder="Digite aqui"
      />
    );

    const input = getByPlaceholderText("Digite aqui");
    fireEvent.changeText(input, "Teste");
    expect(valor).toBe("Teste");
  });

  it("deve mostrar o contador de caracteres quando limite for definido", () => {
    const { getByText } = render(
      <InputPersonalizado
        value="123"
        onChangeText={() => {}}
        limiteCaracteres={5}
      />
    );
    expect(getByText("3/5")).toBeTruthy();
  });

  it("não deve permitir digitar além do limite de caracteres", () => {
    let valor = "";
    const { getByPlaceholderText } = render(
      <InputPersonalizado
        value={valor}
        onChangeText={text => (valor = text)}
        limiteCaracteres={5}
        placeholder="Digite aqui"
      />
    );

    const input = getByPlaceholderText("Digite aqui");
    fireEvent.changeText(input, "123456");
    expect(valor).toBe(""); 
    fireEvent.changeText(input, "12345");
    expect(valor).toBe("12345"); 
  });
});
