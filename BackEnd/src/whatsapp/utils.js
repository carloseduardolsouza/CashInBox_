const dns = require("dns");

// Função para gerar mensagem de compra
function gerarMensagemCompra(dados, tipo) {
  if (tipo === "venda") {
    let mensagem = `🧾 Detalhes da sua compra:\n\n`;
    mensagem += `👤 Cliente: ${dados.cliente}\n`;
    mensagem += `📄 Nº da Venda: ${dados.numero_venda}\n\n`;
    mensagem += `💰 Total Bruto: ${dados.valores.total_bruto}\n`;
    mensagem += `🔻 Descontos: ${dados.valores.descontos}\n`;
    mensagem += `🔺 Acréscimos: ${dados.valores.acrescimos}\n\n`;
    mensagem += `📦 Produtos:\n\n`;

    dados.produtos.forEach((prod) => {
      mensagem += `- ${prod.nome} — ${prod.quantidade} un. — Total: ${prod.total}\n`;
    });

    mensagem += `\n✅ Valor Total da Compra: ${dados.valor_total_compra}`;

    return mensagem;
  } else if (tipo === "orçamento") {
    let mensagem = `🧾 *Orçamento Detalhado*\n\n`;

    mensagem += `👤 *Cliente:* ${dados.cliente}\n`;
    mensagem += `💰 *Total Bruto:* R$ ${dados.valores.total_bruto}\n`;
    mensagem += `🔻 *Descontos:* R$ ${dados.valores.descontos}\n`;
    mensagem += `🔺 *Acréscimos:* R$ ${dados.valores.acrescimos}\n`;
    mensagem += `🧮 *Subtotal:* R$ ${(
      Number(dados.valores.total_bruto) -
      Number(dados.valores.descontos) +
      Number(dados.valores.acrescimos)
    ).toFixed(2)}\n\n`;

    mensagem += `📦 *Produtos*\n`;

    dados.produtos.forEach((prod, index) => {
      mensagem += `\n${index + 1}. ${prod.nome}\n`;
      mensagem += `   - Quantidade: ${prod.quantidade} un\n`;
      mensagem += `   - Total: R$ ${prod.total}`;
    });

    mensagem += `\n\n✅ *Valor Total do Orçamento:* R$ ${dados.valor_total_compra}`;

    return mensagem;
  }
}

// Função para verificar se há conexão com a internet
const temConexaoInternet = () => {
  return new Promise((resolve) => {
    dns.lookup("google.com", (err) => {
      resolve(!err);
    });
  });
};

// Função utilitária para sanitizar número
const sanitizarNumero = (numero) => {
  let limpo = numero.replace(/\D/g, ""); // Remove tudo que não for número

  // Se começar com DDI (55), removemos pra tratar o número sem ele
  let temDDI = limpo.startsWith("55");
  if (temDDI) limpo = limpo.slice(2);

  // Se o número tiver pelo menos 11 dígitos (ex: 62993362090)
  // e o segundo dígito for 9 (depois do DDD), remove o 9
  if (limpo.length >= 11 && limpo[2] === "9") {
    limpo = limpo.slice(0, 2) + limpo.slice(3);
  }

  // Adiciona o DDI 55 de volta
  return `55${limpo}`;
};

module.exports = {
  sanitizarNumero,
  temConexaoInternet,
  gerarMensagemCompra,
};
