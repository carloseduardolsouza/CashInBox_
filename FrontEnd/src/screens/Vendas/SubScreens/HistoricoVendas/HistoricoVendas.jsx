import "./HistoricoVendas.css";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../../../context/AppContext";
import { Link } from "react-router-dom";

import services from "../../../../services/services";
import Loading from "../../../../components/Loading/Loading";

//conexão com a api
import vendaFetch from "../../../../api/vendaFetch";

import { FaFilter } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

function HistoricoVendas() {
  const { setErroApi, tratarErroApi } = useContext(AppContext);
  const [resultadosVendas, setResultadosVendas] = useState([]);
  const [arraySelect, setArraySelect] = useState([]);
  const [filtroData, setFiltroData] = useState("");

  const [loading, setLoading] = useState(true);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 20;

  const carregarVendas = async () => {
    try {
      const response = await vendaFetch.listarVendas(filtroData);

      if (Array.isArray(response)) {
        setResultadosVendas(response);
        setPaginaAtual(1);
      } else {
        setResultadosVendas([]);
        console.warn("Resposta inesperada:", response);
      }
      setLoading(false);
      tratarErroApi(response);
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
    if (arraySelect.length === 0) return;

    await Promise.all(arraySelect.map((id) => vendaFetch.deletarVenda(id)));
    await carregarVendas();
    setArraySelect([]);
  };

  // Paginação: calcular o que mostrar
  const totalPaginas = Math.ceil(resultadosVendas.length / itensPorPagina);
  const vendasPaginadas = resultadosVendas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  return (
    <div>
      {loading && <Loading />}
      <div id="AreaFIltroHistoricoVendas">
        <div id="filterHistoricoVendas">
          <input
            type="date"
            className="FilterDateVendas"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
          <button
            className="FilterICONDateVendas"
            onClick={(e) => {
              e.preventDefault();
              carregarVendas();
            }}
          >
            <FaFilter id="FaFilter" />
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
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {vendasPaginadas.map((dados) => (
            <tr
              key={dados.id}
              className={arraySelect.includes(dados.id) ? "ativo" : ""}
            >
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
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="paginacao">
          {Array.from({ length: totalPaginas }, (_, index) => (
            <button
              key={index}
              className={paginaAtual === index + 1 ? "paginaAtiva" : ""}
              onClick={() => setPaginaAtual(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoricoVendas;
