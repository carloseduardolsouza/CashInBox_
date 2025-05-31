import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 9, fontFamily: "Helvetica" },
  section: {
    marginBottom: 5,
    padding: 5,
    borderWidth: 1,
    borderStyle: "solid",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  col: { width: "48%" },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: "row" },
  tableCol: {
    width: "14.2%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
  center: { textAlign: "center" },
  image: { width: "100%", height: "auto", marginBottom: 10 },
});

const NotaFiscalDANFE = ({ dados }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* INSERE A IMAGEM AQUI */}
      <Image src={""} style={styles.image} />

      <View style={[styles.section, styles.center]}>
        <Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            DANFE - Documento Auxiliar da Nota Fiscal Eletrônica
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            Identificação do Emitente:
          </Text>
        </Text>
        <Text>{dados.emitente.nome}</Text>
        <Text>{dados.emitente.endereco}</Text>
        <Text>CNPJ: {dados.emitente.cnpj}</Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Destinatário:</Text>
        </Text>
        <Text>{dados.destinatario.nome}</Text>
        <Text>{dados.destinatario.endereco}</Text>
        <Text>CNPJ/CPF: {dados.destinatario.cnpj}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text>NF-e Nº: {dados.nfe.numero}</Text>
          <Text>Série: {dados.nfe.serie}</Text>
          <Text>Emissão: {dados.nfe.data_emissao}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Produtos:</Text>
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Cód</Text>
            <Text style={styles.tableCol}>Descrição</Text>
            <Text style={styles.tableCol}>NCM</Text>
            <Text style={styles.tableCol}>CFOP</Text>
            <Text style={styles.tableCol}>Qtd</Text>
            <Text style={styles.tableCol}>Vlr Unit</Text>
            <Text style={styles.tableCol}>Vlr Total</Text>
          </View>

          {dados.produtos.map((prod) => (
            <View style={styles.tableRow} key={prod.codigo}>
              <Text style={styles.tableCol}>{prod.codigo}</Text>
              <Text style={styles.tableCol}>{prod.descricao}</Text>
              <Text style={styles.tableCol}>{prod.ncm}</Text>
              <Text style={styles.tableCol}>{prod.cfop}</Text>
              <Text style={styles.tableCol}>{prod.quantidade}</Text>
              <Text style={styles.tableCol}>R$ {prod.valor_unitario}</Text>
              <Text style={styles.tableCol}>R$ {prod.valor_total}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            Cálculo do Imposto:
          </Text>
        </Text>
        <Text>ICMS: R$ {dados.impostos.icms}</Text>
        <Text>IPI: R$ {dados.impostos.ipi}</Text>
        <Text>Total: R$ {dados.totais.total}</Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Transportadora:</Text>
        </Text>
        <Text>{dados.transportadora.razao_social}</Text>
        <Text>Frete: {dados.transportadora.frete}</Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            Dados Adicionais:
          </Text>
        </Text>
        <Text>{dados.dados_adicionais}</Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Chave de Acesso:</Text>{" "}
          {dados.chave_acesso}
        </Text>
        <Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            Protocolo de Autorização:
          </Text>{" "}
          {dados.protocolo_autorizacao}
        </Text>
      </View>
    </Page>
  </Document>
);

export default NotaFiscalDANFE;
