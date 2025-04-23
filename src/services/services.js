import { format } from "date-fns";

function formatarCurrency(numero) {
  // Converter para número, se possível
  const numeroComoNumero = parseFloat(numero);

  // Verificar se o número é válido
  if (isNaN(numeroComoNumero)) {
    return "Número inválido";
  }

  // Formatar o número como moeda brasileira (BRL)
  const numeroFormatado = numeroComoNumero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return numeroFormatado;
}

// Formatar número de celular (11) 91234-5678
function formatarNumeroCelular(numero) {
  return numero.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

// Formatar CPF 123.456.789-01
function formatarCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Formatar data de nascimento 01/01/1990
function formatarDataNascimento(data) {
  var partes = data.split("-");
  var dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];
  return dataFormatada;
}

function formatarData(data, formato = "dd/MM/yyyy") {
  const dataObj = new Date(data);
  const dataFormatada = format(dataObj, formato);

  return <span>{dataFormatada}</span>;
}

export default {
  formatarCurrency,
  formatarDataNascimento,
  formatarCPF,
  formatarNumeroCelular,
  formatarData,
};
