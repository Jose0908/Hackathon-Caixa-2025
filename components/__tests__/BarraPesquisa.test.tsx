import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BarraPesquisa from '@/components/BarraPesquisa';

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: () => null,
  Feather: () => null,
  Ionicons: () => null, 
}));


describe('BarraPesquisa', () => {
  it('deve renderizar o placeholder corretamente', () => {
    const { getByPlaceholderText } = render(
      <BarraPesquisa valor="" aoMudarTexto={() => {}} placeholder="Pesquisar..." />
    );
    expect(getByPlaceholderText("Pesquisar...")).toBeTruthy();
  });

  it('deve renderizar o valor corretamente', () => {
    const { getByDisplayValue } = render(
      <BarraPesquisa valor="Teste" aoMudarTexto={() => {}} />
    );
    expect(getByDisplayValue("Teste")).toBeTruthy();
  });

  it('deve chamar aoMudarTexto ao digitar', () => {
    const aoMudarTextoMock = jest.fn();
    const { getByPlaceholderText } = render(
      <BarraPesquisa valor="" aoMudarTexto={aoMudarTextoMock} placeholder="Pesquisar..." />
    );

    const input = getByPlaceholderText("Pesquisar...");
    fireEvent.changeText(input, "Novo texto");

    expect(aoMudarTextoMock).toHaveBeenCalledWith("Novo texto");
    expect(aoMudarTextoMock).toHaveBeenCalledTimes(1);
  });
});
