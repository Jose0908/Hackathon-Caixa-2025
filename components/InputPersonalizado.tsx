import { cores } from "@/styles";
import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

type InputPersonalizadoProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  limiteCaracteres?: number;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  inteiro?: boolean;
};

export default function InputPersonalizado({
  value,
  onChangeText,
  placeholder,
  label,
  limiteCaracteres,
  keyboardType = "default",
  inteiro
}: InputPersonalizadoProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9eb2b8" 
          keyboardType={keyboardType}
          value={value}
          onChangeText={text => {
            let textoFiltrado = text;
            if (inteiro) {
              textoFiltrado = textoFiltrado.replace(/[^0-9]/g, "");
            }
            if (!limiteCaracteres || textoFiltrado.length <= limiteCaracteres) {
              onChangeText(textoFiltrado);
            }
          }}
        />
        {limiteCaracteres && (
          <Text style={styles.contador}>
            {value.length}/{limiteCaracteres}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: cores.greyScale90,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: cores.greyScale90,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "CAIXAStd-Regular",
  },
  contador: {
    fontSize: 12,
    color: cores.greyScale70,
    marginLeft: 8,
  },
});
