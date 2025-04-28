import "./DetalhesDoProduto.css";
import { useState } from "react";

//Componentes
import Loading from "../../components/Loading/Loading";

//SubTelas
import InformaçõesGerais from "./SubScreens/InformaçõesGerais/InformaçõesGerais";
import Estoque_Tributario from "./SubScreens/Estoque_Tributario/Estoque_Tributario";
import Preços from "./SubScreens/Preços/Preços";

function DetalhesDoProduto() {
  const [abaAtiva, setAbaAtiva] = useState("InfoGerais");

  const renderAba = () => {
    switch (abaAtiva) {
      case "InfoGerais":
        return <InformaçõesGerais />;
      case "EstoqueTributario":
        return <Estoque_Tributario />;
      case "Preços":
        return <Preços />;
      default:
        return null;
    }
  };
  return (
    <div id="DetalhesDoProduto">
      <h2>Detalhes do Produto</h2>
      <div>
        <button
          onClick={() => setAbaAtiva("InfoGerais")}
          className={`ButãoDetalhesDoProduto ${
            abaAtiva === "InfoGerais" ? "ativo" : ""
          }`}
        >
          Informações Gerais
        </button>
        <button
          onClick={() => setAbaAtiva("Preços")}
          className={`ButãoDetalhesDoProduto ${
            abaAtiva === "Preços" ? "ativo" : ""
          }`}
        >
          Preços-Promoções
        </button>
        <button
          onClick={() => setAbaAtiva("EstoqueTributario")}
          className={`ButãoDetalhesDoProduto ${
            abaAtiva === "EstoqueTributario" ? "ativo" : ""
          }`}
        >
          Estoque-Tributario
        </button>
      </div>
      <div>{renderAba()}</div>
    </div>
  );
}

export default DetalhesDoProduto;
