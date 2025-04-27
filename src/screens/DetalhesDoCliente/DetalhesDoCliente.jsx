import "./DetalhesDoCliente.css";
import { useState } from "react";

// Subtelas
import GeralCliente from "./SubScreens/GeralCliente/GeralCliente";
import Compras from "./SubScreens/Compras/Compras";

function DetalhesDoCliente() {
  const [abaAtiva, setAbaAtiva] = useState("GeralCliente");

  // Função para renderizar a tela correspondente
  const renderConteudo = () => {
    switch (abaAtiva) {
      case "GeralCliente":
        return <GeralCliente />;
      case "Compras":
        return <Compras />;
      default:
        return null;
    }
  };

  return (
    <div id="DetalhesDoCliente">
      <h2>Detalhes do Cliente</h2>
      <header id="HeaderClientesInfo">
        <div className="tabs">
          <p 
            className={`bttRenderInfoClientes ${abaAtiva === "GeralCliente" ? "ativo" : ""}`} 
            onClick={() => setAbaAtiva('GeralCliente')}
          >
            Detalhes
          </p>
          <p 
            className={`bttRenderInfoClientes ${abaAtiva === "Compras" ? "ativo" : ""}`} 
            onClick={() => setAbaAtiva('Compras')}
          >
            Compras
          </p>
        </div>
      </header>
      <main>
        {renderConteudo()}
      </main>
    </div>
  );
}

export default DetalhesDoCliente;
