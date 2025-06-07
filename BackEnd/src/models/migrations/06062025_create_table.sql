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
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_venda) REFERENCES vendas(id)
);
