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
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Ícones Usados
import { FaTools } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";
import { FaComputer } from "react-icons/fa6";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { 
  TrendingUp, 
  Users, 
  Receipt, 
  AlertTriangle, 
  Calendar,
  CreditCard,
  Package,
  Target,
  DollarSign,
  Activity
} from "lucide-react";

// Dados mockados para fallback
const MOCK_DATA = Array.from({ length: 6 }, (_, i) => ({
  name: `M${i + 1}`,
  Despesas: Math.floor(Math.random() * 20) + 10,
  Receitas: Math.floor(Math.random() * 30) + 20,
}));

// Links de navegação configuráveis
const NAVIGATION_LINKS = [
  { to: "/funcionarios", icon: GiTakeMyMoney, label: "Funcionários" },
  { to: "/planosEBoletos", icon: FaTools, label: "Planos" },
  { to: "/fluxoDeCaixa", icon: MdAttachMoney, label: "Fluxo" },
  { to: "/pontoDeVenda", icon: FaComputer, label: "PDV" },
];

function Home() {
  const [relatoriosBasicos, setRelatoriosBasicos] = useState({});
  const [data, setData] = useState([]);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [loading, setLoading] = useState(false);

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
          name: dados.mes?.substring(0, 3) || "Mês",
          Despesas: dados.despesas || 0,
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
  const metricas = useMemo(() => {
    const faturamentoArray = relatoriosBasicos.faturamento || [];
    const len = faturamentoArray.length;

    return {
      faturamento: {
        atual: len >= 1 ? faturamentoArray[len - 1].faturamento : 0,
        anterior: len >= 2 ? faturamentoArray[len - 2].faturamento : 0,
        variacao: len >= 1 ? faturamentoArray[len - 1].variacao : 0,
      },
      clientes: {
        ativos: relatoriosBasicos.clientesAtivos || 0,
        novos: Math.floor((relatoriosBasicos.clientesAtivos || 0) * 0.15), // 15% estimado
        inativos: Math.floor((relatoriosBasicos.clientesAtivos || 0) * 0.25), // 25% estimado
      },
      vendas: {
        hoje: relatoriosBasicos.vendasHoje || 0,
        meta: relatoriosBasicos.metaVendas || 50,
        ticket: relatoriosBasicos.ticketMedio || 0,
      },
      estoque: {
        total: relatoriosBasicos.totalProdutos || 0,
        baixo: relatoriosBasicos.produtosEstoqueMinimo || 0,
        valor: relatoriosBasicos.valorEstoque || 0,
      }
    };
  }, [relatoriosBasicos]);

  // Componente dos botões de navegação compactos
  const NavigationButtons = useMemo(() => (
    <div className="nav-compact">
      {NAVIGATION_LINKS.map(({ to, icon: Icon, label }) => (
        <Link key={to} to={to} className="nav-btn">
          <Icon />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  ), []);

  // Cards de métricas principais (mais compactos)
  const MetricCards = useMemo(() => (
    <div className="metrics-grid">
      {/* Faturamento Principal */}
      <div className="metric-card primary">
        <div className="metric-icon">
          <TrendingUp />
        </div>
        <div className="metric-content">
          <div className="metric-value">
            {mostrarInfo ? services.formatarCurrency(metricas.faturamento.atual) : "••••••"}
          </div>
          <div className="metric-label">Faturamento Mensal</div>
          <div className="metric-change positive">
            <IoMdArrowDropup />
            {metricas.faturamento.variacao}%
          </div>
        </div>
      </div>

      {/* Vendas do Dia */}
      <div className="metric-card success">
        <div className="metric-icon">
          <DollarSign />
        </div>
        <div className="metric-content">
          <div className="metric-value">
            {mostrarInfo ? services.formatarCurrency(relatoriosBasicos.faturamentoDia || 0) : "••••••"}
          </div>
          <div className="metric-label">Vendas Hoje</div>
          <div className="metric-subtitle">
            {metricas.vendas.hoje} vendas realizadas
          </div>
        </div>
      </div>

      {/* Clientes Ativos */}
      <div className="metric-card info">
        <div className="metric-icon">
          <Users />
        </div>
        <div className="metric-content">
          <div className="metric-value">{metricas.clientes.ativos}</div>
          <div className="metric-label">Clientes Ativos</div>
          <div className="metric-subtitle">
            +{metricas.clientes.novos} novos este mês
          </div>
        </div>
      </div>

      {/* Ticket Médio */}
      <div className="metric-card warning">
        <div className="metric-icon">
          <Target />
        </div>
        <div className="metric-content">
          <div className="metric-value">
            {mostrarInfo ? services.formatarCurrency(metricas.vendas.ticket) : "••••"}
          </div>
          <div className="metric-label">Ticket Médio</div>
          <div className="metric-subtitle">
            Meta: {services.formatarCurrency(metricas.vendas.meta * 1000)}
          </div>
        </div>
      </div>

      {/* Orçamentos */}
      <div className="metric-card secondary">
        <div className="metric-icon">
          <Receipt />
        </div>
        <div className="metric-content">
          <div className="metric-value">{relatoriosBasicos.totalOrcamentos || 0}</div>
          <div className="metric-label">Orçamentos</div>
          <div className="metric-subtitle">Aguardando aprovação</div>
        </div>
      </div>

      {/* Estoque Crítico */}
      <div className="metric-card danger">
        <div className="metric-icon">
          <AlertTriangle />
        </div>
        <div className="metric-content">
          <div className="metric-value">{metricas.estoque.baixo}</div>
          <div className="metric-label">Estoque Baixo</div>
          <div className="metric-subtitle">
            Produtos em falta
          </div>
        </div>
      </div>
    </div>
  ), [mostrarInfo, metricas, relatoriosBasicos]);

  // Informações adicionais compactas
  const InfoPanels = useMemo(() => (
    <div className="info-panels">
      {/* Painel de Alertas */}
      <div className="info-panel alerts">
        <h4>
          <AlertTriangle size={16} />
          Alertas
        </h4>
        <div className="alert-items">
          <div className="alert-item">
            <span className="alert-count danger">{relatoriosBasicos.crediariosAtrasados || 0}</span>
            <span className="alert-text">Pagamentos vencidos</span>
          </div>
          <div className="alert-item">
            <span className="alert-count warning">{metricas.estoque.baixo}</span>
            <span className="alert-text">Produtos com estoque baixo</span>
          </div>
          <div className="alert-item">
            <span className="alert-count info">{metricas.clientes.inativos}</span>
            <span className="alert-text">Clientes inativos</span>
          </div>
        </div>
      </div>

      {/* Painel de Performance */}
      <div className="info-panel performance">
        <h4>
          <Activity size={16} />
          Performance
        </h4>
        <div className="performance-items">
          <div className="performance-item">
            <span className="performance-label">Taxa de Conversão</span>
            <span className="performance-value">3.2%</span>
          </div>
          <div className="performance-item">
            <span className="performance-label">Produtos Vendidos</span>
            <span className="performance-value">{metricas.vendas.hoje * 2}</span>
          </div>
          <div className="performance-item">
            <span className="performance-label">Valor em Estoque</span>
            <span className="performance-value">
              {mostrarInfo ? services.formatarCurrency(metricas.estoque.valor) : "••••••"}
            </span>
          </div>
        </div>
      </div>
    </div>
  ), [relatoriosBasicos, metricas, mostrarInfo]);

  return (
    <div className="dashboard">
      {/* Header compacto */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>{dadosLoja.nomeEstabelecimento || "Dashboard"}</h1>
          <span className="header-subtitle">Visão geral • {new Date().toLocaleDateString('pt-BR')}</span>
        </div>
        
        <div className="header-controls">
          <button
            className={`control-btn ${updateReady ? 'update' : ''}`}
            onClick={handleAtualizar}
            disabled={!updateReady}
            title="Atualizar"
          >
            <MdOutlineBrowserUpdated />
            {updateReady && <span className="update-dot" />}
          </button>

          <button
            className="control-btn"
            onClick={toggleMostrarInfo}
            title={mostrarInfo ? "Ocultar valores" : "Mostrar valores"}
          >
            {mostrarInfo ? <FaEye /> : <FaEyeSlash />}
          </button>

          <button
            className="control-btn"
            onClick={toggleDarkMode}
            title="Tema"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Layout principal em grid */}
      <div className="dashboard-grid">
        {/* Coluna da esquerda - Navegação */}
        <div className="grid-left">
          {NavigationButtons}
        </div>

        {/* Coluna central - Gráfico */}
        <div className="grid-center">
          <div className="chart-panel">
            <div className="chart-header">
              <h3>Tendência Financeira</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <div className="legend-color success"></div>
                  Receitas
                </span>
                <span className="legend-item">
                  <div className="legend-color danger"></div>
                  Despesas
                </span>
              </div>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Receitas" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Despesas" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Coluna da direita - Informações adicionais */}
        <div className="grid-right">
          {InfoPanels}
        </div>
      </div>
      {/* Métricas na parte inferior */}
      <div className="dashboard-bottom">
        {MetricCards}
      </div>
    </div>
  );
}

export default Home;