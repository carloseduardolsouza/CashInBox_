DROP TABLE IF EXISTS funcionarios_old;

-- Renomeia a tabela atual para backup
ALTER TABLE funcionarios RENAME TO funcionarios_old;

-- Cria a nova tabela funcionarios
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

-- Copia os dados antigos para a nova tabela
INSERT INTO funcionarios (
    id, nome, cpf, telefone, email, data_nascimento, genero, funcao, endereco,
    data_admissao, salario_base, comissao_mes, regime_contrato, tipo_comissao,
    valor_comissao, status, created_at, updated_at
)
SELECT
    id, nome, cpf, telefone, email, data_nascimento, genero, funcao, endereco,
    data_admissao, salario_base, comissao_mes, regime_contrato, tipo_comissao,
    valor_comissao, status, created_at, updated_at
FROM funcionarios_old;

-- Exclui a tabela antiga
DROP TABLE funcionarios_old;
