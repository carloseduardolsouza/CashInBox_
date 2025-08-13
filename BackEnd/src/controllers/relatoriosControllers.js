const relatoriosModels = require("../models/relatoriosModels");

const home = async (req, res) => {
  try {
    const relatorio = await relatoriosModels.infoHome();
    res.status(200).json(relatorio);
  } catch (error) {
    console.error("Erro ao gerar relatório da home:", error);
    res.status(500).json({ erro: "Erro ao gerar relatório" });
  }
};

const resumoRelatorios = async (req, res) => {
  try {
    const relatorio = await relatoriosModels.resumoRelatorios();
    res.status(200).json(relatorio);
  } catch (error) {
    console.error("Erro ao gerar relatório da home:", error);
    res.status(500).json({ erro: "Erro ao gerar relatório" });
  }
}

module.exports = { home , resumoRelatorios };
