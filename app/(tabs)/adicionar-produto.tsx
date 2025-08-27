import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import { global } from '@/styles';
import { createProduto } from '@/services/produtoService';
import InputPersonalizado from '@/components/InputPersonalizado';

type FormFields = {
  nomeProduto: string;
  taxaJuros: string;
  prazo: string;
  [key: string]: string;
};

export default function AdicionarProduto() {
  const [form, setForm] = useState<FormFields>({
    nomeProduto: '',
    taxaJuros: '',
    prazo: '',
  });

  const [carregando, setCarregando] = useState(false);

  const handleChange = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const handleAdicionar = async () => {
    if (!form.nomeProduto || !form.taxaJuros || !form.prazo) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    // Normaliza vírgula para ponto
    const taxaNormalizada = form.taxaJuros.replace(',', '.');
    const taxa = Number(taxaNormalizada);

    if (isNaN(taxa) || taxa <= 0) {
      Alert.alert('Erro', 'A taxa de juros deve ser um número maior que 0');
      return;
    }

    const prazo = Number(form.prazo);

    if (isNaN(prazo) || prazo <= 0) {
      Alert.alert('Erro', 'O prazo deve ser um número maior que 0');
      return;
    }

    setCarregando(true);

    try {
      await createProduto({
        nome: form.nomeProduto,
        juros: taxa,
        prazo: prazo,
      });
      Alert.alert('Sucesso', 'Produto adicionado!');
      router.push('/');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o produto');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[global.container, styles.container]}>
        <View style={styles.formContainer}>
          <Text style={[global.titulo, styles.titulo]}>Adicionar Produto</Text>
          <InputPersonalizado
            label='Nome do Produto'
            value={form.nomeProduto}
            onChangeText={(v) => handleChange('nomeProduto', v)}
            placeholder="Produto de Investimento X"
            limiteCaracteres={50}
          />
          <InputPersonalizado
            label='Taxa de Juros (% a.a.)'
            value={form.taxaJuros}
            onChangeText={(v) => handleChange('taxaJuros', v)}
            placeholder="12.5"
            keyboardType="numeric"
          />
          <InputPersonalizado
            label='Prazo máximo (meses)'
            value={form.prazo}
            onChangeText={(v) => handleChange('prazo', v)}
            placeholder="3 meses"
            keyboardType="numeric"
            inteiro
          />
        </View>

        <TouchableOpacity style={global.botao} onPress={handleAdicionar} disabled={carregando} testID="botao-adicionar">
          <Text style={global.textoBotao}>{carregando ? 'Adicionando...' : 'Adicionar um Produto'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  titulo: {
    marginBottom: 26,
  },
  formContainer: {
    flex: 1,
    gap: 12,
  }
});
