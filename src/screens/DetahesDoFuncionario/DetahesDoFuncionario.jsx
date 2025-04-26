import "./DetahesDoFuncionario.css";
import { useState, useRef } from "react";

// Subtelas
import InformaçõesGerais from "./SubScreens/InformaçõesGerais/InformaçõesGerais";
import Vendas from "./SubScreens/Vendas/Vendas";

function DetahesDoFuncionario() {
  const [geral, setGeral] = useState(true);
  const [linhaPosicao, setLinhaPosicao] = useState({ left: 0, width: 180 });
  const abasRef = useRef([]);

  const definirAba = (aba, index) => {
    setGeral(aba === "geral");
    // Calcula a posição da linha com base na aba clicada
    const abaElement = abasRef.current[index];
    setLinhaPosicao({
      left: abaElement.offsetLeft, // posição à esquerda da aba
      width: abaElement.offsetWidth, // largura da aba
    });
  };

  return (
    <div id="DetahesDoFuncionario">
      <h2>Detalhes Do Funcionário</h2>
      <header id="HeaderDetahesDoFuncionario">
        <div className="AreaAbas">
          <p
            ref={(el) => (abasRef.current[0] = el)} // Referência da aba "Informações Gerais"
            className={geral ? "ativo" : ""}
            onClick={() => definirAba("geral", 0)}
          >
            Informações Gerais
          </p>
          <p
            ref={(el) => (abasRef.current[1] = el)} // Referência da aba "Vendas"
            className={!geral ? "ativo" : ""}
            onClick={() => definirAba("vendas", 1)}
          >
            Vendas
          </p>

          {/* Linha Animada */}
          <div
            className="UnderlineAnimada"
            style={{
              left: `${linhaPosicao.left}px`,
              width: `${linhaPosicao.width}px`,
            }}
          />
        </div>
      </header>
      <div>
        {geral ? <InformaçõesGerais /> : <Vendas />}
      </div>
    </div>
  );
}

export default DetahesDoFuncionario;
