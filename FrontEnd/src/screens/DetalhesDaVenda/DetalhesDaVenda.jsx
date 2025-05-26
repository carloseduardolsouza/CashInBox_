import "./DetalhesDaVenda.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import services from "../../services/services";

import NotaGrandeDetalhesVenda from "../../components/NotaGrandeDetalhesVenda/NotaGrandeDetalhesVenda";

//conexão com a api
import fetchapi from "../../api/fetchapi";

function DetalhesDaVenda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { setErroApi, dadosLoja } = useContext(AppContext);

  const [EscolherNotas, setEscolherNotas] = useState(false);

  const [venda, setVenda] = useState({});
  const [cliente, setCliente] = useState({});
  const [produtos, setProdutos] = useState([]);

  const [tipoNota, setTipoNota] = useState(null);

  useEffect(() => {
    fetchapi.produrarVendaId(id).then((response) => {
      setVenda(response[0]);
      fetchapi.ProcurarClienteId(response[0].cliente_id).then((response) => {
        setCliente(response[0]);

        fetchapi.procurarProdutosVenda(id).then((response) => {
          setProdutos(response);
        });
      });
    });
  }, []);

  const cancelarVenda = () => {
    fetchapi
      .deletarVenda(id)
      .then(() => {
        navigate("/vendas");
      })
      .catch(() => {
        setErroApi(true);
      });
  };

  const imprimirNota = (tipo) => {
    setTipoNota(tipo);
    setTimeout(() => {
      window.print();
      setTipoNota(null); // limpa após imprimir
    }, 100); // Dá tempo de aplicar o estado antes de imprimir
  };

  return (
    <div id="DetalhesDaVenda">
      <div
        id="DetalhesDaVendaPage"
      >
        {tipoNota === "NotaGrande" && (
          <NotaGrandeDetalhesVenda
            venda={venda}
            cliente={cliente}
            produtos={produtos}
            dadosLoja={dadosLoja}
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
                  <th>Valor Unitario</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => {
                  return (
                    <tr>
                      <td>{produto.produto_nome}</td>
                      <td>
                        {services.formatarCurrency(produto.preco_unitario)}
                      </td>
                      <td>{produto.quantidade}</td>
                      <td>{services.formatarCurrency(produto.valor_total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div id="DetalhesDaVendaDisplay2">
          <div id="DetalhesDaVendaDisplay2Pt1">
            <h2>{services.formatarCurrency(venda.valor_total)}</h2>
            <a id="infoTempoDetalhesdaVenda">
              Venda # {venda.id} -{" "}
              {services.formatarDataCurta(venda.data_venda)} -{" "}
              {services.formatarHorario(venda.data_venda)}
            </a>
          </div>

          <div id="DetalhesDaVendaDisplay2Pt2">
            <p>
              <strong>Pagamento: </strong>Dinheiro
            </p>
            <p>
              <strong>Status: </strong>
              {venda.status}
            </p>
            <p>
              <strong>Vendedor: </strong>
              {venda.nome_funcionario}
            </p>
            <p>
              <strong>Descontos: </strong>
              {venda.descontos}
            </p>
            <p>
              <strong>Acrescimos/Frete: </strong>
              {venda.acrescimos}
            </p>
          </div>

          <div id="DetalhesDaVendaDisplay2Pt3">
            <p
              id="CancelarVendaDetalhesDaVenda"
              onClick={() => cancelarVenda()}
            >
              Cancelar Venda
            </p>
            <div id="areaButtonsDetalhesVedna">
              <button className="ButãoEditarDetalhesDaVenda ButãoDetalhesDaVenda">
                Editar
              </button>
              {EscolherNotas ? (
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
                    Nota de romaneio
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
