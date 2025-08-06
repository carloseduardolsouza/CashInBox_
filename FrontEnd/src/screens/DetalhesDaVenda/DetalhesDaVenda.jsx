import "./DetalhesDaVenda.css";
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import AppContext from "../../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import services from "../../services/services";
import { pdf } from "@react-pdf/renderer";

import Concluindo from "../../components/Concluindo/Concluindo";

// Ícones
import { BsFillSendFill } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";

import CarnePagamento from "../../components/NotaCarné/NotaCarne";
import NotaGrandeDetalhesVenda from "../../components/NotaGrandeDetalhesVenda/NotaGrandeDetalhesVenda";

import vendaFetch from "../../api/vendaFetch";
import clientesFetch from "../../api/clientesFetch";
import whatsappFetch from "../../api/whatsappFetch";

// Constantes
const TIPOS_NOTA = {
  NOTA_GRANDE: "NotaGrande",
  NOTA_PEQUENA: "NotaPequena",
  CARNE_CREDIARIO: "CarneCrediario"
};

const STATUS_VENDA = {
  CONCLUIDA: "concluida",
  ORCAMENTO: "orçamento"
};

function DetalhesDaVenda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { setErroApi, dadosLoja, Whastsapp, adicionarAviso } = useContext(AppContext);

  // Estados
  const [escolherNotas, setEscolherNotas] = useState(false);
  const [tipoNota, setTipoNota] = useState(null);
  const [concluindo, setConcluindo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados dos dados
  const [dadosVenda, setDadosVenda] = useState({
    venda: {},
    cliente: {},
    produtos: [],
    pagamentos: [],
    parcelas: []
  });

  // Função para carregar todos os dados da venda
  const carregarDados = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Buscar venda
      const vendaResponse = await vendaFetch.procurarVendaId(id);
      if (!vendaResponse?.length) {
        throw new Error("Venda não encontrada");
      }

      const vendaData = vendaResponse[0];

      // Buscar dados relacionados em paralelo
      const [clienteResponse, produtosResponse, pagamentosResponse] = await Promise.all([
        clientesFetch.procurarClienteId(vendaData.cliente_id),
        vendaFetch.procurarProdutosVenda(id),
        vendaFetch.procurarPagamentoVenda(id)
      ]);

      let parcelasData = [];
      // Buscar parcelas apenas se não estiver concluída
      if (vendaData.status !== STATUS_VENDA.CONCLUIDA) {
        parcelasData = await vendaFetch.listarVendasCrediarioVenda(id);
      }

      setDadosVenda({
        venda: vendaData,
        cliente: clienteResponse?.[0] || {},
        produtos: produtosResponse || [],
        pagamentos: pagamentosResponse || [],
        parcelas: parcelasData || []
      });

    } catch (error) {
      console.error("Erro ao carregar dados da venda:", error);
      setErroApi(true);
      adicionarAviso("erro", "Erro ao carregar dados da venda");
    } finally {
      setLoading(false);
    }
  }, [id, setErroApi, adicionarAviso]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Handler para cancelar venda
  const handleCancelarVenda = useCallback(async () => {
    if (!window.confirm("Tem certeza que deseja cancelar esta venda?")) {
      return;
    }

    try {
      await vendaFetch.deletarVenda(id);
      adicionarAviso("sucesso", "Venda cancelada com sucesso");
      navigate("/vendas");
    } catch (error) {
      console.error("Erro ao cancelar venda:", error);
      setErroApi(true);
      adicionarAviso("erro", "Erro ao cancelar venda");
    }
  }, [id, navigate, setErroApi, adicionarAviso]);

  // Dados para o carnê de pagamento memoizados
  const carnePagamentoDados = useMemo(() => ({
    logo: "URL_DA_IMAGEM",
    cliente: {
      nome: dadosVenda.cliente?.nome || "indefinido",
      endereco: dadosVenda.cliente?.endereco || "indefinido",
      cpf_cnpj: services.formatarCPF(dadosVenda.cliente?.cpf_cnpj || "indefinido"),
    },
    instrucoes: "Pague até a data de vencimento para evitar juros.",
    parcelas: dadosVenda.parcelas,
    emitente: dadosLoja.nomeEstabelecimento,
    data_emissao: services.formatarDataCurta(dadosVenda.venda.data_venda),
  }), [dadosVenda.cliente, dadosVenda.parcelas, dadosVenda.venda.data_venda, dadosLoja.nomeEstabelecimento]);

  // Handler para download de documentos
  const handleDownload = useCallback(async (tipoNota) => {
    let doc;

    switch (tipoNota) {
      case TIPOS_NOTA.NOTA_GRANDE:
        doc = (
          <NotaGrandeDetalhesVenda
            venda={dadosVenda.venda}
            cliente={dadosVenda.cliente}
            produtos={dadosVenda.produtos}
            dadosLoja={dadosLoja}
            pagamento={dadosVenda.pagamentos}
          />
        );
        break;

      case TIPOS_NOTA.NOTA_PEQUENA:
        adicionarAviso("aviso", "NotaPequena ainda não implementada");
        return;

      case TIPOS_NOTA.CARNE_CREDIARIO:
        doc = <CarnePagamento dados={carnePagamentoDados} />;
        break;

      default:
        console.error("Tipo de nota desconhecido:", tipoNota);
        return;
    }

    try {
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();

      const nomeArquivo = `venda#${id} - ${
        tipoNota === TIPOS_NOTA.CARNE_CREDIARIO
          ? "carnePagamento"
          : tipoNota === TIPOS_NOTA.NOTA_GRANDE
          ? "Nota Grande"
          : tipoNota
      }.pdf`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
      
      adicionarAviso("sucesso", "PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      adicionarAviso("erro", "Erro ao gerar PDF");
    }
  }, [dadosVenda, dadosLoja, carnePagamentoDados, id, adicionarAviso]);

  // Handler para enviar detalhes via WhatsApp
  const handleEnviarWhatsApp = useCallback(async () => {
    if (!dadosVenda.cliente?.telefone) {
      adicionarAviso("aviso", "Este cliente não tem número de WhatsApp cadastrado.");
      return;
    }

    if (!Whastsapp) {
      adicionarAviso("aviso", "Conecte seu WhatsApp primeiro.");
      return;
    }

    setConcluindo(true);

    const arrayDeProdutos = dadosVenda.produtos.map((produto) => ({
      nome: produto.produto_nome,
      quantidade: produto.quantidade,
      total: services.formatarCurrency(produto.valor_total),
    }));

    const tipoCompra = dadosVenda.venda.status === STATUS_VENDA.ORCAMENTO ? "orçamento" : "venda";

    const dados = {
      tipo: tipoCompra,
      numero: dadosVenda.cliente.telefone,
      mensagem: {
        cliente: dadosVenda.cliente.nome,
        numero_venda: id,
        valores: {
          total_bruto: services.formatarCurrency(dadosVenda.venda.total_bruto),
          descontos: dadosVenda.venda.descontos,
          acrescimos: dadosVenda.venda.acrescimos,
        },
        produtos: arrayDeProdutos,
        valor_total_compra: services.formatarCurrency(dadosVenda.venda.valor_total),
      },
    };

    try {
      const response = await whatsappFetch.enviarMensagem(dados);
      
      if (response.error === "Número não está registrado no WhatsApp") {
        adicionarAviso("erro", "ERRO - Número não está registrado no WhatsApp");
      } else {
        adicionarAviso("sucesso", "Mensagem enviada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem no WhatsApp:", error);
      setErroApi(true);
      adicionarAviso("erro", "Erro ao enviar mensagem no WhatsApp.");
    } finally {
      setTimeout(() => setConcluindo(false), 1500);
    }
  }, [dadosVenda, Whastsapp, id, adicionarAviso, setErroApi]);

  // Handler para alternar menu de notas
  const handleToggleNotas = useCallback(() => {
    setEscolherNotas(prev => !prev);
  }, []);

  // Handlers para download específico
  const handleDownloadNotaGrande = useCallback(() => {
    handleDownload(TIPOS_NOTA.NOTA_GRANDE);
    setEscolherNotas(false);
  }, [handleDownload]);

  const handleDownloadCarne = useCallback(() => {
    handleDownload(TIPOS_NOTA.CARNE_CREDIARIO);
    setEscolherNotas(false);
  }, [handleDownload]);

  // Componente da tabela de produtos memoizado
  const TabelaProdutos = useMemo(() => (
    <table className="Table">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Valor Unitário</th>
          <th>Quantidade</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {dadosVenda.produtos.map((produto, index) => (
          <tr key={produto.id || index}>
            <td>{produto.produto_nome}</td>
            <td>{services.formatarCurrency(produto.preco_unitario)}</td>
            <td>{produto.quantidade}</td>
            <td>{services.formatarCurrency(produto.valor_total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ), [dadosVenda.produtos]);

  // Componente de informações do cliente memoizado
  const InfoCliente = useMemo(() => (
    <div id="DivisãoClienteDetalhesDaVenda">
      <div>
        <div id="ImgClienteDetalhesDaVenda">
          <FaRegUser />
        </div>
      </div>

      <div>
        <p>
          <strong>Nome: </strong>
          {dadosVenda.cliente?.nome || "indefinido"}
        </p>
        <p>
          <strong>Número: </strong>
          {services.formatarNumeroCelular(dadosVenda.cliente?.telefone || "indefinido")}
        </p>
        <p>
          <strong>CPF: </strong>
          {services.formatarCPF(dadosVenda.cliente?.cpf_cnpj || "indefinido")}
        </p>
        <p>
          <strong>Endereço: </strong>
          {dadosVenda.cliente?.endereco || "indefinido"}
        </p>
      </div>
    </div>
  ), [dadosVenda.cliente]);

  // Lista de pagamentos memoizada
  const ListaPagamentos = useMemo(() => (
    dadosVenda.pagamentos.map((pagamento, index) => (
      <div key={pagamento.id || index}>
        {services.formatarCurrency(pagamento.valor)} : {pagamento.tipo_pagamento}
      </div>
    ))
  ), [dadosVenda.pagamentos]);

  // Menu de notas memoizado
  const MenuNotas = useMemo(() => (
    <div
      id="EscolherNotasArticle"
      style={{
        position: "absolute",
        bottom: "100%",
        left: 0,
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        zIndex: 10,
        overflow: "hidden",
        transform: escolherNotas ? "translateY(0)" : "translateY(10px)",
        opacity: escolherNotas ? 1 : 0,
        pointerEvents: escolherNotas ? "auto" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <p
        onClick={handleDownloadNotaGrande}
        style={{ cursor: "pointer", padding: "8px", margin: 0 }}
      >
        Nota Grande
      </p>
      {dadosVenda.venda.status !== STATUS_VENDA.CONCLUIDA && (
        <p
          onClick={handleDownloadCarne}
          style={{ cursor: "pointer", padding: "8px", margin: 0 }}
        >
          Carnê crediário
        </p>
      )}
    </div>
  ), [escolherNotas, dadosVenda.venda.status, handleDownloadNotaGrande, handleDownloadCarne]);

  if (loading) {
    return (
      <div id="DetalhesDaVenda">
        <div>Carregando dados da venda...</div>
      </div>
    );
  }

  return (
    <div id="DetalhesDaVenda">
      {concluindo && <Concluindo />}
      
      <button id="EnviarDetalhesVenda" onClick={handleEnviarWhatsApp}>
        <BsFillSendFill /> Enviar Detalhes
      </button>

      <div id="DetalhesDaVendaPage">
        {tipoNota === TIPOS_NOTA.NOTA_GRANDE && (
          <NotaGrandeDetalhesVenda
            venda={dadosVenda.venda}
            cliente={dadosVenda.cliente}
            produtos={dadosVenda.produtos}
            dadosLoja={dadosLoja}
            pagamento={dadosVenda.pagamentos}
          />
        )}
      </div>

      <div id="DetalhesDaVendaDisplay">
        <div id="DetalhesDaVendaDisplay1">
          <h2>Detalhes da Venda</h2>

          {InfoCliente}
          
          <div>
            {TabelaProdutos}
          </div>
        </div>

        <div id="DetalhesDaVendaDisplay2">
          <div id="DetalhesDaVendaDisplay2Pt1">
            <h2>{services.formatarCurrency(dadosVenda.venda.valor_total)}</h2>
            <span id="infoTempoDetalhesdaVenda">
              Venda # {dadosVenda.venda.id} -{" "}
              {services.formatarDataCurta(dadosVenda.venda.data_venda)} -{" "}
              {services.formatarHorario(dadosVenda.venda.data_venda)}
            </span>
          </div>

          <div id="DetalhesDaVendaDisplay2Pt2">
            <p>
              <strong>Total Bruto:</strong>{" "}
              {services.formatarCurrency(dadosVenda.venda.total_bruto)}
            </p>
            <p>
              <strong>Pagamento:</strong>
            </p>
            {ListaPagamentos}

            <p>
              <strong>Status:</strong> {dadosVenda.venda.status}
            </p>
            <p>
              <strong>Vendedor:</strong> {dadosVenda.venda.nome_funcionario}
            </p>
            <p>
              <strong>Descontos:</strong> {dadosVenda.venda.descontos}
            </p>
            <p>
              <strong>Acrescimos/Frete:</strong> {dadosVenda.venda.acrescimos}
            </p>
          </div>

          <div id="DetalhesDaVendaDisplay2Pt3">
            <p id="CancelarVendaDetalhesDaVenda" onClick={handleCancelarVenda}>
              Cancelar Venda
            </p>

            <div id="areaButtonsDetalhesVedna" style={{ position: "relative" }}>
              <button className="ButãoEditarDetalhesDaVenda ButãoDetalhesDaVenda">
                Editar
              </button>

              {MenuNotas}

              <button
                className="ButãoDetalhesDaVenda ButãoNotasDetalhesDaVenda"
                onClick={handleToggleNotas}
              >
                (NF-e / NFC-e)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesDaVenda;