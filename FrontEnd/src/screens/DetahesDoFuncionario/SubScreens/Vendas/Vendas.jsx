import "./Vendas.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import vendaFetch from "../../../../api/vendaFetch";
import services from "../../../../services/services";

function Vendas() {
  const { id } = useParams();
  
    const [arrayVenda, setArrayVenda] = useState([]);
  
    useEffect(() => {
      vendaFetch.listarVendasFuncionario(id).then((response) => {
        setArrayVenda(response);
      });
    }, []);

  return (
    <table className="Table">
      <thead>
        <tr>
          <th>Detalhes</th>
          <th>Cliente</th>
          <th>Desconto</th>
          <th>Acrescimo</th>
          <th>Total</th>
          <th>Status</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {arrayVenda.map((dados) => {
          return (
            <tr>
              <td>
                <Link
                  to={`/detalhesDaVenda/${dados.id}`}
                  className="aTdTabelaHistoricoVendas"
                >
                  <button className="DetalhesHistoricoVendas">Detalhes</button>
                </Link>
              </td>
              <td>{dados.nome_cliente}</td>
              <td>{dados.descontos}</td>
              <td>{dados.acrescimos}</td>
              <td>{services.formatarCurrency(dados.valor_total)}</td>
              <td>{dados.status}</td>
              <td>{services.formatarData(dados.data_venda)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Vendas;
