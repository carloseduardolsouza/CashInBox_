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
  const [resultadoClientes, setResultadoClientes] = useState([]);
  const [resultadoVendedores, setResultadoVendedores] = useState([]);
  const [loading, setloading] = useState(true);
  const [concluindo, setConcluindo] = useState(false);
  const [statusVenda, setStatusVenda] = useState("concluida");

  const [faturado, setFaturado] = useState(false);
  const [nomeVendedor, setNomeVendedor] = useState("'Vendedor...'");

  const [id, setId] = useState();
  const [nomeInfoClient, setNomeInfoClient] = useState("'NOME'");
  const [telefoneInfoClient, setTelefoneInfoClient] = useState("'TELEFONE'");
  const [idCliente, setIdCliente] = useState();
  const [idProduto, setIdProduto] = useState();
  const [idVendedor, setIdVendedor] = useState(0);
  const [INFOclient, setINFOclient] = useState({
    name: "DESCONHECIDO",
    telefone: "DESCONHECIDO",
  });

  const [desconto, setDesconto] = useState(0);
  const [quantidade, setQuantidade] = useState(1);
  const [pagamento, setPagamento] = useState();
  const [preçoComDesconto, setPreçoComDesconto] = useState(0);
  const [percem, setPercem] = useState(false);

  const [produto, setProduto] = useState("'Produto'");
  const [precovenda, setPreçovenda] = useState("'Preço'");
  const [emestoque, setEmestoque] = useState("'Em estoque'");

  const [alert, setAlert] = useState(false);
  const [desable, setDesable] = useState(false);
  const [venda, setVenda] = useState([]);
  const [descontoFormatado, setDescontoFormatado] = useState();

  useEffect(() => {
    fetchapi.ProcurarCliente("all").then((response) => {
      setResultadoClientes(response);
    });
  }, []);

  useEffect(() => {
    fetchapi.ProcurarProdutos("all").then((response) => {
      setResultadoProdutos(response);
      setloading(false);
    });
  }, []);

  function gerarNumeroUnico() {
    return new Date().getTime(); // Retorna o timestamp atual
  }

  const localeVenda = gerarNumeroUnico();

  const renderInfoClient = async (e) => {
    setloading(true);
    setId(e.value);
    const infoClient = await fetchapi.ProcurarClienteId(e.value);
    const { name, telefone, id } = infoClient[0];
    setNomeInfoClient(name);
    setIdCliente(id);
    setTelefoneInfoClient(telefone);
    setloading(false);
    setINFOclient(infoClient[0]);
  };

  const optionsProdutos = [];

  resultadoProdutos.map((resultProdutos) => {
    optionsProdutos.push({
      value: resultProdutos.id,
      label: resultProdutos.nome,
    });
  });

  const renderInfoProduto = async (e) => {
    setloading(true);
    setId(e.value);
    const infoClient = await fetchapi.ProcurarProdutosId(e.value);
    const { id, produto, preçovenda, emestoque } = infoClient[0];
    setProduto(produto);
    setPreçovenda(+preçovenda);
    setEmestoque(emestoque);
    setloading(false);
    setIdProduto(id);
  };

  /*const calcularPrice = () => {
    if (idProduto == "" || idProduto == undefined || idProduto == null) {
      setAlert(true);
      return;
    }
    if (percem) {
      var preçodaporcentagem = (desconto / 100) * (precovenda * quantidade);
      var porcentagemPorcentagem = precovenda * quantidade - preçodaporcentagem;
      setPreçoComDesconto(porcentagemPorcentagem);
      setDescontoFormatado(
        `${desconto}% / ${services.formatarCurrency(preçodaporcentagem)}`
      );
    } else {
      var porcentagemReais = precovenda * quantidade - desconto;
      var preçodareais = (desconto / precovenda) * 100;
      setPreçoComDesconto(porcentagemReais);
      setDescontoFormatado(
        `${preçodareais.toFixed(1)}% / ${services.formatarCurrency(desconto)}`
      );
    }
  };*/

  const LançarAVenda = () => {
    if (id == "" || id == undefined || id == null) {
      setAlert(true);
      return;
    }
    if (preçoComDesconto == 0) {
      setAlert(true);
      return;
    }

    const objectVenda = {
      date: Data,
      status: statusVenda,
      id_cliente: +idCliente,
      id_produto: +idProduto,
      id_vendedor: idVendedor,
      pagamento: pagamento,
      produto: produto,
      preço_und: precovenda,
      quantidade: quantidade,
      preço: preçoComDesconto,
      desconto: descontoFormatado,
      rastreio: "",
      total: "",
    };

    if (idCliente == "" || idCliente == undefined || idCliente == null) {
      objectVenda.id_cliente = 0;
    }

    if (pagamento == "" || pagamento == undefined || pagamento == null) {
      objectVenda.pagamento = "Dinheiro";
    }

    setVenda([...venda, objectVenda]);
    setDesconto(0);
    setQuantidade(1);
    setPreçoComDesconto(0);
    setPagamento();
    setId();
    setProduto();
    setPreçovenda();
    setEmestoque();
  };

  const Feature = () => {
    if (venda.length == 0) {
      setAlert(true);
      return;
    }
    if (idVendedor == 0) {
      setAlert(true);
      return;
    }
    const ratrear = `${Data.getDate()}${Data.getMonth()}${Data.getFullYear()}`;

    venda.map((venda) => {
      venda.rastreio = `${ratrear}${localeVenda}`;
    });

    venda.map((venda) => {
      venda.status = statusVenda;
    });

    venda.map((venda) => {
      venda.id_vendedor = idVendedor;
    });

    setDesable(true);
    setFaturado(true);
  };

  const handleKeyDown = (event) => {
    if (event.key == "F2") {
      Feature();
    }
  };

  const deleteItem = (idIndex) => {
    const novaVenda = [...venda]; // Cria uma nova referência para o array
    novaVenda.splice(idIndex, 1); // Remove o item
    setVenda(novaVenda); // Atualiza o estado com o novo array
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
            onChange={(e) => `` /*renderInfoProduto(e)*/}
            isDisabled={desable}
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
                <p>{`` /*services.formatarCurrency(precovenda)*/}</p>
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
                  onChange={(e) => setQuantidade(e.target.value)}
                  value={quantidade}
                  disabled={desable}
                />
              </label>
            </form>
          </div>
          <label className="statusVenda">
            <strong>Status: </strong>
            <select
              className="SelectStatusVenda"
              onChange={(e) => setStatusVenda(e.target.value)}
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
          {venda.map(
            (venda, index) => `` /*<ProdutosNovaVenda
              data={venda}
              index={index}
              deleter={deleteItem}
            />*/
          )}
          <button
            className="FaturarNovaVenda"
            onClick={() => setFaturado(true)}
            disabled={desable}
          >
            (F2) - Faturar
          </button>
        </div>
      </main>
    </div>
  );
}

export default PontoDeVenda;
