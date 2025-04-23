import "./FluxoDeCaixa.css";
import { useState } from "react";

//SubTelas
import CaixaAtual from "./SubScreens/CaixaAtual/CaixaAtual";
import CaixasAnteriores from "./SubScreens/CaixasAnteriores/CaixasAnteriores";

function FluxoDeCaixa() {
  const [caixaAtual, setCaixaAtual] = useState(true);

  return (
    <div id="caixa">
      <h2>Caixa</h2>
      <nav className="MenuCaixa">
        <p onClick={() => setCaixaAtual(true)}>Caixa Atual</p>
        <p onClick={() => setCaixaAtual(false)}>Caixas Anteriores</p>
      </nav>
      <main>{(caixaAtual && <CaixaAtual />) || <CaixasAnteriores />}</main>
    </div>
  );
}

export default FluxoDeCaixa;
