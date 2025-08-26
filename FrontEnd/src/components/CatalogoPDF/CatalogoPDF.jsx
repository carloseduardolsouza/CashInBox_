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

// Configuração da URL base
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3322";

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
  },
  logoPlaceholder: {
    width: 80,
    height: 60,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
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
    minHeight: 240,
  },
  productImageContainer: {
    width: "100%",
    height: 120,
    marginBottom: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  productName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
    lineHeight: 1.3,
    minHeight: 15,
  },
  productInfo: {
    fontSize: 9,
    marginBottom: 3,
    color: "#666",
    lineHeight: 1.2,
  },
  productInfoSection: {
    marginTop: "auto",
  },
  priceContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2c5530",
    marginBottom: 2,
  },
  productCostPrice: {
    fontSize: 10,
    color: "#999",
    textDecoration: "line-through",
    marginBottom: 2,
  },
  productPromotionalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#dc3545",
    marginTop: 2,
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
    marginTop: 6,
    fontStyle: "italic",
    lineHeight: 1.2,
  },
  stockInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  stockText: {
    fontSize: 9,
    color: "#666",
  },
  stockLow: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  stockGood: {
    color: "#28a745",
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
  emptyState: {
    textAlign: "center",
    marginTop: 100,
    color: "#666",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 12,
    color: "#999",
  },
});

const CatalogoProdutosPdf = ({ produtos = [], dadosLoja = {} }) => {
  // Validação inicial
  if (!produtos || produtos.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>CATÁLOGO DE PRODUTOS</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              Nenhum produto encontrado
            </Text>
            <Text style={styles.emptyStateText}>
              Selecione alguns produtos para gerar o catálogo.
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  const produtosParaCatalogo = produtos.filter(
    (produto) => produto && produto.nome
  );
  const produtosPorPagina = 4;
  const totalPaginas = Math.ceil(
    produtosParaCatalogo.length / produtosPorPagina
  );

  // Função para formatar data atual
  const dataAtual = new Date();
  const formatarData = (data) => {
    return services?.formatarDataCurta
      ? services.formatarDataCurta(data)
      : data.toLocaleDateString("pt-BR");
  };

  // Função para formatar moeda
  const formatarMoeda = (valor) => {
    return services?.formatarCurrency
      ? services.formatarCurrency(valor)
      : `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
  };

  // Função para formatar CNPJ
  const formatarCNPJ = (cnpj) => {
    if (!cnpj) return "00.000.000/0000-00";
    return services?.formatarCNPJ
      ? services.formatarCNPJ(cnpj)
      : cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  // Função para formatar telefone
  const formatarTelefone = (telefone) => {
    if (!telefone) return "(00) 00000-0000";
    return services?.formatarNumeroCelular
      ? services.formatarNumeroCelular(telefone)
      : telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // Função para determinar status do estoque
  const getStatusEstoque = (produto) => {
    if (produto.estoque === undefined || produto.estoque === null) return null;
    if (produto.estoque === 0) return "Sem estoque";
    if (produto.estoque < 5) return "Estoque baixo";
    return "Em estoque";
  };

  // Função para obter estilo do estoque
  const getEstiloEstoque = (produto) => {
    if (produto.estoque === undefined || produto.estoque === null)
      return styles.stockText;

    if (produto.estoque === 0 || produto.estoque < 5)
      return [styles.stockText, styles.stockLow];
    return [styles.stockText, styles.stockGood];
  };

  const gerarPaginas = () => {
    const paginas = [];

    for (let i = 0; i < totalPaginas; i++) {
      const inicio = i * produtosPorPagina;
      const fim = inicio + produtosPorPagina;
      const produtosPagina = produtosParaCatalogo.slice(inicio, fim);

      paginas.push(
        <Page key={`page-${i}`} size="A4" style={styles.page}>
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
                {dadosLoja.nomeEstabelecimento || "Nome da Empresa"}
              </Text>
            </View>

            <View style={styles.companyInfo}>
              <Text style={styles.companyDetails}>
                CNPJ: {formatarCNPJ(dadosLoja.cnpj)}
              </Text>
              <Text style={styles.companyDetails}>
                {dadosLoja.endereco || "Endereço não cadastrado"}
              </Text>
              <Text style={styles.companyDetails}>
                Tel: {formatarTelefone(dadosLoja.telefone)}
              </Text>
              {dadosLoja.email && (
                <Text style={styles.companyDetails}>
                  E-mail: {dadosLoja.email}
                </Text>
              )}
              {dadosLoja.site && (
                <Text style={styles.companyDetails}>
                  Site: {dadosLoja.site}
                </Text>
              )}
            </View>
          </View>

          {/* Título */}
          <Text style={styles.title}>CATÁLOGO DE PRODUTOS</Text>

          {/* Informações do catálogo */}
          <View style={styles.catalogInfo}>
            <Text style={styles.catalogInfoText}>
              Data: {formatarData(dataAtual)}
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
              const imagemBase64 = produto.imagem;

              const getImagemSrc = (img) => {
                if (!img) return null;

                // já é data URI válido
                if (img.startsWith("data:image")) return img;

                // senão, for só base64 cru
                return `data:image/png;base64,${img}`;
              };

              return (
                <View
                  key={produto.id || `produto-${i}-${index}`}
                  style={styles.productCard}
                >
                  {/* Imagem */}
                  <View style={styles.productImageContainer}>
                    {produto.imagem ? (
                      <Image src={getImagemSrc(produto.imagem)} style={styles.productImage} />
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

                  {/* Informações do produto */}
                  <View>
                    {produto.codigo_barras && (
                      <Text style={styles.productInfo}>
                        Código: {produto.codigo_barras}
                      </Text>
                    )}
                    {produto.categoria && (
                      <Text style={styles.productInfo}>
                        Categoria: {produto.categoria}
                      </Text>
                    )}
                    {produto.marca && (
                      <Text style={styles.productInfo}>
                        Marca: {produto.marca}
                      </Text>
                    )}
                  </View>

                  {/* Seção de preços */}
                  <View
                    style={[styles.productInfoSection, styles.priceContainer]}
                  >
                    {produto.preco_promocional &&
                    produto.preco_promocional < produto.preco_venda ? (
                      <View>
                        <Text style={styles.productCostPrice}>
                          De: {formatarMoeda(produto.preco_venda || 0)}
                        </Text>
                        <Text style={styles.productPromotionalPrice}>
                          Por: {formatarMoeda(produto.preco_promocional)}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.productPrice}>
                        {formatarMoeda(produto.preco_venda || 0)}
                      </Text>
                    )}
                  </View>

                  {/* Descrição */}
                  {produto.descricao && (
                    <Text style={styles.productDescription}>
                      {produto.descricao.length > 80
                        ? produto.descricao.substring(0, 80) + "..."
                        : produto.descricao}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Catálogo gerado em {formatarData(dataAtual)} -{" "}
            {dadosLoja.nomeEstabelecimento || "Nome da Loja"}
            {dadosLoja.telefone &&
              ` - Tel: ${formatarTelefone(dadosLoja.telefone)}`}
            {dadosLoja.email && ` - ${dadosLoja.email}`}
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
