import "./VendasAReceber.css";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../../../context/AppContext";
import { useNavigate } from 'react-router-dom'

import services from "../../../../services/services";

import ModalFaturar from "./components/ModalFaturar/ModalFaturar";

//conexão com a api
import vendaFetch from "../../../../api/vendaFetch";

function VendasAReceber() {
  const navigate = useNavigate()
  const { setErroApi } = useContext(AppContext);
  const [resultadosVendas, setResultadosVendas] = useState([]);

  const [modalAtiva, setModalAtiva] = useState(null);
  const [dadosParaModal, setDadosParaModal] = useState(null);

  const carregarVendasCrediario = async () => {
  try {
    const response = await vendaFetch.listarVendasCrediario();
    const vendasNaoPagas = response.filter(venda => venda.status !== "pago");
    setResultadosVendas(vendasNaoPagas);
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
              <tr className="trVendasReceber">
                <td>
                  <button
                    className="DetalhesHistoricoVendas"
                    onClick={() => abrirModalFaturar(dados)}
                  >
                    Faturar
                  </button>
                </td>
                <td onClick={() => {navigate(`/detalhesDaVenda/${dados.id_venda}`)}}>{dados.nome_cliente}</td>
                <td>
                  {services.formatarDataNascimento(dados.data_vencimento)}
                </td>
                <td>{services.formatarCurrency(dados.valor_parcela)}</td>
                <td>
                  <p
                    className={
                      dados.status === "vencido"
                        ? "vencidaStatusConta"
                        : "pendenteStatusConta"
                    }
                  >
                    {dados.status}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VendasAReceber;
