import "./Arquivos.css";

function Arquivos() {
  const menuItems = [
    {
      id: 'installments',
      icon: '💳',
      title: 'Parcelas de Crediário',
      description: 'Visualizar todas as parcelas de crediário já pagas',
      count: '1,247 parcelas',
      color: '#3498db'
    },
    {
      id: 'invoices',
      icon: '📋',
      title: 'Faturas e Recibos',
      description: 'Documentos fiscais e comprovantes',
      count: '432 documentos',
      color: '#9b59b6'
    }
  ];

  const handleMenuClick = (item) => {
    console.log('Navegando para:', item.title);
    // Aqui você pode implementar a navegação
  };

  return (
    <div id="Arquivos">
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
            {menuItems.map(item => (
              <div 
                key={item.id}
                className="menu-item"
                onClick={() => handleMenuClick(item)}
                style={{'--item-color': item.color}}
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
              <div className="storage-used" style={{width: '10%'}}></div>
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

      <main className="arquivos-content">
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
            <p>Gerencie todos os seus documentos financeiros de forma organizada e segura.</p>
            
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
      </main>
    </div>
  );
}

export default Arquivos;