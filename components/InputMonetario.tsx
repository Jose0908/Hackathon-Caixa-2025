import { cores } from "@/styles";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CurrencyInput from "react-native-currency-input";

type InputMonetarioProps = {
  value: number | null;
  onChangeValue: (value: number | null) => void;
  placeholder?: string;
  label?: string;
  limiteCaracteres?: number; 
  prefix?: string;
};

export default function InputMonetario({
  value,
  onChangeValue,
  placeholder,
  label,
  prefix = "R$ ",
}: InputMonetarioProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <CurrencyInput
          style={styles.input}
          value={value}
          onChangeValue={onChangeValue}
          prefix={prefix}
          delimiter="."
          separator=","
          precision={2}
          placeholder={placeholder}
          testID="input-valor"
        />
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
});
