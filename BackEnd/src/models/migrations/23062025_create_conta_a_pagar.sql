CREATE TABLE contas_a_pagar (
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
