import "./DetahesDoFuncionario.css";
import { useState } from "react";

//SubTelas
import InformaçõesGerais from "./SubScreens/InformaçõesGerais/InformaçõesGerais";
import Vendas from "./SubScreens/Vendas/Vendas";

function DetahesDoFuncionario() {
  const [geral, setGeral] = useState(true);
  return (
    <div id="DetahesDoFuncionario">
      <h2>Detalhes Do Funcionário</h2>
      <header id="HeaderDetahesDoFuncionario">
        <p onClick={() => setGeral(true)}>Informações Gerais</p>
        <p onClick={() => setGeral(false)}>Vendas</p>
      </header>
      <div>
        {geral && <InformaçõesGerais /> || <Vendas/>}
      </div>
    </div>
  );
}

export default DetahesDoFuncionario;
