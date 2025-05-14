import "./DetalhesDoProduto.css";
import { useState, useEffect , useContext } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../context/AppContext";

//Componentes
import Loading from "../../components/Loading/Loading";

//conexão com a api
import fetchapi from "../../api/fetchapi";

//SubTelas
import InformaçõesGerais from "./SubScreens/InformaçõesGerais/InformaçõesGerais";
import Opções from "./SubScreens/Opções/Opções";

function DetalhesDoProduto() {
  const { id } = useParams();
  const {setErroApi} = useContext(AppContext)
  const [infoProduto, setInfoProduto] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("InfoGerais");

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const resultado = await fetchapi.ProcurarProdutoId(id);
        setInfoProduto(resultado);
      } catch (err) {
        setErroApi(true)
      }
    };

    buscarProdutos();
  }, []);

  const renderAba = () => {
    switch (abaAtiva) {
      case "InfoGerais":
        return <InformaçõesGerais />;
      case "Opções":
        return <Opções />;
      default:
        return null;
    }
  };

  if (!infoProduto) {
    return <Loading />;
  }

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
