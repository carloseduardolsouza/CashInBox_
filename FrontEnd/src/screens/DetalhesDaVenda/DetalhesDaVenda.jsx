import "./DetalhesDaVenda.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useParams } from "react-router-dom";
import services from "../../services/services";

//conexão com a api
import fetchapi from "../../api/fetchapi";

function DetalhesDaVenda() {
  const { id } = useParams();

  const [venda, setVenda] = useState({});
  const [cliente, setCliente] = useState({});
  const [produtos, setProdutos] = useState([]);

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
  return (
    <div id="DetalhesDaVenda">
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
                {services.formatarNumeroCelular(cliente?.telefone || "indefinido")}
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
                      <td>{services.formatarCurrency(produto.preco_unitario)}</td>
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
            <a>
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
            <p id="CancelarVendaDetalhesDaVenda">Cancelar Venda</p>
            <div>
              <button className="ButãoEditarDetalhesDaVenda ButãoDetalhesDaVenda">
                Editar
              </button>
              <button className="ButãoNotasDetalhesDaVenda ButãoDetalhesDaVenda">
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
