import "./AutomacaoWhats.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../../../context/AppContext";
import whatsappFetch from "../../../../api/whatsappFetch";
import userFetch from "../../../../api/userFetch";
import { FaCheckCircle } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

function AutomacaoWhats() {
  const [dadosBot, setDadosBot] = useState({});
  const [erro, setErro] = useState(false);
  const [girando, setGirando] = useState(false);
  const [msg_aniversario, setMsg_aniversario] = useState(false);
  const [time_msg_aniversario, setTime_msg_aniversario] = useState("09:00");
  const [msg_msg_aniversario, setMsg_msg_aniversario] = useState(
    "🎉 Olá ${nome}! Feliz aniversário! 🎂🎈 Você ganha 10% de desconto na loja só hoje! 🛍🎁 Aproveite! 🥳"
  );

  const [msg_notificacao, setMsg_notificacao] = useState(false);
  const [numero_msg_notificacao, setMumero_msg_notificacao] = useState("");
  const [msg_cobranca, setMsg_cobranca] = useState(false);
  const [msg_lembrete_orcamento, setMsg_lembrete_orcamento] = useState(false);
  const [
    msg_lembrete_orcamento_intervalo,
    setMsg_lembrete_orcamento_intervalo,
  ] = useState(30);

  const { setErroApi, adicionarAviso } = useContext(AppContext);

  const handleClick = () => {
    setGirando(true);
    setTimeout(() => setGirando(false), 3000);
  };

  const fetchQrCode = async () => {
    try {
      const response = await whatsappFetch.pegarQrCode();
      setDadosBot(response);
      setErro(false);
    } catch {
      setErro(true);
    }
  };

  const fetchDadosAutomacao = async () => {
    try {
      const response = await userFetch.verConfigAutomacao();
      setMsg_aniversario(response.msg_aniversario);
      setMsg_msg_aniversario(
        response.msg_msg_aniversario || msg_msg_aniversario
      );
      setTime_msg_aniversario(
        response.time_msg_aniversario || time_msg_aniversario
      );
      setMsg_notificacao(response.msg_notificacao);
      setMsg_cobranca(response.msg_cobranca);
      setMumero_msg_notificacao(response.numero_msg_notificacao);
      setMsg_lembrete_orcamento(response.msg_lembrete_orcamento);
      setMsg_lembrete_orcamento_intervalo(
        response.msg_lembrete_orcamento_intervalo
      );
    } catch {
      console.error("Erro ao buscar dados da automação.");
    }
  };

  const cumprirRotinas = async () => {
    handleClick();
    await whatsappFetch.cumprirRotinasManual();
    adicionarAviso("sucesso", "SUCESSO - Rotinas cumpridas manualmente!");
  };

  const salvarDadosAutomacao = async () => {
    const dados = {
      msg_aniversario,
      time_msg_aniversario,
      msg_msg_aniversario,
      msg_notificacao,
      numero_msg_notificacao,
      msg_cobranca,
      msg_lembrete_orcamento,
      msg_lembrete_orcamento_intervalo,
    };

    try {
      await userFetch.editarConfigAutomacao(dados);
      fetchDadosAutomacao();
      adicionarAviso("sucesso", "SUCESSO - Dados da automação salvos!");
    } catch {
      setErroApi(true);
    }
  };

  useEffect(() => {
    fetchQrCode();
    fetchDadosAutomacao();
    const interval = setInterval(fetchQrCode, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = dadosBot.status_bot === "online" ? "green" : "red";

  const renderQRCode = () => {
    if (dadosBot.qr_code) {
      return <img src={dadosBot.qr_code} alt="QR Code" className="qr-code" />;
    }
    if (dadosBot.status_bot === "online") {
      return <p className="status-text online">✅ Bot conectado</p>;
    }
    return <p className="status-text loading">⏳ Carregando QR Code...</p>;
  };

  return (
    <div id="AutomacaoWhats">
      <div id="area1AutomacaoWpp">
        <button id="buttonCumprirRotinas" onClick={cumprirRotinas}>
          <FiRefreshCw id="FiRefreshCw" className={girando ? "spinner" : ""} />{" "}
          Cumprir Rotinas
        </button>

        {[
          {
            label: "Mensagem de aniversário 🎉",
            checked: msg_aniversario,
            onChange: () => setMsg_aniversario(!msg_aniversario),
            content: msg_aniversario && (
              <>
                <label>
                  <p>Horário:</p>
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
              </>
            ),
          },
          {
            label: "Notificações no celular 📱",
            checked: msg_notificacao,
            onChange: () => setMsg_notificacao(!msg_notificacao),
            content: msg_notificacao && (
              <label>
                <p>Número WhatsApp:</p>
                <input
                  type="number"
                  value={numero_msg_notificacao}
                  onChange={(e) => setMumero_msg_notificacao(e.target.value)}
                />
              </label>
            ),
          },
          {
            label: "Mensagem de cobrança ⚠️",
            checked: msg_cobranca,
            onChange: () => setMsg_cobranca(!msg_cobranca),
          },
          {
            label: "Lembrete de orçamento 📝",
            checked: msg_lembrete_orcamento,
            onChange: () => setMsg_lembrete_orcamento(!msg_lembrete_orcamento),
            content: msg_lembrete_orcamento && (
              <label>
                <p>Intervalo (dias):</p>
                <input
                  type="number"
                  value={msg_lembrete_orcamento_intervalo}
                  onChange={(e) =>
                    setMsg_lembrete_orcamento_intervalo(e.target.value)
                  }
                />
              </label>
            ),
          },
        ].map((item, idx) => (
          <div key={idx} className="CardOptions">
            <div className="inputCardOptions">
              <p>{item.label}</p>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={item.onChange}
                />
                <span className="slider"></span>
              </label>
            </div>
            {item.content}
          </div>
        ))}

        <button id="buttonSalvarConfigs" onClick={salvarDadosAutomacao}>
          <FaCheckCircle /> Salvar
        </button>
      </div>

      <div className="automacao-container">
        <div className="qr-section">{renderQRCode()}</div>
        <div className="status-section">
          <div
            className="status-indicator"
            style={{ backgroundColor: statusColor }}
          />
          <p className="status-text">
            {dadosBot.status_bot || "Status desconhecido"}
          </p>
        </div>
        {erro && <p className="error-text">❌ Erro ao buscar status</p>}
      </div>
    </div>
  );
}

export default AutomacaoWhats;
