import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ResultadoSimulacao } from "@/types/ResultadoSimulacao";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { cores, global } from '@/styles';

type Props = {
  resultado: ResultadoSimulacao;
};

const linhaInformacao = (
  titulo: string,
  valor: string,
  divisor: boolean = true
) => (
  <View style={{ marginBottom: 4 }}>
    <View style={global.infoLinha}>
      <Text style={global.infoTitulo}>{titulo}</Text>
      <Text style={global.infoValor}>{valor}</Text>
    </View>
    {divisor && <View style={global.divisor} />}
  </View>
);

const GraficoAmortizacao: React.FC<Props> = ({ resultado }) => {
  const [selecionado, setSelecionado] = useState<number | null>(null);

  if (!resultado || resultado.memoria.length === 0) return null;

  const dadosSaldo = resultado.memoria.map((item, index) => ({
    value: item.saldo,
    frontColor: cores.azulTitulo,
    onPress: () => setSelecionado(index),
  })) as barDataItem[];

  // gerar meses a partir do mês atual
  const hoje = new Date();
  const meses = resultado.memoria.map((_, i) => {
    const data = new Date(hoje);
    data.setMonth(hoje.getMonth() + i);

    const mesAbreviado = data.toLocaleDateString("pt-BR", { month: "short" });
    const mesCompleto = data.toLocaleDateString("pt-BR", { month: "long" });
    const anoAbreviado = data.getFullYear().toString().slice(-2);
    const anoCompleto = data.getFullYear();

    return { abreviado: `${mesAbreviado} ${anoAbreviado}`, completo: { mes: mesCompleto, ano: anoCompleto } };
  });

  const maxValor = Math.max(
    ...dadosSaldo.map((d) => d.value).filter((v): v is number => typeof v === "number")
  );

  return (
    <View style={[styles.container, { marginTop: 20 }]}>
      <Text style={styles.titulo}>Evolução do Saldo</Text>

      <BarChart
        barWidth={40}
        noOfSections={4}
        data={dadosSaldo}
        xAxisLabelTexts={meses.map(m => m.abreviado)}
        xAxisLabelsHeight={20}
        xAxisLabelTextStyle={styles.xAxisLabel}
        yAxisLabelTexts={undefined} 
        yAxisTextStyle={styles.yAxisLabel}
        maxValue={maxValor}         
        showFractionalValues={false}
        hideRules
      />

      {selecionado !== null && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.detalhesTitulo}>Em {meses[selecionado].completo.mes} de {meses[selecionado].completo.ano}</Text>
          <View style={global.infoContainer}>
            {linhaInformacao("Saldo restante:", `R$ ${resultado.memoria[selecionado].saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, true)}
            {linhaInformacao("Parcela:", `R$ ${(resultado.memoria[selecionado].amortizacao + resultado.memoria[selecionado].juros).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, true)}
            {linhaInformacao("Juros:", `R$ ${resultado.memoria[selecionado].juros.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, true)}
            {linhaInformacao("Amortização:", `R$ ${resultado.memoria[selecionado].amortizacao.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, true)}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
  },
  titulo: {
    fontFamily: "CAIXAStd-Regular",
    fontSize: 16,
    fontWeight: "600",
    color: cores.greyScale130,
    textAlign: "center",
    marginBottom: 12,
  },
  xAxisLabel: {
    fontFamily: "CAIXAStd-Regular",
    fontSize: 12,
    color: cores.greyScale90,
    textAlign: "center",
  },
  yAxisLabel: {
    fontSize: 12,
    color: cores.greyScale90,
  },
  detalhesTitulo: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: cores.greyScale70,
  },
});

export default GraficoAmortizacao;