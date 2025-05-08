//import { format } from "date-fns";

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
  if (!numero) return "";
  return numero.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

// Formatar CPF 123.456.789-01
function formatarCPF(cpf) {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Formatar data de nascimento 01/01/1990
function formatarDataNascimento(data) {
  if (!data) return "";
  var partes = data.split("-");
  var dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];
  return dataFormatada;
}

/*function formatarData(data, formato = "dd/MM/yyyy") {
  const dataObj = new Date(data);
  const dataFormatada = format(dataObj, formato);

  return <span>{dataFormatada}</span>;
}*/

function mascaraDeDinheroInput(e) {
  let inputValue = e.target.value;

  // Remove tudo que não for número
  inputValue = inputValue.replace(/\D/g, "");

  // Adiciona a máscara de moeda
  inputValue = inputValue.replace(/(\d)(\d{2})$/, "$1,$2");
  inputValue = inputValue.replace(/(\d)(\d{3})(\d{3})$/, "$1.$2.$3"); // Adiciona pontos nas centenas de milhar

  if (inputValue.length > 6) {
    inputValue = "R$ " + inputValue;
  } else if (inputValue.length === 0) {
    inputValue = "";
  } else {
    inputValue = "R$ " + inputValue;
  }
  console.log(inputValue);
  return inputValue;
}

export default {
  formatarCurrency,
  formatarDataNascimento,
  formatarCPF,
  formatarNumeroCelular,
  mascaraDeDinheroInput,
};
