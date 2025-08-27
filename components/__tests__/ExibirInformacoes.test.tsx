import { render } from '@testing-library/react-native';
import React from 'react';
import ExibirInformacoes from '../ExibirInformacoes';

describe('ExibirInformacoes', () => {
  it('deve renderizar labels e valores corretamente', () => {
    const labels = ['Nome', 'Idade', 'Cidade'];
    const valores = ['José', 30, 'São Paulo'];

    const { getByText, queryAllByTestId } = render(
      <ExibirInformacoes labels={labels} valores={valores} />
    );

    labels.forEach(label => {
      expect(getByText(`${label}:`)).toBeTruthy();
    });
    valores.forEach(valor => {
      expect(getByText(String(valor))).toBeTruthy();
    });

    const divisores = queryAllByTestId('divisor');
    expect(divisores.length).toBe(labels.length - 1);
  });
});
