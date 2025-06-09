import "./HistoricoVendas.css";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../../../context/AppContext";
import { Link } from "react-router-dom";

import services from "../../../../services/services";

//conexão com a api
import fetchapi from "../../../../api/fetchapi";

import { FaFilter } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

function HistoricoVendas() {
  const { setErroApi } = useContext(AppContext);
  const [resultadosVendas, setResultadosVendas] = useState([]);
  const [arraySelect, setArraySelect] = useState([]);

  const [filtroData, setFiltroData] = useState("");

  const carregarVendas = async () => {
    try {
      const response = await fetchapi.listarVendas(filtroData);
      setResultadosVendas(response);
    } catch (error) {
      setErroApi(true);
    }
  };

  useEffect(() => {
    carregarVendas();
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

    await Promise.all(arraySelect.map((id) => fetchapi.deletarVenda(id)));
    await carregarVendas();
    setArraySelect([]);
  };

  return (
    <div>
      <div id="AreaFIltroHistoricoVendas">
        <div id="filterHistoricoVendas">
          <input
            type="date"
            className="FilterDateVendas"
            value={filtroData} // mantém controlado
            onChange={(e) => setFiltroData(e.target.value)}
          />
          <button
            className="FilterICONDateVendas"
            onClick={(e) => {
              e.preventDefault();
              carregarVendas(); // agora sim: valor atualizado
            }}
          >
            <FaFilter  id="FaFilter"/>
          </button>
        </div>

        <button
          disabled={arraySelect.length === 0}
          className={
            arraySelect.length >= 1
              ? "buttonExcluirItensSelecionadosAtivado"
              : "buttonExcluirItensSelecionadosDesativado"
          }
          onClick={() => excluirVendasSelecionadas()}
        >
          <FaTrash />
        </button>
      </div>
      <table className="Table">
        <thead>
          <tr>
            <th>*</th>
            <th>Detalhes</th>
            <th>Cliente</th>
            <th>Desconto</th>
            <th>Acrescimos</th>
            <th>Total</th>
            <th>status</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {resultadosVendas.map((dados) => {
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
                <td>{services.formatarData(dados.data_venda)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HistoricoVendas;
