import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import services from "../services/services";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  header: {
    margin: 9,
    fontSize: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerThwo: {
    margin: 9,
    marginTop: 40,
    fontSize: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boxInfo: {
    border: "1 solid black",
    padding: 3,
    fontSize: 13,
    marginBottom: 10,
  },
  logoLider: {
    width: 70,
    height: 35, // ajuste proporcional
  },
  table: {
    border: "1 solid black",
    marginTop: 10,
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000000",
    color: "#ffffff",
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    color: "#ffffff",
    padding: 2,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#eeeeee",
    color: "#0c0c0c",
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    padding: 2,
    textAlign: "center",
  },
  preFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  ptNotinha: {
    height: "49vh", // no react-pdf pode usar porcentagem ou um valor fixo.
  },
  dotted: {
    borderBottom: "1 dotted black",
    marginVertical: 5,
  },
  footer: {
    border: "1 solid black",
    height: 60,
    marginTop: 10,
    padding: 5,
    justifyContent: "space-around",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  textDetalhesCompra: {
    fontSize: 12,
  },
  footerText: {
    width: 350,
    textAlign: "center",
    height: 20,
    borderTop: "1 solid black",
    fontSize: 10,
    paddingTop: 2,
  },
});

const MyPDFDocumentNotaGrande = ({ produtos, cliente, venda, dadosLoja }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.logoLider}
            src="https://via.placeholder.com/100x50"
          />
          <View>
            <Text>CNPJ: {services.formatarCNPJ(dadosLoja.cnpj) || "0000"}</Text>
            <Text>{dadosLoja.endereco || "0000"}</Text>
            <Text>
              {services.formatarNumeroCelular(dadosLoja.telefone) || "0000"}
            </Text>
          </View>
        </View>

        <View style={styles.boxInfo}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Pagamento: </Text>
            {venda.pagamento || "Não informado"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Cliente: </Text>
            {cliente.nome || "Não informado"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Telefone: </Text>
            {services.formatarNumeroCelular(
              cliente.telefone || "Não informado"
            )}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Endereço: </Text>
            {cliente?.endereco || "Não informado"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Data: </Text>
            {services.formatarDataCurta(venda.data_venda)}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Produto</Text>
            <Text style={styles.tableHeaderCell}>Vl. unitário</Text>
            <Text style={styles.tableHeaderCell}>Unidade</Text>
            <Text style={styles.tableHeaderCell}>Total</Text>
          </View>

          {produtos.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{product.produto_nome}</Text>
              <Text style={styles.tableCell}>
                {services.formatarCurrency(product.preco_unitario)}
              </Text>
              <Text style={styles.tableCell}>{product.quantidade}</Text>
              <Text style={styles.tableCell}>
                {services.formatarCurrency(product.valor_total)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.preFooter}>
          <View>
            <Text style={styles.textDetalhesCompra}>
              Descontos: {venda.descontos}
            </Text>
            <Text style={styles.textDetalhesCompra}>
              Acrescimos: {venda.acrescimos}
            </Text>
          </View>
          <Text>
            Valor Total: {services.formatarCurrency(venda.valor_total)}
          </Text>
        </View>

        <View style={styles.dotted} />

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Assinatura do responsável</Text>
            <Text style={styles.footerText}>Assinatura do cliente</Text>
          </View>
        </View>

        <View style={styles.headerThwo}>
          <Image
            style={styles.logoLider}
            src="https://via.placeholder.com/100x50"
          />
          <View>
            <Text>CNPJ: {services.formatarCNPJ(dadosLoja.cnpj) || "0000"}</Text>
            <Text>{dadosLoja.endereco || "0000"}</Text>
            <Text>
              {services.formatarNumeroCelular(dadosLoja.telefone) || "0000"}
            </Text>
          </View>
        </View>

        <View style={styles.boxInfo}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Pagamento: </Text>
            {venda.pagamento || "Não informado"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Cliente: </Text>
            {cliente.nome || "Não informado"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Telefone: </Text>
            {services.formatarNumeroCelular(
              cliente.telefone || "Não informado"
            )}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Endereço: </Text>
            {cliente?.endereco || "Não informado"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Data: </Text>
            {services.formatarDataCurta(venda.data_venda)}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Produto</Text>
            <Text style={styles.tableHeaderCell}>Vl. unitário</Text>
            <Text style={styles.tableHeaderCell}>Unidade</Text>
            <Text style={styles.tableHeaderCell}>Total</Text>
          </View>

          {produtos.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{product.produto_nome}</Text>
              <Text style={styles.tableCell}>
                {services.formatarCurrency(product.preco_unitario)}
              </Text>
              <Text style={styles.tableCell}>{product.quantidade}</Text>
              <Text style={styles.tableCell}>
                {services.formatarCurrency(product.valor_total)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.preFooter}>
          <View>
            <Text style={styles.textDetalhesCompra}>
              Descontos: {venda.descontos}
            </Text>
            <Text style={styles.textDetalhesCompra}>
              Acrescimos: {venda.acrescimos}
            </Text>
          </View>
          <Text>
            Valor Total: {services.formatarCurrency(venda.valor_total)}
          </Text>
        </View>

        <View style={styles.dotted} />

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Assinatura do responsável</Text>
            <Text style={styles.footerText}>Assinatura do cliente</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyPDFDocumentNotaGrande;
