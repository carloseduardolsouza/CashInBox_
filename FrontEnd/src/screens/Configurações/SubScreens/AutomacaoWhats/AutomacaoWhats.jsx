import "./AutomacaoWhats.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../../../context/AppContext";
import whatsappFetch from "../../../../api/whatsappFetch";
import userFetch from "../../../../api/userFetch";
import { FaRobot } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

function AutomacaoWhats() {
  const [dadosBot, setDadosBot] = useState({});
  const [dadosAutomacao, setDadosAutomacao] = useState({});
  const [erro, setErro] = useState(false);

  const { setErroApi, adicionarAviso } = useContext(AppContext);

  const [msg_aniversario, setMsg_aniversario] = useState(false);
  const [time_msg_aniversario, setTime_msg_aniversario] = useState("");
  const [msg_msg_aniversario, setMsg_msg_aniversario] = useState("");

  const [msg_inatividade, setMsg_inatividade] = useState(false);

  const [msg_notificacao, setMsg_notificacao] = useState(false);
  const [numero_msg_notificacao, setMumero_msg_notificacao] = useState("");

  const [msg_cobranca, setMsg_cobranca] = useState(false);

  const [clickRobo, setClickRobo] = useState(false);

  const fetchQrCode = async () => {
    try {
      const response = await whatsappFetch.pegarQrCode();
      setDadosBot(response);
      setErro(false);
    } catch (error) {
      console.error("Erro ao buscar QR Code:", error);
      setErro(true);
    }
  };

  const fetchDadosAutomacao = async () => {
    try {
      const response = await userFetch.verConfigAutomacao();
      setMsg_aniversario(response.msg_aniversario);
      setMsg_notificacao(response.msg_notificacao);
      setMsg_cobranca(response.msg_cobranca);
      setMumero_msg_notificacao(response.numero_msg_notificacao);
      setDadosAutomacao(response);
    } catch (error) {
      console.error("Erro ao buscar dados da automaçao:", error);
    }
  };

  const salvarDadosAutomacao = async () => {
    let dados = {
      msg_aniversario: msg_aniversario,
      time_msg_aniversario: time_msg_aniversario,
      msg_msg_aniversario: msg_msg_aniversario,

      msg_inatividade: msg_inatividade,

      msg_notificacao: msg_notificacao,
      numero_msg_notificacao: numero_msg_notificacao,

      msg_cobranca: msg_cobranca,
    };

    await userFetch
      .editarConfigAutomacao(dados)
      .then(() => {
        fetchDadosAutomacao();
        adicionarAviso(
          "sucesso",
          "SUCESSO - Dados da automação editado com sucesso !"
        );
      })
      .catch(() => {
        setErroApi(true);
      });
  };

  useEffect(() => {
    fetchQrCode();
    fetchDadosAutomacao();
    const interval = setInterval(() => {
      fetchQrCode();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = dadosBot.status_bot === "online" ? "green" : "red";

  return (
    <div id="AutomacaoWhats">
      <div id="divStatusRobo" onClick={() => setClickRobo(!clickRobo)}>
        <div id="divSpanConectado">
          <div
            id="spanConectadoOrNo"
            style={{ backgroundColor: statusColor }}
          />
          <p>
            <FaRobot />
            {dadosBot.status_bot || "Status desconhecido"}
          </p>
          {erro && <p style={{ color: "red" }}>Erro ao buscar status</p>}
        </div>

        {clickRobo && (
          <div>
            {dadosBot.qr_code ? (
              <img src={dadosBot.qr_code} alt="QR Code do Bot" />
            ) : dadosBot.status_bot === "online" ? (
              <p>Bot conectado</p>
            ) : (
              <p>Carregando QR Code...</p>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="CardOptions">
          <div className="inputCardOptions">
            <p>Mensagem de aniversário 🎉</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={msg_aniversario}
                onChange={() => setMsg_aniversario(!msg_aniversario)}
              />
              <span className="slider"></span>
            </label>
          </div>
          {msg_aniversario && (
            <div>
              <label>
                <p>Horário da mensagem:</p>
                <input
                  type="time"
                  value={time_msg_aniversario}
                  onChange={(e) => setTime_msg_aniversario(e.target.value)}
                />
              </label>

              <label>
                <p>Mensagem:</p>
                <textarea
                  value={msg_msg_aniversario}
                  onChange={(e) => setMsg_msg_aniversario(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        <div className="CardOptions">
          <div className="inputCardOptions">
            <p>Mensagem de inatividade 💤</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={msg_inatividade}
                onChange={() => setMsg_inatividade(msg_inatividade)}
              />
              <span className="slider"></span>
            </label>
          </div>
          {msg_inatividade && (
            <div>
              <label>
                <p>Período sem comprar (em dias):</p>
                <input type="number" min={1} />
              </label>

              <label>
                <p>Mensagem:</p>
                <textarea />
              </label>
            </div>
          )}
        </div>

        <div className="CardOptions">
          <div className="inputCardOptions">
            <p>Notificações no celular 📱</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={msg_notificacao}
                onChange={() => setMsg_notificacao(!msg_notificacao)}
              />
              <span className="slider"></span>
            </label>
          </div>
          {msg_notificacao && (
            <div>
              <label>
                <p>Número WhatsApp:</p>
                <input
                  type="number"
                  value={numero_msg_notificacao}
                  onChange={(e) => setMumero_msg_notificacao(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        <div className="CardOptions">
          <div className="inputCardOptions">
            <p>Mensagem de cobrança ⚠️</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={msg_cobranca}
                onChange={() => setMsg_cobranca(!msg_cobranca)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        <button onClick={() => salvarDadosAutomacao()} id="buttonSalvarConfigs">
          <FaCheckCircle /> Salvar
        </button>
      </div>
    </div>
  );
}

export default AutomacaoWhats;
