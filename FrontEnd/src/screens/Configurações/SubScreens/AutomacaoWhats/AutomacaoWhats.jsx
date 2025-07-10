import "./AutomacaoWhats.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../../../context/AppContext";
import whatsappFetch from "../../../../api/whatsappFetch";
import userFetch from "../../../../api/userFetch";
import { FaRobot } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

function AutomacaoWhats() {
  const [dadosBot, setDadosBot] = useState({});
  const [dadosAutomacao, setDadosAutomacao] = useState({});
  const [erro, setErro] = useState(false);
  const [girando, setGirando] = useState(false);

  const handleClick = () => {
    setGirando(true);

    // Remove a animação depois de 3 segundos
    setTimeout(() => {
      setGirando(false);
    }, 3000); // 3000 ms = 3s
  };

  const { setErroApi, adicionarAviso } = useContext(AppContext);

  const [msg_aniversario, setMsg_aniversario] = useState(false);
  const [time_msg_aniversario, setTime_msg_aniversario] = useState("09:00");
  const [msg_msg_aniversario, setMsg_msg_aniversario] = useState(
    "🎉 Olá ${nome} ! Em comemoração a esta data muito especial, a equipe da CashInBox deseja um feliz aniversário! 🎂🎈\n\nPra celebrar com estilo, você ganha 10% de desconto em todos os itens da loja, só hoje! 🛍🎁\n\nAproveite e faça seu dia ainda melhor! 🥳\n"
  );

  const [msg_inatividade, setMsg_inatividade] = useState(false);

  const [msg_notificacao, setMsg_notificacao] = useState(false);
  const [numero_msg_notificacao, setMumero_msg_notificacao] = useState("");

  const [msg_cobranca, setMsg_cobranca] = useState(false);

  const [msg_orcamento, setMsg_orcamento] = useState(false);

  const [clickRobo, setClickRobo] = useState(false);

  const [msg_lembrete_orcamento, setMsg_lembrete_orcamento] = useState(false);
  const [
    msg_lembrete_orcamento_intervalo,
    setMsg_lembrete_orcamento_intervalo,
  ] = useState(30);

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
      setMsg_msg_aniversario(() => {
        if (
          response.msg_msg_aniversario === "" ||
          !response.msg_msg_aniversario
        ) {
          return msg_msg_aniversario;
        } else {
          return response.msg_msg_aniversario;
        }
      });
      setTime_msg_aniversario(() => {
        if (
          response.time_msg_aniversario === "" ||
          !response.time_msg_aniversario
        ) {
          return time_msg_aniversario;
        } else {
          return response.time_msg_aniversario;
        }
      });
      setMsg_notificacao(response.msg_notificacao);
      setMsg_cobranca(response.msg_cobranca);
      setMumero_msg_notificacao(response.numero_msg_notificacao);
      setDadosAutomacao(response);
      setMsg_lembrete_orcamento(response.msg_lembrete_orcamento);
      setMsg_lembrete_orcamento_intervalo(
        response.msg_lembrete_orcamento_intervalo
      );
    } catch (error) {
      console.error("Erro ao buscar dados da automaçao:", error);
    }
  };

  const cumprirRotinas = async () => {
    handleClick();
    await whatsappFetch.cumprirRotinasManual().then(() => {
      adicionarAviso("sucesso", "SUCESSO - Rotinas cumpridas manualmente!");
    });
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

      msg_lembrete_orcamento: msg_lembrete_orcamento,
      msg_lembrete_orcamento_intervalo: msg_lembrete_orcamento_intervalo,
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
      <button id="buttonCumprirRotinas" onClick={() => cumprirRotinas()}>
        <FiRefreshCw id="FiRefreshCw" className={girando ? "spinner" : ""} />{" "}
        Cumprir rotinas
      </button>
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

        <div className="CardOptions">
          <div className="inputCardOptions">
            <p>Lembrete de orçamento 📝</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={msg_lembrete_orcamento}
                onChange={() => setMsg_lembrete_orcamento(!msg_lembrete_orcamento)}
              />
              <span className="slider"></span>
            </label>
          </div>
          {msg_lembrete_orcamento && (
            <div>
              <label>
                <p>Intervalo de dias: (em dias)</p>
                <input
                  type="number"
                  value={msg_lembrete_orcamento_intervalo}
                  onChange={(e) =>
                    setMsg_lembrete_orcamento_intervalo(e.target.value)
                  }
                />
              </label>
            </div>
          )}
        </div>
        <button onClick={() => salvarDadosAutomacao()} id="buttonSalvarConfigs">
          <FaCheckCircle /> Salvar
        </button>
      </div>
    </div>
  );
}

export default AutomacaoWhats;
