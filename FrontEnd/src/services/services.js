import format from "date-fns/format";
import NotaGrandeDetalhesVenda from "../components/NotaGrandeDetalhesVenda/NotaGrandeDetalhesVenda";

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

// Formatar número de celular: (11) 91234-5678 ou (62) 9336-2090
function formatarNumeroCelular(numero) {
  if (!numero) return "";

  numero = numero.replace(/\D/g, ""); // Remove tudo que não for número

  if (numero.length === 11) {
    // Ex.: 11912345678
    return numero.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (numero.length === 10) {
    // Ex.: 6293362090
    return numero.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    // Se não for 10 ou 11 dígitos, retorna como está
    return numero;
  }
}

// Formatar CPF 123.456.789-01
function formatarCPF(cpf) {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarCNPJ(cnpj) {
  // Remove tudo que não for número
  cnpj = cnpj.replace(/\D/g, "");

  // Confere se tem 14 dígitos
  if (cnpj.length !== 14) {
    throw new Error("CNPJ inválido. Deve conter 14 dígitos.");
  }

  // Formata com máscara
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

// Formatar data de nascimento 01/01/1990
function formatarDataNascimento(data) {
  if (!data) return "";
  var partes = data.split("-");
  var dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];
  return dataFormatada;
}

function formatarData(data, formato = "dd/MM/yyyy") {
  const dataObj = new Date(data);
  const dataFormatada = format(dataObj, formato);

  return <span>{dataFormatada}</span>;
}

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

function formatarDataCurta(dataString) {
  const data = new Date(dataString);
  const dia = data.getDate();
  const ano = data.getFullYear();

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const mes = meses[data.getMonth()];

  return `${dia.toString().padStart(2, "0")} ${mes} ${ano}`;
}

function formatarHorario(dataString) {
  const data = new Date(dataString);
  const horas = data.getHours().toString().padStart(2, "0");
  const minutos = data.getMinutes().toString().padStart(2, "0");
  return `${horas}:${minutos}`;
}

function interpretarBoleto(codigo) {
  if (codigo.length !== 44) {
    throw new Error("Código de barras inválido!");
  }

  const banco = codigo.substring(0, 3);
  const moeda = codigo[3];
  const digitoVerificador = codigo[4];
  const fatorVencimento = parseInt(codigo.substring(5, 9), 10);
  const valor = parseInt(codigo.substring(9, 19), 10) / 100;
  const codigoLivre = codigo.substring(19);

  const baseDate = new Date(1997, 9, 7); // Outubro é 9
  baseDate.setDate(baseDate.getDate() + fatorVencimento);

  return {
    banco,
    moeda,
    digitoVerificador,
    vencimento: baseDate.toISOString().split("T")[0],
    valor: `R$ ${valor.toFixed(2)}`,
    codigoLivre,
  };
}


export default {
  formatarCurrency,
  formatarCNPJ,
  formatarDataNascimento,
  formatarCPF,
  formatarData,
  formatarNumeroCelular,
  mascaraDeDinheroInput,
  formatarDataCurta,
  formatarHorario,
  interpretarBoleto,
};
