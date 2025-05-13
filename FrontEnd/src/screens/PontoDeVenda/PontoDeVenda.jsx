import "./PontoDeVenda.css";
import { useState, useEffect } from "react";

//Servicos
import fetchapi from "../../api/fetchapi.js";
import services from "../../services/services.js";

//Componentes
import FaturarVenda from "./components/FaturarVenda/FaturarVenda";

//Biblioteca
import Select from "react-select";

function PontoDeVenda() {
  const Data = new Date();
  const log = `${Data.getUTCDate()}/${
    Data.getUTCMonth() + 1
  }/${Data.getUTCFullYear()}`;

  const [resultadoProdutos, setResultadoProdutos] = useState([]);
  const [faturado , setFaturado] = useState(false)

  const [produto, setProduto] = useState("'Produto'");
  const [precovenda, setPreçovenda] = useState("'Preço'");
  const [emestoque, setEmestoque] = useState("'Em estoque'");

  useEffect(() => {
    fetchapi.ProcurarProdutos("all").then((response) => {
      setResultadoProdutos(response);
    });
  }, []);

  const optionsProdutos = [];

  resultadoProdutos.map((resultProdutos , index) => {
    optionsProdutos.push({
      value: index,
      label: resultProdutos.nome,
    });
  });

  const renderInfoProduto = async (e) => {
    const {nome , estoque_atual , preco_venda} = resultadoProdutos[e.value]
    setProduto(nome)
    setEmestoque(estoque_atual)
    setPreçovenda(preco_venda)
  };


  const handleKeyDown = (event) => {
    if (event.key == "F2") {
    }
  };

  return (
    <div id="NOVAVENDA" tabIndex={0} onKeyDown={handleKeyDown}>
      {faturado && <FaturarVenda fechar={setFaturado} />}
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
                />
              </label>
            </form>
          </div>
          <label className="statusVenda">
            <strong>Status: </strong>
            <select
              className="SelectStatusVenda"
            >
              <option value="concluida">concluida</option>
              <option value="entregar">entregar</option>
              <option value="pagar e entregar">pagar e entregar</option>
            </select>
          </label>
          <div className="PreçoNovaVenda">
            <h1>Total : {/*services.formatarCurrency(preçoComDesconto)*/}</h1>
          </div>
        </div>
        <div className="ProdutosNovaVenda">

          <button
            className="FaturarNovaVenda"
            onClick={() => setFaturado(true)}
          >
            (F2) - Faturar
          </button>
        </div>
      </main>
    </div>
  );
}

export default PontoDeVenda;
