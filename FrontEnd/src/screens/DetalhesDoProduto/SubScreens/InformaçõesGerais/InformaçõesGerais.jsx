import "./InformaçõesGerais.css";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AppContext from "../../../../context/AppContext";

import fetchapi from "../../../../api/fetchapi";
//icones
import { FaRegTrashAlt } from "react-icons/fa";

function InformaçõesGerais() {
  const { setErroApi } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoriaEdit, setCategoriaEdit] = useState("");
  const [categoria_idEdit, setCategoria_idEdit] = useState("");
  const [resultCategorias, setResultCategorias] = useState([]);
  const [imagensProdutosEdit, setImagensProdutosEdit] = useState([]);
  const [codBarrasEdit, setcodBarrasEdit] = useState("");
  const [nomeProdutoEdit, setNomeProdutoEdit] = useState("");
  const [descricaoEdit, setDescricaoEdit] = useState("");
  const [estoque_atualEdit, setEstoque_atualEdit] = useState("");
  const [estoque_minimoEdit, setEstoque_minimoEdit] = useState("");
  const [preco_custoEdit, setPreco_custoEdit] = useState("");
  const [markupEdit, setMarkupEdit] = useState("");
  const [preco_vendaEdit, setPreco_vendaEdit] = useState("");

  const buscarCategorias = async () => {
    try {
      const resultado = await fetchapi.listarCategorias();
      setResultCategorias(resultado);
    } catch (err) {
      setErroApi(true);
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, []);

  const categorias = resultCategorias.map((categoria) => ({
    value: categoria.id,
    label: categoria.nome,
  }));

  useEffect(() => {
    const buscarProduto = async () => {
      const dadosProduto = await fetchapi.ProcurarProdutoId(id);
      setNomeProdutoEdit(dadosProduto[0].nome);
      setDescricaoEdit(dadosProduto[0].descricao);
      setEstoque_atualEdit(dadosProduto[0].estoque_atual);
      setEstoque_minimoEdit(dadosProduto[0].estoque_minimo);
      setPreco_custoEdit(dadosProduto[0].preco_custo);
      setMarkupEdit(dadosProduto[0].markup);
      setPreco_vendaEdit(dadosProduto[0].preco_venda);
      setcodBarrasEdit(dadosProduto[0].codigo_barras);
      setCategoriaEdit(dadosProduto[0].categoria);
    };

    const buscarImagens = async () => {
      const dadosImage = await fetchapi.listarImagens(id).then((response) => {
        setImagensProdutosEdit(response);
      });
    };
    buscarProduto();
    buscarImagens();
  }, [id]);

  const deletarVariacao = async (id) => {
    try {
      await fetchapi.deletarVariacaoProduto(id);

      const dadosImage = await fetchapi.listarImagens(id);
      setImagensProdutosEdit(dadosImage);
    } catch (error) {
      console.error("Erro ao deletar variação:", error);
    }
  };

  const DeletarProduto = async (id) => {
    try {
      await fetchapi.DeletarProduto(id).then(() => {
        navigate("/estoque");
      });
    } catch {}
  };

  const calculeValor = (campo, valor) => {
    valor = parseFloat(valor) || 0;

    if (campo === "precoCompra") {
      setPreco_custoEdit(valor);
      const novoPrecoVenda = valor + (valor * markupEdit) / 100;
      setPreco_vendaEdit(novoPrecoVenda);
    } else if (campo === "margem") {
      setMarkupEdit(valor);
      const novoPrecoVenda = preco_custoEdit + (preco_custoEdit * valor) / 100;
      setPreco_vendaEdit(novoPrecoVenda);
    } else if (campo === "precoVenda") {
      setPreco_vendaEdit(valor);
      const novaMargem = ((valor - preco_custoEdit) / preco_custoEdit) * 100;
      setMarkupEdit(novaMargem);
    }
  };

  const SalvarAlteracoesProduto = (e) => {
    e.preventDefault();
    let dados = {
      id: id,
      nome: nomeProdutoEdit,
      descricao: descricaoEdit,
      codigo_barras: codBarrasEdit,
      preco_venda: preco_vendaEdit,
      preco_custo: preco_custoEdit,
      estoque_atual: estoque_atualEdit,
      estoque_minimo: estoque_minimoEdit,
      markup: markupEdit,
      categoria: categoriaEdit,
      categoria_id: categoria_idEdit,
      unidade_medida: "",
      ativo: "",
    };

    fetchapi
      .AtualizarProduto(dados)
      .then((resposta) => {})
      .catch((erro) => {
        setErroApi(true);
      });
  };

  return (
    <div id="InformaçõesGeraisProdutos">
      <div id="InputsInfoProdutos">
        <div className="divInputsContentInfoProdutos">
          <strong>Codigo de barras</strong>
          <input
            type="number"
            value={codBarrasEdit}
            onChange={(e) => setcodBarrasEdit(e.target.value)}
          />
        </div>
        <div className="divInputsContentInfoProdutos">
          <strong>Nome</strong>
          <input
            type="text"
            value={nomeProdutoEdit}
            onChange={(e) => setNomeProdutoEdit(e.target.value)}
          />
        </div>

        <div>
          <div className="divInputsContentInfoProdutos">
            <strong>Categoria</strong>
            <Select
              className="selectInputsContentInfoProdutos"
              options={categorias}
              value={categorias.find(
                (option) => option.label === categoriaEdit
              )}
              onChange={(e) => {
                setCategoria_idEdit(e.value);
                setCategoriaEdit(e.label);
              }}
            />
          </div>
          <div className="divInputsContentInfoProdutos">
            <strong>Descrição</strong>
            <textarea
              type="text"
              value={descricaoEdit}
              onChange={(e) => setDescricaoEdit(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="divInputsContentInfoProdutos">
            <strong>Preço de custo:</strong>
            <input
              type="text"
              value={preco_custoEdit}
              onChange={(e) => calculeValor("precoCompra", e.target.value)}
            />
          </div>
          <div className="divInputsContentInfoProdutos">
            <strong>Markup:</strong>
            <input
              type="text"
              value={markupEdit}
              onChange={(e) => calculeValor("margem", e.target.value)}
            />
          </div>
          <div className="divInputsContentInfoProdutos">
            <strong>Preço de Venda:</strong>
            <input
              type="text"
              value={preco_vendaEdit}
              onChange={(e) => calculeValor("precoVenda", e.target.value)}
            />
          </div>
        </div>

        <div>
          <div class="checkbox-wrapper-4">
            <input class="inp-cbx" id="morning" type="checkbox" />
            <label class="cbx" for="morning">
              <span>
                <svg width="12px" height="10px"></svg>
              </span>
              <span>Controlar Estoque</span>
            </label>
            <svg class="inline-svg">
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
                value={estoque_atualEdit}
                onChange={(e) => setEstoque_atualEdit(e.target.value)}
              />
            </div>

            <div className="ControleDeEstoqueInputs">
              <strong>Estoque Minimo</strong>
              <input
                type="number"
                value={estoque_minimoEdit}
                onChange={(e) => setEstoque_minimoEdit(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        {imagensProdutosEdit.map((dados) => {
          return (
            <div className="itemDeImagemInfoProduto">
              <div
                className="ImageItemDeImagemInfoProduto"
                style={{
                  backgroundImage: `url(http://localhost:3322/uploads/${dados.imagem_path})`,
                }}
              />
              <div>
                <p>
                  <strong>Cor:</strong> Vermelha
                </p>
              </div>

              <button onClick={() => deletarVariacao(dados.id)}>
                <FaRegTrashAlt />
              </button>
            </div>
          );
        })}

        <input type="file" id="InputFileInfoProdutos" />
      </div>

      <nav id="navInfoProdutos">
        <div>
          <button
            className="salvar"
            onClick={(e) => SalvarAlteracoesProduto(e)}
          >
            Salvar
          </button>
          <button className="cancelar" onClick={() => navigate("/estoque")}>
            Cancelar
          </button>
        </div>

        <button
          id="buttonExcluirInfoProduto"
          onClick={() => DeletarProduto(id)}
        >
          <FaRegTrashAlt /> Excluir Produto
        </button>
      </nav>
    </div>
  );
}

export default InformaçõesGerais;
