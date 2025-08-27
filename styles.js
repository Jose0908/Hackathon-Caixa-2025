import { StyleSheet } from "react-native";

export const cores = {
    azulTitulo: "#00437A",
    fundo: "#ffffff",
    turquesa: "#359485",
    botao: "#d87b00",
    tabAtiva: "#a65e00",
    greyScale130: "#22292e",
    greyScale110: "#404b52",
    greyScale90: "#64747a",
    greyScale70: "#9eb2b8",
    greyScale50: "#d0e0e3",
    greyScale30: "#ebf1f2",
    greyScale10: "#f7fafa",
    texto: "#404b52",
    preto: "#000000",
};

export const tamanhoFontes = {
    titulo: 24,
    texto: 16,
};

export const global = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
        paddingVertical: 30,
        paddingHorizontal: 20,
        marginTop: 40,
    },

    containerCentralizado: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },

    label: {
        fontSize: 16,
        marginBottom: 8
    },

    texto: {
        fontSize: tamanhoFontes.texto,
        color: cores.texto,
        marginTop: 4,
        fontFamily: 'CAIXAStd-Regular',
    },

    titulo: {
        fontSize: tamanhoFontes.titulo,
        color: cores.azulTitulo,
        textAlign: "center",
        marginVertical: 16,
        fontFamily: 'CAIXAStd-Bold'
    },

    input: {
        borderWidth: 1,
        borderColor: cores.greyScale90,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },

    botao: {
        backgroundColor: cores.botao,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 4,
    },

    textoBotao: {
        color: cores.fundo,
        fontSize: 16,
        fontFamily: 'CAIXAStd-Bold'
    },

    infoContainer: {
        marginVertical: 10,
    },
    infoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        alignItems: 'center',
    },
    infoTitulo: {
        fontFamily: 'CAIXAStd-Bold',
        fontSize: 16,
    },
    infoValor: {
        color: cores.greyScale90,
        fontSize: 14,
    },

    divisor: {
        borderBottomWidth: 0.5,
        borderBottomColor: cores.greyScale50,
    },

     inputComum: {
        flex: 1,
        borderWidth: 1,
        borderColor: cores.greyScale90, 
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: tamanhoFontes.texto,
        fontFamily: 'CAIXAStd-Regular',
        color: cores.texto,
        marginBottom: 20,
    },

    labelInput: {
        fontSize: 16,
        fontWeight: '600',
        color: cores.texto,
        marginBottom: 6,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
