import "./FluxoDeCaixa.css";
import { useState } from "react";

//componentes
import FunçãoNãoDisponivel from "../../components/FunçãoNãoDisponivel/FunçãoNãoDisponivel"

//SubTelas
import CaixaAtual from "./SubScreens/CaixaAtual/CaixaAtual";
import CaixasAnteriores from "./SubScreens/CaixasAnteriores/CaixasAnteriores";

function FluxoDeCaixa() {
  const [abaAtiva, setAbaAtiva] = useState("caixaAtual");

  const renderAba = () => {
    switch (abaAtiva) {
      case "caixaAtual":
        return <CaixaAtual />;
      case "caixaAnteriores":
        return <CaixasAnteriores />;
      default:
        return null;
    }
  };

  return (
    <div id="caixa">
      {<FunçãoNãoDisponivel/>}
      <h2>Caixa</h2>
      <nav className="MenuCaixa">
        <p
          onClick={() => setAbaAtiva("caixaAtual")}
          className={`ButãoCaixaAbas ${
            abaAtiva === "caixaAtual" ? "ativo" : ""
          }`}
        >
          Caixa Atual
        </p>
        <p
          onClick={() => setAbaAtiva("caixaAnteriores")}
          className={`ButãoCaixaAbas ${
            abaAtiva === "caixaAnteriores" ? "ativo" : ""
          }`}
        >
          Caixas Anteriores
        </p>
      </nav>
      <main>{renderAba()}</main>
    </div>
  );
}

export default FluxoDeCaixa;
