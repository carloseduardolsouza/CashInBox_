import "./Orçamentos.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import fetchapi from "../../../../api/fetchapi";
import services from "../../../../services/services";

function Orçamentos() {
  const { id } = useParams();

  const [arrayOrcamento, setArrayOrcamento] = useState([]);

  useEffect(() => {
    fetchapi.listarOrcamentoCliente(id).then((response) => {
      setArrayOrcamento(response);
    });
  }, []);

  return (
    <div>
      <table className="Table">
        <thead>
          <tr>
            <th>Detalhes</th>
            <th>Desconto</th>
            <th>Acrescimos</th>
            <th>Total</th>
            <th>status</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {arrayOrcamento.map((dados) => {
            return (
              <tr>
                <td>
                  <Link
                    to={`/detalhesDaVenda/${dados.id}`}
                    className="aTdTabelaHistoricoVendas"
                  >
                    <button className="DetalhesHistoricoVendas">
                      Detalhes
                    </button>
                  </Link>
                </td>
                <td>{dados.descontos}</td>
                <td>{dados.acrescimos}</td>
                <td>{services.formatarCurrency(dados.valor_total)}</td>
                <td>{dados.status}</td>
                <td>{services.formatarData(dados.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Orçamentos;
