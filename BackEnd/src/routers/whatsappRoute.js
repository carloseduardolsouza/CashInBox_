const express = require("express");
const router = express.Router();

const whatsapp = require("../whatsapp/controller");
const rotinas = require("../services/rotinas");

router.post("/detalhesVenda", whatsapp.enviarMensagem);
router.get("/loginQrCode", whatsapp.qrCode);

router.get("/cumprirRotinasManual", async (req, res) => {
  await rotinas.executarRotinasDiarias("manualmente");
  res.status(200).json({ message: "rotinas executadas manualmente" });
});

module.exports = router;
