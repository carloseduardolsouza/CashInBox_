import "./DetalhesDaVenda.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import services from "../../services/services";

// Icones
import { BsFillSendFill } from "react-icons/bs";

import NotaGrandeDetalhesVenda from "../../components/NotaGrandeDetalhesVenda/NotaGrandeDetalhesVenda";

// conexão com a api
import fetchapi from "../../api/fetchapi";

function DetalhesDaVenda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { setErroApi, dadosLoja } = useContext(AppContext);

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

  const imprimirNota = (tipo) => {
    setTipoNota(tipo);
    setTimeout(() => {
      window.print();
      setTipoNota(null);
    }, 100);
    setEscolherNotas(false);
  };

  const enviarDetalhesWhatsApp = async () => {
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
          total_bruto: services.formatarCurrency(venda.valor_total),
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

            <div id="areaButtonsDetalhesVedna">
              <button className="ButãoEditarDetalhesDaVenda ButãoDetalhesDaVenda">
                Editar
              </button>

              {escolherNotas ? (
                <div id="areaButtonsEscolherNotas">
                  <button
                    className="EsolhaDeNotas"
                    onClick={() => imprimirNota("NotaGrande")}
                  >
                    Nota Grande
                  </button>
                  <button
                    className="EsolhaDeNotas"
                    onClick={() => imprimirNota("NotaPequena")}
                  >
                    Nota Pequena
                  </button>
                  <button
                    className="EsolhaDeNotas"
                    onClick={() => imprimirNota("NotaRomaneio")}
                  >
                    Nota de Romaneio
                  </button>
                </div>
              ) : (
                <button
                  className="ButãoDetalhesDaVenda ButãoNotasDetalhesDaVenda"
                  onClick={() => setEscolherNotas(true)}
                >
                  (NF-e / NFC-e)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesDaVenda;
