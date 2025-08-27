import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { cores } from '@/styles';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: cores.tabAtiva,
                tabBarInactiveTintColor: cores.greyScale110,
                tabBarLabelStyle: {
                    fontFamily: 'CAIXAStd-Bold',
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Listar produtos',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="list"
                            size={size}
                            color={color}
                        />
                    ),
                }
                }
            />

            <Tabs.Screen
                name="adicionar-produto"
                options={{
                    title: 'Adicionar produto',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="add-circle-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="simularProdutos/[id]"
                options={{
                    title: 'Simular Produto',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="bar-chart"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>

    );
};

export default TabsLayout;
