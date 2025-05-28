import "./PontoDeVenda.css";
import { useState, useEffect , useContext } from "react";
import AppContext from "../../context/AppContext.js"

//icones
import { FaTrash } from "react-icons/fa6";

//Servicos
import fetchapi from "../../api/fetchapi.js";
import services from "../../services/services.js";

//Componentes
import FaturarVenda from "./components/FaturarVenda/FaturarVenda";

//Biblioteca
import Select from "react-select";

function PontoDeVenda() {
  const {setErroApi} = useContext(AppContext)

  const Data = new Date();
  const log = `${Data.getUTCDate()}/${
    Data.getUTCMonth() + 1
  }/${Data.getUTCFullYear()}`;

  const [resultadoProdutos, setResultadoProdutos] = useState([]);
  const [faturado, setFaturado] = useState(false);

  const [produto, setProduto] = useState("'Produto'");
  const [precovenda, setPreçovenda] = useState("'Preço'");
  const [emestoque, setEmestoque] = useState("'Em estoque'");
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);
  const [id_produto, setId_produto] = useState("");

  const [arrayVenda, setArrayVenda] = useState([]);

  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    fetchapi.ProcurarProdutos("all").then((response) => {
      setResultadoProdutos(response);
    }).catch(() => {
      setErroApi(true)
    });
  }, []);

  const optionsProdutos = [];

  resultadoProdutos.map((resultProdutos, index) => {
    optionsProdutos.push({
      value: index,
      label: resultProdutos.nome,
    });
  });

  const renderInfoProduto = async (e) => {
    const { nome, estoque_atual, preco_venda, id } = resultadoProdutos[e.value];
    setProduto(nome);
    setId_produto(id);
    setEmestoque(estoque_atual);
    setPreçovenda(preco_venda);
  };

  const handleKeyDown = (event) => {
    if (event.key == "F2") {
    }
  };

  const adidiconarArrayDeVenda = (e) => {
    e.preventDefault();
    // Verifica se precovenda é um número válido
    if (isNaN(precovenda) || isNaN(quantidadeProduto)) {
      console.warn("Preço ou quantidade inválidos.");
      return;
    }

    let objetoDaVenda = {
      produto_id: id_produto,
      produto_nome: produto,
      quantidade: quantidadeProduto,
      preco_unitario: precovenda,
      valor_total: precovenda * quantidadeProduto,
    };
    setArrayVenda([...arrayVenda, objetoDaVenda]);
    setValorTotal(
      (prevValorTotal) => prevValorTotal + precovenda * quantidadeProduto
    );
  };

  const deleteItem = (idIndex, valorMenos) => {
    const novaVenda = [...arrayVenda]; // Cria uma nova referência para o array
    novaVenda.splice(idIndex, 1); // Remove o item
    setArrayVenda(novaVenda); // Atualiza o estado com o novo array
    setValorTotal((prevValorTotal) => prevValorTotal - valorMenos);
  };

  return (
    <div id="NOVAVENDA" tabIndex={0} onKeyDown={handleKeyDown}>
      {faturado && (
        <FaturarVenda
          fechar={setFaturado}
          venda={arrayVenda}
          limparVenda={setArrayVenda}
          limparValor={setValorTotal}
        />
      )}
      <header>
        <h2>Nova Venda</h2>
        <p>{log}</p>
      </header>
      <main className="MainNovaVenda">
        <div>
          <Select
            className="SelectNovaVenda"
            placeholder="Produto"
            options={optionsProdutos}
            onChange={(e) => renderInfoProduto(e)}
          />
          <div className="DivisãoNovaVenda">
            <div>
              <label className="NovaVendaLabel">
                <p className="NovanVendaStrong">
                  <strong>Produto</strong>
                </p>
                <p>{produto}</p>
              </label>
              <label className="NovaVendaLabel">
                <p className="NovanVendaStrong">
                  <strong>Preço</strong>
                </p>
                <p>{services.formatarCurrency(precovenda)}</p>
              </label>
            </div>
            <form>
              <label className="NovaVendaLabel">
                <p className="NovanVendaStrong">
                  <strong>Em Estoque</strong>
                </p>
                <p>{emestoque}</p>
              </label>
              <label className="NovaVendaLabel">
                <p className="NovanVendaStrong">
                  <strong>Quantidade</strong>
                </p>
                <input
                  type="number"
                  value={quantidadeProduto}
                  onChange={(e) => setQuantidadeProduto(e.target.value)}
                />
              </label>
              <button
                id="buttonOkPontoDeVenda"
                onClick={(e) => adidiconarArrayDeVenda(e)}
              >
                OK
              </button>
            </form>
          </div>
          <div className="PreçoNovaVenda">
            <h1>Total : {services.formatarCurrency(valorTotal)}</h1>
          </div>
        </div>
        <div className="ProdutosNovaVenda">
          <table className="Table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço Unitario</th>
                <th>Quantidade</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {arrayVenda.map((venda, index) => {
                return (
                  <tr>
                    <td>{venda.produto_nome}</td>
                    <td>{services.formatarCurrency(venda.preco_unitario)}</td>
                    <td>{venda.quantidade}</td>
                    <td>{services.formatarCurrency(venda.valor_total)}</td>
                    <td>
                      <button
                        className="buttonDeleteArrayVenda"
                        onClick={() => deleteItem(index, venda.valor_total)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="FaturarNovaVenda"
            onClick={() => {
              if (arrayVenda.length === 0) {
                return;
              } else {
                setFaturado(true);
              }
            }}
          >
            (F2) - Faturar
          </button>
        </div>
      </main>
    </div>
  );
}

export default PontoDeVenda;
