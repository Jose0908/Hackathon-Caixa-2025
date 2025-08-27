import React from 'react';
import { render } from '@testing-library/react-native';
import { useFonts } from 'expo-font';
import RootLayout from '../_layout';

jest.mock('expo-font', () => ({
  useFonts: jest.fn(),
}));

jest.mock('expo-router', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const Stack = ({ children }: any) => (
    <View testID="stack-container">{children}</View>
  );
  
  Stack.Screen = (({ children }: any) => (
    <View testID="stack-screen">{children}</View>
  )) as Function;
  (Stack.Screen as any).displayName = "Stack.Screen";
  
  return {
    Stack,
  };
});

jest.mock('../assets/fonts/CAIXAStd-Regular.ttf', () => ({}), { virtual: true });
jest.mock('../assets/fonts/CAIXAStd-Bold.ttf', () => ({}), { virtual: true });
jest.mock('../assets/fonts/CAIXAStd-BoldItalic.ttf', () => ({}), { virtual: true });

describe('RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar null enquanto as fontes não carregam', () => {
    (useFonts as jest.Mock).mockReturnValue([false]);
    const { queryByTestId } = render(<RootLayout />);
    expect(queryByTestId('stack-container')).toBeNull();
  });

  it('deve renderizar o Stack quando as fontes carregarem', () => {
    (useFonts as jest.Mock).mockReturnValue([true]);
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('stack-container')).toBeTruthy();
  });

  it('deve carregar as fontes corretas', () => {
    const mockUseFonts = useFonts as jest.Mock;
    mockUseFonts.mockReturnValue([true]);
    render(<RootLayout />);
    expect(mockUseFonts).toHaveBeenCalledWith({
      'CAIXAStd-Regular': 1,
      'CAIXAStd-Bold': 1,
      'CAIXAStd-BoldItalic': 1,
    });
  });
});
