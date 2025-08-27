import ExibirInformacoes from '@/components/ExibirInformacoes';
import GraficoAmortizacao from '@/components/GraficoAmortizacao';
import InputMonetario from '@/components/InputMonetario';
import InputPersonalizado from '@/components/InputPersonalizado';
import SelecionarProduto from '@/components/SelecionarProduto';
import { getProdutos } from '@/services/produtoService'; 
import { simularProduto } from '@/services/simulacaoService';
import { global } from '@/styles';
import { Produto } from '@/types/Produto';
import { ResultadoSimulacao } from '@/types/ResultadoSimulacao';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native';


export default function ProdutoDetalhe() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produto, setProduto] = useState<Produto | null>(null);
  const [valorSimulacao, setValorSimulacao] = useState<number | null>(null);
  const [tempoSimulacao, setTempoSimulacao] = useState<number | null>(null);
  const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setResultado(null);
    setProduto(null);

    getProdutos().then((lista) => {
      setProdutos(lista);

      if (id) {
        const encontrado = lista.find((p) => String(p.id) === id);
        if (encontrado) setProduto(encontrado);
        else setProduto(null);
      }
      else setProduto(null);
    });
  }, [id]);

  const fazerSimulacao = async () => {
    if (!produto || !valorSimulacao || !tempoSimulacao) {
      Alert.alert('Erro', 'Selecione um produto, valor e tempo da simulação');
      return;
    }

    if (tempoSimulacao > produto.prazo) {
      Alert.alert('Erro', 'O prazo da simulação não pode ser maior que o prazo máximo do produto');
      return;
    }

    setCarregando(true);

    try {
      const res = await simularProduto({
        produtoId: produto.id,
        valor: valorSimulacao,
        meses: Number(tempoSimulacao),
        porcentagemAnual: produto.juros,
      });

      setResultado(res);
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível realizar a simulação');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={global.container}>
      <Text style={global.titulo}>Realizar Simulação</Text>

      <SelecionarProduto produtos={produtos} produto={produto} setProduto={setProduto} />

      {produto && <ExibirInformacoes
        labels={["Taxa de Juros", "Prazo Máximo"]}
        valores={[
          `${produto.juros}% a.a.`,
          `${produto.prazo} ${produto.prazo === 1 ? "mês" : "meses"}`
        ]}
      />}

      <View style={global.infoLinha}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <InputMonetario
            label="Valor do Empréstimo"
            value={valorSimulacao}
            onChangeValue={setValorSimulacao}
            placeholder="R$ 0,00"
            limiteCaracteres={10}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 8 }}>
          <InputPersonalizado
            value={tempoSimulacao !== null ? String(tempoSimulacao) : ""}
            onChangeText={(text) => {
              const num = text === "" ? null : Number(text);
              setTempoSimulacao(num);
            }}
            placeholder="5 meses"
            keyboardType="numeric"
            label="Duração da Simulação"
            inteiro
          />
        </View>
      </View>

      <TouchableOpacity style={global.botao} onPress={fazerSimulacao} disabled={carregando} testID='botao-simular'>
        <Text style={global.textoBotao}>
          {carregando ? 'Simulando...' : 'Simular'}
        </Text>
      </TouchableOpacity>

      {resultado && (
        <ExibirInformacoes
          labels={["Total a pagar", "Taxa de Juros mensal", "Parcela Mensal"]}
          valores={[
            `R$ ${resultado.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            `${resultado.txJurosMensalEfetiva.toFixed(2)}%`,
            `R$ ${resultado.valorParcelaMensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
          ]}
        />
      )}
      {resultado && <GraficoAmortizacao resultado={resultado} />}
    </ScrollView>
  );
}