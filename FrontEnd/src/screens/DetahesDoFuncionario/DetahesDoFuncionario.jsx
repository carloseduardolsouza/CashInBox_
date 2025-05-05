import "./DetahesDoFuncionario.css";
import { useState } from "react";

// Subtelas
import InformaçõesGerais from "./SubScreens/InformaçõesGerais/InformaçõesGerais";
import Vendas from "./SubScreens/Vendas/Vendas";

function DetahesDoFuncionario() {
  const [abaAtiva, setAbaAtiva] = useState("InformaçõesGerais");

  const renderConteudo = () => {
    switch (abaAtiva) {
      case "InformaçõesGerais":
        return <InformaçõesGerais />;
      case "Vendas":
        return <Vendas />;
      default:
        return null;
    }
  };

  return (
    <div id="DetahesDoFuncionario">
      <h2>Detalhes Do Funcionário</h2>
      <header id="HeaderDetahesDoFuncionario">
        <div className="AreaAbas">
          <button
            className={`bttDetalhesDoFuncionario ${abaAtiva === 'InformaçõesGerais' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva("InformaçõesGerais")}
          >
            Informações Gerais
          </button>
          <button
            className={`bttDetalhesDoFuncionario ${abaAtiva === 'Vendas' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva('Vendas')}
          >
            Vendas
          </button>
        </div>
      </header>
      <div>{renderConteudo()}</div>
    </div>
  );
}

export default DetahesDoFuncionario;
