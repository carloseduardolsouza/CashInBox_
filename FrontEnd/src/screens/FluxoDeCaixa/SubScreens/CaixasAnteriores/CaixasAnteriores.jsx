import "./CaixasAnteriores.css";
import { useEffect, useState, useContext } from "react";
import caixaFetch from "../../../../api/caixaFetch";
import services from "../../../../services/services";
import AppContext from "../../../../context/AppContext";

//modal
import DetalhesCaixaAnterior from "./components/DetalhesCaixaAnterior";

function CaixasAnteriores() {
  const { setErroApi } = useContext(AppContext);
  const [caixasAnteriores, setCaixasAnteriores] = useState([]);

  const [modal, setModal] = useState(null);
  const [dadosModal, setDadosModal] = useState(null);

  useEffect(() => {
    caixaFetch
      .buscarCaixas()
      .then((response) => {
        setCaixasAnteriores(response);
      })
      .catch(() => setErroApi(true));
  }, []);

  const updateDadosModal = (dados) => {
    setDadosModal(dados);
    setModal("detalhes");
  };

  const renderModal = () => {
    switch (modal) {
      case "detalhes":
        return <DetalhesCaixaAnterior dados={dadosModal} fechar={setModal}/>;
      case null:
        return null;
    }
  };

  return (
    <div id="CaixasAnteriores">
      {renderModal()}
      <table className="Table">
        <thead>
          <tr>
            <th>Caixa</th>
            <th>Abertura</th>
            <th>Fechamento</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {caixasAnteriores.map((dados) => {
            return (
              <tr>
                <td>{services.formatarData(dados.data_abertura)}</td>
                <td>{services.formatarCurrency(dados.valor_abertura)}</td>
                <td>{services.formatarCurrency(dados.valor_fechamento)}</td>
                <td>
                  <button
                    className="DetalhesHistoricoVendas"
                    onClick={() => updateDadosModal(dados)}
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CaixasAnteriores;
