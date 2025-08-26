import { useEffect, useState, useMemo, useContext, useCallback } from "react";
import "./ModalGerarCatalogo.css";
import produtoFetch from "../../../../api/produtoFetch";
import categoriaFetch from "../../../../api/categoriaFetch";
import services from "../../../../services/services";
import Select from "react-select";
import { pdf } from "@react-pdf/renderer";
import AppContext from "../../../../context/AppContext";
import CatalogoProdutosPdf from "../../../../components/CatalogoPDF/CatalogoPDF";
import Concluindo from "../../../../components/Concluindo/Concluindo";

function ModalGerarCatalogo({ fechar, produtos }) {
  const { setErroApi, dadosLoja, adicionarAviso } = useContext(AppContext);

  const [produtosTratados, setProdutosTratados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelect, setCategoriaSelect] = useState(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState(new Set());
  const [concluindo, setConcluindo] = useState(false);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  const buscarCategorias = useCallback(async () => {
    try {
      const response = await categoriaFetch.listarCategorias();
      setCategorias(response || []);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setErroApi(true);
      adicionarAviso("erro", "Erro ao carregar categorias.");
    }
  }, [setErroApi, adicionarAviso]);

  async function convertToBase64(url, quality = 0.9) {
    try {
      // 1️⃣ Pega a imagem do URL
      const response = await fetch(url);
      const blob = await response.blob();

      // 2️⃣ Cria um elemento Image para manipular
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "Anonymous"; // importante para evitar problemas de CORS
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = URL.createObjectURL(blob);
      });

      // 3️⃣ Cria um canvas e desenha a imagem nele
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // 4️⃣ Converte o canvas para base64 em JPEG
      const base64 = canvas.toDataURL("image/jpeg", quality); // qualidade entre 0 e 1
      return base64;
    } catch (err) {
      console.error("Erro ao converter imagem para JPEG:", err);
      return null;
    }
  }

  const customStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ? "black" : "#ccc",
        boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
        "&:hover": { borderColor: "black" },
        minHeight: 38,
      }),
      menu: (base) => ({ ...base, zIndex: 9999 }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "#333"
          : state.isFocused
          ? "#f0f0f0"
          : "white",
        color: state.isSelected ? "white" : "black",
      }),
    }),
    []
  );

  const optionsCategorias = useMemo(
    () => [
      { value: null, label: "Todas as categorias" },
      ...categorias.map((categoria) => ({
        value: categoria.id,
        label: categoria.nome,
      })),
    ],
    [categorias]
  );

  // Produtos filtrados pela categoria selecionada
  const produtosFiltrados = useMemo(() => {
    if (!categoriaSelect) {
      return produtosTratados;
    }
    return produtosTratados.filter(
      (produto) => produto.categoria_id === categoriaSelect
    );
  }, [produtosTratados, categoriaSelect]);

  // Função para selecionar/deselecionar todos os produtos da categoria atual
  const handleSelecionarTodos = useCallback(() => {
    const todosProdutosIds = produtosFiltrados.map((produto) => produto.id);
    const todosEstaoSelecionados = todosProdutosIds.every((id) =>
      produtosSelecionados.has(id)
    );

    setProdutosSelecionados((prev) => {
      const novoSet = new Set(prev);
      if (todosEstaoSelecionados) {
        // Remover todos os produtos filtrados
        todosProdutosIds.forEach((id) => novoSet.delete(id));
      } else {
        // Adicionar todos os produtos filtrados
        todosProdutosIds.forEach((id) => novoSet.add(id));
      }
      return novoSet;
    });
  }, [produtosFiltrados, produtosSelecionados]);

  const toggleProdutoSelecionado = useCallback((produtoId) => {
    setProdutosSelecionados((prev) => {
      const novoSet = new Set(prev);
      if (novoSet.has(produtoId)) {
        novoSet.delete(produtoId);
      } else {
        novoSet.add(produtoId);
      }
      return novoSet;
    });
  }, []);

  const handleRowClick = useCallback(
    (produtoId) => {
      toggleProdutoSelecionado(produtoId);
    },
    [toggleProdutoSelecionado]
  );

  const handleCheckboxClick = useCallback(
    (e, produtoId) => {
      e.stopPropagation(); // Evita que o click do checkbox dispare o click da linha
      toggleProdutoSelecionado(produtoId);
    },
    [toggleProdutoSelecionado]
  );

  // Handler para gerar e fazer download do catálogo
  const handleGerarCatalogo = useCallback(async () => {
    if (produtosSelecionados.size === 0) {
      adicionarAviso(
        "aviso",
        "Selecione pelo menos um produto para gerar o catálogo."
      );
      return;
    }

    setConcluindo(true);

    try {
      // Filtrar apenas os produtos selecionados
      const produtosSelecionadosArray = produtosTratados.filter((produto) =>
        produtosSelecionados.has(produto.id)
      );

      console.log("Produtos selecionados:", produtosSelecionadosArray);
      console.log("Dados da loja:", dadosLoja);
      console.log(produtosSelecionadosArray);

      // Validar se há produtos
      if (produtosSelecionadosArray.length === 0) {
        throw new Error("Nenhum produto válido foi selecionado");
      }

      // Validar dados da loja
      if (!dadosLoja) {
        throw new Error("Dados da loja não encontrados");
      }

      // Criar o documento PDF
      const doc = (
        <CatalogoProdutosPdf
          produtos={produtosSelecionadosArray}
          dadosLoja={dadosLoja}
        />
      );

      console.log("Documento PDF criado, gerando blob...");

      // Gerar o PDF com tratamento de erro mais robusto
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      console.log("Blob gerado com sucesso:", blob.size, "bytes");
      console.log("Tipo do blob:", blob.type);

      // Verificar se o blob foi gerado corretamente
      if (blob.size === 0) {
        throw new Error("PDF gerado está vazio");
      }

      if (blob.type !== "application/pdf") {
        console.warn("Tipo MIME incorreto:", blob.type);
      }

      // Criar nome do arquivo com data atual
      const dataAtual = new Date()
        .toLocaleDateString("pt-BR")
        .replace(/\//g, "-");
      const nomeArquivo = `catalogo-produtos-${dataAtual}.pdf`;

      // Fazer download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);

      adicionarAviso(
        "sucesso",
        `Catálogo gerado com sucesso! ${produtosSelecionados.size} produtos incluídos.`
      );

      // Fechar modal após sucesso
      setTimeout(() => {
        setConcluindo(false);
        fechar(null);
      }, 1500);
    } catch (error) {
      console.error("Erro detalhado ao gerar catálogo:", error);
      console.error("Stack trace:", error.stack);
      setErroApi(true);
      adicionarAviso("erro", `Erro ao gerar catálogo PDF: ${error.message}`);
      setConcluindo(false);
    }
  }, [
    produtosSelecionados,
    produtosTratados,
    dadosLoja,
    adicionarAviso,
    setErroApi,
    fechar,
  ]);

  const carregarProdutosComImagens = useCallback(async () => {
    if (!produtos || produtos.length === 0) {
      setProdutosTratados([]);
      setCarregandoProdutos(false);
      return;
    }

    setCarregandoProdutos(true);
    try {
      const produtosComImg = await Promise.all(
        produtos.map(async (dados) => {
          try {
            const imagens = await produtoFetch.listarImagens(dados.id);
            let imgUrl = null;

            if (imagens && imagens.length > 0) {
              const imgPath = imagens[0].imagem_path;
              imgUrl = await convertToBase64(
                `http://localhost:3322/uploads/${imgPath}`
              );
            }

            return {
              ...dados,
              imagem: imgUrl,
              estoque_min_atingido: dados.estoque_atual <= dados.estoque_minimo,
            };
          } catch (error) {
            console.warn(
              `Erro ao carregar imagem do produto ${dados.id}:`,
              error
            );
            return {
              ...dados,
              imagem: null,
              estoque_min_atingido: dados.estoque_atual <= dados.estoque_minimo,
            };
          }
        })
      );

      setProdutosTratados(produtosComImg);
    } catch (error) {
      console.error("Erro ao carregar produtos com imagens:", error);
      setErroApi(true);
      adicionarAviso("erro", "Erro ao carregar imagens dos produtos.");
    } finally {
      setCarregandoProdutos(false);
    }
  }, [produtos, setErroApi, adicionarAviso]);

  useEffect(() => {
    buscarCategorias();
    carregarProdutosComImagens();
  }, [buscarCategorias, carregarProdutosComImagens]);

  // Limpar seleções quando a categoria mudar
  useEffect(() => {
    setProdutosSelecionados(new Set());
  }, [categoriaSelect]);

  // Verificar se todos os produtos filtrados estão selecionados
  const todosSelecionados = useMemo(() => {
    if (produtosFiltrados.length === 0) return false;
    return produtosFiltrados.every((produto) =>
      produtosSelecionados.has(produto.id)
    );
  }, [produtosFiltrados, produtosSelecionados]);

  const algumSelecionado = useMemo(() => {
    return produtosFiltrados.some((produto) =>
      produtosSelecionados.has(produto.id)
    );
  }, [produtosFiltrados, produtosSelecionados]);

  if (carregandoProdutos) {
    return (
      <div className="blurModal">
        <div id="ModalGerarCatalogo">
          <h2>Carregando produtos...</h2>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Aguarde enquanto carregamos os produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blurModal">
      {concluindo && <Concluindo />}

      <div id="ModalGerarCatalogo">
        <h2>Selecionar produtos ({produtosTratados.length} disponíveis)</h2>

        <nav>
          <div>
            <span>Selecione uma categoria:</span>
            <Select
              options={optionsCategorias}
              styles={customStyles}
              value={
                optionsCategorias.find(
                  (option) => option.value === categoriaSelect
                ) || optionsCategorias[0]
              }
              onChange={(selectedOption) => {
                setCategoriaSelect(selectedOption?.value || null);
              }}
              placeholder="Selecione uma categoria"
              isSearchable
              noOptionsMessage={() => "Nenhuma categoria encontrada"}
            />
          </div>

          {produtosFiltrados.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <button
                type="button"
                onClick={handleSelecionarTodos}
                style={{
                  padding: "8px 16px",
                  backgroundColor: todosSelecionados ? "#dc3545" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {todosSelecionados ? "Desmarcar todos" : "Selecionar todos"}
              </button>
              <span
                style={{ marginLeft: "10px", fontSize: "14px", color: "#666" }}
              >
                {produtosFiltrados.length} produtos na categoria atual
              </span>
            </div>
          )}
        </nav>

        <div id="rowGerarCatalogo">
          {produtosFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Nenhum produto encontrado para a categoria selecionada.</p>
            </div>
          ) : (
            <table id="listaDeProdutos">
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={todosSelecionados}
                      ref={(input) => {
                        if (input)
                          input.indeterminate =
                            algumSelecionado && !todosSelecionados;
                      }}
                      onChange={handleSelecionarTodos}
                      title={
                        todosSelecionados
                          ? "Desmarcar todos"
                          : "Selecionar todos"
                      }
                    />
                  </th>
                  <th style={{ width: "80px" }}>Imagem</th>
                  <th>Nome</th>
                  <th style={{ width: "120px" }}>Preço</th>
                  <th style={{ width: "80px" }}>Estoque</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((dados) => {
                  const isSelected = produtosSelecionados.has(dados.id);
                  return (
                    <tr
                      key={dados.id}
                      className={isSelected ? "gerarCatalogoAtiva" : ""}
                      onClick={() => handleRowClick(dados.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleCheckboxClick(e, dados.id)}
                        />
                      </td>
                      <td>
                        {dados.imagem ? (
                          <img
                            src={dados.imagem}
                            alt={dados.nome}
                            style={{
                              maxHeight: 70,
                              maxWidth: 70,
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "70px",
                              height: "70px",
                              backgroundColor: "#f0f0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "4px",
                              fontSize: "10px",
                              color: "#666",
                            }}
                          >
                            Sem imagem
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <strong>{dados.nome}</strong>
                          {dados.codigo_barras && (
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              Cód: {dados.codigo_barras}
                            </div>
                          )}
                          {dados.referencia && (
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              Ref: {dados.referencia}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{services.formatarCurrency(dados.preco_venda)}</td>
                      <td>
                        <span
                          style={{
                            color: dados.estoque_min_atingido
                              ? "#dc3545"
                              : "#333",
                          }}
                        >
                          {dados.estoque_atual || 0}
                        </span>
                        {dados.estoque_min_atingido && (
                          <div style={{ fontSize: "10px", color: "#dc3545" }}>
                            Estoque baixo
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px", color: "#666" }}>
            {produtosSelecionados.size} de {produtosTratados.length} produtos
            selecionados
          </span>
        </div>

        <div id="areaButtons">
          <div>
            <button onClick={() => fechar(null)} disabled={concluindo}>
              Cancelar
            </button>
            <button
              onClick={handleGerarCatalogo}
              disabled={concluindo || produtosSelecionados.size === 0}
              style={{
                opacity: produtosSelecionados.size === 0 ? 0.6 : 1,
                cursor:
                  produtosSelecionados.size === 0 ? "not-allowed" : "pointer",
                marginLeft: "10px",
              }}
            >
              {concluindo
                ? "Gerando..."
                : `Gerar catálogo (${produtosSelecionados.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalGerarCatalogo;
