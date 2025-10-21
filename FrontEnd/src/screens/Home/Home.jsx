import "./Home.css";
import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";
import services from "../../services/services";
import relatorioFetch from "../../api/relatorioFetch";
import caixaFetch from "../../api/caixaFetch";
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
  Activity,
} from "lucide-react";

// Dados mockados para fallback
const MOCK_DATA = Array.from({ length: 6 }, (_, i) => ({
  name: `M${i + 1}`,
  Despesas: 0,
  Receitas: 0,
  Vendas: 0,
}));

// Links de navegação configuráveis
const NAVIGATION_LINKS = [
  { to: "/funcionarios", icon: GiTakeMyMoney, label: "Funcionários" },
  { to: "/planosEBoletos", icon: FaTools, label: "Planos" },
  { to: "/fluxoDeCaixa", icon: MdAttachMoney, label: "Fluxo" },
  { to: "/pontoDeVenda", icon: FaComputer, label: "PDV" },
];

// Opções de Filtro de Período
const PERIOD_OPTIONS = [
  { label: "Mês", value: "mes" },
  { label: "Trimestre", value: "trimestre" },
  { label: "Semestre", value: "semestre" },
  { label: "Anual", value: "anual" },
];

/**
 * Função utilitária para obter a data de início do período atual.
 */
const getCurrentPeriodStart = (date, periodFilter) => {
  const inicioAtual = new Date(date);
  inicioAtual.setDate(1);
  inicioAtual.setHours(0, 0, 0, 0);
  
  switch (periodFilter) {
    case "trimestre":
      inicioAtual.setMonth(date.getMonth() - 2);
      break;
    case "semestre":
      inicioAtual.setMonth(date.getMonth() - 5);
      break;
    case "anual":
      inicioAtual.setMonth(date.getMonth() - 11);
      break;
    case "mes":
    default:
      break;
  }
  
  return inicioAtual;
};

/**
 * Função utilitária para ajustar datas para o período anterior.
 */
const getPreviousPeriodStart = (date, period) => {
  const current = getCurrentPeriodStart(date, period);
  const previous = new Date(current);
  
  switch (period) {
    case "trimestre":
      previous.setMonth(current.getMonth() - 3);
      break;
    case "semestre":
      previous.setMonth(current.getMonth() - 6);
      break;
    case "anual":
      previous.setFullYear(current.getFullYear() - 1);
      break;
    case "mes":
    default:
      previous.setMonth(current.getMonth() - 1);
      break;
  }
  
  return previous;
};

/**
 * Função para processar o array de movimentos do caixa e vendas para gerar os dados do gráfico.
 */
const processarDadosParaGrafico = (movimentacoes = [], vendas = [], periodFilter = "mes") => {
  if ((!Array.isArray(movimentacoes) || movimentacoes.length === 0) && 
      (!Array.isArray(vendas) || vendas.length === 0)) {
    return MOCK_DATA;
  }

  const agora = new Date();
  const inicioAtual = getCurrentPeriodStart(agora, periodFilter);
  const dataAgregada = new Map();
  const formatoMes = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

  // Determinar o número de meses no período
  const numMeses = {
    mes: 1,
    trimestre: 3,
    semestre: 6,
    anual: 12
  }[periodFilter] || 1;

  // Gerar todos os meses no período
  for (let i = 0; i < numMeses; i++) {
    const tempDate = new Date(inicioAtual);
    tempDate.setMonth(inicioAtual.getMonth() + i);
    
    const key = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}`;
    const nomeMes = formatoMes.format(tempDate);
    const nomeFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1, 3);
    
    dataAgregada.set(key, { name: nomeFormatado, Despesas: 0, Receitas: 0, Vendas: 0 });
  }

  // Processar movimentações do caixa
  if (Array.isArray(movimentacoes)) {
    movimentacoes.forEach((movimento) => {
      const dataMovimento = new Date(movimento.data);

      if (dataMovimento >= inicioAtual && dataMovimento <= agora) {
        const key = `${dataMovimento.getFullYear()}-${String(dataMovimento.getMonth() + 1).padStart(2, '0')}`;
        
        if (dataAgregada.has(key)) {
          const item = dataAgregada.get(key);
          const valor = parseFloat(movimento.valor) || 0;
          
          if (movimento.tipo === "entrada") {
            item.Receitas += valor;
          } else if (movimento.tipo === "saida") {
            item.Despesas += valor;
          }
        }
      }
    });
  }

  // Processar vendas
  if (Array.isArray(vendas)) {
    vendas.forEach((venda) => {
      const dataVenda = new Date(venda.data_venda);
      
      if (dataVenda >= inicioAtual && dataVenda <= agora) {
        const key = `${dataVenda.getFullYear()}-${String(dataVenda.getMonth() + 1).padStart(2, '0')}`;
        
        if (dataAgregada.has(key)) {
          const item = dataAgregada.get(key);
          const valorVenda = parseFloat(venda.valor_total) || 0;
          item.Vendas += valorVenda;
        }
      }
    });
  }

  // Formatar o resultado
  const chartData = Array.from(dataAgregada.values()).map(item => ({
    ...item,
    Receitas: parseFloat(item.Receitas.toFixed(2)),
    Despesas: parseFloat(item.Despesas.toFixed(2)),
    Vendas: parseFloat(item.Vendas.toFixed(2)),
  }));

  return chartData.length > 0 ? chartData : MOCK_DATA;
};

/**
 * Função para processar o array de vendas brutas e calcular as métricas do período.
 */
const processarFaturamentoComPeriodo = (vendas = [], periodFilter = "mes") => {
  const agora = new Date();
  const inicioAtual = getCurrentPeriodStart(agora, periodFilter);
  const inicioAnterior = getPreviousPeriodStart(agora, periodFilter);
  const fimAnterior = new Date(inicioAtual);
  fimAnterior.setMilliseconds(-1);

  let faturamentoAtual = 0;
  let faturamentoAnterior = 0;
  let totalVendasAtual = 0;
  let totalVendasAnterior = 0;

  const diaAtual = agora.getDate();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();
  let faturamentoDiaAtual = 0;
  let vendasDoDia = 0;

  vendas.forEach((venda) => {
    const dataVenda = new Date(venda.data_venda);
    const valorTotal = parseFloat(venda.valor_total) || 0;

    if (
      dataVenda.getDate() === diaAtual &&
      dataVenda.getMonth() === mesAtual &&
      dataVenda.getFullYear() === anoAtual
    ) {
      faturamentoDiaAtual += valorTotal;
      vendasDoDia++;
    }

    if (dataVenda >= inicioAtual && dataVenda <= agora) {
      faturamentoAtual += valorTotal;
      totalVendasAtual++;
    } else if (dataVenda >= inicioAnterior && dataVenda <= fimAnterior) {
      faturamentoAnterior += valorTotal;
      totalVendasAnterior++;
    }
  });

  let variacao = 0;
  if (faturamentoAnterior > 0) {
    variacao = ((faturamentoAtual - faturamentoAnterior) / faturamentoAnterior) * 100;
  } else if (faturamentoAtual > 0) {
    variacao = 100;
  }

  const ticketMedioAtual = totalVendasAtual > 0 ? faturamentoAtual / totalVendasAtual : 0;

  return {
    faturamentoAtual,
    faturamentoAnterior,
    variacao: parseFloat(variacao.toFixed(2)),
    faturamentoDia: faturamentoDiaAtual,
    vendasHoje: vendasDoDia,
    totalVendasPeriodo: totalVendasAtual,
    ticketMedio: parseFloat(ticketMedioAtual.toFixed(2)),
    periodFilter,
  };
};

function Home() {
  const [relatoriosBasicos, setRelatoriosBasicos] = useState({});
  const [data, setData] = useState(MOCK_DATA);
  const [movimentacoesCaixa, setMovimentacoesCaixa] = useState([]);
  const [vendasBrutas, setVendasBrutas] = useState([]);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [periodFilter, setPeriodFilter] = useState("semestre");

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

  // Função que busca dados de entrada e saida do caixa
  const fetchbuscardadoscaixa = useCallback(async () => {
    try {
      const response = await caixaFetch.buscarMovimentacao();
      if (response && Array.isArray(response)) {
        setMovimentacoesCaixa(response);
      } else {
        setMovimentacoesCaixa([]);
      }
    } catch (error) {
      console.error("Erro ao buscar movimentações do caixa:", error);
      setMovimentacoesCaixa([]);
    }
  }, []);

  // Função centralizada de busca e processamento de dados
  const fetchAndProcessRelatorios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await relatorioFetch.buscarRelatoriosBasicos();

      let processedData = {};

      if (
        response?.faturamento &&
        Array.isArray(response.faturamento) &&
        response.faturamento.length > 0
      ) {
        // Armazenar vendas brutas para o gráfico
        setVendasBrutas(response.faturamento);

        const {
          faturamentoAtual,
          faturamentoAnterior,
          variacao,
          faturamentoDia,
          vendasHoje,
          totalVendasPeriodo,
          ticketMedio,
        } = processarFaturamentoComPeriodo(response.faturamento, periodFilter);

        processedData = {
          ...response,
          faturamentoAtual,
          faturamentoAnterior,
          variacao,
          faturamentoDia,
          vendasHoje,
          totalVendasPeriodo,
          ticketMedio,
        };
      } else {
        processedData = response || {};
      }

      setRelatoriosBasicos(processedData);
      tratarErroApi(response);
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
      setRelatoriosBasicos({});
    } finally {
      setLoading(false);
    }
  }, [tratarErroApi, periodFilter]);

  // Atualizar dados do gráfico quando movimentações, vendas ou filtro mudarem
  useEffect(() => {
    const chartData = processarDadosParaGrafico(movimentacoesCaixa, vendasBrutas, periodFilter);
    setData(chartData);
  }, [movimentacoesCaixa, vendasBrutas, periodFilter]);

  // Buscar dados iniciais
  useEffect(() => {
    fetchbuscardadoscaixa();
    fetchAndProcessRelatorios();
  }, [fetchbuscardadoscaixa, fetchAndProcessRelatorios]);

  // Handlers otimizados
  const handleAtualizar = useCallback(() => {
    window.electronAPI?.instalarAtualizacao();
  }, []);

  const toggleMostrarInfo = useCallback(() => {
    setMostrarInfo((prev) => !prev);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, [setIsDark]);

  const handlePeriodChange = useCallback((event) => {
    setPeriodFilter(event.target.value);
  }, []);

  // Cálculos memoizados
  const metricas = useMemo(() => {
    const variacao = relatoriosBasicos.variacao || 0;
    const isPositive = variacao >= 0;

    return {
      faturamento: {
        atual: relatoriosBasicos.faturamentoAtual || 0,
        variacao,
        isPositive,
      },
      clientes: {
        ativos: relatoriosBasicos.clientesAtivos || 0,
        novos: relatoriosBasicos.clientesNovosMes || 0,
        inativos: Math.floor((relatoriosBasicos.clientesAtivos || 0) * 0.25),
      },
      vendas: {
        hoje: relatoriosBasicos.vendasHoje || 0,
        meta: relatoriosBasicos.metaVendas || 50,
        ticket: relatoriosBasicos.ticketMedio || 0,
        totalPeriodo: relatoriosBasicos.totalVendasPeriodo || 0,
      },
      estoque: {
        total: relatoriosBasicos.totalProdutos || 0,
        baixo: relatoriosBasicos.produtosEstoqueMinimo || 0,
        valor: relatoriosBasicos.valorEstoque || 0,
      },
    };
  }, [relatoriosBasicos]);

  // Componente dos botões de navegação compactos
  const NavigationButtons = useMemo(
    () => (
      <div className="nav-compact">
        {NAVIGATION_LINKS.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="nav-btn">
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    ),
    []
  );

  // Cards de métricas principais
  const MetricCards = useMemo(() => {
    const { faturamento, vendas } = metricas;
    const ArrowIcon = faturamento.isPositive ? IoMdArrowDropup : IoMdArrowDropdown;
    const changeClass = faturamento.isPositive ? "success" : "danger";

    return (
      <div className="metrics-grid">
        {/* Faturamento Principal (Período Atual) */}
        <div className="metric-card primary">
          <div className="metric-icon">
            <TrendingUp />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {mostrarInfo
                ? services.formatarCurrency(faturamento.atual)
                : "••••••"}
            </div>
            <div className="metric-label">
              Faturamento {periodFilter.charAt(0).toUpperCase() + periodFilter.slice(1)}
            </div>
            <div className={`metric-change ${changeClass}`}>
              <span className="arrow-icon"><ArrowIcon /></span>
              {faturamento.variacao}% vs Período Ant.
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
              {mostrarInfo
                ? services.formatarCurrency(relatoriosBasicos.faturamentoDia || 0)
                : "••••••"}
            </div>
            <div className="metric-label">Vendas Hoje</div>
            <div className="metric-subtitle">
              {vendas.hoje} vendas realizadas
            </div>
          </div>
        </div>

        {/* Ticket Médio (Período Atual) */}
        <div className="metric-card warning">
          <div className="metric-icon">
            <Target />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {mostrarInfo
                ? services.formatarCurrency(vendas.ticket)
                : "••••"}
            </div>
            <div className="metric-label">
              Ticket Médio {periodFilter.charAt(0).toUpperCase() + periodFilter.slice(1)}
            </div>
            <div className="metric-subtitle">
              {vendas.totalPeriodo} vendas no total
            </div>
          </div>
        </div>

        {/* Dívidas Ativas */}
        <div className="metric-card danger">
          <div className="metric-icon">
            <AlertTriangle />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {mostrarInfo
                ? services.formatarCurrency(relatoriosBasicos.dividasAtivas || 0)
                : "••••"}

                {console.log(relatoriosBasicos.dividasAtivas)}
            </div>
            <div className="metric-label">Dívidas Ativas</div>
            <div className="metric-subtitle">Valor de dívidas</div>
          </div>
        </div>
      </div>
    );
  }, [mostrarInfo, metricas, relatoriosBasicos, periodFilter]);

  // Informações adicionais compactas
  const InfoPanels = useMemo(
    () => (
      <div className="info-panels">
        {/* Painel de Alertas */}
        <div className="info-panel alerts">
          <h4>
            <AlertTriangle size={16} />
            Alertas
          </h4>
          <div className="alert-items">
            <div className="alert-item">
              <span className="alert-count danger">
                {relatoriosBasicos.crediariosAtrasados || 0}
              </span>
              <span className="alert-text">Pagamentos vencidos</span>
            </div>
            <div className="alert-item">
              <span className="alert-count warning">
                {metricas.estoque.baixo}
              </span>
              <span className="alert-text">Produtos com estoque baixo</span>
            </div>
            <div className="alert-item">
              <span className="alert-count info">
                {metricas.clientes.novos}
              </span>
              <span className="alert-text">Clientes novos no mês</span>
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
              <span className="performance-label">Estoque convertido</span>
              <span className="performance-value">
                {mostrarInfo ? "10%" : "••••••"}
              </span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Produtos Vendidos</span>
              <span className="performance-value">
                {metricas.vendas.hoje * 2}
              </span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Valor em Estoque</span>
              <span className="performance-value">
                {mostrarInfo
                  ? services.formatarCurrency(relatoriosBasicos.valorEmEstoque)
                  : "••••••"}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    [relatoriosBasicos, metricas, mostrarInfo]
  );

  return (
    <div className="dashboard">
      {/* Header compacto */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>{dadosLoja.nomeEstabelecimento || "Dashboard"}</h1>
          <span className="header-subtitle">
            Visão geral • {new Date().toLocaleDateString("pt-BR")}
          </span>
        </div>

        <div className="header-controls">
          {/* Select de Filtro de Período */}
          <select
            value={periodFilter}
            onChange={handlePeriodChange}
            className="control-select"
            title="Filtrar por Período"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            className={`control-btn ${updateReady ? "update" : ""}`}
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
            disabled
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Layout principal em grid */}
      <div className="dashboard-grid">
        {/* Coluna da esquerda - Navegação */}
        <div className="grid-left">{NavigationButtons}</div>

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
                <span className="legend-item">
                  <div className="legend-color warning"></div>
                  Vendas
                </span>
              </div>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
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
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value) => services.formatarCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="Receitas"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Despesas"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Vendas"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Coluna da direita - Informações adicionais */}
        <div className="grid-right">{InfoPanels}</div>
      </div>
      {/* Métricas na parte inferior */}
      <div className="dashboard-bottom">{MetricCards}</div>
    </div>
  );
}

export default Home;