import "./PlanosEBoletos.css";
import { GoGear } from "react-icons/go";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchapi from "../../api/fetchapi";
import services from "../../services/services";

function PlanosEBoletos() {
  const [infoPlanos, setInfoPlanos] = useState({});

  useEffect(() => {
    fetchapi.informacoesPlanos().then((response) => {
      setInfoPlanos(response);
    });
  }, []);

  const pegarBoleto = () => {
    fetchapi
      .gerarBoleto()
      .then((response) => {
        window.open(response[0].url, "_blank"); // Abre no navegador padrão
      })
      .catch((err) => {
        console.error("Erro ao gerar boleto:", err);
      });
  };

  // Função para calcular dias restantes até o vencimento
  const calcularDiasRestantes = (dataVencimento) => {
    if (!dataVencimento) return null;
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento - hoje;
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDias;
  };

  const diasRestantes = calcularDiasRestantes(infoPlanos.vencimento_em);

  return (
    <div id="PlanosEBoletos">
      <h2>Planos e Boletos</h2>
      <p>
        Tudo sobre pagamentos, assinaturas e vencimentos dos serviços da
        CashInBox.
      </p>

      <div id="areaPlanosEPagamento">
        <div id="BlocoUmDetalhesPagamento">
          <h2>Boleto Menssal</h2>
          <div>
            <span>
              <p>Plano - {infoPlanos.plano}</p>
              <p>{services.formatarCurrency(infoPlanos.valor)}</p>
            </span>

            <span>
              <p>
                Vencimento em{" "}
                {services.formatarDataCurta(infoPlanos.vencimento_em)}
              </p>
              {diasRestantes !== null && (
                <p>
                  Vencimento em{" "}
                  <strong>
                    {diasRestantes} dia{diasRestantes !== 1 ? "s" : ""}
                  </strong>
                </p>
              )}
            </span>

            <a id="mudarPlanoPlanosBoletos">Mudar Plano</a>

            <div id="areaStatusPagamento">
              <button id="ButtonDowloadBoleto" onClick={() => pegarBoleto()}>
                Dowload Boleto
              </button>
              <strong>Pagamento recebido</strong>
            </div>
          </div>
        </div>

        <div id="cardDadosDoEstabelecimentoPlanosEBoletos">
          <h2>Dados da conta</h2>
          <p>
            <strong>Nome do estabelecimento: </strong> {"CashInBox - Dev"}
          </p>
          <p>
            <strong>Cnpj: </strong> {"8481000185485"}
          </p>

          <Link to={`/configurações`} id="EditarDadosPlanosEBoletos">
            <GoGear /> Editar Dados
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PlanosEBoletos;
