import "./DetalhesDaVenda.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import services from "../../services/services";
import { pdf } from "@react-pdf/renderer";

// Icones
import { BsFillSendFill } from "react-icons/bs";

import NotaGrandeDetalhesVenda from "../../components/NotaGrandeDetalhesVenda/NotaGrandeDetalhesVenda";
import NotaFiscalDANFE from "../../components/NotaFiscalDetalhesVenda/NotaFiscalDetalhesVenda";

// conexão com a api
import fetchapi from "../../api/fetchapi";

function DetalhesDaVenda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { setErroApi, dadosLoja, Whastsapp } = useContext(AppContext);

  const [escolherNotas, setEscolherNotas] = useState(false);
  const [tipoNota, setTipoNota] = useState(null);

  const [venda, setVenda] = useState({});
  const [cliente, setCliente] = useState({});
  const [produtos, setProdutos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const vendaResponse = await fetchapi.produrarVendaId(id);
        setVenda(vendaResponse[0]);

        const clienteResponse = await fetchapi.ProcurarClienteId(
          vendaResponse[0].cliente_id
        );
        setCliente(clienteResponse[0]);

        const produtosResponse = await fetchapi.procurarProdutosVenda(id);
        setProdutos(produtosResponse);

        const pagamentosResponse = await fetchapi.procurarPagamentoVenda(id);
        setPagamentos(pagamentosResponse);
      } catch (error) {
        console.error("Erro ao carregar dados da venda:", error);
        setErroApi(true);
      }
    };

    carregarDados();
  }, [id, setErroApi]);

  const cancelarVenda = async () => {
    try {
      await fetchapi.deletarVenda(id);
      navigate("/vendas");
    } catch (error) {
      console.error("Erro ao cancelar venda:", error);
      setErroApi(true);
    }
  };

  var dados = {
    emitente: {
      nome: "Empresa Exemplo Ltda",
      endereco: "Rua das Flores, 123 - Centro - São Paulo/SP",
      cnpj: "12.345.678/0001-99",
    },
    destinatario: {
      nome: "João da Silva",
      endereco: "Av. Paulista, 1000 - Bela Vista - São Paulo/SP",
      cnpj: "123.456.789-00",
    },
    nfe: {
      numero: "12345",
      serie: "1",
      data_emissao: "2025-05-29",
    },
    produtos: [
      {
        codigo: "001",
        descricao: "Produto A",
        ncm: "1234.56.78",
        cfop: "5102",
        quantidade: 2,
        valor_unitario: 50.0,
        valor_total: 100.0,
      },
      {
        codigo: "002",
        descricao: "Produto B com descrição maior",
        ncm: "8765.43.21",
        cfop: "6102",
        quantidade: 1,
        valor_unitario: 200.0,
        valor_total: 200.0,
      },
    ],
    impostos: {
      icms: 30.0,
      ipi: 10.0,
    },
    totais: {
      total: 310.0,
    },
    transportadora: {
      razao_social: "Transportes Rápidos Ltda",
      frete: "Por conta do destinatário",
    },
    dados_adicionais: "Entrega prevista para 5 dias úteis.",
    chave_acesso: "1234 5678 9012 3456 7890 1234 5678 9012 3456",
    protocolo_autorizacao: "135798642",
  };

  const handleDownload = async (tipoNota) => {
    let doc;
    if (tipoNota == "NotaGrande") {
      doc = (
        <NotaGrandeDetalhesVenda
          venda={venda}
          cliente={cliente}
          produtos={produtos}
          dadosLoja={dadosLoja}
          pagamento={pagamentos}
        />
      );
    }
    if (tipoNota == "NotaPequena") {
      doc = (
        <NotaFiscalDANFE
          dados={dados}
        />
      );
    }

    if (tipoNota == "NotaRomaneio") {
      return;
    }

    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `venda#${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const enviarDetalhesWhatsApp = async () => {
    if (!venda.cliente_id) {
      window.alert("Este cliente não tem número de WhatsApp cadastrado.");
      return;
    }

    if (Whastsapp != true) {
      window.alert("Conecte seu whatsApp Primeiro");
      return;
    }
    const arrayDeProdutos = produtos.map((dados) => ({
      nome: dados.produto_nome,
      quantidade: dados.quantidade,
      total: services.formatarCurrency(dados.valor_total),
    }));

    const dados = {
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

    await fetchapi
      .enviarMensagem(dados)
      .then(() => {})
      .catch(() => setErroApi(true));
  };

  return (
    <div id="DetalhesDaVenda">
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
              <div id="ImgClienteDetalhesDaVenda"></div>
            </div>

            <div>
              <p>
                <strong>Nome: </strong>
                {cliente?.nome || "indefinido"}
              </p>
              <p>
                <strong>Numero: </strong>
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
                <p
                  onClick={() => {
                    handleDownload("NotaPequena");
                    setEscolherNotas(false);
                  }}
                  style={{ cursor: "pointer", padding: "8px", margin: 0 }}
                >
                  Nota Pequena
                </p>
                <p
                  onClick={() => {
                    handleDownload("NotaRomaneio");
                    setEscolherNotas(false);
                  }}
                  style={{ cursor: "pointer", padding: "8px", margin: 0 }}
                >
                  Nota Romaneio
                </p>
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
