const connection = require("./db");

const listarCliente = async () => {
  const query = `SELECT * FROM produtos`;

  // Use o método `all` para retornar todos os resultados da consulta
  const users = await new Promise((resolve, reject) => {
    connection.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  // Retorna os usuários (ou clientes) invertidos
  return users.reverse();
};

const novoProduto = async (dados) => {
  const {
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo,
    estoque_atual,
    estoque_minimo,
    markup,
    categoria,
    marca,
    unidade_medida,
    ativo,
  } = dados;

  const created_at = new Date().toISOString();
  const updated_at = created_at;

  const query = `
    INSERT INTO produtos 
    (nome, descricao, codigo_barras, preco_venda, preco_custo, estoque_atual, estoque_minimo,markup, categoria, marca, unidade_medida, ativo, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo || 0,
    estoque_atual || 0,
    estoque_minimo || 0,
    markup || 0,
    categoria,
    marca,
    unidade_medida,
    ativo === false ? 0 : 1,
    created_at,
    updated_at,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

const editarProduto = async (id, dados) => {
  const {
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo,
    estoque_atual,
    estoque_minimo,
    markup,
    categoria,
    marca,
    unidade_medida,
    ativo,
  } = dados;

  const updated_at = new Date().toISOString();

  const query = `
    UPDATE produtos
    SET 
      nome = ?, 
      descricao = ?, 
      codigo_barras = ?, 
      preco_venda = ?, 
      preco_custo = ?, 
      estoque_atual = ?, 
      estoque_minimo = ?, 
      markup = ?, 
      categoria = ?, 
      marca = ?, 
      unidade_medida = ?, 
      ativo = ?, 
      updated_at = ?
    WHERE id = ?
  `;

  const values = [
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo || 0,
    estoque_atual || 0,
    estoque_minimo || 0,
    markup || 0,
    categoria,
    marca,
    unidade_medida,
    ativo === false ? 0 : 1,
    updated_at,
    id,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else if (this.changes === 0) {
        resolve(null); // Nenhuma linha foi alterada
      } else {
        resolve(this.changes); // Retorna o número de linhas alteradas
      }
    });
  });
};

const deletarProduto = async (id) => {
  const query = `DELETE FROM produtos WHERE id = ${id}`;

  await new Promise((resolve, reject) => {
    connection.run(query, function (err) {
      if (err) {
        reject(err); // Caso ocorra algum erro
      } else {
        resolve(this.lastID); // Retorna o ID do funcionario inserido
      }
    });
  });
};

const procurarProdutoId = async (id) => {
  const query = `SELECT * FROM produtos WHERE id = ${id}`;

  // Use o método `all` para retornar todos os resultados da consulta
  const users = await new Promise((resolve, reject) => {
    connection.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  // Retorna os usuários (ou Funcionarios) invertidos
  return users;
};

module.exports = {
  listarCliente,
  novoProduto,
  editarProduto,
  deletarProduto,
  procurarProdutoId
};
