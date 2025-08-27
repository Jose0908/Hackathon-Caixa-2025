import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdicionarProduto from '../(tabs)/adicionar-produto';
import * as produtoService from '@/services/produtoService';
import { Alert } from 'react-native';
import { router } from 'expo-router';

jest.mock('@/services/produtoService', () => ({
    createProduto: jest.fn(),
}));

jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
}));

jest.spyOn(Alert, 'alert');

describe('AdicionarProduto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('deve renderizar todos os inputs e o botão', () => {
        const { getByPlaceholderText, getByTestId } = render(<AdicionarProduto />);
        expect(getByPlaceholderText('Produto de Investimento X')).toBeTruthy();
        expect(getByPlaceholderText('12.5')).toBeTruthy();
        expect(getByPlaceholderText('3 meses')).toBeTruthy();
        expect(getByTestId('botao-adicionar')).toBeTruthy();
    });

    it('deve atualizar o estado ao digitar nos inputs', () => {
        const { getByPlaceholderText } = render(<AdicionarProduto />);
        const inputNome = getByPlaceholderText('Produto de Investimento X');
        fireEvent.changeText(inputNome, 'Produto Teste');
        expect(inputNome.props.value).toBe('Produto Teste');

        const inputTaxa = getByPlaceholderText('12.5');
        fireEvent.changeText(inputTaxa, '10');
        expect(inputTaxa.props.value).toBe('10');

        const inputPrazo = getByPlaceholderText('3 meses');
        fireEvent.changeText(inputPrazo, '6');
        expect(inputPrazo.props.value).toBe('6');
    });

    it('deve mostrar alerta se algum campo estiver vazio', async () => {
        const { getByTestId } = render(<AdicionarProduto />);
        const botao = getByTestId('botao-adicionar');
        fireEvent.press(botao);
        expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    });

    it('deve chamar createProduto e navegar em sucesso', async () => {
        let resolver: Function = () => { };
        (produtoService.createProduto as jest.Mock).mockImplementation(() => new Promise(r => { resolver = r; }));

        const { getByTestId, getByPlaceholderText } = render(<AdicionarProduto />);

        fireEvent.changeText(getByPlaceholderText('Produto de Investimento X'), 'Produto Teste');
        fireEvent.changeText(getByPlaceholderText('12.5'), '10');
        fireEvent.changeText(getByPlaceholderText('3 meses'), '6');

        const botao = getByTestId('botao-adicionar');

        fireEvent.press(botao);

        await waitFor(() => {
            expect(botao.props.accessibilityState.disabled).toBe(true);
        });

        resolver({});

        await waitFor(() => {
            expect(produtoService.createProduto).toHaveBeenCalledWith({
                nome: 'Produto Teste',
                juros: 10,
                prazo: 6,
            });
            expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Produto adicionado!');
            expect(router.push).toHaveBeenCalledWith('/');
        });
    });

    it('deve mostrar alerta em caso de erro', async () => {
        let rejecter: Function = () => { };
        (produtoService.createProduto as jest.Mock).mockImplementation(
            () => new Promise((_, r) => { rejecter = r; })
        );

        const { getByTestId, getByPlaceholderText } = render(<AdicionarProduto />);

        fireEvent.changeText(getByPlaceholderText('Produto de Investimento X'), 'Produto Teste');
        fireEvent.changeText(getByPlaceholderText('12.5'), '10');
        fireEvent.changeText(getByPlaceholderText('3 meses'), '6');

        const botao = getByTestId('botao-adicionar');

        fireEvent.press(botao);

        await waitFor(() => {
            expect(botao.props.accessibilityState.disabled).toBe(true);
        });

        rejecter(new Error('Falha'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Erro',
                'Não foi possível adicionar o produto'
            );
            expect(botao.props.accessibilityState.disabled).toBe(false);
        });
    });
});
