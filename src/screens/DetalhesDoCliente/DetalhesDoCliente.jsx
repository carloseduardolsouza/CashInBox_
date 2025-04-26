import "./DetalhesDoCliente.css";
import { useState } from "react";

// Subtelas
import GeralCliente from "./SubScreens/GeralCliente/GeralCliente";
import Compras from "./SubScreens/Compras/Compras";

function DetalhesDoCliente() {
  const [compras, setCompras] = useState(false);

  return (
    <div id="DetalhesDoCliente">
      <h2>Detalhes do Cliente</h2>
      <header id="HeaderClientesInfo">
        <div className="tabs">
          <p 
            className={`bttRenderInfoClientes ${!compras ? "ativo" : ""}`} 
            onClick={() => setCompras(false)}
          >
            Detalhes
          </p>
          <p 
            className={`bttRenderInfoClientes ${compras ? "ativo" : ""}`} 
            onClick={() => setCompras(true)}
          >
            Compras
          </p>
        </div>
        <div
          className="UnderlineAnimada"
          style={{
            left: compras ? '50%' : '0%', // Movendo a linha para a aba ativa
          }}
        ></div>
      </header>
      <main>
        {compras ? <Compras /> : <GeralCliente />}
      </main>
    </div>
  );
}

export default DetalhesDoCliente;
