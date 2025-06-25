import "./DetalhesDoProduto.css";
import { useState } from "react";
import { useParams } from "react-router-dom";

//SubTelas
import InformaçõesGerais from "./SubScreens/InformaçõesGerais/InformaçõesGerais";
import Opções from "./SubScreens/Opções/Opções";

function DetalhesDoProduto() {
  const [abaAtiva, setAbaAtiva] = useState("InfoGerais");

  const { id } = useParams();

  const renderAba = () => {
    switch (abaAtiva) {
      case "InfoGerais":
        return <InformaçõesGerais id={id}/>;
      case "Opções":
        return <Opções />;
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
          onClick={() => setAbaAtiva("Opções")}
          className={`ButãoDetalhesDoProduto ${
            abaAtiva === "Opções" ? "ativo" : ""
          }`}
        >
          Opções
        </button>
      </div>
      <div>{renderAba()}</div>
    </div>
  );
}

export default DetalhesDoProduto;
