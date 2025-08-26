import "./DetalhesDoProduto.css";

import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import AppContext from "../../context/AppContext";

import produtoFetch from "../../api/produtoFetch";
import categoriaFetch from "../../api/categoriaFetch";
//icones
import { FaRegTrashAlt } from "react-icons/fa";

// Hook customizado para gerenciar dados do produto
const useProdutoData = (id) => {
  const [produto, setProduto] = useState({
    codBarras: "",
    nomeProduto: "",
    descricao: "",
    estoque_atual: "",
    estoque_minimo: "",
    preco_custo: "",
    markup: "",
    preco_venda: "",
    categoria: "",
    categoria_id: "",
    controlarEstoque: false,
  });
  
  const [imagensProdutos, setImagensProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return {
    produto,
    setProduto,
    imagensProdutos,
    setImagensProdutos,
    loading,
    setLoading,
    error,
    setError
  };
};

// Utilitário para formatação de valores monetários
const formatarValorMonetario = (valor) => {
  return typeof valor === 'number' ? valor.toFixed(2) : parseFloat(valor || 0).toFixed(2);
};

// Utilitário para validação de dados
const validarDadosProduto = (dados) => {
  const erros = [];
  
  if (!dados.nome?.trim()) erros.push("Nome é obrigatório");
  if (!dados.preco_custo || dados.preco_custo <= 0) erros.push("Preço de custo deve ser maior que zero");
  if (!dados.preco_venda || dados.preco_venda <= 0) erros.push("Preço de venda deve ser maior que zero");
  
  return erros;
};

function DetalhesDoProduto() {
  const { id } = useParams();
  const { setErroApi, adicionarAviso } = useContext(AppContext);
  const navigate = useNavigate();

  const {
    produto,
    setProduto,
    imagensProdutos,
    setImagensProdutos,
    loading,
    setLoading,
    error,
    setError
  } = useProdutoData(id);

  const [resultCategorias, setResultCategorias] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const fileInputRef = useRef(null);

  // Memoizar opções de categorias
  const categorias = useMemo(() => 
    resultCategorias.map((categoria) => ({
      value: categoria.id,
      label: categoria.nome,
    })), [resultCategorias]
  );

  // Função para buscar categorias com cache
  const buscarCategorias = useCallback(async () => {
    try {
      if (resultCategorias.length === 0) {
        const resultado = await categoriaFetch.listarCategorias();
        setResultCategorias(resultado);
      }
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      setErroApi(true);
    }
  }, [resultCategorias.length, setErroApi]);

  // Função para buscar imagens
  const buscarImagens = useCallback(async () => {
    try {
      const response = await produtoFetch.listarImagens(id);
      setImagensProdutos(response || []);
    } catch (err) {
      console.error("Erro ao buscar imagens:", err);
      setError("Erro ao carregar imagens");
    }
  }, [id, setImagensProdutos, setError]);

  // Função para buscar produto
  const buscarProduto = useCallback(async () => {
    try {
      setLoading(true);
      const dadosProduto = await produtoFetch.procurarProdutoId(id);
      
      if (!dadosProduto) {
        throw new Error("Produto não encontrado");
      }

      setProduto({
        codBarras: dadosProduto.codigo_barras || "",
        nomeProduto: dadosProduto.nome || "",
        descricao: dadosProduto.descricao || "",
        estoque_atual: dadosProduto.estoque_atual || "",
        estoque_minimo: dadosProduto.estoque_minimo || "",
        preco_custo: dadosProduto.preco_custo || "",
        markup: dadosProduto.markup || "",
        preco_venda: dadosProduto.preco_venda || "",
        categoria: dadosProduto.categoria || "",
        categoria_id: dadosProduto.categoria_id || "",
        controlarEstoque: Boolean(dadosProduto.ativo),
      });
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      setError("Erro ao carregar produto");
      setErroApi(true);
    } finally {
      setLoading(false);
    }
  }, [id, setProduto, setLoading, setError, setErroApi]);

  // Effects
  useEffect(() => {
    buscarCategorias();
  }, [buscarCategorias]);

  useEffect(() => {
    if (id) {
      Promise.all([buscarProduto(), buscarImagens()]);
    }
  }, [id, buscarProduto, buscarImagens]);

  // Função para deletar imagem
  const deletarVariacao = useCallback(async (imagemId) => {
    try {
      await produtoFetch.deletarVariacaoProduto(imagemId);
      await buscarImagens(); // Recarrega as imagens
      adicionarAviso("sucesso", "Imagem deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar variação:", error);
      adicionarAviso("erro", "Erro ao deletar imagem");
    }
  }, [buscarImagens, adicionarAviso]);

  // Função para deletar produto
  const DeletarProduto = useCallback(async (produtoId) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      await produtoFetch.deletarProduto(produtoId);
      adicionarAviso("sucesso", "Produto excluído com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      adicionarAviso("erro", "Erro ao excluir produto");
    }
  }, [navigate, adicionarAviso]);

  // Função para calcular valores
  const calculeValor = useCallback((campo, valor) => {
    const valorNumerico = parseFloat(valor) || 0;
    
    setProduto(prev => {
      const novoProduto = { ...prev };
      
      if (campo === "precoCompra") {
        novoProduto.preco_custo = valorNumerico;
        const novoPrecoVenda = valorNumerico + (valorNumerico * parseFloat(prev.markup || 0)) / 100;
        novoProduto.preco_venda = parseFloat(formatarValorMonetario(novoPrecoVenda));
      } else if (campo === "margem") {
        novoProduto.markup = valorNumerico;
        const precoCusto = parseFloat(prev.preco_custo || 0);
        const novoPrecoVenda = precoCusto + (precoCusto * valorNumerico) / 100;
        novoProduto.preco_venda = parseFloat(formatarValorMonetario(novoPrecoVenda));
      } else if (campo === "precoVenda") {
        novoProduto.preco_venda = valorNumerico;
        const precoCusto = parseFloat(prev.preco_custo || 0);
        if (precoCusto > 0) {
          const novaMargem = ((valorNumerico - precoCusto) / precoCusto) * 100;
          novoProduto.markup = parseFloat(formatarValorMonetario(novaMargem));
        }
      }
      
      return novoProduto;
    });
  }, [setProduto]);

  // Função para atualizar campo do produto
  const atualizarCampo = useCallback((campo, valor) => {
    setProduto(prev => ({
      ...prev,
      [campo]: valor
    }));
  }, [setProduto]);

  // Função para salvar alterações
  const SalvarAlteracoesProduto = useCallback(async (e) => {
    e.preventDefault();
    
    const dados = {
      id: id,
      nome: produto.nomeProduto.charAt(0).toUpperCase() + produto.nomeProduto.slice(1).toLowerCase(),
      descricao: produto.descricao,
      codigo_barras: produto.codBarras,
      preco_venda: parseFloat(produto.preco_venda) || 0,
      preco_custo: parseFloat(produto.preco_custo) || 0,
      estoque_atual: produto.controlarEstoque ? parseInt(produto.estoque_atual) || 0 : 0,
      estoque_minimo: produto.controlarEstoque ? parseInt(produto.estoque_minimo) || 0 : 0,
      markup: parseFloat(formatarValorMonetario(produto.markup)) || 0,
      categoria: produto.categoria,
      categoria_id: produto.categoria_id,
      unidade_medida: "",
      ativo: produto.controlarEstoque ? 1 : 0,
    };

    // Validar dados
    const erros = validarDadosProduto(dados);
    if (erros.length > 0) {
      adicionarAviso("erro", `Erros de validação: ${erros.join(", ")}`);
      return;
    }

    try {
      setSalvando(true);
      await produtoFetch.atualizarProduto(dados);
      adicionarAviso("sucesso", "SUCESSO - Dados do produto editado com sucesso!");
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro);
      setErroApi(true);
      adicionarAviso("erro", "Erro ao salvar alterações");
    } finally {
      setSalvando(false);
    }
  }, [id, produto, adicionarAviso, setErroApi]);

  // Função para upload de imagens
  const HandleImageChange = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validar tipos de arquivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const arquivosInvalidos = files.filter(file => !tiposPermitidos.includes(file.type));
    
    if (arquivosInvalidos.length > 0) {
      adicionarAviso("erro", "Apenas arquivos de imagem são permitidos (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validar tamanho dos arquivos (máximo 5MB por arquivo)
    const maxTamanho = 5 * 1024 * 1024; // 5MB
    const arquivosGrandes = files.filter(file => file.size > maxTamanho);
    
    if (arquivosGrandes.length > 0) {
      adicionarAviso("erro", "Arquivos muito grandes. Máximo 5MB por imagem");
      return;
    }

    try {
      await produtoFetch.novaImagemProduto(id, files);
      await buscarImagens();
      adicionarAviso("sucesso", "Imagens adicionadas com sucesso!");
      
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      adicionarAviso("erro", "Erro ao fazer upload das imagens");
    }
  }, [id, buscarImagens, adicionarAviso]);

  // Mostrar loading
  if (loading) {
    return (
      <div id="DetalhesDoProduto">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Carregando dados do produto...
        </div>
      </div>
    );
  }

  // Mostrar erro
  if (error) {
    return (
      <div id="DetalhesDoProduto">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          {error}
          <br />
          <button onClick={() => navigate("/estoque")} style={{ marginTop: '1rem' }}>
            Voltar ao Estoque
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="DetalhesDoProduto">
      <h2>Detalhes do Produto</h2>
      <div id="InformaçõesGeraisProdutos">
        <div id="InputsInfoProdutos">
          <div className="divInputsContentInfoProdutos">
            <strong>Codigo de barras</strong>
            <input
              type="number"
              value={produto.codBarras}
              onChange={(e) => atualizarCampo('codBarras', e.target.value)}
              placeholder="Digite o código de barras"
            />
          </div>
          
          <div className="divInputsContentInfoProdutos">
            <strong>Nome</strong>
            <input
              type="text"
              value={produto.nomeProduto}
              onChange={(e) => atualizarCampo('nomeProduto', e.target.value)}
              placeholder="Nome do produto"
              required
            />
          </div>

          <div>
            <div className="divInputsContentInfoProdutos">
              <strong>Categoria</strong>
              <Select
                className="selectInputsContentInfoProdutos"
                options={categorias}
                value={categorias.find(option => option.label === produto.categoria) || null}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    atualizarCampo('categoria_id', selectedOption.value);
                    atualizarCampo('categoria', selectedOption.label);
                  } else {
                    atualizarCampo('categoria_id', '');
                    atualizarCampo('categoria', '');
                  }
                }}
                placeholder="Selecione uma categoria"
                isClearable
                noOptionsMessage={() => "Nenhuma categoria encontrada"}
              />
            </div>
            
            <div className="divInputsContentInfoProdutos">
              <strong>Descrição</strong>
              <textarea
                value={produto.descricao}
                onChange={(e) => atualizarCampo('descricao', e.target.value)}
                placeholder="Descrição do produto"
                rows={3}
              />
            </div>
          </div>
          
          <div>
            <div className="divInputsContentInfoProdutos">
              <strong>Preço de custo:</strong>
              <input
                type="number"
                step="0.01"
                min="0"
                value={produto.preco_custo}
                onChange={(e) => calculeValor("precoCompra", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="divInputsContentInfoProdutos">
              <strong>Markup (%):</strong>
              <input
                type="number"
                step="0.01"
                min="0"
                value={produto.markup}
                onChange={(e) => calculeValor("margem", e.target.value)}
                placeholder="0.00"
              />
            </div>
            
            <div className="divInputsContentInfoProdutos">
              <strong>Preço de Venda:</strong>
              <input
                type="number"
                step="0.01"
                min="0"
                value={produto.preco_venda}
                onChange={(e) => calculeValor("precoVenda", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <div className="checkbox-wrapper-4">
              <input
                className="inp-cbx"
                id="morning"
                type="checkbox"
                checked={produto.controlarEstoque}
                onChange={() => atualizarCampo('controlarEstoque', !produto.controlarEstoque)}
              />
              <label className="cbx" htmlFor="morning">
                <span>
                  <svg width="12px" height="10px">
                    <use href="#check-4"></use>
                  </svg>
                </span>
                <span>Controlar Estoque</span>
              </label>
              <svg className="inline-svg">
                <symbol id="check-4" viewBox="0 0 12 10">
                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </symbol>
              </svg>
            </div>
            
            <div id="ControleDeEstoque">
              <div className="ControleDeEstoqueInputs">
                <strong>Estoque Atual</strong>
                <input
                  type="number"
                  min="0"
                  value={produto.estoque_atual}
                  disabled={!produto.controlarEstoque}
                  onChange={(e) => atualizarCampo('estoque_atual', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="ControleDeEstoqueInputs">
                <strong>Estoque Mínimo</strong>
                <input
                  type="number"
                  min="0"
                  value={produto.estoque_minimo}
                  disabled={!produto.controlarEstoque}
                  onChange={(e) => atualizarCampo('estoque_minimo', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          {imagensProdutos.length > 0 ? (
            imagensProdutos.map((dados) => (
              <div key={dados.id} className="itemDeImagemInfoProduto">
                <div
                  className="ImageItemDeImagemInfoProduto"
                  style={{
                    backgroundImage: `url(http://localhost:3322/uploads/${dados.imagem_path})`,
                  }}
                />
                <div>
                  <p>{produto.nomeProduto || 'Produto sem nome'}</p>
                </div>
                <button 
                  onClick={() => deletarVariacao(dados.id)}
                  title="Excluir imagem"
                  type="button"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', opacity: 0.7 }}>
              Nenhuma imagem adicionada
            </div>
          )}

          <input
            type="file"
            multiple
            accept="image/*"
            className="imageProduto"
            id="InputFileInfoProdutos"
            ref={fileInputRef}
            onChange={HandleImageChange}
          />
        </div>

        <nav id="navInfoProdutos">
          <div>
            <button
              className="salvar"
              onClick={SalvarAlteracoesProduto}
              disabled={salvando}
              type="button"
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
            <button 
              className="cancelar" 
              onClick={() => navigate(-1)}
              type="button"
            >
              Cancelar
            </button>
          </div>

          <button
            id="buttonExcluirInfoProduto"
            onClick={() => DeletarProduto(id)}
            type="button"
          >
            <FaRegTrashAlt /> Excluir Produto
          </button>
        </nav>
      </div>
    </div>
  );
}

export default DetalhesDoProduto;