import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import services from "../../services/services";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    lineHeight: 1.4,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1 solid #000",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    maxHeight: "8cm",
    overflow: "hidden",
  },
  blocoEsquerdo: {
    width: "30%",
    paddingRight: 10,
    borderRight: "1 dashed #ccc",
  },
  blocoDireito: {
    width: "68%",
    paddingLeft: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#333",
  },
  fieldText: {
    fontSize: 9,
    padding: 2,
    borderBottom: "0.5 solid #ddd",
    marginBottom: 3,
  },
  titleCode: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  box: {
    width: "48%",
  },
  valorParcela: {
    width: "100%",
  },
  barcodeImage: {
    width: "100%",
    height: 50,
    marginTop: 5,
  },
});

const CarnePagamento = ({ dados }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {dados.parcelas.map((parcela, index) => (
        <View style={styles.container} key={index}>
          {/* BLOCO ESQUERDO */}
          <View style={styles.blocoEsquerdo}>
            <Text style={styles.sectionTitle}>Documento</Text>
            <Text style={styles.fieldText}>0001 - 1</Text>

            <Text style={styles.sectionTitle}>Pagador</Text>
            <Text style={styles.fieldText}>{dados.cliente.nome}</Text>

            <Text style={styles.sectionTitle}>Beneficiário</Text>
            <Text style={styles.fieldText}>{dados.emitente}</Text>

            <View style={styles.row}>
              <View style={styles.box}>
                <Text style={styles.sectionTitle}>Vencimento</Text>
                <Text style={styles.fieldText}>{services.formatarDataNascimento(parcela.data_vencimento)}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.sectionTitle}>Valor</Text>
                <Text style={styles.fieldText}>R$ {parcela.valor_parcela}</Text>
              </View>
            </View>

            <Text style={styles.fieldText}>(-) Desconto/Abatimento</Text>
            <Text style={styles.fieldText}>(-) Outras Deduções</Text>
            <Text style={styles.fieldText}>(+) Mora/Juros/Multa</Text>
            <Text style={styles.fieldText}>(+) Outros Acréscimos</Text>
            <Text style={styles.fieldText}>(=) Valor Cobrado</Text>
          </View>

          {/* BLOCO DIREITO */}
          <View style={styles.blocoDireito}>
            <Text style={styles.titleCode}>{""}</Text>

            <Text style={styles.sectionTitle}>Local de Pagamento</Text>
            <Text style={styles.fieldText}>
              Preferencialmente por pix ou nas casas lotéricas
            </Text>

            <View style={styles.row}>
              <View style={styles.box}>
                <Text style={styles.sectionTitle}>Valor</Text>
                <Text style={styles.fieldText}>R$ {parcela.valor_parcela}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.sectionTitle}>Vencimento</Text>
                <Text style={styles.fieldText}>{services.formatarDataNascimento(parcela.data_vencimento)}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.valorParcela}>
                <Text style={styles.sectionTitle}>Beneficiário</Text>
                <Text style={styles.fieldText}>{dados.emitente}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.box}>
                <Text style={styles.sectionTitle}>Sacado</Text>
                <Text style={styles.fieldText}>{dados.cliente.nome}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.sectionTitle}>CPF/CNPJ</Text>
                <Text style={styles.fieldText}>{dados.cliente.cpf_cnpj}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Código de Barras</Text>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default CarnePagamento;
