// NotaGrandeDetalhesVendaPdf.jsx
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import services from "../../services/services";

// Estilos no formato JS (não CSS)
const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  cabecalhoNotaGrande: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 50,
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  cabecalhoNotaGrande2: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: "black",
    borderTopStyle: "dashed",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  boxInfo: {
    borderWidth: 1,
    borderColor: "black",
    padding: 3,
    marginVertical: 10,
  },
  logoImpresa: {
    width: 70,
    height: 50,
  },
  preFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 2,
  },
  footer: {
    borderWidth: 1,
    borderColor: "black",
    height: 60,
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  footerText: {
    width: 150,
    textAlign: "center",
    height: 20,
    borderTopWidth: 1,
    borderTopColor: "black",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginVertical: 4,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#EEE",
    padding: 3,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 3,
  },
  tableCellHeader: {
    fontWeight: "bold",
  },
});

const NotaGrandeDetalhesVendaPdf = ({
  venda,
  cliente = {},
  produtos,
  dadosLoja,
  pagamento,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* PRIMEIRA NOTA */}
      <View style={styles.cabecalhoNotaGrande}>
        {/* Aqui você pode por uma Image se tiver a logo */}
        <Image src={""} style={styles.logoImpresa} />
        <View>
          <Text>
            CNPJ: {services.formatarCNPJ(dadosLoja.cnpj || "00000000000000")}
          </Text>
          <Text>{dadosLoja.endereco || "Endereço não cadastrado"}</Text>
          <Text>
            {services.formatarNumeroCelular(
              dadosLoja.telefone || "00000000000"
            )}
          </Text>
        </View>
      </View>

      <View>
        <Text>
          Pagamento:{" "}
          {pagamento && pagamento.length > 0
            ? pagamento
                .map(
                  (p) =>
                    `${services.formatarCurrency(p.valor)} : ${
                      p.tipo_pagamento
                    }`
                )
                .join(", ")
            : "Desconhecido"}
        </Text>
      </View>

      <View style={styles.boxInfo}>
        <Text>Cliente: {cliente.nome || "Desconhecido"}</Text>
        <Text>
          Telefone:{" "}
          {cliente.telefone
            ? services.formatarNumeroCelular(cliente.telefone)
            : "Desconhecido"}
        </Text>
        <Text>Endereço: {cliente.endereco || "Desconhecido"}</Text>
        <Text>
          Data: {services.formatarDataCurta(venda.data_venda) || "Desconhecido"}
        </Text>
      </View>

      <View style={styles.table}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableColHeader, styles.tableCellHeader]}>
            Produto
          </Text>
          <Text style={[styles.tableColHeader, styles.tableCellHeader]}>
            Quantidade
          </Text>
          <Text style={[styles.tableColHeader, styles.tableCellHeader]}>
            Vl. unitário
          </Text>
          <Text style={[styles.tableColHeader, styles.tableCellHeader]}>
            Total
          </Text>
        </View>

        {/* Linhas da tabela */}
        {produtos.map((product, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCol}>{product.produto_nome}</Text>
            <Text style={styles.tableCol}>{product.quantidade}</Text>
            <Text style={styles.tableCol}>
              {services.formatarCurrency(product.preco_unitario)}
            </Text>
            <Text style={styles.tableCol}>
              {services.formatarCurrency(product.valor_total)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.preFooter}>
        <Text>Qtde. itens: {produtos.length}</Text>
        <Text>Valor Total: {services.formatarCurrency(venda.valor_total)}</Text>
      </View>

      <View style={styles.footer}>
        <View style={{ height: 40 }}></View>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>assinatura do responsável</Text>
          <Text style={styles.footerText}>assinatura do cliente</Text>
        </View>
      </View>

      {/* SEGUNDA NOTA (repete a mesma estrutura com pequenas mudanças) */}
      <View style={styles.cabecalhoNotaGrande2}>
        <Image src={""} style={styles.logoImpresa} />
        <View>
          <Text>
            CNPJ: {services.formatarCNPJ(dadosLoja.cnpj || "00000000000000")}
          </Text>
          <Text>{dadosLoja.endereco || "Endereço não cadastrado"}</Text>
          <Text>
            {services.formatarNumeroCelular(
              dadosLoja.telefone || "00000000000"
            )}
          </Text>
        </View>
      </View>

      <View>
        <Text>
          Pagamento:{" "}
          {pagamento && pagamento.length > 0
            ? pagamento
                .map(
                  (p) =>
                    `${services.formatarCurrency(p.valor)} : ${
                      p.tipo_pagamento
                    }`
                )
                .join(", ")
            : "Desconhecido"}
        </Text>
      </View>

      <View style={styles.boxInfo}>
        <Text>Cliente: {cliente.nome || "Desconhecido"}</Text>
        <Text>
          Telefone:{" "}
          {cliente.telefone
            ? services.formatarNumeroCelular(cliente.telefone)
            : "Desconhecido"}
        </Text>
        <Text>Endereço: {cliente.endereco || "Desconhecido"}</Text>
        <Text>
          Data: {services.formatarDataCurta(venda.data_venda) || "Desconhecido"}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableColHeader, styles.tableCellHeader]}>
            Produto
          </Text>
          <Text style={[styles.tableColHeader, styles.tableCellHeader]}>
            Quantidade
          </Text>
          <Text style={[styles.tableColHeader, styles.tableCellHeader]}>
            Vl. unitário
          </Text>
          <Text style={[styles.tableColHeader, styles.tableCellHeader]}>
            Total
          </Text>
        </View>

        {produtos.map((product, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCol}>{product.produto_nome}</Text>
            <Text style={styles.tableCol}>{product.quantidade}</Text>
            <Text style={styles.tableCol}>
              {services.formatarCurrency(product.preco_unitario)}
            </Text>
            <Text style={styles.tableCol}>
              {services.formatarCurrency(product.valor_total)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.preFooter}>
        <Text>Qtde. itens: {produtos.length}</Text>
        <Text>Valor Total: {services.formatarCurrency(venda.valor_total)}</Text>
      </View>

      <View style={styles.footer}>
        <View style={{ height: 40 }}></View>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>assinatura do responsável</Text>
          <Text style={styles.footerText}>assinatura do cliente</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default NotaGrandeDetalhesVendaPdf;
