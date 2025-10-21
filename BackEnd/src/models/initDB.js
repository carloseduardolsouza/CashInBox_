const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const os = require("os");

// Caminho para a pasta segura do app (pasta persistente por usuário)
const userDataPath = path.join(os.homedir(), "AppData", "Roaming", "CashInBox"); // Windows
const dbPath = path.join(userDataPath, "database.sqlite");

console.log("📁 Banco de dados será salvo em:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error("❌ Erro ao conectar ao banco:", err.message);
  console.log("✅ Conectado ao SQLite!");
});

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function addColumnIfNotExists(tableName, columnName, columnType) {
  const rows = await allAsync(`PRAGMA table_info(${tableName})`);
  const exists = rows.some((row) => row.name === columnName);
  if (exists) {
    console.log(
      `✅ Coluna '${columnName}' já existe na tabela '${tableName}'. Pulando...`
    );
    return;
  }
  const alterSQL = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType};`;
  await runAsync(alterSQL);
  console.log(
    `✅ Coluna '${columnName}' adicionada com sucesso na tabela '${tableName}'.`
  );
}

async function applyMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");

  await runAsync(`CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const appliedRows = await allAsync("SELECT name FROM migrations");
  const appliedMigrations = new Set(appliedRows.map((r) => r.name));

  if (!fs.existsSync(migrationsDir)) {
    console.warn("⚠️ Pasta de migrations não encontrada, pulando migrations.");
    return;
  }

  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
  files.sort();

  for (const file of files) {
    if (appliedMigrations.has(file)) {
      console.log(`✅ Migration ${file} já aplicada, pulando.`);
      continue;
    }

    const rawSQL = fs
      .readFileSync(path.join(migrationsDir, file), "utf8")
      .trim();

    try {
      // Quebra o SQL em múltiplas instruções, respeitando `;`
      const statements = rawSQL
        .split(/;\s*(\r?\n|$)/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const stmt of statements) {
        // Detecta padrão ALTER TABLE ADD COLUMN
        const alterAddColMatch = stmt.match(
          /ALTER TABLE\s+(\w+)\s+ADD COLUMN\s+(\w+)\s+([\w()]+)(.*)/i
        );
        if (alterAddColMatch) {
          const tableName = alterAddColMatch[1];
          const columnName = alterAddColMatch[2];
          const columnType = alterAddColMatch[3];
          // Usa a função que checa se coluna existe antes de criar
          await addColumnIfNotExists(tableName, columnName, columnType);
        } else {
          // Executa normalmente outras queries
          await runAsync(stmt);
        }
      }

      await runAsync("INSERT INTO migrations (name) VALUES (?)", [file]);
      console.log(`✅ Migration ${file} aplicada com sucesso.`);
    } catch (err) {
      console.error(`❌ Erro ao aplicar migration ${file}:`, err.message);
      throw err;
    }
  }
}

async function criarTabelasPrincipais() {
  await runAsync(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf_cnpj TEXT NOT NULL,
    email TEXT,
    genero TEXT,
    telefone TEXT,
    data_nascimento TEXT,
    endereco TEXT,
    data_ultima_compra TEXT,
    total_compras REAL DEFAULT 0,
    pontuacao_fidelidade INTEGER DEFAULT 0,
    categoria INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    data_nascimento TEXT,
    genero TEXT,
    funcao TEXT,
    endereco TEXT,
    data_admissao TEXT,
    salario_base REAL DEFAULT 0,
    comissao_mes REAL DEFAULT 0,
    regime_contrato TEXT DEFAULT 'CLT',
    tipo_comissao TEXT CHECK (tipo_comissao IN ('fixa', 'percentual', 'Não contabilizar comissão')),
    valor_comissao REAL DEFAULT 0,
    status TEXT CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    codigo_barras TEXT,
    referencia TEXT,
    preco_venda REAL NOT NULL,
    preco_custo REAL DEFAULT 0,
    estoque_atual INTEGER DEFAULT 0,
    estoque_minimo INTEGER DEFAULT 0,
    markup INTEGER DEFAULT 0,
    categoria TEXT,
    categoria_id INTEGER DEFAULT 0,
    marca TEXT,
    unidade_medida TEXT,
    ativo INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS variacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    cor TEXT,
    tamanho TEXT,
    imagem_path TEXT,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    nome_cliente TEXT,
    funcionario_id INTEGER,
    nome_funcionario TEXT,
    data_venda TEXT NOT NULL,
    descontos TEXT,
    acrescimos TEXT,
    valor_total REAL NOT NULL,
    total_bruto REAL,
    status TEXT NOT NULL,
    observacoes TEXT,
    ultimo_lembrete TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS vendas_itens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venda_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    produto_nome TEXT,
    quantidade INTEGER NOT NULL,
    preco_unitario REAL NOT NULL,
    valor_total REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venda_id) REFERENCES vendas(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venda_id INTEGER,
    tipo_pagamento TEXT,
    valor REAL DEFAULT 0,
    FOREIGN KEY (venda_id) REFERENCES vendas(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS crediario_parcelas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    nome_cliente TEXT NOT NULL,
    id_venda INTEGER NOT NULL,
    numero_parcela INTEGER NOT NULL,
    data_vencimento DATE NOT NULL,
    valor_parcela REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    data_pagamento DATE,
    valor_pago REAL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_venda) REFERENCES vendas(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS caixas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_abertura DATETIME NOT NULL,
    data_fechamento DATETIME,
    valor_abertura REAL NOT NULL,
    valor_fechamento REAL,
    total_recebido REAL DEFAULT 0,
    saldo_adicionado REAL DEFAULT 0,
    saldo_retirada REAL DEFAULT 0,
    valor_esperado REAL DEFAULT 0,
    status TEXT CHECK(status IN ('aberto', 'fechado')) DEFAULT 'aberto'
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS movimentacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caixa_id INTEGER NOT NULL,
    data DATETIME NOT NULL,
    descricao TEXT,
    tipo TEXT CHECK(tipo IN ('entrada', 'saida')) NOT NULL,
    valor REAL NOT NULL,
    tipo_pagamento TEXT,
    categoria TEXT,
    FOREIGN KEY (caixa_id) REFERENCES caixas(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS contas_a_pagar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    fornecedor TEXT NOT NULL,
    categoria TEXT NOT NULL,
    valor_total REAL NOT NULL,
    data_emissao TEXT NOT NULL,
    data_vencimento TEXT NOT NULL,
    forma_pagamento TEXT NOT NULL,
    parcelado INTEGER NOT NULL DEFAULT 0,
    observacoes TEXT,
    status TEXT NOT NULL DEFAULT 'pendente',
    data_pagamento TEXT
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function initDB() {
  try {
    await criarTabelasPrincipais();
    await applyMigrations();
    console.log("🎉 Banco inicializado com sucesso!");
    console.log("📋 Todas as tabelas foram criadas com a estrutura mais atual");
  } catch (err) {
    console.error("❌ Erro na inicialização do banco:", err);
  }
}

// Rodar initDB para iniciar tudo
initDB();

module.exports = { db };
