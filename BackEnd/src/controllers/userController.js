// controllers/userController.js
const userData = require("../models/userData");

const getDados = (req, res) => {
  const data = userData.getUserData();
  if (!data) return res.status(404).json({ error: "Nenhum dado encontrado" });
  res.json(data);
};

const salvarDados = (req, res) => {
  const sucesso = userData.saveUserData(req.body);
  if (!sucesso) return res.status(500).json({ error: "Erro ao salvar dados" });
  res.json({ success: true });
};

const verConfigAutomacao = (req, res) => {
  const data = userData.verConfigAutomacao();
  if (!data) return res.status(404).json({ error: "Nenhum dado encontrado" });
  res.json(data);
};

const editarConfigAutomacao = (req, res) => {
  const sucesso = userData.editarConfigAutomacao(req.body);
  if (!sucesso) return res.status(500).json({ error: "Erro ao salvar dados" });
  res.json({ success: true });
};

const verConfigVendas = (req, res) => {
  const data = userData.verConfigVendas();
  if (!data) return res.status(404).json({ error: "Nenhum dado encontrado" });
  res.json(data);
};

const editarConfigVendas = (req, res) => {
  const sucesso = userData.editarConfigVendas(req.body);
  if (!sucesso) return res.status(500).json({ error: "Erro ao salvar dados" });
  res.json({ success: true });
};

module.exports = {
  getDados,
  salvarDados,
  verConfigAutomacao,
  editarConfigAutomacao,
  verConfigVendas,
  editarConfigVendas,
};
