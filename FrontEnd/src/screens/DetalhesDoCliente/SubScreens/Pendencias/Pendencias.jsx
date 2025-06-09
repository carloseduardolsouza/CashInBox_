import "./Pendencias.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import fetchapi from "../../../../api/fetchapi";
import services from "../../../../services/services";

function Pendencias() {
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
            <th>Valor</th>
            <th>Vencimento</th>
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
                      Detalhes Compra
                    </button>
                  </Link>
                </td>
                <td>{dados.descontos}</td>
                <td>{dados.acrescimos}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Pendencias;
