const soap = require('soap');

exports.enviarNFe = async (xmlAssinado) => {
  // URL do WSDL homologação da SEFAZ GO
  const urlWsdlHomologacao = 'https://homolog.sefaz.go.gov.br/nfe/services/NfeAutorizacao4?wsdl';
  
  const client = await soap.createClientAsync(urlWsdlHomologacao);
  const args = { nfeDadosMsg: xmlAssinado };
  
  try {
    const [result] = await client.nfeAutorizacaoLoteAsync(args);
    return result;
  } catch (err) {
    throw new Error('Erro ao enviar NF-e: ' + err.message);
  }
};
