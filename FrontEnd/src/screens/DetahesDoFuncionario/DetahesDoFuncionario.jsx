import "./DetahesDoFuncionario.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//conexão api
import funcionarioFetch from "../../api/funcionarioFetch";

//componentes
import Loading from "../../components/Loading/Loading";

// Subtelas
import InformaçõesGerais from "./SubScreens/InformaçõesGerais/InformaçõesGerais";
import Vendas from "./SubScreens/Vendas/Vendas";

function DetahesDoFuncionario() {
  const { id } = useParams();
  const [infoFuncionario, setInfoFuncionario] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("InformaçõesGerais");

  const renderConteudo = () => {
    switch (abaAtiva) {
      case "InformaçõesGerais":
        return <InformaçõesGerais infoFuncionario={infoFuncionario} />;
      case "Vendas":
        return <Vendas />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const buscarFuncionario = async () => {
      try {
        const resultado = await funcionarioFetch.procurarFuncionarioId(id);
        setInfoFuncionario(resultado);
        console.log(resultado)
      } catch (err) {
        console.error("Erro ao buscar Funcionario:", err);
      }
    };

    buscarFuncionario();
  }, []);

  if (!infoFuncionario) {
    return <Loading />;
  }

  return (
    <div id="DetahesDoFuncionario">
      <h2>Detalhes Do Funcionário</h2>
      <header id="HeaderDetahesDoFuncionario">
        <div className="AreaAbas">
          <button
            className={`bttDetalhesDoFuncionario ${
              abaAtiva === "InformaçõesGerais" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("InformaçõesGerais")}
          >
            Informações Gerais
          </button>
          <button
            className={`bttDetalhesDoFuncionario ${
              abaAtiva === "Vendas" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("Vendas")}
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
