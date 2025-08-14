import React, { useState, useEffect } from "react";
import "./Arquivos.css";

//api
import vendaFetch from "../../api/vendaFetch";

//services
import services from "../../services/services";

//avisos
import EmBreve from "../../components/EmBreve/EmBreve";

// Modal de Edição
const EditModal = ({ isOpen, onClose, item, type, onSave }) => {
  const [formData, setFormData] = useState(item || {});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {type === "installments"
              ? "✏️ Editar Parcela"
              : "📝 Editar Documento"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {type === "installments" ? (
            <>
              <div className="form-group">
                <label>Cliente</label>
                <input
                  type="text"
                  value={formData.cliente || ""}
                  onChange={(e) => handleChange("cliente", e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Parcela</label>
                  <input
                    type="text"
                    value={formData.parcela || ""}
                    onChange={(e) => handleChange("parcela", e.target.value)}
                    placeholder="Ex: 5/12"
                  />
                </div>
                <div className="form-group">
                  <label>Valor</label>
                  <input
                    type="text"
                    value={formData.valor || ""}
                    onChange={(e) => handleChange("valor", e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data de Pagamento</label>
                  <input
                    type="date"
                    value={formData.dataPagamento || ""}
                    onChange={(e) =>
                      handleChange("dataPagamento", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status || "pago"}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option value="pago">Pago</option>
                    <option value="pendente">Pendente</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Título do Documento</label>
                <input
                  type="text"
                  value={formData.titulo || ""}
                  onChange={(e) => handleChange("titulo", e.target.value)}
                  placeholder="Nome do documento"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.tipo || "fatura"}
                    onChange={(e) => handleChange("tipo", e.target.value)}
                  >
                    <option value="fatura">Fatura</option>
                    <option value="recibo">Recibo</option>
                    <option value="nota_fiscal">Nota Fiscal</option>
                    <option value="comprovante">Comprovante</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Valor</label>
                  <input
                    type="text"
                    value={formData.valor || ""}
                    onChange={(e) => handleChange("valor", e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Data do Documento</label>
                <input
                  type="date"
                  value={formData.dataDocumento || ""}
                  onChange={(e) =>
                    handleChange("dataDocumento", e.target.value)
                  }
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Observações</label>
            <textarea
              value={formData.observacoes || ""}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              placeholder="Observações adicionais..."
              rows="3"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSave}>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

// Tela de Lista de Parcelas
const InstallmentsList = ({ onBack, onEditItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [parcelas, setParcelas] = useState([]);

  useEffect(() => {
    vendaFetch.listarVendasCrediario().then((response) => {
      console.log(response);

      const parceParcelas = [
        ...response.map((d) => ({
          id: d.id,
          cliente: d.nome_cliente,
          parcela: "5/12",
          valor: services.formatarCurrency(d.valor_parcela),
          dataPagamento: d.data_pagamento || "0000-00-00",
          status: d.status,
        })),
      ];

      setParcelas(parceParcelas);
    });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pago":
        return "✅";
      case "pendente":
        return "⏳";
      case "atrasado":
        return "⚠️";
      default:
        return "📄";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pago":
        return "#28a745";
      case "pendente":
        return "#ffc107";
      case "atrasado":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const filteredParcelas = parcelas.filter((parcela) => {
    const matchesSearch = parcela.cliente
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "todos" || parcela.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="list-view">
      <div className="list-header">
        <div className="list-title">
          <button className="back-btn" onClick={onBack}>
            ← Voltar
          </button>
          <div>
            <h2>💳 Parcelas de Crediário</h2>
            <p>{filteredParcelas.length} parcelas encontradas</p>
          </div>
        </div>

        <div className="list-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos os Status</option>
            <option value="pago">Pagos</option>
            <option value="pendente">Pendentes</option>
            <option value="atrasado">Atrasados</option>
          </select>
        </div>
      </div>

      <div className="list-content">
        <div className="items-grid">
          {filteredParcelas.map((parcela) => (
            <div
              key={parcela.id}
              className="item-card"
              onClick={() => onEditItem(parcela)}
            >
              <div className="item-header">
                <div className="item-icon">💳</div>
                <div
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(parcela.status) }}
                >
                  {getStatusIcon(parcela.status)} {parcela.status.toUpperCase()}
                </div>
              </div>

              <div className="item-body">
                <h3>{parcela.cliente}</h3>
                <p className="item-subtitle">Parcela {parcela.parcela}</p>

                <div className="item-details">
                  <div className="detail-row">
                    <span className="detail-label">Valor:</span>
                    <span className="detail-value">{parcela.valor}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Data:</span>
                    <span className="detail-value">
                      {new Date(parcela.dataPagamento).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="item-footer">
                <span className="edit-hint">Clique para editar</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tela de Lista de Faturas e Recibos
const InvoicesList = ({ onBack, onEditItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");

  const documentos = [
    {
      id: 1,
      titulo: "Conta de Energia - Agosto",
      tipo: "fatura",
      valor: "R$ 850,00",
      dataDocumento: "2025-08-13",
      fornecedor: "Eletrobras",
    },
    {
      id: 2,
      titulo: "Fornecedor XYZ - Fatura",
      tipo: "fatura",
      valor: "R$ 3.200,00",
      dataDocumento: "2025-08-12",
      fornecedor: "XYZ Materiais",
    },
    {
      id: 3,
      titulo: "Recibo de Pagamento - Silva",
      tipo: "recibo",
      valor: "R$ 1.200,00",
      dataDocumento: "2025-08-11",
      fornecedor: "João Silva",
    },
    {
      id: 4,
      titulo: "Nota Fiscal - Equipamentos",
      tipo: "nota_fiscal",
      valor: "R$ 5.500,00",
      dataDocumento: "2025-08-10",
      fornecedor: "TechStore",
    },
    {
      id: 5,
      titulo: "Comprovante - Transferência",
      tipo: "comprovante",
      valor: "R$ 780,00",
      dataDocumento: "2025-08-09",
      fornecedor: "Banco Digital",
    },
  ];

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case "fatura":
        return "📋";
      case "recibo":
        return "🧾";
      case "nota_fiscal":
        return "📄";
      case "comprovante":
        return "💰";
      default:
        return "📝";
    }
  };

  const getTypeLabel = (tipo) => {
    switch (tipo) {
      case "fatura":
        return "Fatura";
      case "recibo":
        return "Recibo";
      case "nota_fiscal":
        return "Nota Fiscal";
      case "comprovante":
        return "Comprovante";
      default:
        return "Documento";
    }
  };

  const filteredDocumentos = documentos.filter((doc) => {
    const matchesSearch =
      doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "todos" || doc.tipo === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="list-view">
      <div className="list-header">
        <div className="list-title">
          <button className="back-btn" onClick={onBack}>
            ← Voltar
          </button>
          <div>
            <h2>📋 Faturas e Recibos</h2>
            <p>{filteredDocumentos.length} documentos encontrados</p>
          </div>
        </div>

        <div className="list-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="fatura">Faturas</option>
            <option value="recibo">Recibos</option>
            <option value="nota_fiscal">Notas Fiscais</option>
            <option value="comprovante">Comprovantes</option>
          </select>
        </div>
      </div>

      <div className="list-content">
        <div className="items-grid">
          {filteredDocumentos.map((doc) => (
            <div
              key={doc.id}
              className="item-card"
              onClick={() => onEditItem(doc)}
            >
              <div className="item-header">
                <div className="item-icon">{getTypeIcon(doc.tipo)}</div>
                <div className="type-badge">{getTypeLabel(doc.tipo)}</div>
              </div>

              <div className="item-body">
                <h3>{doc.titulo}</h3>
                <p className="item-subtitle">{doc.fornecedor}</p>

                <div className="item-details">
                  <div className="detail-row">
                    <span className="detail-label">Valor:</span>
                    <span className="detail-value">{doc.valor}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Data:</span>
                    <span className="detail-value">
                      {new Date(doc.dataDocumento).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="item-footer">
                <span className="edit-hint">Clique para editar</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente Principal
function Arquivos() {
  const [currentView, setCurrentView] = useState("home");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentType, setCurrentType] = useState(null);

  const menuItems = [
    {
      id: "installments",
      icon: "💳",
      title: "Parcelas de Crediário",
      description: "Visualizar todas as parcelas de crediário já pagas",
      count: "1,247 parcelas",
      color: "#4285f4",
    },
    {
      id: "invoices",
      icon: "📋",
      title: "Faturas e Recibos",
      description: "Documentos fiscais e comprovantes",
      count: "432 documentos",
      color: "#4285f4",
    },
  ];

  const handleMenuClick = (item) => {
    setCurrentView(item.id);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setCurrentType(currentView);
    setModalOpen(true);
  };

  const handleSaveItem = (updatedItem) => {
    console.log("Item atualizado:", updatedItem);
    // Aqui você implementaria a lógica para salvar no backend
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "installments":
        return (
          <InstallmentsList
            onBack={handleBackToHome}
            onEditItem={handleEditItem}
          />
        );
      case "invoices":
        return (
          <InvoicesList onBack={handleBackToHome} onEditItem={handleEditItem} />
        );
      default:
        return (
          <>
            <div className="content-header">
              <div className="breadcrumb">
                <span className="breadcrumb-item active">Início</span>
              </div>

              <div className="header-actions">
                <button className="header-btn">
                  <span>⚙️</span>
                  Configurações
                </button>
                <button className="header-btn">
                  <span>📊</span>
                  Relatórios
                </button>
              </div>
            </div>

            <div className="welcome-section">
              <div className="welcome-card">
                <div className="welcome-icon">🎯</div>
                <h2>Bem-vindo ao Sistema de Arquivos</h2>
                <p>
                  Gerencie todos os seus documentos financeiros de forma
                  organizada e segura.
                </p>

                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">2,054</div>
                    <div className="stat-label">Total de Documentos</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">R$ 847K</div>
                    <div className="stat-label">Valor Total Processado</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">156</div>
                    <div className="stat-label">Clientes Ativos</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-section">
              <div className="section-header">
                <h3>📋 Documentos Recentes</h3>
                <button className="see-all-btn">Ver todos</button>
              </div>

              <div className="recent-items">
                <div className="recent-item">
                  <div className="recent-icon">💰</div>
                  <div className="recent-info">
                    <div className="recent-name">João Silva - Parcela 5/12</div>
                    <div className="recent-date">Hoje, 14:30</div>
                  </div>
                  <div className="recent-amount">R$ 150,00</div>
                </div>

                <div className="recent-item">
                  <div className="recent-icon">⚡</div>
                  <div className="recent-info">
                    <div className="recent-name">Conta de Energia - Agosto</div>
                    <div className="recent-date">Ontem, 16:45</div>
                  </div>
                  <div className="recent-amount">R$ 850,00</div>
                </div>

                <div className="recent-item">
                  <div className="recent-icon">📋</div>
                  <div className="recent-info">
                    <div className="recent-name">Fornecedor XYZ - Fatura</div>
                    <div className="recent-date">2 dias atrás</div>
                  </div>
                  <div className="recent-amount">R$ 3.200,00</div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div id="Arquivos">
      <EmBreve />
      <nav className="arquivos-sidebar">
        <div className="headerArquivosNavigation">
          <div className="header-icon">📁</div>
          <h3>Gestão de Arquivos</h3>
          <p>Sistema de Controle Cashinbox</p>
        </div>

        <div className="menu-section">
          <div className="menu-title">
            <span>📂 Categorias</span>
          </div>

          <div className="menu-items">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`menu-item ${
                  currentView === item.id ? "active" : ""
                }`}
                onClick={() => handleMenuClick(item)}
                style={{ "--item-color": item.color }}
              >
                <div className="menu-item-icon">
                  <span>{item.icon}</span>
                </div>

                <div className="menu-item-content">
                  <strong className="menu-item-title">{item.title}</strong>
                  <p className="menu-item-description">{item.description}</p>
                  <span className="menu-item-count">{item.count}</span>
                </div>

                <div className="menu-item-arrow">
                  <span>›</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="storage-info">
            <div className="storage-header">
              <span>💿 Armazenamento</span>
            </div>
            <div className="storage-bar">
              <div className="storage-used" style={{ width: "10%" }}></div>
            </div>
            <div className="storage-text">
              <span>1.8 GB de 100 GB utilizados</span>
            </div>
          </div>

          <div className="quick-actions">
            <button className="action-btn primary">
              <span>📤</span>
              Novo Upload
            </button>
            <button className="action-btn secondary">
              <span>🔍</span>
              Buscar
            </button>
          </div>
        </div>
      </nav>

      <main className="arquivos-content">{renderCurrentView()}</main>

      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={currentItem}
        type={currentType}
        onSave={handleSaveItem}
      />
    </div>
  );
}

export default Arquivos;
