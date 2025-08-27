import React from 'react';
import { render } from '@testing-library/react-native';
import TabsLayout from '../(tabs)/_layout';

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        MaterialIcons: (props: any) => <View testID={`icon-${props.name}`} />
    };
});

jest.mock('expo-router', () => {
    const React = require('react');
    const { View } = require('react-native');

    const MockTabsScreen = ({ children, name, options }: any) => (
        <View testID={`screen-${name}`}>
            {children}
            {options?.title && <View testID={`title-${options.title}`} />}
            {options?.tabBarIcon && options.tabBarIcon({ color: 'black', size: 24 })}
        </View>
    );
    const MockTabs = ({ children }: any) => <>{children}</>;

    return { Tabs: Object.assign(MockTabs, { Screen: MockTabsScreen }) };
});

describe('TabsLayout', () => {
    it('renderiza todos os tabs e títulos', () => {
        const { getByTestId } = render(<TabsLayout />);

        expect(getByTestId('screen-index')).toBeTruthy();
        expect(getByTestId('screen-adicionar-produto')).toBeTruthy();
        expect(getByTestId('screen-simularProdutos/[id]')).toBeTruthy();

        expect(getByTestId('title-Listar produtos')).toBeTruthy();
        expect(getByTestId('title-Adicionar produto')).toBeTruthy();
        expect(getByTestId('title-Simular Produto')).toBeTruthy();
    });

    it('renderiza os ícones de cada tab', () => {
        const { getByTestId } = render(<TabsLayout />);

        expect(getByTestId('icon-list')).toBeTruthy();
        expect(getByTestId('icon-add-circle-outline')).toBeTruthy();
        expect(getByTestId('icon-bar-chart')).toBeTruthy();
    });
});
