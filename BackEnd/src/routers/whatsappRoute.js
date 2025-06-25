const express = require("express");
const router = express.Router();

const whatsapp = require("../whatsapp/controller");

router.post("/detalhesVenda", whatsapp.enviarMensagem);
router.get("/loginQrCode", whatsapp.qrCode);

module.exports = router;
