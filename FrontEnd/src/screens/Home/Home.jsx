import "./Home.css";
import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";
import services from "../../services/services";
import relatorioFetch from "../../api/relatorioFetch";
import { MdOutlineBrowserUpdated } from "react-icons/md";

// Biblioteca de Gráficos
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Ícones Usados
import { FaTools } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";
import { FaComputer } from "react-icons/fa6";
import { IoMdArrowDropup } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Dados mockados para fallback
const MOCK_DATA = Array.from({ length: 7 }, () => ({
  name: "Mês",
  Despesas: 10,
  Receitas: 40,
}));

// Links de navegação configuráveis
const NAVIGATION_LINKS = [
  { to: "/funcionarios", icon: GiTakeMyMoney, label: "Funcionários" },
  { to: "/planosEBoletos", icon: FaTools, label: "Planos e Boletos" },
  { to: "/fluxoDeCaixa", icon: MdAttachMoney, label: "Fluxo de Caixa" },
  { to: "/pontoDeVenda", icon: FaComputer, label: "PDV" },
];

function Home() {
  const [relatoriosBasicos, setRelatoriosBasicos] = useState({});
  const [data, setData] = useState([]);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  const {
    isDark,
    setIsDark,
    dadosLoja,
    setErroApi,
    setVencido,
    setFazerLogin,
    tratarErroApi,
  } = useContext(AppContext);

  // Gerenciar tema
  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDark);
  }, [isDark]);

  // Configurar listeners do Electron
  useEffect(() => {
    const electronAPI = window?.electronAPI;
    if (!electronAPI) return;

    const handleUpdateAvailable = () => {
      console.log("🔔 Atualização disponível!");
    };

    const handleUpdateDownloaded = () => {
      console.log("📦 Atualização baixada!");
      setUpdateReady(true);
    };

    electronAPI.onUpdateAvailable(handleUpdateAvailable);
    electronAPI.onUpdateDownloaded(handleUpdateDownloaded);

    // Cleanup não é necessário pois são listeners do Electron
  }, []);

  // Buscar dados dos relatórios
  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const response = await relatorioFetch.buscarRelatoriosBasicos();
        
        if (Array.isArray(response)) {
          setRelatoriosBasicos(response);
        } else {
          setRelatoriosBasicos(response || {});
          if (!response) {
            console.warn("Resposta inesperada:", response);
          }
        }
        
        tratarErroApi(response);

        // Mapear dados do faturamento para o gráfico
        const chartData = response?.faturamento?.map((dados) => ({
          name: dados.mes,
          Despesas: 0,
          Receitas: dados.faturamento,
        })) || MOCK_DATA;

        setData(chartData);
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        setData(MOCK_DATA);
      }
    };

    fetchRelatorios();
  }, [tratarErroApi]);

  // Handlers otimizados
  const handleAtualizar = useCallback(() => {
    window.electronAPI?.instalarAtualizacao();
  }, []);

  const toggleMostrarInfo = useCallback(() => {
    setMostrarInfo(prev => !prev);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => !prev);
  }, [setIsDark]);

  // Cálculos memoizados
  const faturamentoData = useMemo(() => {
    const faturamentoArray = relatoriosBasicos.faturamento || [];
    const len = faturamentoArray.length;

    return {
      atual: len >= 1 ? faturamentoArray[len - 1].faturamento : 0,
      anterior: len >= 2 ? faturamentoArray[len - 2].faturamento : 0,
      variacao: len >= 1 ? faturamentoArray[len - 1].variacao : 0,
    };
  }, [relatoriosBasicos.faturamento]);

  // Componente dos botões de navegação
  const NavigationButtons = useMemo(() => (
    <div className="ButtonHeaderDeashBoard">
      {NAVIGATION_LINKS.map(({ to, icon: Icon, label }) => (
        <Link key={to} to={to} className="bttButtonHeaderDeashBoard">
          <Icon /> {label}
        </Link>
      ))}
    </div>
  ), []);

  // Componente das métricas
  const MetricsCards = useMemo(() => (
    <div className="LoyautCardMétricasBox">
      <article className="cardMétricasBox green">
        <div>
          <h2>Receitas</h2>
          <h1>R$ 00,00</h1>
        </div>
        <div>
          <div className="linha" />
          <div className="displayFlex">
            <div>
              <p>Último mês</p>
              <strong>R$ 00,00</strong>
            </div>
            <div>
              <p>
                <IoMdArrowDropup />
                Variação
              </p>
              <strong>0%</strong>
            </div>
          </div>
        </div>
      </article>

      <article className="cardMétricasBox red">
        <div>
          <h2>Despesas</h2>
          <h1>R$ 00,00</h1>
        </div>
        <div>
          <div className="linha" />
          <div className="displayFlex">
            <div>
              <p>Último mês</p>
              <strong>R$ 00,00</strong>
            </div>
            <div>
              <p>
                <IoMdArrowDropup />
                Variação
              </p>
              <strong>0%</strong>
            </div>
          </div>
        </div>
      </article>

      <article className="cardMétricasBox orange">
        <div>
          <h2>Faturamento Mensal</h2>
          <h1>
            {mostrarInfo
              ? services.formatarCurrency(faturamentoData.atual)
              : "••••••"}
          </h1>
        </div>
        <div>
          <div className="linha" />
          <div className="displayFlex">
            <div>
              <p>Último mês</p>
              <strong>
                {mostrarInfo
                  ? services.formatarCurrency(faturamentoData.anterior)
                  : "••••••"}
              </strong>
            </div>
            <div>
              <p>
                <IoMdArrowDropup />
                Crescimento
              </p>
              <strong>{faturamentoData.variacao}%</strong>
            </div>
          </div>
        </div>
      </article>
    </div>
  ), [mostrarInfo, faturamentoData]);

  // Componente das informações principais
  const InfoCards = useMemo(() => (
    <div id="InfoHomeDeash">
      <div className="card-info">
        <p>Pagamentos Vencidos</p>
        <span className="badge">{relatoriosBasicos.crediariosAtrasados}</span>
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
            ? services.formatarCurrency(relatoriosBasicos.faturamentoDia || 0)
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
  ), [relatoriosBasicos, mostrarInfo]);

  return (
    <div id="Homescreen">
      <div className="NotificationHomeScreen">
        <div style={{ position: "relative" }}>
          {updateReady && <span id="circleAtualizacao" />}
          <button
            id="ButtonDarkMode"
            onClick={handleAtualizar}
            disabled={!updateReady}
            title="Instalar Atualização"
          >
            <MdOutlineBrowserUpdated />
          </button>
        </div>

        <button
          id="ButtonDarkMode"
          onClick={toggleMostrarInfo}
          aria-label={mostrarInfo ? "Esconder informações" : "Mostrar informações"}
          title={mostrarInfo ? "Esconder informações" : "Mostrar informações"}
        >
          {mostrarInfo ? <FaEye /> : <FaEyeSlash />}
        </button>

        <button
          id="ButtonDarkMode"
          onClick={toggleDarkMode}
          disabled={true}
          title="Alternar tema"
        >
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

        {NavigationButtons}
        {MetricsCards}
      </header>

      <main>
        {InfoCards}
      </main>
    </div>
  );
}

export default Home;