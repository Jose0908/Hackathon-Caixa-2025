import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cores } from '@/styles';

interface BarraPesquisaProps {
  placeholder?: string;
  valor: string;
  aoMudarTexto: (texto: string) => void;
}

const BarraPesquisa: React.FC<BarraPesquisaProps> = ({ placeholder, valor, aoMudarTexto }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={24} color="#404B52" style={styles.icone} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={valor}
        onChangeText={aoMudarTexto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.greyScale30,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
  },
  icone: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

export default BarraPesquisa;
