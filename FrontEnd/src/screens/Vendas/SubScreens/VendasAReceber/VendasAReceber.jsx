import "./VendasAReceber.css";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../../../context/AppContext";

import services from "../../../../services/services";

//conexão com a api
import fetchapi from "../../../../api/fetchapi";

function VendasAReceber() {
  const { setErroApi } = useContext(AppContext);
  const [resultadosVendas, setResultadosVendas] = useState([]);

  const carregarVendasCrediario = async () => {
    try {
      const response = await fetchapi.listarVendasCrediario();
      setResultadosVendas(response);
    } catch (error) {
      setErroApi(true);
    }
  };

  const faturarVendaCrediario = async (id) => {
    const pago = fetchapi.receberPagamentoParcela(id).then(() => {
      carregarVendasCrediario()
    })
  }

  useEffect(() => {
    carregarVendasCrediario();
  }, []);

  return (
    <div>
      <table className="Table">
        <thead>
          <tr>
            <th>*</th>
            <th>Cliente</th>
            <th>Vencimento</th>
            <th>Valor da Parcela</th>
            <th>status</th>
          </tr>
        </thead>

        <tbody>
          {resultadosVendas.map((dados) => {
            return (
              <tr>
                <td>
                  <button className="DetalhesHistoricoVendas" onClick={() => faturarVendaCrediario(dados.id)}>Faturar</button>
                </td>
                <td>{dados.nome_cliente}</td>
                <td>{services.formatarDataNascimento(dados.data_vencimento)}</td>
                <td>{services.formatarCurrency(dados.valor_parcela)}</td>
                <td>{dados.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VendasAReceber;
