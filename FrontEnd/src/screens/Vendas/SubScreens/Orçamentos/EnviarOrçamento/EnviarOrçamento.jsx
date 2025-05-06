import { useState } from "react";
import "./EnviarOrçamento.css";

function EnviarOrçamento({fechar}) {
  const [formaDeEnvio, setFormaDeEnvio] = useState("WhatsApp");

  const renderFormaDeEnvio = () => {
    switch (formaDeEnvio) {
      case "Email":
        return (
          <form id="FormEnivarEmail">
            <label>
              <span>Para:</span>
              <input type="email" />
            </label>

            <label>
              <span>Titulo:</span>
              <input type="text" />
            </label>

            <label>
              <span>Conteudo:</span>
              <textarea />
            </label>

            <div>
              <button style={{ backgroundColor: "#0295ff" }}>Enviar</button>
              <button style={{ backgroundColor: "red" }} onClick={() => fechar(null)}>Cancelar</button>
            </div>
          </form>
        );
      case "WhatsApp":
        return (
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
              <button style={{ backgroundColor: "red" }} onClick={() => fechar(null)}>Cancelar</button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="blurModal">
      <div id="EnviarOrçamento">
        <h3>Enviar Orçamento</h3>
        <select
          id="SelectEnivarEmail"
          onChange={(e) => setFormaDeEnvio(e.target.value)}
        >
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
        </select>

        {renderFormaDeEnvio()}
      </div>
    </div>
  );
}

export default EnviarOrçamento;
