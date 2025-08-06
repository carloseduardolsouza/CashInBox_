import "./CaixaAtual.css";
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import AppContext from "../../../../context/AppContext";

import services from "../../../../services/services";
import ItemCaixaAtual from "./components/ItemCaixaAtual/ItemCaixaAtual";

// Ícones
import { FaMoneyBill1 } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";
import { FaCcMastercard } from "react-icons/fa6";
import { FaPix } from "react-icons/fa6";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";

// Componentes
import AdicionarSaldo from "./components/AdicionarSaldo/AdicionarSaldo";
import RetirarSaldo from "./components/RetirarSaldo/RetirarSaldo";
import SaldoInicial from "./components/SaldoInicial/SaldoInicial";
import FecharCaixa from "./components/FecharCaixa/FecharCaixa";

import caixaFetch from "../../../../api/caixaFetch";

// Constantes para tipos de aba
const ABAS = {
  SALDO_INICIAL: "SaldoInicial",
  FECHAR_CAIXA: "FecharCaixa",
  RETIRAR_SALDO: "RetirarSaldo",
  ADICIONAR_SALDO: "AdicionarSaldo"
};

const STATUS_CAIXA = {
  ABERTO: "Aberto",
  FECHADO: "Fechado"
};

// Configuração dos meios de pagamento
const MEIOS_PAGAMENTO = [
  { key: "dinheiro", icon: FaMoneyBill1, label: "Dinheiro" },
  { key: "cartão de credito", icon: FaCcMastercard, label: "Cartão de crédito" },
  { key: "cartão de debito", icon: FaCreditCard, label: "Cartão de débito" },
  { key: "cheque", icon: FaMoneyCheckAlt, label: "Cheque" },
  { key: "pix", icon: FaPix, label: "Pix" },
  { key: "crediario propio", icon: BsFillCreditCard2FrontFill, label: "Crediário" }
];

function CaixaAtual() {
  const { setErroApi } = useContext(AppContext);

  // Estados principais
  const [abaSobreposta, setAbaSobreposta] = useState(null);
  const [statusCaixa, setStatusCaixa] = useState(STATUS_CAIXA.FECHADO);
  const [movimentacoes, setMovimentacoes] = useState([]);

  // Estados dos dados do caixa
  const [dadosCaixa, setDadosCaixa] = useState({
    id: 0,
    dataAbertura: 0,
    saldoInicial: 0,
    valorEsperado: 0,
    saldoAdicionado: 0,
    saldoRetirada: 0,
    valoresCaixa: {}
  });

  // Função para buscar dados do caixa otimizada
  const buscarCaixasAbertos = useCallback(async () => {
    try {
      const response = await caixaFetch.buscarCaixasAbertos();
      
      if (Array.isArray(response) && response.length === 0) {
        setStatusCaixa(STATUS_CAIXA.FECHADO);
        setMovimentacoes([]);
        setDadosCaixa({
          id: 0,
          dataAbertura: 0,
          saldoInicial: 0,
          valorEsperado: 0,
          saldoAdicionado: 0,
          saldoRetirada: 0,
          valoresCaixa: {}
        });
        return;
      }

      if (response) {
        // Atualizar dados do caixa
        setDadosCaixa({
          id: response.id || 0,
          dataAbertura: response.data_abertura,
          saldoInicial: response.valor_abertura,
          valorEsperado: response.valor_esperado,
          saldoAdicionado: response.saldo_adicionado,
          saldoRetirada: response.saldo_retirada,
          valoresCaixa: response.resumo_caixa || {}
        });

        // Buscar movimentações
        const movimentacoess = await caixaFetch.buscarMovimentacao(response.id);
        setMovimentacoes(movimentacoess || []);
        setStatusCaixa(STATUS_CAIXA.ABERTO);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do caixa:", error);
      setErroApi(true);
      setStatusCaixa(STATUS_CAIXA.FECHADO);
    }
  }, [setErroApi]);

  // Effect para carregar dados iniciais
  useEffect(() => {
    buscarCaixasAbertos();
  }, [buscarCaixasAbertos]);

  // Handler para abrir/fechar caixa
  const handleAbrirFecharCaixa = useCallback(() => {
    const novaAba = statusCaixa === STATUS_CAIXA.ABERTO ? 
      ABAS.FECHAR_CAIXA : 
      ABAS.SALDO_INICIAL;
    setAbaSobreposta(novaAba);
  }, [statusCaixa]);

  // Handlers para ações de saldo
  const handleAdicionarSaldo = useCallback(() => {
    setAbaSobreposta(ABAS.ADICIONAR_SALDO);
  }, []);

  const handleRetirarSaldo = useCallback(() => {
    setAbaSobreposta(ABAS.RETIRAR_SALDO);
  }, []);

  // Renderizar aba sobreposta
  const renderAbaSobreposta = useCallback(() => {
    const props = {
      fecharAba: setAbaSobreposta,
      atualizar: buscarCaixasAbertos
    };

    switch (abaSobreposta) {
      case ABAS.SALDO_INICIAL:
        return (
          <SaldoInicial
            {...props}
            statusCaixa={setStatusCaixa}
          />
        );
      case ABAS.FECHAR_CAIXA:
        return (
          <FecharCaixa
            {...props}
            statusCaixa={setStatusCaixa}
            id={dadosCaixa.id}
          />
        );
      case ABAS.RETIRAR_SALDO:
        return (
          <RetirarSaldo
            {...props}
            idCaixa={dadosCaixa.id}
          />
        );
      case ABAS.ADICIONAR_SALDO:
        return (
          <AdicionarSaldo
            {...props}
            idCaixa={dadosCaixa.id}
          />
        );
      default:
        return null;
    }
  }, [abaSobreposta, dadosCaixa.id, buscarCaixasAbertos]);

  // Componente de resumo de caixa memoizado
  const ResumoCaixa = useMemo(() => (
    <div className="Resumodecaixa">
      <div>
        <h3>
          Resumo de Caixa #{" "}
          {dadosCaixa.dataAbertura ? 
            services.formatarData(dadosCaixa.dataAbertura) : 
            " - "}
        </h3>
        <p id="dataAberturaCaixa">
          Aberto hoje ({services.formatarHorario(dadosCaixa.dataAbertura)})
        </p>
      </div>

      {statusCaixa === STATUS_CAIXA.ABERTO ? (
        <div id="DetalhesResumoCaixa">
          <p>Saldo Inicial: {services.formatarCurrency(dadosCaixa.saldoInicial)}</p>
          <p>Saldo Adicionado: {services.formatarCurrency(dadosCaixa.saldoAdicionado)}</p>
          <p>Saldo Retirado: {services.formatarCurrency(dadosCaixa.saldoRetirada)}</p>
          <p>
            <strong>
              Saldo Final: {services.formatarCurrency(dadosCaixa.valorEsperado)}
            </strong>
          </p>
        </div>
      ) : (
        <div id="divFantasmaResumo" />
      )}

      <div id="areaButtonResumoCaixa">
        <button
          className="buttonRetiarAddSaldo"
          onClick={handleAdicionarSaldo}
          disabled={statusCaixa !== STATUS_CAIXA.ABERTO}
        >
          Adicionar Saldo
        </button>
        <button
          className="buttonRetiarAddSaldo"
          onClick={handleRetirarSaldo}
          disabled={statusCaixa !== STATUS_CAIXA.ABERTO}
        >
          Retirar Saldo
        </button>
      </div>
    </div>
  ), [dadosCaixa, statusCaixa, handleAdicionarSaldo, handleRetirarSaldo]);

  // Componente de meios de pagamento memoizado
  const MeiosPagamento = useMemo(() => (
    <div id="meiosDePagamentoDiv">
      <h3>Meios de pagamento</h3>
      {statusCaixa === STATUS_CAIXA.ABERTO ? (
        <div>
          {MEIOS_PAGAMENTO.map(({ key, icon: IconComponent, label }) => (
            <div key={key} className="formasDePagamentoCaixa">
              <IconComponent />
              <strong>{label}</strong>
              <p>{services.formatarCurrency(dadosCaixa.valoresCaixa?.[key] || 0)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div />
      )}
    </div>
  ), [statusCaixa, dadosCaixa.valoresCaixa]);

  // Componente de movimentações memoizado
  const ListaMovimentacoes = useMemo(() => (
    <div id="sectionrolavel">
      {movimentacoes.map((movimentacao) => (
        <ItemCaixaAtual 
          key={`${movimentacao.id}-${movimentacao.timestamp || Math.random()}`} 
          dados={movimentacao} 
        />
      ))}
    </div>
  ), [movimentacoes]);

  // Verificar se caixa está aberto
  const caixaAberto = statusCaixa === STATUS_CAIXA.ABERTO;

  return (
    <div id="CaixaAtual">
      {renderAbaSobreposta()}
      
      <div className="InfoDetalhasdasCaixaAtual">
        <div>
          {ResumoCaixa}
        </div>
        {MeiosPagamento}
      </div>

      <div className="InfoCaixaAtual">
        <h3>Movimentações</h3>
        {ListaMovimentacoes}

        <div className="FooterCaixaAtual">
          {caixaAberto ? (
            <div>
              <strong>Saldo Final</strong>
              <h1>{services.formatarCurrency(dadosCaixa.valorEsperado)}</h1>
            </div>
          ) : (
            <div id="divFantasmaTotalCaixa" />
          )}
          
          <button
            id="ButtonCaixa"
            onClick={handleAbrirFecharCaixa}
          >
            {caixaAberto ? "Fechar Caixa" : "Abrir Caixa"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaixaAtual;