-- ==========================================
-- SCRIPT DE ATUALIZAÇÃO COMPLETA DO BANCO
-- ==========================================
-- Este script padroniza todas as tabelas do banco de dados
-- seguindo a mesma lógica do exemplo fornecido

-- ==========================================
-- 1. ATUALIZAÇÃO DA TABELA CLIENTES
-- ==========================================
DROP TABLE IF EXISTS clientes_old;

ALTER TABLE clientes RENAME TO clientes_old;

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
);

INSERT INTO clientes (
    id, nome, cpf_cnpj, email, genero, telefone, 
    data_nascimento, endereco, data_ultima_compra, 
    total_compras, pontuacao_fidelidade, created_at, updated_at
)
SELECT 
    id, nome, cpf_cnpj, email, genero, telefone,
    data_nascimento, endereco, data_ultima_compra,
    total_compras, pontuacao_fidelidade, created_at, updated_at
FROM clientes_old;

DROP TABLE clientes_old;

-- ==========================================
-- 2. ATUALIZAÇÃO DA TABELA FUNCIONARIOS
-- ==========================================
DROP TABLE IF EXISTS funcionarios_old;

ALTER TABLE funcionarios RENAME TO funcionarios_old;

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
    tipo_comissao TEXT CHECK (tipo_comissao IN ('fixa', 'percentual', 'Não contabilizar comissão')),
    valor_comissao REAL DEFAULT 0,
    status TEXT CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

INSERT INTO funcionarios (
    id, nome, cpf, telefone, email, data_nascimento,
    genero, funcao, endereco, data_admissao, salario_base,
    comissao_mes, regime_contrato, tipo_comissao, valor_comissao,
    status, created_at, updated_at
)
SELECT 
    id, nome, cpf, telefone, email, data_nascimento,
    genero, funcao, endereco, data_admissao, salario_base,
    comissao_mes, regime_contrato, tipo_comissao, valor_comissao,
    status, created_at, updated_at
FROM funcionarios_old;

DROP TABLE funcionarios_old;

-- ==========================================
-- 3. ATUALIZAÇÃO DA TABELA PRODUTOS
-- ==========================================
DROP TABLE IF EXISTS produtos_old;

ALTER TABLE produtos RENAME TO produtos_old;

CREATE TABLE IF NOT EXISTS produtos (
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
);

INSERT INTO produtos (
    id, nome, descricao, codigo_barras, referencia,
    preco_venda, preco_custo, estoque_atual, estoque_minimo,
    markup, categoria, categoria_id, marca, unidade_medida,
    ativo, created_at, updated_at
)
SELECT 
    id, nome, descricao, codigo_barras, referencia,
    preco_venda, preco_custo, estoque_atual, estoque_minimo,
    markup, categoria, categoria_id, marca, unidade_medida,
    ativo, created_at, updated_at
FROM produtos_old;

DROP TABLE produtos_old;

-- ==========================================
-- 4. ATUALIZAÇÃO DA TABELA CATEGORIAS
-- ==========================================
DROP TABLE IF EXISTS categorias_old;

ALTER TABLE categorias RENAME TO categorias_old;

CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

INSERT INTO categorias (id, nome)
SELECT id, nome
FROM categorias_old;

DROP TABLE categorias_old;

-- ==========================================
-- 5. ATUALIZAÇÃO DA TABELA VARIACOES
-- ==========================================
DROP TABLE IF EXISTS variacoes_old;

ALTER TABLE variacoes RENAME TO variacoes_old;

CREATE TABLE IF NOT EXISTS variacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    cor TEXT,
    tamanho TEXT,
    imagem_path TEXT,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

INSERT INTO variacoes (id, produto_id, cor, tamanho, imagem_path)
SELECT id, produto_id, cor, tamanho, imagem_path
FROM variacoes_old;

DROP TABLE variacoes_old;

-- ==========================================
-- 6. ATUALIZAÇÃO DA TABELA VENDAS_ITENS
-- ==========================================
DROP TABLE IF EXISTS vendas_itens_old;

ALTER TABLE vendas_itens RENAME TO vendas_itens_old;

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

INSERT INTO vendas_itens (
    id, venda_id, produto_id, produto_nome,
    quantidade, preco_unitario, valor_total, created_at
)
SELECT 
    id, venda_id, produto_id, produto_nome,
    quantidade, preco_unitario, valor_total, created_at
FROM vendas_itens_old;

DROP TABLE vendas_itens_old;

-- ==========================================
-- 7. ATUALIZAÇÃO DA TABELA PAGAMENTOS
-- ==========================================
DROP TABLE IF EXISTS pagamentos_old;

ALTER TABLE pagamentos RENAME TO pagamentos_old;

CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venda_id INTEGER,
    tipo_pagamento TEXT,
    valor REAL DEFAULT 0,
    FOREIGN KEY (venda_id) REFERENCES vendas(id)
);

INSERT INTO pagamentos (id, venda_id, tipo_pagamento, valor)
SELECT id, venda_id, tipo_pagamento, valor
FROM pagamentos_old;

DROP TABLE pagamentos_old;

-- ==========================================
-- 8. ATUALIZAÇÃO DA TABELA CREDIARIO_PARCELAS
-- ==========================================
DROP TABLE IF EXISTS crediario_parcelas_old;

ALTER TABLE crediario_parcelas RENAME TO crediario_parcelas_old;

CREATE TABLE IF NOT EXISTS crediario_parcelas (
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
);

INSERT INTO crediario_parcelas (
    id, id_cliente, nome_cliente, id_venda, numero_parcela,
    data_vencimento, valor_parcela, status, data_pagamento, valor_pago
)
SELECT 
    id, id_cliente, nome_cliente, id_venda, numero_parcela,
    data_vencimento, valor_parcela, status, data_pagamento, valor_pago
FROM crediario_parcelas_old;

DROP TABLE crediario_parcelas_old;

-- ==========================================
-- 9. ATUALIZAÇÃO DA TABELA CAIXAS
-- ==========================================
DROP TABLE IF EXISTS caixas_old;

ALTER TABLE caixas RENAME TO caixas_old;

CREATE TABLE IF NOT EXISTS caixas (
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
);

INSERT INTO caixas (
    id, data_abertura, data_fechamento, valor_abertura,
    valor_fechamento, total_recebido, saldo_adicionado,
    saldo_retirada, valor_esperado, status
)
SELECT 
    id, data_abertura, data_fechamento, valor_abertura,
    valor_fechamento, total_recebido, saldo_adicionado,
    saldo_retirada, valor_esperado, status
FROM caixas_old;

DROP TABLE caixas_old;

-- ==========================================
-- 10. ATUALIZAÇÃO DA TABELA MOVIMENTACOES
-- ==========================================
DROP TABLE IF EXISTS movimentacoes_old;

ALTER TABLE movimentacoes RENAME TO movimentacoes_old;

CREATE TABLE IF NOT EXISTS movimentacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caixa_id INTEGER NOT NULL,
    data DATETIME NOT NULL,
    descricao TEXT,
    tipo TEXT CHECK(tipo IN ('entrada', 'saida')) NOT NULL,
    valor REAL NOT NULL,
    tipo_pagamento TEXT,
    FOREIGN KEY (caixa_id) REFERENCES caixas(id)
);

INSERT INTO movimentacoes (
    id, caixa_id, data, descricao, tipo, valor, tipo_pagamento
)
SELECT 
    id, caixa_id, data, descricao, tipo, valor, tipo_pagamento
FROM movimentacoes_old;

DROP TABLE movimentacoes_old;

-- ==========================================
-- 11. ATUALIZAÇÃO DA TABELA CONTAS_A_PAGAR
-- ==========================================
DROP TABLE IF EXISTS contas_a_pagar_old;

ALTER TABLE contas_a_pagar RENAME TO contas_a_pagar_old;

CREATE TABLE IF NOT EXISTS contas_a_pagar (
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
);

INSERT INTO contas_a_pagar (
    id, descricao, fornecedor, categoria, valor_total,
    data_emissao, data_vencimento, forma_pagamento,
    parcelado, observacoes, status, data_pagamento
)
SELECT 
    id, descricao, fornecedor, categoria, valor_total,
    data_emissao, data_vencimento, forma_pagamento,
    parcelado, observacoes, status, data_pagamento
FROM contas_a_pagar_old;

DROP TABLE contas_a_pagar_old;

-- ==========================================
-- 12. ATUALIZAÇÃO DA TABELA MIGRATIONS
-- ==========================================
DROP TABLE IF EXISTS migrations_old;

ALTER TABLE migrations RENAME TO migrations_old;

CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO migrations (id, name, applied_at)
SELECT id, name, applied_at
FROM migrations_old;

DROP TABLE migrations_old;

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================
-- Comando para verificar se todas as tabelas foram atualizadas
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

-- ==========================================
-- ATUALIZAÇÃO DA SEQUÊNCIA SQLITE
-- ==========================================
-- Atualizar a tabela sqlite_sequence para manter os contadores corretos
UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM clientes
) WHERE name = 'clientes';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM funcionarios
) WHERE name = 'funcionarios';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM produtos
) WHERE name = 'produtos';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM categorias
) WHERE name = 'categorias';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM vendas
) WHERE name = 'vendas';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM vendas_itens
) WHERE name = 'vendas_itens';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM pagamentos
) WHERE name = 'pagamentos';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM crediario_parcelas
) WHERE name = 'crediario_parcelas';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM variacoes
) WHERE name = 'variacoes';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM caixas
) WHERE name = 'caixas';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM movimentacoes
) WHERE name = 'movimentacoes';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM contas_a_pagar
) WHERE name = 'contas_a_pagar';

UPDATE sqlite_sequence SET seq = (
    SELECT MAX(id) FROM migrations
) WHERE name = 'migrations';