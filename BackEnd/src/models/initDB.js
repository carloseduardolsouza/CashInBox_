// src/models/initDB.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho do banco de dados (ajuste se quiser mudar o local do arquivo)
const db = new sqlite3.Database(
  path.resolve(__dirname, "../../database.sqlite"),
  (err) => {
    if (err) {
      return console.error("Erro ao conectar ao banco:", err.message);
    }
    console.log("Conectado ao SQLite!");
  }
);

db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS clientes (
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
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `,
    (err) => {
      if (err) {
        return console.error("Erro ao criar tabela:", err.message);
      }
      console.log('Tabela "clientes" criada com sucesso!');
    }
  );

  db.run(
    `
    CREATE TABLE IF NOT EXISTS funcionarios (
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
    tipo_comissao TEXT CHECK (tipo_comissao IN ('fixa', 'percentual' , 'Não contabilizar comissão')),
    valor_comissao REAL DEFAULT 0,
    status TEXT CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
    )
  `,
    (err) => {
      if (err) {
        return console.error("Erro ao criar tabela:", err.message);
      }
      console.log('Tabela "funcionarios" criada com sucesso!');
    }
  );

  db.run(
    `
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    codigo_barras TEXT,
    preco_venda REAL NOT NULL,
    preco_custo REAL DEFAULT 0,
    estoque_atual INTEGER DEFAULT 0,
    estoque_minimo INTEGER DEFAULT 0,
    markup INTEGER DEFAULT 0,
    categoria TEXT,
    categoria_id INTEGER DEFAULT 0,
    marca TEXT,
    unidade_medida TEXT,
    ativo INTEGER DEFAULT 1, -- 1 para ativo, 0 para inativo
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  `,
    (err) => {
      if (err) {
        return console.error("Erro ao criar tabela 'produtos':", err.message);
      }
      console.log('Tabela "produtos" criada com sucesso!');
    }
  );

  db.run(
    `
  CREATE TABLE IF NOT EXISTS variacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    cor TEXT,
    tamanho TEXT,
    imagem_path TEXT,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  );
  `,
    (err) => {
      if (err) {
        return console.error("Erro ao criar tabela 'variacoes':", err.message);
      }
      console.log('Tabela "variacoes" criada com sucesso!');
    }
  );

  db.run(
    `
  CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venda_id INTEGER,
    tipo_pagamento TEXT,
    valor REAL DEFAULT 0,

    FOREIGN KEY (venda_id) REFERENCES vendas(id)
  );
  `,
    (err) => {
      if (err) {
        return console.error("Erro ao criar tabela 'pagamentos':", err.message);
      }
      console.log('Tabela "pagamentos" criada com sucesso!');
    }
  );

  db.run(
    `
  CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    nome_cliente TEXT,
    funcionario_id INTEGER,
    nome_funcionario TEXT,
    data_venda TEXT NOT NULL,
    descontos TEXT,
    acrescimos TEXT,
    valor_total REAL NOT NULL,
    status TEXT CHECK(status IN ('concluida', 'pendente', 'cancelada', 'orcamento')) NOT NULL,
    observacoes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

  );
  `,
    (err) => {
      if (err) {
        return console.error("Erro ao criar tabela 'vendas':", err.message);
      }
      console.log('Tabela "vendas" criada com sucesso!');
    }
  );

  db.run(
    `
  CREATE TABLE IF NOT EXISTS vendas_itens (
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
);

);

  );
  `,
    (err) => {
      if (err) {
        return console.error(
          "Erro ao criar tabela 'venda_itens':",
          err.message
        );
      }
      console.log('Tabela "venda_itens" criada com sucesso!');
    }
  );

  db.run(
    `
  CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
);
  `,
    (err) => {
      if (err) {
        return console.error("Erro ao criar tabela 'categorias':", err.message);
      }
      console.log('Tabela "categorias" criada com sucesso!');
    }
  );
});
