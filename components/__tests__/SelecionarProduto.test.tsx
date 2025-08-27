import { act, fireEvent, render } from '@testing-library/react-native';
import SelecionarProduto from '@/components/SelecionarProduto';
import React from 'react';
import { Produto } from '@/types/Produto';

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: () => null,
}));


jest.mock('react-native-picker-select', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return (props: any) => {
    const allItems = props.placeholder ? [props.placeholder, ...props.items] : props.items;
    return allItems.map((item: any) => (
      <Text
        key={item.value || 'placeholder'}
        testID={`picker-item-${item.value || ''}`}
        onPress={() => props.onValueChange(item.value)}
      >
        {item.label}
      </Text>
    ));
  };
});


describe('SelecionarProduto', () => {
  const produtosMock: Produto[] = [
    { id: "1", nome: "Produto A", juros: 5, prazo: 12 },
    { id: "2", nome: "Produto B", juros: 6, prazo: 24 },
  ];

  it('deve chamar setProduto ao selecionar um produto', async () => {
    const setProdutoMock = jest.fn();
    const { findByTestId } = render(
      <SelecionarProduto produtos={produtosMock} produto={null} setProduto={setProdutoMock} />
    );

    const pickerItem = await findByTestId("picker-item-2");
    fireEvent.press(pickerItem);

    expect(setProdutoMock).toHaveBeenCalledWith({ id: "2", nome: "Produto B", juros: 6, prazo: 24 });
  });

  it('deve chamar setProduto com null ao selecionar o placeholder', async () => {
    const setProdutoMock = jest.fn();
    const { findByTestId } = render(
      <SelecionarProduto produtos={produtosMock} produto={produtosMock[0]} setProduto={setProdutoMock} />
    );

    const placeholderItem = await findByTestId("picker-item-"); 
    fireEvent.press(placeholderItem);

    expect(setProdutoMock).toHaveBeenCalledWith(null);
  });
});
