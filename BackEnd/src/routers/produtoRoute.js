const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const os = require("os");

const produtosControllers = require("../controllers/produtosController");
const authMiddleware = require("../middleware/authMiddleware");

// Define pasta de upload persistente no perfil do usuário
const uploadDir = path.join(os.homedir(), "AppData", "Roaming", "CashInBox", "uploads");

// Cria pasta se não existir (modo recursivo garante subpastas)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração Multer com nome de arquivo limpo e único
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${sanitized}`);
  },
});

const upload = multer({ storage });

// Rotas Produtos
router.get("/:id", authMiddleware , produtosControllers.procurarProduto);
router.get("/id/:id", produtosControllers.procurarProdutoId);
router.post("/", upload.array("imagens"), produtosControllers.novoProduto);
router.post("/:id/imagens", upload.array("imagens"), produtosControllers.novaImagemProduto);
router.put("/:id", produtosControllers.editarProduto);
router.delete("/:id", produtosControllers.deletarProduto);

// Rotas Variações (padronizei plural/singular, só clareza)
router.get("/produtos/:id/variacoes", produtosControllers.procurarVariacoesProduto);
router.delete("/variacoes/:id", produtosControllers.deletarVariacaoProduto);

module.exports = router;
