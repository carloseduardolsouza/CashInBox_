const nfeService = require('../services/nfeService');

exports.enviarNFe = async (req, res) => {
  const nfeData = req.body;  // Aqui você recebe os dados da nota (emitente, produtos, destinatário)
  
  try {
    const resultado = await nfeService.processarEnvioNFe(nfeData);
    res.status(200).json(resultado);  // Retorna chave, protocolo, status
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.testarNFe = async (req, res) => {
  try {
    const xml = await nfeService.gerarXmlFake();
    res.status(200).send(xml);  // Retorna apenas o XML gerado (para validar/testar)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
