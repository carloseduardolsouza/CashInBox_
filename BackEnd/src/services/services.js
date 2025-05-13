const fs = require("fs");
const path = require("path");

const restart = (req, res) => {
  const flagPath = path.resolve(__dirname, "../../restart.flag");
  fs.writeFileSync(flagPath, `Reiniciado em: ${new Date().toISOString()}`);
  console.log("API será reiniciada...");
  res.send("Reiniciando...");
  process.exit(0);
};

const deletarImagem = (nomeArquivo) => {
  const caminhoImagem = path.join(__dirname, "../../uploads", nomeArquivo);
  console.log(caminhoImagem)

  // Verifica se o arquivo existe antes de tentar deletar
  if (fs.existsSync(caminhoImagem)) {
    fs.unlink(caminhoImagem, (err) => {
      if (err) {
        console.error("Erro ao deletar imagem:", err);
      } else {
        console.log("Imagem deletada com sucesso:", nomeArquivo);
      }
    });
  } else {
    console.warn("Arquivo não encontrado:", nomeArquivo);
  }
};

module.exports = {
  restart,
  deletarImagem,
};
