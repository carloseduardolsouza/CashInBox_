import "./VendasAReceber.css";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../../../context/AppContext";

import services from "../../../../services/services";

import ModalFaturar from "./components/ModalFaturar/ModalFaturar";

//conexão com a api
import vendaFetch from "../../../../api/vendaFetch";

function VendasAReceber() {
  const { setErroApi } = useContext(AppContext);
  const [resultadosVendas, setResultadosVendas] = useState([]);

  const [modalAtiva, setModalAtiva] = useState(null);
  const [dadosParaModal, setDadosParaModal] = useState(null);

  const carregarVendasCrediario = async () => {
    try {
      const response = await vendaFetch.listarVendasCrediario();
      setResultadosVendas(response);
    } catch (error) {
      setErroApi(true);
    }
  };

  const abrirModalFaturar = (dadosDaVenda) => {
    setDadosParaModal(dadosDaVenda);
    setModalAtiva("faturar");
  };

  const renderModal = () => {
    switch (modalAtiva) {
      case "faturar":
        return (
          <ModalFaturar
            fechar={setModalAtiva}
            dados={dadosParaModal}
            atualizarVendas={carregarVendasCrediario}
          />
        );
      case null:
        return null;
    }
  };

  useEffect(() => {
    carregarVendasCrediario();
  }, []);

  return (
    <div>
      {renderModal()}
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
                  <button
                    className="DetalhesHistoricoVendas"
                    onClick={() => abrirModalFaturar(dados)}
                  >
                    Faturar
                  </button>
                </td>
                <td>{dados.nome_cliente}</td>
                <td>
                  {services.formatarDataNascimento(dados.data_vencimento)}
                </td>
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
