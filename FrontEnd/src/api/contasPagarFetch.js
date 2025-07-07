const API_URL = "http://localhost:3322/contas";

const novaConta = async (dados) => {
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao criar conta");
  return res.json();
};

const contasAll = async () => {
  const res = await fetch(`${API_URL}/`, { method: "GET" });
  return res.json();
};

const editarConta = async (dados, id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao editar conta");
  return res.json();
};

const pagarConta = async (id, dataPagamento) => {
  const res = await fetch(`${API_URL}/${id}/pagar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data_pagamento: dataPagamento }),
  });
  if (!res.ok) throw new Error("Erro ao pagar conta");
  return res.json();
};

const deletarConta = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao deletar conta");
  return res.json();
};

export default {
  novaConta,
  contasAll,
  pagarConta,
  editarConta,
  deletarConta,
};
