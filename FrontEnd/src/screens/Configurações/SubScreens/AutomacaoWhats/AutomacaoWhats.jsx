import "./AutomacaoWhats.css";
import { useState, useEffect, useContext } from "react";
import fetchapi from "../../../../api/fetchapi";
import AppContext from "../../../../context/AppContext";

function AutomacaoWhats() {
  const [fraseBot, setFraseBot] = useState("Carregando");
  const [dadosBot , setDadosBot] = useState({})

  useEffect(() => {
    fetchapi.pegarQrCode().then((response) => {
        setDadosBot(response)
    })
  },[])

  return (
    <div id="AutomacaoWhats">
      <div>
        <div id="divSpanConectado">
          <div id="spanConectadoOrNo" style={{ backgroundColor: "red" }} />
          <p>{dadosBot.mensagem_status}</p>
        </div>
      </div>

      <div>
        <img src={dadosBot.qr_code} alt="" />
      </div>
    </div>
  );
}

export default AutomacaoWhats;
