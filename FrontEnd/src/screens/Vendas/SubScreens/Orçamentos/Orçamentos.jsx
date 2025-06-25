import "./Orçamentos.css";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../../../context/AppContext";

import services from "../../../../services/services";

import vendaFetch from "../../../../api/vendaFetch";


function Orçamentos() {
  const { setErroApi } = useContext(AppContext);
  const [resultadosOrçamentos, setResultadosOrçamentos] = useState([]);
  const [arraySelect, setArraySelect] = useState([]);

  const carregarOrçamentos = async () => {
    try {
      const response = await vendaFetch.listarOrcamentos();
      setResultadosOrçamentos(response);
    } catch (error) {
      setErroApi(true);
    }
  };

  useEffect(() => {
    carregarOrçamentos();
  }, []);

  const toggleArraySelect = (id) => {
    if (arraySelect.includes(id)) {
      setArraySelect(arraySelect.filter((item) => item !== id));
    } else {
      setArraySelect([...arraySelect, id]);
    }
  };

  const excluirVendasSelecionadas = async () => {
    if (arraySelect.length === 0) {
      return;
    }

    await Promise.all(arraySelect.map((id) => vendaFetch.deletarVenda(id)));
    await carregarOrçamentos();
    setArraySelect([]);
  };

  return (
    <div>
      <table className="Table">
        <thead>
          <tr>
            <th>*</th>
            <th>Detalhes</th>
            <th>Cliente</th>
            <th>Desconto</th>
            <th>Acrescimo</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {resultadosOrçamentos.map((dados) => {
            return (
              <tr className={arraySelect.includes(dados.id) ? "ativo" : ""}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => toggleArraySelect(dados.id)}
                  />
                </td>
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
                <td>{dados.nome_cliente}</td>
                <td>{dados.descontos}</td>
                <td>{dados.acrescimos}</td>
                <td>{services.formatarCurrency(dados.valor_total)}</td>
                <td>{dados.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Orçamentos;
