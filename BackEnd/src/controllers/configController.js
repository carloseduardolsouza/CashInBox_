// controllers/userController.js
const userData = require('../models/configsData');

const getDados = (req, res) => {
  const data = userData.getConfigsData();
  if (!data) return res.status(404).json({ error: 'Nenhum dado encontrado' });
  res.json(data);
};

const salvarDados = (req, res) => {
  const sucesso = userData.saveConfigsData(req.body);
  if (!sucesso) return res.status(500).json({ error: 'Erro ao salvar dados' });
  res.json({ success: true });
};

module.exports = {
  getDados,
  salvarDados
};