import { useState } from "react";
import "./EnviarOrçamento.css";

function EnviarOrçamento({ fechar  , id}) {
  return (
    <div className="blurModal">
      <div id="EnviarOrçamento">
        <h3>Enviar Orçamento (WhatsApp)</h3>
        <form id="FormEnivarWhatsApp">
          <label>
            <span>Numero:</span>
            <input type="number" />
          </label>

          <label>
            <span>Conteudo:</span>
            <textarea />
          </label>

          <div>
            <button style={{ backgroundColor: "#0295ff" }}>Enviar</button>
            <button
              style={{ backgroundColor: "red" }}
              onClick={() => fechar(null)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnviarOrçamento;
