import "./FluxoDeCaixa.css";
import caixaFetch from "../../api/caixaFetch";
import { useState, useEffect } from "react";
import services from "../../services/services";

import NovaEntrada from "./subScreen/NovaEntrada";
import NovaSaida from "./subScreen/NovaSaida";

function FluxoDeCaixa() {
  const [movimentacoes, setMovimentacoes] = useState([]);

  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);

  const [modalAtiva , setModalAtiva] = useState(null)

  const renderModal = () => {
  switch (modalAtiva) {
    case "Entrada":
      return <NovaEntrada fechar={setModalAtiva}/>;
    case "Saida":
      return <NovaSaida fechar={setModalAtiva}/>;
    default:
      return null; 
  }
};

  useEffect(() => {
    const totalEntradas = movimentacoes.reduce((acumulador, movimentacao) => {
      if (movimentacao.tipo === "entrada") {
        return acumulador + movimentacao.valor;
      }
      return acumulador;
    }, 0);

    const totalSaidas = movimentacoes.reduce((acumulador, movimentacao) => {
      if (movimentacao.tipo === "saida") {
        return acumulador + movimentacao.valor;
      }
      return acumulador;
    }, 0);

    setEntradas(totalEntradas);
    setSaidas(totalSaidas);
  }, [movimentacoes]);

  useEffect(() => {
    caixaFetch
      .buscarMovimentacao()
      .then((response) => setMovimentacoes(response));
  }, []);

  return (
    <div id="FluxoDeCaixa">
      {renderModal()}
      <div id="HeaderFluxoDeCaixa">
        <div>
          <h2>Fluxo de Caixa</h2>
          <p>Controle financeiro completo</p>
        </div>
        <div id="headerButtonsFluxoDeCaixa">
          <button className="btnPrimary btnEntrada" onClick={() => {setModalAtiva("Entrada")}}>+ Nova Entrada</button>
          <button className="btnSecondary" onClick={() => {setModalAtiva("Saida")}}>+ Nova Saída</button>
        </div>
      </div>

      <div id="cardsGridFluxoDeCaixa">
        <div className="cardFluxoDeCaixa">
          <div className="cardHeaderFluxoDeCaixa">
            <span className="cardTitleFluxoDeCaixa">Saldo Atual</span>
            <div className="cardIconFluxoDeCaixa iconBlue">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="cardValueFluxoDeCaixa">R$ 45.280,00</div>
          <p className="cardSubtextFluxoDeCaixa">Atualizado agora</p>
        </div>

        <div className="cardFluxoDeCaixa">
          <div className="cardHeaderFluxoDeCaixa">
            <span className="cardTitleFluxoDeCaixa">Entradas</span>
            <div className="cardIconFluxoDeCaixa iconGreen">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>
          <div className="cardValueFluxoDeCaixa valueGreen">
            {services.formatarCurrency(entradas)}
          </div>
        </div>

        <div className="cardFluxoDeCaixa">
          <div className="cardHeaderFluxoDeCaixa">
            <span className="cardTitleFluxoDeCaixa">Saídas</span>
            <div className="cardIconFluxoDeCaixa iconRed">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                <polyline points="17 18 23 18 23 12" />
              </svg>
            </div>
          </div>
          <div className="cardValueFluxoDeCaixa valueRed">
            {services.formatarCurrency(saidas)}
          </div>
        </div>

        <div className="cardFluxoDeCaixa">
          <div className="cardHeaderFluxoDeCaixa">
            <span className="cardTitleFluxoDeCaixa">Resultado</span>
            <div className="cardIconFluxoDeCaixa iconPurple">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>
          <div className="cardValueFluxoDeCaixa valueGreen">
            {services.formatarCurrency(entradas - saidas)}
          </div>
          <p className="cardSubtextFluxoDeCaixa">Lucro líquido</p>
        </div>
      </div>

      <div id="tableSectionFluxoDeCaixa">
        <div id="tableHeaderFluxoDeCaixa">
          <h2>Movimentações financeiras</h2>
          <div id="filtersFluxoDeCaixa">
            <select className="selectFluxoDeCaixa">
              <option>Todos</option>
              <option>Entradas</option>
              <option>Saídas</option>
            </select>
            <select className="selectFluxoDeCaixa">
              <option>30 dias</option>
              <option>60 dias</option>
              <option>90 dias</option>
            </select>
          </div>
        </div>

        <div id="tableWrapperFluxoDeCaixa">
          <table id="tableFluxoDeCaixa">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((mov) => (
                <tr key={mov.id}>
                  <td>{services.formatarData(mov.data)}</td>
                  <td>
                    <span
                      className={`badgeFluxoDeCaixa ${
                        mov.tipo === "entrada" ? "badgeEntrada" : "badgeSaida"
                      }`}
                    >
                      {mov.tipo}
                    </span>
                  </td>
                  <td>
                    <span className="badgeFluxoDeCaixa badgeCategoria">
                      {mov.categoria}
                    </span>
                  </td>
                  <td>{mov.descricao}</td>
                  <td
                    className={
                      mov.valor > 0 ? "valorPositivo" : "valorNegativo"
                    }
                  >
                    {mov.tipo === "entrada" ? "+" : "-"}R${" "}
                    {Math.abs(mov.valor).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FluxoDeCaixa;
