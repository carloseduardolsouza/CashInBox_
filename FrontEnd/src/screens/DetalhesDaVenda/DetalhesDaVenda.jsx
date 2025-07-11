import "./DetalhesDaVenda.css";
import { useState, useEffect, useContext } from "react";
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

function DetalhesDaVenda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { setErroApi, dadosLoja, Whastsapp, adicionarAviso } =
    useContext(AppContext);

  const [escolherNotas, setEscolherNotas] = useState(false);
  const [tipoNota, setTipoNota] = useState(null);
  const [concluindo, setConcluindo] = useState(false);

  const [venda, setVenda] = useState({});
  const [cliente, setCliente] = useState({});
  const [produtos, setProdutos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [parcelas, setParcelas] = useState([]);

  const carregarDados = async () => {
    try {
      const vendaResponse = await vendaFetch.procurarVendaId(id);
      console.log(vendaResponse);
      setVenda(vendaResponse[0]);

      const clienteResponse = await clientesFetch.procurarClienteId(
        vendaResponse[0].cliente_id
      );

      setCliente(clienteResponse[0]);

      const produtosResponse = await vendaFetch.procurarProdutosVenda(id);
      setProdutos(produtosResponse);

      const pagamentosResponse = await vendaFetch.procurarPagamentoVenda(id);
      setPagamentos(pagamentosResponse);

      if (vendaResponse[0].status != "concluida") {
        const parcelasResponse = await vendaFetch.listarVendasCrediarioVenda(
          id
        );
        setParcelas(parcelasResponse);
      }
    } catch (error) {
      console.error("Erro ao carregar dados da venda:", error);
      setErroApi(true);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const cancelarVenda = async () => {
    try {
      await vendaFetch.deletarVenda(id);
      navigate("/vendas");
    } catch (error) {
      console.error("Erro ao cancelar venda:", error);
      setErroApi(true);
    }
  };

  const CarnePagamentoDados = {
    logo: "URL_DA_IMAGEM",
    cliente: {
      nome: cliente?.nome || "indefinido",
      endereco: cliente?.endereco || "indefinido",
      cpf_cnpj: services.formatarCPF(cliente?.cpf_cnpj || "indefinido"),
    },
    instrucoes: "Pague até a data de vencimento para evitar juros.",
    parcelas: parcelas,
    emitente: dadosLoja.nomeEstabelecimento,
    data_emissao: services.formatarDataCurta(venda.data_venda),
  };

  const handleDownload = async (tipoNota) => {
    let doc;

    switch (tipoNota) {
      case "NotaGrande":
        doc = (
          <NotaGrandeDetalhesVenda
            venda={venda}
            cliente={cliente}
            produtos={produtos}
            dadosLoja={dadosLoja}
            pagamento={pagamentos}
          />
        );
        break;

      case "NotaPequena":
        console.warn("NotaPequena ainda não implementada");
        return;

      case "CarneCrediario":
        doc = <CarnePagamento dados={CarnePagamentoDados} />;
        break;

      default:
        console.error("Tipo de nota desconhecido:", tipoNota);
        return;
    }

    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `venda#${id} - ${
      tipoNota === "CarneCrediario"
        ? "carnePagamento"
        : tipoNota === "NotaGrande"
        ? "Nota Grande"
        : tipoNota
    }.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const enviarDetalhesWhatsApp = async () => {
    if (!cliente?.telefone) {
      adicionarAviso(
        "aviso",
        "Este cliente não tem número de WhatsApp cadastrado."
      );
      return;
    }

    if (Whastsapp !== true) {
      adicionarAviso("aviso", "Conecte seu WhatsApp primeiro.");
      return;
    }

    setConcluindo(true);

    const arrayDeProdutos = produtos.map((dados) => ({
      nome: dados.produto_nome,
      quantidade: dados.quantidade,
      total: services.formatarCurrency(dados.valor_total),
    }));

    const typeCompra = () => {
      if (venda.status === "orçamento") {
        return "orçamento";
      } else {
        return "venda";
      }
    };

    const dados = {
      tipo: typeCompra(),
      numero: cliente.telefone,
      mensagem: {
        cliente: cliente.nome,
        numero_venda: id,
        valores: {
          total_bruto: services.formatarCurrency(venda.total_bruto),
          descontos: venda.descontos,
          acrescimos: venda.acrescimos,
        },
        produtos: arrayDeProdutos,
        valor_total_compra: services.formatarCurrency(venda.valor_total),
      },
    };

    try {
      await whatsappFetch
        .enviarMensagem(dados)
        .then((response) => {
          if (response.error === "Número não está registrado no WhatsApp") {
            adicionarAviso("erro", "ERRO - Número não está registrado no WhatsApp");
          }
        })
        .catch((error) => {
          console.error("Erro ao enviar mensagem no WhatsApp:", error);
          setErroApi(true);
          window.alert("Erro ao enviar mensagem no WhatsApp.");
        });
    } finally {
      setTimeout(() => setConcluindo(false), 1500);
    }
  };

  return (
    <div id="DetalhesDaVenda">
      {concluindo && <Concluindo />}
      <button id="EnviarDetalhesVenda" onClick={enviarDetalhesWhatsApp}>
        <BsFillSendFill /> Enviar Detalhes
      </button>

      <div id="DetalhesDaVendaPage">
        {tipoNota === "NotaGrande" && (
          <NotaGrandeDetalhesVenda
            venda={venda}
            cliente={cliente}
            produtos={produtos}
            dadosLoja={dadosLoja}
            pagamento={pagamentos}
          />
        )}
      </div>

      <div id="DetalhesDaVendaDisplay">
        <div id="DetalhesDaVendaDisplay1">
          <h2>Detalhes da Venda</h2>

          <div id="DivisãoClienteDetalhesDaVenda">
            <div>
              <div id="ImgClienteDetalhesDaVenda">
                <FaRegUser />
              </div>
            </div>

            <div>
              <p>
                <strong>Nome: </strong>
                {cliente?.nome || "indefinido"}
              </p>
              <p>
                <strong>Número: </strong>
                {services.formatarNumeroCelular(
                  cliente?.telefone || "indefinido"
                )}
              </p>
              <p>
                <strong>CPF: </strong>
                {services.formatarCPF(cliente?.cpf_cnpj || "indefinido")}
              </p>
              <p>
                <strong>Endereço: </strong>
                {cliente?.endereco || "indefinido"}
              </p>
            </div>
          </div>

          <div>
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
                {produtos.map((produto, index) => (
                  <tr key={index}>
                    <td>{produto.produto_nome}</td>
                    <td>{services.formatarCurrency(produto.preco_unitario)}</td>
                    <td>{produto.quantidade}</td>
                    <td>{services.formatarCurrency(produto.valor_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="DetalhesDaVendaDisplay2">
          <div id="DetalhesDaVendaDisplay2Pt1">
            <h2>{services.formatarCurrency(venda.valor_total)}</h2>
            <span id="infoTempoDetalhesdaVenda">
              Venda # {venda.id} -{" "}
              {services.formatarDataCurta(venda.data_venda)} -{" "}
              {services.formatarHorario(venda.data_venda)}
            </span>
          </div>

          <div id="DetalhesDaVendaDisplay2Pt2">
            <p>
              <strong>Total Bruto:</strong>{" "}
              {services.formatarCurrency(venda.total_bruto)}
            </p>
            <p>
              <strong>Pagamento:</strong>
            </p>
            {pagamentos.map((dados, index) => (
              <div key={index}>
                {services.formatarCurrency(dados.valor)} :{" "}
                {dados.tipo_pagamento}
              </div>
            ))}

            <p>
              <strong>Status:</strong> {venda.status}
            </p>
            <p>
              <strong>Vendedor:</strong> {venda.nome_funcionario}
            </p>
            <p>
              <strong>Descontos:</strong> {venda.descontos}
            </p>
            <p>
              <strong>Acrescimos/Frete:</strong> {venda.acrescimos}
            </p>
          </div>

          <div id="DetalhesDaVendaDisplay2Pt3">
            <p id="CancelarVendaDetalhesDaVenda" onClick={cancelarVenda}>
              Cancelar Venda
            </p>

            <div id="areaButtonsDetalhesVedna" style={{ position: "relative" }}>
              <button className="ButãoEditarDetalhesDaVenda ButãoDetalhesDaVenda">
                Editar
              </button>

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
                  transform: escolherNotas
                    ? "translateY(0)"
                    : "translateY(10px)",
                  opacity: escolherNotas ? 1 : 0,
                  pointerEvents: escolherNotas ? "auto" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <p
                  onClick={() => {
                    handleDownload("NotaGrande");
                    setEscolherNotas(false);
                  }}
                  style={{ cursor: "pointer", padding: "8px", margin: 0 }}
                >
                  Nota Grande
                </p>
                {venda.status != "concluida" && (
                  <p
                    onClick={() => {
                      handleDownload("CarneCrediario");
                      setEscolherNotas(false);
                    }}
                    style={{ cursor: "pointer", padding: "8px", margin: 0 }}
                  >
                    Carnê crediário
                  </p>
                )}
              </div>

              <button
                className="ButãoDetalhesDaVenda ButãoNotasDetalhesDaVenda"
                onClick={() => setEscolherNotas(!escolherNotas)}
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
