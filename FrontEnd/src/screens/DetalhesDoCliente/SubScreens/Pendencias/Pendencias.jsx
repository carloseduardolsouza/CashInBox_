import "./Pendencias.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import fetchapi from "../../../../api/fetchapi";
import services from "../../../../services/services";

import ModalFaturar from "../../../Vendas/SubScreens/VendasAReceber/components/ModalFaturar/ModalFaturar";

function Pendencias() {
  const { id } = useParams();

  const [arrayOrcamento, setArrayOrcamento] = useState([]);
  const [modalAtiva, setModalAtiva] = useState(null);
  const [dadosParaModal, setDadosParaModal] = useState(null);

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

  const carregarVendasCrediario = async () => {
    fetchapi.listarVendasCrediarioCliente(id).then((response) => {
      setArrayOrcamento(response);
    });
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
            <th>Detalhes</th>
            <th>Valor</th>
            <th>Vencimento</th>
            <th>Status</th>
            <th>Faturar</th>
          </tr>
        </thead>
        <tbody>
          {arrayOrcamento.map((dados) => {
            return (
              <tr>
                <td>
                  <Link
                    to={`/detalhesDaVenda/${dados.id_venda}`}
                    className="aTdTabelaHistoricoVendas"
                  >
                    <button className="DetalhesHistoricoVendas">
                      Detalhes Compra
                    </button>
                  </Link>
                </td>
                <td>{services.formatarCurrency(dados.valor_parcela)}</td>
                <td>
                  {services.formatarDataNascimento(dados.data_vencimento)}
                </td>
                <td>{dados.status}</td>
                <td>
                  <button
                    onClick={() => abrirModalFaturar(dados)}
                    className="DetalhesHistoricoVendas"
                  >
                    Faturar
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

export default Pendencias;
