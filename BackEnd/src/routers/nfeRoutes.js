const express = require('express');
const router = express.Router();
const nfeController = require('../controllers/nfeController');

router.post('/enviar', nfeController.enviarNFe);
router.post('/testar', nfeController.testarNFe);

module.exports = router;
