import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, View } from "react-native";
import { cores } from "@/styles";
import { Produto } from "@/types/Produto";

type Props = {
  produtos: Produto[];
  produto: Produto | null;
  setProduto: (p: Produto | null) => void;
};

export default function SelecionarProduto({ produtos, produto, setProduto }: Props) {
  return (
    <View style={styles.pickerContainer}>
      <RNPickerSelect
        placeholder={{ label: "Selecione um produto...", value: "" }}
        value={produto ? String(produto.id) : ""}
        onValueChange={(itemValue) => {
          if (itemValue === "") {
            setProduto(null);
            return;
          }
          const selecionado = produtos.find((p) => String(p.id) === itemValue);
          if (selecionado) setProduto(selecionado);
        }}
        items={produtos.map((p) => ({ label: p.nome, value: String(p.id) }))}
        style={{
          inputIOS: styles.pickerInput,
          inputAndroid: styles.pickerInput,
        }}
        useNativeAndroidPickerStyle={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: cores.greyScale90,
    borderRadius: 16,
    overflow: "hidden",
    margin: 10,
  },
  pickerInput: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "CAIXAStd-Regular",
  },
});
