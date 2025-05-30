import "./CaixaAtual.css";
import { useState, useEffect , useContext } from "react";
import AppContext from "../../../../context/AppContext";

import services from "../../../../services/services";

import ItemCaixaAtual from "./components/ItemCaixaAtual/ItemCaixaAtual";

//icones
import { FaMoneyBill1 } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";
import { FaCcMastercard } from "react-icons/fa6";
import { FaPix } from "react-icons/fa6";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";

//componentes
import AdicionarSaldo from "./components/AdicionarSaldo/AdicionarSaldo";
import RetirarSaldo from "./components/RetirarSaldo/RetirarSaldo";
import SaldoInicial from "./components/SaldoInicial/SaldoInicial";
import FecharCaixa from "./components/FecharCaixa/FecharCaixa";

import fetchapi from "../../../../api/fetchapi";

function CaixaAtual() {
  const {setErroApi} = useContext(AppContext)

  const [abaSobreposta, setAbaSobreposta] = useState(null);
  const [statusCaixa, setStatusCaixa] = useState("Fechado");

  const [data_abertura, setData_abertura] = useState(0);
  const [saldo_inicial, setSaldo_inicial] = useState(0);
  const [valor_esperado, setValor_esperado] = useState(0);
  const [saldo_adicionado, setSaldo_adicionado] = useState(0);
  const [saldo_retirada, setSaldo_retirada] = useState(0);
  const [idCaixa, setIdCaixa] = useState(0);

  const [movimentacoes, setMovimentacoes] = useState([]);

  const BuscarCaixasAbertosPage = async () => {
    const response = await fetchapi.BuscarCaixasAbertos().catch(() => setErroApi(true));
    const caixa = response[0];
    setIdCaixa(caixa.id || 0);
    setSaldo_inicial(caixa.valor_abertura);
    setValor_esperado(caixa.valor_esperado);
    setSaldo_adicionado(caixa.saldo_adicionado);
    setSaldo_retirada(caixa.saldo_retirada);
    setData_abertura(caixa.data_abertura);

    if (response.length === 0) {
      setStatusCaixa("Fechado");
      setMovimentacoes([]);
      return;
    }

    if (response.length > 0) {
      const movimentacoess = await fetchapi.BuscarMovimentacao(caixa.id);
      setMovimentacoes(movimentacoess);
      setStatusCaixa("Aberto");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await BuscarCaixasAbertosPage();
      } catch (error) {
        console.error("Erro ao buscar dados do caixa:", error);
        setStatusCaixa("Fechado");
      }
    };

    fetchData();
  }, []);

  const renderAbaSobreposta = () => {
    switch (abaSobreposta) {
      case "SaldoInicial":
        return (
          <SaldoInicial
            fecharAba={setAbaSobreposta}
            statusCaixa={setStatusCaixa}
            atualizar={BuscarCaixasAbertosPage}
          />
        );
      case "FecharCaixa":
        return (
          <FecharCaixa
            fecharAba={setAbaSobreposta}
            statusCaixa={setStatusCaixa}
            atualizar={BuscarCaixasAbertosPage}
            id={idCaixa}
          />
        );
      case "RetirarSaldo":
        return (
          <RetirarSaldo
            fecharAba={setAbaSobreposta}
            atualizar={BuscarCaixasAbertosPage}
            idCaixa={idCaixa}
          />
        );
      case "AdicionarSaldo":
        return (
          <AdicionarSaldo
            fecharAba={setAbaSobreposta}
            atualizar={BuscarCaixasAbertosPage}
            idCaixa={idCaixa}
          />
        );
      case null:
        return null;
    }
  };

  const AbirFecharCaixa = () => {
    if (statusCaixa == "Aberto") {
      setAbaSobreposta("FecharCaixa");
    } else {
      setAbaSobreposta("SaldoInicial");
    }
  };

  return (
    <div id="CaixaAtual">
      {renderAbaSobreposta()}
      <div className="InfoDetalhasdasCaixaAtual">
        <div>
          <div className="Resumodecaixa">
            <div>
              <h3>Resumo de Caixa # {services.formatarData(data_abertura)}</h3>
              <p id="dataAberturaCaixa">
                Aberto hoje ({services.formatarHorario(data_abertura)})
              </p>
            </div>
            {statusCaixa === "Aberto" ? (
              <div id="DetalhesResumoCaixa">
                <p>Saldo Inicial: {services.formatarCurrency(saldo_inicial)}</p>
                <p>
                  Saldo Adicionado:{" "}
                  {services.formatarCurrency(saldo_adicionado)}
                </p>
                <p>
                  Saldo Retirado: {services.formatarCurrency(saldo_retirada)}
                </p>
                <p>
                  <strong>
                    Saldo Final: {services.formatarCurrency(valor_esperado)}
                  </strong>
                </p>
              </div>
            ) : (
              <div id="divFantasmaResumo" />
            )}

            <div id="areaButtonResumoCaixa">
              <button
                className="buttonRetiarAddSaldo"
                onClick={() => setAbaSobreposta("AdicionarSaldo")}
                disabled={statusCaixa === "Aberto" ? false : true}
              >
                Adicionar Saldo
              </button>
              <button
                className="buttonRetiarAddSaldo"
                onClick={() => setAbaSobreposta("RetirarSaldo")}
                disabled={statusCaixa === "Aberto" ? false : true}
              >
                Retirar Saldo
              </button>
            </div>
          </div>
        </div>
        <div id="meiosDePagamentoDiv">
          <h3>Meios de pagamento</h3>
          {statusCaixa === "Aberto" ? (
            <div>
              <div className="formasDePagamentoCaixa">
                <FaMoneyBill1 />
                <strong>Dinheiro</strong>
                <p>{"R$ 200,00"}</p>
              </div>
              <div className="formasDePagamentoCaixa">
                <FaCcMastercard />
                <strong>Cartão de credito</strong>
                <p>{"R$ 200,00"}</p>
              </div>
              <div className="formasDePagamentoCaixa">
                <FaCreditCard />
                <strong>Cartão de debito</strong>
                <p>{"R$ 200,00"}</p>
              </div>
              <div className="formasDePagamentoCaixa">
                <FaMoneyCheckAlt />
                <strong>Cheque</strong>
                <p>{"R$ 200,00"}</p>
              </div>
              <div className="formasDePagamentoCaixa">
                <FaPix />
                <strong>Pix</strong>
                <p>{"R$ 200,00"}</p>
              </div>
              <div className="formasDePagamentoCaixa">
                <BsFillCreditCard2FrontFill />
                <strong>Crediario</strong>
                <p>{"R$ 200,00"}</p>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <div className="InfoCaixaAtual">
        <h3>Movimentações</h3>
        <div id="sectionrolavel">
          {movimentacoes.map((response) => {
            return <ItemCaixaAtual dados={response} />;
          })}
        </div>

        <div className="FooterCaixaAtual">
          {statusCaixa === "Aberto" ? (
            <div>
              <strong>Saldo Final</strong>
              <h1>{services.formatarCurrency(valor_esperado)}</h1>
            </div>
          ) : (
            <div id="divFantasmaTotalCaixa" />
          )}
          <button
            id="ButtonCaixa"
            onClick={() => {
              AbirFecharCaixa();
            }}
          >
            {statusCaixa === "Fechado" ? "Abrir Caixa" : "Fechar Caixa"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaixaAtual;
