const { create } = require('xmlbuilder2');

exports.gerarXML = async (nfeData) => {
  const xmlObj = {
    enviNFe: {
      '@xmlns': 'http://www.portalfiscal.inf.br/nfe',
      '@versao': '4.00',
      idLote: nfeData.idLote || '1',
      indSinc: '1',
      NFe: {
        infNFe: {
          '@versao': '4.00',
          '@Id': nfeData.idNota || 'NFe520...',
          ide: {
            cUF: '52',
            natOp: 'Venda',
            mod: '55',
            serie: '1',
            nNF: nfeData.numero || '1',
            dhEmi: new Date().toISOString(),
            tpNF: '1',
            idDest: '1',
            cMunFG: '5208707',
            tpImp: '1',
            tpEmis: '1',
            cDV: '0',
            tpAmb: '2',
            finNFe: '1',
            indFinal: '1',
            indPres: '1',
            procEmi: '0',
            verProc: '1.0'
          }
          // emitente, destinatário, produtos...
        }
      }
    }
  };

  const xml = create(xmlObj).end({ prettyPrint: true });
  return xml;
};
