import "./Home.css";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";
import services from "../../services/services";
import relatorioFetch from "../../api/relatorioFetch";
import { MdOutlineBrowserUpdated } from "react-icons/md";

//Biblioteca de Gráficos
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

//Icones Usados
import { FaTools } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";
import { FaComputer } from "react-icons/fa6";
import { IoMdArrowDropup } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Home() {
  const [relatoriosBasicos, setRelatoriosBasicos] = useState({});
  const {
    isDark,
    setIsDark,
    dadosLoja,
    setErroApi,
    setVencido,
    setFazerLogin,
    tratarErroApi,
  } = useContext(AppContext);
  const [data, setData] = useState([]);

  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  useEffect(() => {
    relatorioFetch
      .buscarRelatoriosBasicos()
      .then((response) => {
        if (Array.isArray(response)) {
          setRelatoriosBasicos(response);
        } else {
          setRelatoriosBasicos([]); // Evita o erro
          console.warn("Resposta inesperada:", response);
        }
        tratarErroApi(response)

        setRelatoriosBasicos(response);

        const newData = response.faturamento.map((dados) => ({
          name: dados.mes,
          Despesas: 0,
          Receitas: dados.faturamento,
        }));

        setData(newData);
      })
      .catch((error) => {
        const newData = [];
        for (let i = 0; i < 7; i++) {
          newData.push({
            name: "Mês",
            Despesas: 10,
            Receitas: 40,
          });
        }
        setData(newData);
      });

    window?.electronAPI?.onUpdateAvailable(() => {
      console.log("🔔 Atualização disponível!");
    });

    window?.electronAPI?.onUpdateDownloaded(() => {
      console.log("📦 Atualização baixada!");
      setUpdateReady(true);
    });
  }, []);

  const handleAtualizar = () => {
    window.electronAPI.instalarAtualizacao();
  };

  // Calcular o faturamento atual, anterior e a variação
  const faturamentoArray = relatoriosBasicos.faturamento || [];
  const len = faturamentoArray.length;

  const faturamentoAtual = len >= 1 ? faturamentoArray[len - 1].faturamento : 0;
  const faturamentoAnterior =
    len >= 2 ? faturamentoArray[len - 2].faturamento : 0;

  const variacao = len >= 1 ? faturamentoArray[len - 1].variacao : 0;

  return (
    <div id="Homescreen">
      <div className="NotificationHomeScreen">
        <div style={{ position: "relative" }}>
          {updateReady && <span id="circleAtualizacao" />}
          <button
            id="ButtonDarkMode"
            onClick={() => handleAtualizar()}
            disabled={!updateReady}
          >
            <MdOutlineBrowserUpdated />
          </button>
        </div>

        <button
          id="ButtonDarkMode"
          onClick={() => setMostrarInfo(!mostrarInfo)}
          aria-label={
            mostrarInfo ? "Esconder informações" : "Mostrar informações"
          }
        >
          {mostrarInfo ? <FaEye /> : <FaEyeSlash />}
        </button>
        <button id="ButtonDarkMode" onClick={() => setIsDark(!isDark)} disabled={true}>
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>

      <h1>{dadosLoja.nomeEstabelecimento || "CashInBox..."}</h1>

      <header className="HeaderHomeDeashBoard">
        <LineChart
          width={550}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Receitas" stroke="#31c331" />
          <Line type="monotone" dataKey="Despesas" stroke="#de2727" />
        </LineChart>

        <div className="ButtonHeaderDeashBoard">
          <Link to={"/funcionarios"} className="bttButtonHeaderDeashBoard">
            <GiTakeMyMoney /> Funcionários
          </Link>
          <Link to={"/planosEBoletos"} className="bttButtonHeaderDeashBoard">
            <FaTools /> Planos e Boletos
          </Link>
          <Link to={"/fluxoDeCaixa"} className="bttButtonHeaderDeashBoard">
            <MdAttachMoney /> Fluxo de Caixa
          </Link>
          <Link to={"/pontoDeVenda"} className="bttButtonHeaderDeashBoard">
            <FaComputer /> PDV
          </Link>
        </div>

        <div className="LoyautCardMétricasBox">
          <article className="cardMétricasBox green">
            <h2>Receitas</h2>
            <h1>{"R$ 00,00"}</h1>
            <div className="linha" />
            <div className="displayFlex">
              <div>
                <p>Último mês</p>
                <strong>{"R$ 00,00"}</strong>
              </div>
              <div>
                <p>
                  <IoMdArrowDropup />
                </p>
                <strong>{"0%"}</strong>
              </div>
            </div>
          </article>

          <article className="cardMétricasBox red">
            <h2>Despesas</h2>
            <h1>{"R$ 00,00"}</h1>
            <div className="linha" />
            <div className="displayFlex">
              <div>
                <p>Último mês</p>
                <strong>{"R$ 00,00"}</strong>
              </div>
              <div>
                <p>
                  <IoMdArrowDropup />
                </p>
                <strong>{"0%"}</strong>
              </div>
            </div>
          </article>

          <article className="cardMétricasBox orange">
            <h2>Faturamento Mês</h2>
            <h1>
              {mostrarInfo
                ? services.formatarCurrency(faturamentoAtual || 0)
                : "••••••"}
            </h1>
            <div className="linha" />
            <div className="displayFlex">
              <div>
                <p>Último mês</p>
                <strong>
                  {mostrarInfo
                    ? services.formatarCurrency(faturamentoAnterior || 0)
                    : "••••••"}
                </strong>
              </div>
              <div>
                <p>
                  <IoMdArrowDropup />
                </p>
                <strong>{variacao}%</strong>
              </div>
            </div>
          </article>
        </div>
      </header>

      <main>
        <div id="InfoHomeDeash">
          <div className="card-info">
            <p>Pagamentos Vencidos</p>
            <span className="badge">
              {relatoriosBasicos.crediariosAtrasados}
            </span>
          </div>

          <div className="card-info">
            <p>Clientes Ativos</p>
            <span className="badge">{relatoriosBasicos.clientesAtivos}</span>
          </div>

          <div className="card-info">
            <p>Orçamentos</p>
            <span className="badge">{relatoriosBasicos.totalOrcamentos}</span>
          </div>

          <div className="card-info">
            <p>Resumo Diário</p>
            <span>
              {mostrarInfo
                ? services.formatarCurrency(
                    relatoriosBasicos.faturamentoDia || 0
                  )
                : "••••••"}
            </span>
          </div>

          <div className="card-info alert">
            <p style={{ color: "white" }}>Alertas de Estoque</p>
            <div className="info-bottom">
              <ShoppingBasket className="icon yellow" />
              <strong>{relatoriosBasicos.produtosEstoqueMinimo}</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
