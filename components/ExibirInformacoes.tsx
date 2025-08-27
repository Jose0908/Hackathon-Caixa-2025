import React from 'react';
import { View, Text } from 'react-native';
import { global } from '@/styles';

const ExibirInformacoes = ({ labels, valores }: { labels: string[], valores: (string | number)[] }) => {
    return (
        <View style={global.infoContainer}>
            {labels.map((label, index) => (
                <React.Fragment key={index}>
                    <View style={global.infoLinha}>
                        <Text style={[global.texto, global.infoTitulo]}>{label}:</Text>
                        <Text style={[global.texto, global.infoValor]}>{valores[index]}</Text>
                    </View>
                    {/* Mostra divisor só se não for o último item */}
                    {index < labels.length - 1 && <View style={global.divisor} testID="divisor" />}
                </React.Fragment>
            ))}
        </View>
    );
};

export default ExibirInformacoes;