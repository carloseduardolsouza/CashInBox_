ALTER TABLE vendas RENAME TO vendas_old;

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
    total_bruto REAL,
    status TEXT NOT NULL,
    observacoes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

INSERT INTO vendas (
    id, cliente_id, nome_cliente, funcionario_id, nome_funcionario,
    data_venda, descontos, acrescimos, valor_total, total_bruto,
    status, observacoes, created_at, updated_at
)
SELECT
    id, cliente_id, nome_cliente, funcionario_id, nome_funcionario,
    data_venda, descontos, acrescimos, valor_total, total_bruto,
    status, observacoes, created_at, updated_at
FROM vendas_old;

DROP TABLE vendas_old;
