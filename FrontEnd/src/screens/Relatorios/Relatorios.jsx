import { useState } from "react";
import "./Relatorios.css";

// Componentes
import EmBreve from "../../components/EmBreve/EmBreve";

// SubTelas
import ResumoVisãoGeral from "./SubScreens/ResumoVisãoGeral/ResumoVisãoGeral";
import DashboardExecutivo from "./SubScreens/DashboardExecutivo/DashboardExecutivo";

function Relatorios() {
  const [abaAtiva, setAbaAtiva] = useState("Resumo");

  const handleClick = (nomeAba) => {
    setAbaAtiva(nomeAba);
  };

  const menuItems = [
    {
      categoria: "Visão Geral",
      items: ["Resumo", "Dashboard Executivo"],
    },
    {
      categoria: "Lucratividade",
      items: [
        "Receita/Despesas",
        "Por produto vendido",
        "Margem por categoria",
      ],
    },
    {
      categoria: "Fornecedores",
      items: ["Por produto", "Vendas analítico", "Performance de entrega"],
    },
    {
      categoria: "Vendas",
      items: [
        "Meios de pagamento",
        "Comissão por vendedor",
        "Horário de pico",
        "Categoria de produto",
        "Vendedor",
        "Produto",
        "Cliente e categoria",
        "Vendas e retenção",
        "Produtos monofásico",
      ],
    },
    {
      categoria: "Estoque",
      items: [
        "Uso e consumo interno",
        "Recomendação de estoque",
        "Giro de estoque",
      ],
    },
    {
      categoria: "Clientes",
      items: ["Ranking de vendas", "Análise de comportamento", "Retenção"],
    },
    {
      categoria: "Contas a pagar",
      items: ["A vencer", "A pagar", "Histórico de pagamentos"],
    },
    {
      categoria: "Entregas",
      items: ["Por entregador", "Por transportadora", "Tempo médio"],
    },
  ];

  const renderMenuItem = (label) => (
    <button
      key={label}
      className={`menu-item ${abaAtiva === label ? "menu-item-active" : ""}`}
      onClick={() => handleClick(label)}
    >
      {label}
    </button>
  );

  const renderAba = () => {
    switch (abaAtiva) {
      case "Resumo":
        return <ResumoVisãoGeral />;
      case "Dashboard Executivo":
        return <DashboardExecutivo />;
      default:
        return (
          <div className="content-placeholder">
            <h3>{abaAtiva}</h3>
            <p>
              Este relatório será desenvolvido em breve. Funcionalidade
              específica para análise de {abaAtiva.toLowerCase()}.
            </p>
          </div>
        );
    }
  };

  return (
    <div id="Relatorios">
      <EmBreve />
      <header className="relatorios-header">
        <h2>📊 Relatórios</h2>
        <p>Análise completa dos dados do seu negócio</p>
      </header>

      <div id="divLadoladoRelatorios">
        <nav id="menuRelatorios">
          {menuItems.map((section) => (
            <div key={section.categoria} className="divMenuRelatorios">
              <h4 className="menu-section-title">{section.categoria}</h4>
              <div className="menu-items">
                {section.items.map(renderMenuItem)}
              </div>
            </div>
          ))}
        </nav>

        <main className="relatorios-content">{renderAba()}</main>
      </div>
    </div>
  );
}

export default Relatorios;
