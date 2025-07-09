const xmlGenerator = require('../utils/xmlGenerator');
const xmlSigner = require('../utils/xmlSigner');
const sefazClient = require('../utils/sefazClient');

exports.processarEnvioNFe = async (nfeData) => {
  const xml = await xmlGenerator.gerarXML(nfeData);
  const xmlAssinado = await xmlSigner.assinarXML(xml);
  const resposta = await sefazClient.enviarNFe(xmlAssinado);
  return resposta;  // Retorna status, protocolo, chave
};

exports.gerarXmlFake = async () => {
  const xml = await xmlGenerator.gerarXML({ /* dados fake ou fixos */ });
  return xml;
};
