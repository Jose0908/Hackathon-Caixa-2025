import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ProdutoDetalhe from '@/app/(tabs)/simularProdutos/[id]';
import { Alert, Keyboard } from 'react-native';
import { getProdutos } from '@/services/produtoService';
import { simularProduto } from '@/services/simulacaoService';
import { useSearchParams } from 'expo-router/build/hooks';

jest.mock('@/components/SelecionarProduto', () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock('@/components/ExibirInformacoes', () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock('@/components/InputMonetario', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(TextInput, {
        testID: 'input-valor',
        value: props.value !== null ? String(props.value) : '',
        placeholder: props.placeholder,
        onChangeText: (text: string) => props.onChangeValue(Number(text)),
      }),
  };
});

jest.mock('@/components/InputPersonalizado', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => (
      <TextInput
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
      />
    ),
  };
});

jest.mock('@/components/GraficoAmortizacao', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/services/produtoService', () => ({
  getProdutos: jest.fn(),
}));

jest.mock('@/services/simulacaoService', () => ({
  simularProduto: jest.fn(),
}));

jest.mock('expo-router/build/hooks', () => ({
  useSearchParams: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe('ProdutoDetalhe', () => {
  const produtoMock = { id: '1', juros: 10, prazo: 12, nome: 'Produto X' };
  const resultadoMock = { valorTotal: 1000, txJurosMensalEfetiva: 0.5, valorParcelaMensal: 85 };

  beforeEach(() => {
    jest.clearAllMocks();
    (getProdutos as jest.Mock).mockResolvedValue([produtoMock]);
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '1' });
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  it('deve renderizar o título e inputs', async () => {
    const { getByText } = render(<ProdutoDetalhe />);
    await waitFor(() => expect(getByText('Realizar Simulação')).toBeTruthy());
  });

  it('mostra alerta se algum campo estiver vazio', async () => {
    const { getByText } = render(<ProdutoDetalhe />);
    const botao = getByText('Simular');
    await act(async () => {
      fireEvent.press(botao);
    });
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Selecione um produto, valor e tempo da simulação');
  });

  it('mostra alerta em caso de erro na simulação', async () => {
    (simularProduto as jest.Mock).mockRejectedValue(new Error('Falha'));
    const { getByText, getByPlaceholderText } = render(<ProdutoDetalhe />);
    await act(async () => {
      fireEvent.press(getByText('Simular'));
    });
    fireEvent.changeText(getByPlaceholderText("R$ 0,00"), "1000");
    fireEvent.changeText(getByPlaceholderText('5 meses'), '6');
    const botao = getByText('Simular');
    await act(async () => {
      fireEvent.press(botao);
    });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possível realizar a simulação');
    });
  });

  it("mostra erro se prazo informado for maior que o máximo", async () => {
    const { getByText, getByPlaceholderText } = render(<ProdutoDetalhe />);
    await waitFor(() => {
      expect(getProdutos).toHaveBeenCalled();
    });
    fireEvent.changeText(getByPlaceholderText("R$ 0,00"), "1000");
    fireEvent.changeText(getByPlaceholderText("5 meses"), "24");
    fireEvent.press(getByText("Simular"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erro",
        "O prazo da simulação não pode ser maior que o prazo máximo do produto"
      );
    });
  });

  it("seta produto como null quando id não existe na lista", async () => {
    (getProdutos as jest.Mock).mockResolvedValue([produtoMock]);
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => "999" });
    render(<ProdutoDetalhe />);
    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  it("seta produto como null quando id não é passado", async () => {
    (getProdutos as jest.Mock).mockResolvedValue([produtoMock]);
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });
    render(<ProdutoDetalhe />);
    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  it("fecha o teclado ao definir resultado da simulação", async () => {
    (getProdutos as jest.Mock).mockResolvedValue([produtoMock]);
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => String(produtoMock.id) });
    (simularProduto as jest.Mock).mockResolvedValue(resultadoMock);
    const dismissSpy = jest.spyOn(Keyboard, "dismiss");
    const { getByPlaceholderText, getByText } = render(<ProdutoDetalhe />);
    await waitFor(() => {
      expect(getByText('Realizar Simulação')).toBeTruthy();
    });
    fireEvent.changeText(getByPlaceholderText("R$ 0,00"), "1000");
    fireEvent.changeText(getByPlaceholderText("5 meses"), "12");
    await act(async () => {
      fireEvent.press(getByText("Simular"));
    });
    expect(dismissSpy).toHaveBeenCalled();
  });
});