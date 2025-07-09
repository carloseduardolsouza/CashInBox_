const fs = require('fs');
const { SignedXml } = require('xml-crypto');
const forge = require('node-forge');

function carregarCertificadoPfx(caminhoPfx, senha) {
  const pfxBuffer = fs.readFileSync(caminhoPfx);
  const pfxAsn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
  const p12 = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, false, senha);
  const bags = p12.getBags({ bagType: forge.pki.oids.keyBag });
  const keyBag = bags[forge.pki.oids.keyBag][0];
  const privateKeyPem = forge.pki.privateKeyToPem(keyBag.key);
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  const certBag = certBags[forge.pki.oids.certBag][0];
  const certPem = forge.pki.certificateToPem(certBag.cert);
  return { privateKeyPem, certPem };
}

exports.assinarXML = async (xml) => {
  // Ajuste caminho e senha para seu certificado
  const caminhoPfx = './certificado.pfx';
  const senhaPfx = 'sua_senha_do_certificado';

  const { privateKeyPem, certPem } = carregarCertificadoPfx(caminhoPfx, senhaPfx);

  const sig = new SignedXml();
  sig.addReference("//*[local-name(.)='infNFe']", [
    "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
  ]);
  sig.signingKey = privateKeyPem;
  sig.keyInfoProvider = {
    getKeyInfo: () => `<X509Data></X509Data>`,
  };
  sig.computeSignature(xml);

  return sig.getSignedXml();
};
