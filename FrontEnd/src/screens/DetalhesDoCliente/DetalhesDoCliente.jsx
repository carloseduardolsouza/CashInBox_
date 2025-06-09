import "./DetalhesDoCliente.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//conexão api
import fetchapi from "../../api/fetchapi";

// Subtelas
import GeralCliente from "./SubScreens/GeralCliente/GeralCliente";
import Compras from "./SubScreens/Compras/Compras";
import Orçamentos from "./SubScreens/Orçamentos/Orçamentos";
import Pendencias from "./SubScreens/Pendencias/Pendencias";

//componentes
import Loading from "../../components/Loading/Loading";

function DetalhesDoCliente() {
  const { id } = useParams();
  const [infoCliente, setInfoCliente] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("GeralCliente");

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const resultado = await fetchapi.ProcurarClienteId(id);
        setInfoCliente(resultado);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };

    buscarClientes();
  }, []);

  // Função para renderizar a tela correspondente
  const renderConteudo = () => {
    switch (abaAtiva) {
      case "GeralCliente":
        return <GeralCliente infoCliente={infoCliente[0]} />;
      case "Compras":
        return <Compras />;
      case "Orçamentos":
        return <Orçamentos />;
      case "Pendencias":
        return <Pendencias />;
      default:
        return null;
    }
  };

  if (!infoCliente) {
    return <Loading />;
  }
  return (
    <div id="DetalhesDoCliente">
      <h2>Detalhes do Cliente</h2>
      <header id="HeaderClientesInfo">
        <div className="tabs">
          <p
            className={`bttRenderInfoClientes ${
              abaAtiva === "GeralCliente" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("GeralCliente")}
          >
            Detalhes
          </p>
          <p
            className={`bttRenderInfoClientes ${
              abaAtiva === "Compras" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("Compras")}
          >
            Compras
          </p>
          <p
            className={`bttRenderInfoClientes ${
              abaAtiva === "Orçamentos" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("Orçamentos")}
          >
            Orçamentos
          </p>

          <p
            className={`bttRenderInfoClientes ${
              abaAtiva === "Pendencias" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("Pendencias")}
          >
            Pendencias
          </p>
        </div>
      </header>
      <main>{renderConteudo()}</main>
    </div>
  );
}

export default DetalhesDoCliente;
