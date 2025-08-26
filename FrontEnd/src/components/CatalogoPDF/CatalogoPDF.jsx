// CatalogoProdutosPdf.jsx
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
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#333",
  },
  logoSection: {
    alignItems: "flex-start",
    flex: 1,
  },
  logoImpresa: {
    width: 80,
    height: 60,
    marginBottom: 10,
    objectFit: "contain",
  },
  logoPlaceholder: {
    width: 80,
    height: 60,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 4,
  },
  companyInfo: {
    alignItems: "flex-end",
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  companyDetails: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  catalogInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
  catalogInfoText: {
    fontSize: 9,
    color: "#333",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 6,
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#fefefe",
    position: "relative",
  },
  productImageContainer: {
    width: "100%",
    height: 120,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  productName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
    lineHeight: 1.3,
  },
  productInfo: {
    fontSize: 9,
    marginBottom: 3,
    color: "#666",
    lineHeight: 1.2,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2c5530",
    marginTop: 6,
    marginBottom: 2,
  },
  productCostPrice: {
    fontSize: 9,
    color: "#999",
    textDecoration: "line-through",
    marginBottom: 2,
  },
  productMarkup: {
    fontSize: 8,
    color: "#28a745",
    fontWeight: "bold",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 7,
    fontWeight: "bold",
    color: "white",
  },
  activeStatus: {
    backgroundColor: "#28a745",
  },
  inactiveStatus: {
    backgroundColor: "#dc3545",
  },
  stockWarning: {
    backgroundColor: "#ffc107",
    color: "#212529",
  },
  noImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  noImageText: {
    fontSize: 8,
    color: "#6c757d",
    textAlign: "center",
  },
  productDescription: {
    fontSize: 8,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
    lineHeight: 1.2,
  },
  stockInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  stockText: {
    fontSize: 9,
    color: "#666",
  },
  stockLow: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 20,
    fontSize: 8,
    color: "#999",
  },
});

const CatalogoProdutosPdf = ({ produtos = [], dadosLoja = {} }) => {
  if (!produtos || produtos.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>CATÁLOGO DE PRODUTOS</Text>
          <Text style={{ textAlign: "center", marginTop: 50, fontSize: 14 }}>
            Nenhum produto selecionado para o catálogo.
          </Text>
        </Page>
      </Document>
    );
  }

  const produtosParaCatalogo = produtos;
  const produtosPorPagina = 8;
  const totalPaginas = Math.ceil(produtosParaCatalogo.length / produtosPorPagina);

  const gerarPaginas = () => {
    const paginas = [];

    for (let i = 0; i < totalPaginas; i++) {
      const inicio = i * produtosPorPagina;
      const fim = inicio + produtosPorPagina;
      const produtosPagina = produtosParaCatalogo.slice(inicio, fim);

      paginas.push(
        <Page key={i} size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoSection}>
              {dadosLoja.logo ? (
                <Image src={dadosLoja.logo} style={styles.logoImpresa} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Text style={{ fontSize: 8, color: "#999" }}>LOGO</Text>
                </View>
              )}
              <Text style={styles.companyName}>
                {dadosLoja.nome || "Nome da Empresa"}
              </Text>
            </View>

            <View style={styles.companyInfo}>
              <Text style={styles.companyDetails}>
                CNPJ: {services.formatarCNPJ(dadosLoja.cnpj || "00000000000000")}
              </Text>
              <Text style={styles.companyDetails}>
                {dadosLoja.endereco || "Endereço não cadastrado"}
              </Text>
              <Text style={styles.companyDetails}>
                Tel:{" "}
                {services.formatarNumeroCelular(dadosLoja.telefone || "00000000000")}
              </Text>
              {dadosLoja.email && (
                <Text style={styles.companyDetails}>E-mail: {dadosLoja.email}</Text>
              )}
              {dadosLoja.site && (
                <Text style={styles.companyDetails}>Site: {dadosLoja.site}</Text>
              )}
            </View>
          </View>

          {/* Título */}
          <Text style={styles.title}>CATÁLOGO DE PRODUTOS</Text>

          {/* Informações do catálogo */}
          <View style={styles.catalogInfo}>
            <Text style={styles.catalogInfoText}>
              Data: {services.formatarDataCurta(new Date())}
            </Text>
            <Text style={styles.catalogInfoText}>
              Total de produtos: {produtosParaCatalogo.length}
            </Text>
            <Text style={styles.catalogInfoText}>
              Página {i + 1} de {totalPaginas}
            </Text>
          </View>

          {/* Grid de produtos */}
          <View style={styles.productsGrid}>
            {produtosPagina.map((produto, index) => {
              const estoqueAtual = produto.estoque_atual || 0;
              const estoqueMinimo = produto.estoque_minimo || 0;
              const estoqueBaixo = estoqueAtual <= estoqueMinimo && estoqueMinimo > 0;

              return (
                <View key={produto.id || index} style={styles.productCard}>
                  {/* Badge de status */}
                  {produto.ativo !== undefined && (
                    <View
                      style={[
                        styles.statusBadge,
                        estoqueBaixo
                          ? styles.stockWarning
                          : produto.ativo
                          ? styles.activeStatus
                          : styles.inactiveStatus,
                      ]}
                    >
                      <Text>
                        {estoqueBaixo
                          ? "ESTOQUE BAIXO"
                          : produto.ativo
                          ? "ATIVO"
                          : "INATIVO"}
                      </Text>
                    </View>
                  )}

                  {/* Imagem */}
                  <View style={styles.productImageContainer}>
                    {produto.imagem && produto.imagem !== "" ? (
                      <Image src={produto.imagem} style={styles.productImage} />
                    ) : (
                      <View style={styles.noImage}>
                        <Text style={styles.noImageText}>SEM{"\n"}IMAGEM</Text>
                      </View>
                    )}
                  </View>

                  {/* Nome */}
                  <Text style={styles.productName}>
                    {produto.nome || "Produto sem nome"}
                  </Text>

                  {/* Informações */}
                  {produto.codigo_barras && (
                    <Text style={styles.productInfo}>
                      Código: {produto.codigo_barras}
                    </Text>
                  )}
                  {produto.referencia && (
                    <Text style={styles.productInfo}>
                      Referência: {produto.referencia}
                    </Text>
                  )}
                  {produto.categoria && (
                    <Text style={styles.productInfo}>
                      Categoria: {produto.categoria}
                    </Text>
                  )}
                  {produto.marca && (
                    <Text style={styles.productInfo}>Marca: {produto.marca}</Text>
                  )}
                  <Text style={styles.productInfo}>
                    Estoque: {estoqueAtual} {produto.unidade_medida || "un"}
                  </Text>
                  {produto.estoque_minimo > 0 && (
                    <Text style={styles.productInfo}>
                      Est. mín: {produto.estoque_minimo}
                    </Text>
                  )}

                  {/* Preços */}
                  {produto.preco_custo > 0 && (
                    <Text style={styles.productCostPrice}>
                      Custo: {services.formatarCurrency(produto.preco_custo)}
                    </Text>
                  )}
                  <Text style={styles.productPrice}>
                    {services.formatarCurrency(produto.preco_venda || 0)}
                  </Text>
                  {produto.markup > 0 && (
                    <Text style={styles.productMarkup}>
                      Markup: {produto.markup}%
                    </Text>
                  )}

                  {/* Descrição */}
                  {produto.descricao && (
                    <Text style={styles.productDescription}>
                      {produto.descricao.length > 60
                        ? produto.descricao.substring(0, 60) + "..."
                        : produto.descricao}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Catálogo gerado em {services.formatarDataCurta(new Date())} -{" "}
            {dadosLoja.nome || "Nome da Loja"}
          </Text>

          {/* Número da página */}
          <Text style={styles.pageNumber}>
            {i + 1}/{totalPaginas}
          </Text>
        </Page>
      );
    }

    return paginas;
  };

  return <Document>{gerarPaginas()}</Document>;
};

export default CatalogoProdutosPdf;
