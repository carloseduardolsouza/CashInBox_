import "./InformaçõesGerais.css";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

//icones
import { FaRegTrashAlt } from "react-icons/fa";
import fetchapi from "../../../../api/fetchapi";

function InformaçõesGerais() {
  const { id } = useParams();
  const [imagensProdutosEdit, setImagensProdutosEdit] = useState([]);
  const [codBarrasEdit, setcodBarrasEdit] = useState("");
  const [nomeProdutoEdit, setNomeProdutoEdit] = useState("");
  const [descricaoEdit, setDescricaoEdit] = useState("");
  const [estoque_atualEdit, setEstoque_atualEdit] = useState("");
  const [estoque_minimoEdit, setEstoque_minimoEdit] = useState("");
  const [preco_custoEdit, setPreco_custoEdit] = useState("");
  const [markupEdit, setMarkupEdit] = useState("");
  const [preco_vendaEdit, setPreco_vendaEdit] = useState("");

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
    };

    const buscarImagens = async () => {
      const dadosImage = await fetchapi.listarImagens(id).then((response) => {
        setImagensProdutosEdit(response);
      });
    };
    buscarProduto();
    buscarImagens();
  }, [id]);

  return (
    <div id="InformaçõesGeraisProdutos">
      <div id="InputsInfoProdutos">
        <div className="divInputsContentInfoProdutos">
          <strong>Codigo de barras</strong>
          <input type="number" value={codBarrasEdit} />
        </div>
        <div className="divInputsContentInfoProdutos">
          <strong>Nome</strong>
          <input type="text" value={nomeProdutoEdit} />
        </div>

        <div>
          <div className="divInputsContentInfoProdutos">
            <strong>Categoria</strong>
            <Select className="selectInputsContentInfoProdutos" />
          </div>
          <div className="divInputsContentInfoProdutos">
            <strong>Marca</strong>
            <Select className="selectInputsContentInfoProdutos" />
          </div>
          <div className="divInputsContentInfoProdutos">
            <strong>Descrição</strong>
            <textarea type="text" value={descricaoEdit} />
          </div>
        </div>
        <div>
          <div className="divInputsContentInfoProdutos">
            <strong>Preço de custo:</strong>
            <input type="text" value={preco_custoEdit} />
          </div>
          <div className="divInputsContentInfoProdutos">
            <strong>Markup:</strong>
            <input type="text" value={markupEdit} />
          </div>
          <div className="divInputsContentInfoProdutos">
            <strong>Preço de Venda:</strong>
            <input type="text" value={preco_vendaEdit} />
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
              <input type="number" value={estoque_atualEdit} />
            </div>

            <div className="ControleDeEstoqueInputs">
              <strong>Estoque Minimo</strong>
              <input type="number" value={estoque_minimoEdit} />
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

              <button>
                <FaRegTrashAlt />
              </button>
            </div>
          );
        })}

        <input type="file" id="InputFileInfoProdutos" />
      </div>

      <nav id="navInfoProdutos">
        <div>
          <button className="salvar">Salvar</button>
          <button className="cancelar">Cancelar</button>
        </div>

        <button id="buttonExcluirInfoProduto">
          <FaRegTrashAlt /> Excluir Produto
        </button>
      </nav>
    </div>
  );
}

export default InformaçõesGerais;
