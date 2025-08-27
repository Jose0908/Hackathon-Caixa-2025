import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Animated, Pressable, Keyboard } from 'react-native';
import BarraPesquisa from '@/components/BarraPesquisa';
import { Produto } from '../../types/Produto';
import { useRouter } from 'expo-router';
import { global, cores } from '@/styles';
import { getProdutos } from '@/services/produtoService';
import { useFocusEffect } from '@react-navigation/native';

const Produtos = () => {
    const router = useRouter();

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [busca, setBusca] = useState('');
    const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);

    // chama API toda vez que a aba/tela ganhar foco
    useFocusEffect(
        useCallback(() => {
            let ativo = true;
            getProdutos().then((res) => {
                if (ativo) setProdutos(res);
            });
            return () => {
                ativo = false;
            };
        }, [])
    );

    React.useEffect(() => {
        if (busca === '') {
            setProdutosFiltrados(produtos);
        } else {
            const filtrados = produtos.filter((p) =>
                p.nome.toLowerCase().includes(busca.toLowerCase())
            );
            setProdutosFiltrados(filtrados);
        }
    }, [busca, produtos]);

    const animacaoRefs = useRef<{ [key: string]: Animated.Value }>({});

    const getAnimacao = (id: string) => {
        if (!animacaoRefs.current[id]) {
            animacaoRefs.current[id] = new Animated.Value(1);
        }
        return animacaoRefs.current[id];
    };

    return (
        <View style={global.container}>
            <Text style={[global.titulo, { fontFamily: 'CAIXAStd-Bold' }]}>
                Produtos de empréstimo
            </Text>

            <FlatList
                data={produtosFiltrados}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View style={styles.barraPesquisa}>
                        <BarraPesquisa
                            placeholder="Buscar produtos..."
                            valor={busca}
                            aoMudarTexto={setBusca}
                        />
                    </View>
                }
                renderItem={({ item }) => {
                    const animacao = getAnimacao(item.id);

                    const handlePressIn = () => {
                        Animated.spring(animacao, {
                            toValue: 0.95,
                            useNativeDriver: true,
                        }).start();
                    };

                    const handlePressOut = () => {
                        Animated.spring(animacao, {
                            toValue: 1,
                            friction: 3,
                            tension: 40,
                            useNativeDriver: true,
                        }).start();
                    };

                    const handlePress = () => {
                        Keyboard.dismiss();
                        router.push({
                            pathname: '/simularProdutos/[id]',
                            params: { id: item.id },
                        });
                    };

                    return (
                        <View style={styles.cardWrapper}>
                            <Pressable
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={handlePress}
                            >
                                <Animated.View
                                    style={[styles.card, { transform: [{ scale: animacao }] }]}
                                >
                                    <Text style={[global.texto, { fontWeight: '600' }]}>
                                        {item.nome}
                                    </Text>
                                    <Text style={[global.texto, { color: cores.turquesa }]}>
                                        {item.juros}% a.a.
                                    </Text>
                                    <Text style={[global.texto, { color: cores.greyScale70 }]}>
                                        {item.prazo} {item.prazo === 1 ? 'mês' : 'meses'}
                                    </Text>
                                </Animated.View>
                            </Pressable>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        shadowColor: cores.preto,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        borderRadius: 12,
        marginBottom: 16,
        marginHorizontal: 8,
    },
    card: {
        backgroundColor: cores.fundo,
        borderRadius: 12,
        padding: 16,
    },
    barraPesquisa: {
        marginHorizontal: 8,
        marginBottom: 12,
    },
});

export default Produtos;
