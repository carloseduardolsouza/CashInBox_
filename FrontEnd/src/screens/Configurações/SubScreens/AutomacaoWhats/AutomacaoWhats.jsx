import "./AutomacaoWhats.css";
import { useState, useEffect } from "react";
import whatsappFetch from "../../../../api/whatsappFetch";
import { FaRobot } from "react-icons/fa";

function AutomacaoWhats() {
  const [dadosBot, setDadosBot] = useState({});
  const [erro, setErro] = useState(false);

  const [automaAniversario, setAutomaAniversario] = useState(false);
  const [automaNotificacao, setAutomaNotificacao] = useState(false);
  const [automaInatividade , setAutomaInatividade] = useState(false)

  const [horaAniversario, setHoraAniversario] = useState("09:00");
  const [mensagemAniversario, setMensagemAniversario] = useState(
    "🎉 Feliz aniversário! Você ganhou 10% de desconto hoje!"
  );
  const [numeroNotificacao, setNumeroNotificacao] = useState("");

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

  useEffect(() => {
    fetchQrCode();
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
                checked={automaAniversario}
                onChange={() => setAutomaAniversario(!automaAniversario)}
              />
              <span className="slider"></span>
            </label>
          </div>
          {automaAniversario && (
            <div>
              <label>
                <p>Horário da mensagem:</p>
                <input
                  type="time"
                  value={horaAniversario}
                  onChange={(e) => setHoraAniversario(e.target.value)}
                />
              </label>

              <label>
                <p>Mensagem:</p>
                <textarea
                  value={mensagemAniversario}
                  onChange={(e) => setMensagemAniversario(e.target.value)}
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
                checked={automaInatividade}
                onChange={() => setAutomaInatividade(!automaInatividade)}
              />
              <span className="slider"></span>
            </label>
          </div>
          {automaInatividade && (
            <div>
              <label>
                <p>Período sem comprar (em dias):</p>
                <input
                  type="number"
                  min={1}
                />
              </label>

              <label>
                <p>Mensagem:</p>
                <textarea
                />
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
                checked={automaNotificacao}
                onChange={() => setAutomaNotificacao(!automaNotificacao)}
              />
              <span className="slider"></span>
            </label>
          </div>
          {automaNotificacao && (
            <div>
              <label>
                <p>Número WhatsApp:</p>
                <input
                  type="number"
                  value={numeroNotificacao}
                  onChange={(e) => setNumeroNotificacao(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AutomacaoWhats;
