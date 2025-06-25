import { useEffect, useState } from "react";
import services from "../../../../services/services";
import "./FaturarVenda.css";
import Select from "react-select";

import clientesFetch from "../../../../api/clientesFetch";
import funcionarioFetch from "../../../../api/funcionarioFetch";
import vendaFetch from "../../../../api/vendaFetch";

import Concluindo from "../../../../components/Concluindo/Concluindo";

//icones
import { FaTrash } from "react-icons/fa6";

function FaturarVenda({ fechar, venda, limparVenda, limparValor }) {
  const [concluindo, setConcluindo] = useState(false);

  const [valorCompra, setValorCompra] = useState(0);
  const [descontoReais, setDescontoReais] = useState(0);
  const [descontoPorcentagem, setDescontoPorcentagem] = useState(0);
  const [acrescimoReais, setAcrescimoReais] = useState(0);
  const [acrescimoPorcentagem, setAcrescimoPorcentagem] = useState(0);
  const [totalPagar, setTotalPagar] = useState(0);
  const [formaPagementoAtual, setFormaPagementoAtual] = useState("Dinheiro");
  const [valorSendoPago, setValorSendoPago] = useState(0);

  const [resultadoClientes, setResultadoClientes] = useState([]);
  const [resultadoFuncionarios, setResultadoFuncionarios] = useState([]);

  const [id_cliente, setId_cliente] = useState(0);
  const [nome_cliente, setNome_cliente] = useState("");

  const [id_vendedor, setId_vendedor] = useState(0);
  const [nome_vendedor, setNome_vendedor] = useState("");

  const [formaPagemento, setFormaPagamento] = useState([]);
  const [faltaPagar, setFaltaPagar] = useState(0);
  const [troco, setTroco] = useState(0);

  const [numParcelas, setNumParcelas] = useState(1);
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [parcelasGeradas, setParcelasGeradas] = useState([]);

  const gerarParcelas = () => {
    // Validações básicas
    if (!totalPagar || !numParcelas || !dataPrimeiraParcela) {
      window.warn(
        "Verifique os valores: totalPagar, numParcelas ou dataPrimeiraParcela estão faltando."
      );
      return;
    }

    const parcelas = [];
    const valorParcela = +(
      parseFloat(totalPagar) / parseInt(numParcelas)
    ).toFixed(2);
    const dataBase = new Date(dataPrimeiraParcela);

    for (let i = 0; i < parseInt(numParcelas); i++) {
      const vencimento = new Date(dataBase);
      vencimento.setMonth(vencimento.getMonth() + i);

      parcelas.push({
        numero_parcela: i + 1,
        valor_parcela: valorParcela,
        data_vencimento: vencimento.toISOString().split("T")[0], // formato YYYY-MM-DD
      });
    }

    setParcelasGeradas(parcelas);
  };

  const [alertaFormaPagamento, setAlertaFormaPagamento] = useState(false);

  useEffect(() => {
    clientesFetch
      .procurarCliente("")
      .then((data) => {
        setResultadoClientes(data);
      })
      .catch(() => {});

    funcionarioFetch
      .procurarFuncionario("")
      .then((data) => {
        setResultadoFuncionarios(data);
      })
      .catch(() => {});

    const total = venda.reduce((acc, item) => acc + item.valor_total, 0);
    setValorCompra(total);
    setTotalPagar(total);
    setFaltaPagar(total);
    setValorSendoPago(total);
  }, []);

  const atualizarValores = (campo, valor) => {
    const valorNumerico = parseFloat(valor) || 0;

    if (campo === "descontoReais") {
      setDescontoReais(valorNumerico);
      setDescontoPorcentagem(
        valorCompra > 0 ? (valorNumerico / valorCompra) * 100 : 0
      );
      setTotalPagar(valorCompra - valorNumerico + acrescimoReais);
      setFaltaPagar(valorCompra - valorNumerico + acrescimoReais);
      setValorSendoPago(valorCompra - valorNumerico + acrescimoReais);
    } else if (campo === "descontoPorcentagem") {
      setDescontoPorcentagem(valorNumerico);
      const descontoCalculado = (valorCompra * valorNumerico) / 100;
      setDescontoReais(descontoCalculado);
      setTotalPagar(valorCompra - descontoCalculado + acrescimoReais);
      setFaltaPagar(valorCompra - descontoCalculado + acrescimoReais);
      setValorSendoPago(valorCompra - descontoCalculado + acrescimoReais);
    } else if (campo === "acrescimoReais") {
      setAcrescimoReais(valorNumerico);
      setAcrescimoPorcentagem(
        valorCompra > 0 ? (valorNumerico / valorCompra) * 100 : 0
      );
      setTotalPagar(valorCompra - descontoReais + valorNumerico);
      setFaltaPagar(valorCompra - descontoReais + valorNumerico);
      setValorSendoPago(valorCompra - descontoReais + valorNumerico);
    } else if (campo === "acrescimoPorcentagem") {
      setAcrescimoPorcentagem(valorNumerico);
      const acrescimoCalculado = (valorCompra * valorNumerico) / 100;
      setAcrescimoReais(acrescimoCalculado);
      setTotalPagar(valorCompra - descontoReais + acrescimoCalculado);
      setFaltaPagar(valorCompra - descontoReais + acrescimoCalculado);
      setValorSendoPago(valorCompra - descontoReais + acrescimoCalculado);
    }
  };

  const addFormaPagamento = (e) => {
    e.preventDefault();
    setAlertaFormaPagamento(false);
    if (faltaPagar <= 0) {
      return;
    }
    let formaPagementoObject = {
      tipo_pagamento: formaPagementoAtual,
      valor: valorSendoPago,
    };
    setFormaPagamento([...formaPagemento, formaPagementoObject]);
    if (faltaPagar - valorSendoPago < 0) {
      setFaltaPagar(0);
      setValorSendoPago(0);
      setTroco((faltaPagar - valorSendoPago) * -1);
    } else {
      setFaltaPagar(faltaPagar - valorSendoPago);
      setValorSendoPago(faltaPagar - valorSendoPago);
    }
  };

  const optionsClientes = resultadoClientes.map((cliente) => ({
    value: cliente.id,
    label: cliente.nome,
  }));

  const optionsFuncionarios = resultadoFuncionarios.map((funcionario) => ({
    value: funcionario.id,
    label: funcionario.nome,
  }));

  const customStyles = {
    control: (base, state) => ({
      ...base,
      width: 340,
      borderColor: state.isFocused ? "black" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      "&:hover": {
        borderColor: "black",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const faturarVendaEmBloco = (status) => {
    // Verifica se a forma de pagamento está vazia E não é crediário próprio
    if (
      formaPagemento.length <= 0 &&
      status === "concluida" &&
      formaPagementoAtual !== "Crediario Propio"
    ) {
      setAlertaFormaPagamento(true); // mostra o alerta dentro do form
      return;
    }

    if (formaPagementoAtual === "Crediario Propio" && id_cliente == 0) {
      window.alert(
        "Para vender no crediario e nescessario escolher um cliente"
      );
      return;
    }

    if (
      formaPagementoAtual === "Crediario Propio" &&
      parcelasGeradas.length === 0
    ) {
      window.alert("Gere pelo menos 1 parcela para vender no crediario");
      return;
    }
    setAlertaFormaPagamento(false); // limpa o alerta se passou
    setConcluindo(true);

    const dadosComuns = {
      cliente_id: id_cliente,
      nome_cliente: nome_cliente,
      funcionario_id: id_vendedor,
      nome_funcionario: nome_vendedor,
      descontos: `R$ ${descontoReais.toFixed(
        2
      )} / ${descontoPorcentagem.toFixed(2)}%`,
      acrescimos: `R$ ${acrescimoReais.toFixed(
        2
      )} / ${acrescimoPorcentagem.toFixed(2)}%`,
      total_bruto: valorCompra,
      valor_total: totalPagar,
      observacoes: "",
      produtos: venda,
    };

    if (formaPagementoAtual === "Crediario Propio" && status === "concluida") {
      const dados = {
        ...dadosComuns,
        status: "Crediario pendente",
        parcelas: parcelasGeradas,
      };

      vendaFetch
        .novaVendaCrediario(dados)
        .then(() => {
          setTimeout(() => {
            setConcluindo(false);
            limparVenda([]);
            limparValor(0);
            fechar(false);
          }, 1500);
        })
        .catch(() => {
          //carregar erro
        });
    } else {
      const dados = {
        ...dadosComuns,
        status: status,
        pagamentos: formaPagemento,
      };

      vendaFetch
        .novaVendaEmBloco(dados)
        .then(() => {
          setTimeout(() => {
            setConcluindo(false);
            fechar(false);
            limparVenda([]);
            limparValor(0);
          }, 1500);
        })
        .catch(() => {
          // tratar erro aqui
        });
    }
  };

  const deletarEstaFormaPagamento = (dados, index) => {
    const novoArray = formaPagemento.filter((_, i) => i !== index);
    setValorSendoPago((prev) => prev + Number(dados.valor)); // ✅ MELHOR PRÁTICA
    setFormaPagamento(novoArray);
  };

  return (
    <div id="FaturarVenda">
      {concluindo && <Concluindo />}
      <button id="ButtonFecharAbaFaturarVenda" onClick={() => fechar(false)}>
        X
      </button>
      <div id="FaturarVendaPart1">
        <div id="FaturarVendaPreços">
          <div>
            <p>Total da venda:</p>
            <input
              readOnly
              type="text"
              placeholder="00,00"
              value={services.formatarCurrency(valorCompra)}
            />
          </div>
          <div>
            <p style={{ marginRight: "50px" }}>Desconto:</p>
            <input
              type="number"
              min={0}
              placeholder="00,00"
              className="realDesconto"
              value={descontoReais}
              onChange={(e) =>
                atualizarValores("descontoReais", e.target.value)
              }
            />
            <input
              type="number"
              min={0}
              className="porcentagemDesconto"
              placeholder="5%"
              value={descontoPorcentagem}
              onChange={(e) =>
                atualizarValores("descontoPorcentagem", e.target.value)
              }
            />
          </div>
          <div>
            <p>Acrescimo/Frete:</p>
            <input
              type="number"
              min={0}
              placeholder="00,00"
              className="realDesconto"
              value={acrescimoReais}
              onChange={(e) =>
                atualizarValores("acrescimoReais", e.target.value)
              }
            />
            <input
              type="number"
              className="porcentagemDesconto"
              placeholder="5%"
              value={acrescimoPorcentagem}
              onChange={(e) =>
                atualizarValores("acrescimoPorcentagem", e.target.value)
              }
            />
          </div>
          <div>
            <p>Total a Pagar:</p>
            <input
              type="text"
              value={services.formatarCurrency(totalPagar)}
              readOnly
            />
          </div>
        </div>
        <div id="FaturarVendaDetalhesCliente">
          <div>
            <div className="ItenSearch">
              <p>Cliente:</p>
              <div style={{ display: "flex" }}>
                <Select
                  options={optionsClientes}
                  styles={customStyles}
                  onChange={(e) => {
                    setId_cliente(e.value);
                    setNome_cliente(e.label);
                  }}
                />
              </div>
            </div>
            <div className="ItenSearch">
              <p>Vendedor:</p>
              <div style={{ display: "flex" }}>
                <Select
                  options={optionsFuncionarios}
                  styles={customStyles}
                  onChange={(e) => {
                    setId_vendedor(e.value);
                    setNome_vendedor(e.label);
                  }}
                />
              </div>
            </div>
            <div>
              <form
                onSubmit={(e) => addFormaPagamento(e)}
                id="FaturarVendaFormaDePagamento"
                style={{ position: "relative" }}
              >
                <div>
                  <p>Forma de pagamento:</p>
                  <select
                    onChange={(e) => setFormaPagementoAtual(e.target.value)}
                    value={formaPagementoAtual}
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Pix">Pix</option>
                    <option value="Cartão de credito">Cartão de credito</option>
                    <option value="Cartão de debito">Cartão de debito</option>
                    <option value="Crediario Propio">Crediario Propio</option>
                  </select>
                </div>

                {formaPagementoAtual === "Crediario Propio" ? (
                  <div id="creadirioPropioDiv">
                    <div>
                      <label>N° parcelas:</label>
                      <input
                        required
                        type="number"
                        min={1}
                        value={numParcelas}
                        onChange={(e) => setNumParcelas(e.target.value)}
                      />
                    </div>

                    <div>
                      <label>primeiro vencimento:</label>
                      <input
                        required
                        type="date"
                        value={dataPrimeiraParcela}
                        onChange={(e) => setDataPrimeiraParcela(e.target.value)}
                      />
                    </div>

                    <button type="button" onClick={gerarParcelas}>
                      Parcelas
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      onChange={(e) => setValorSendoPago(e.target.value)}
                      value={valorSendoPago}
                    />
                    <button type="submit">ok</button>
                  </div>
                )}
              </form>
              {alertaFormaPagamento && (
                <div id="alertEscolhaFormaPagamento">
                  ⚠️ Escolha pelo menos uma forma de pagamento antes de
                  concluir.
                </div>
              )}
            </div>
          </div>
          {formaPagementoAtual === "Crediario Propio" ? (
            <div>
              <table className="Table">
                <thead>
                  <tr>
                    <th>Vencimento</th>
                    <th>Valor</th>
                    <th>N° Parcela</th>
                  </tr>
                </thead>
                <tbody>
                  {parcelasGeradas.map((dados, index) => {
                    return (
                      <tr>
                        <td>
                          {services.formatarDataNascimento(
                            dados.data_vencimento
                          )}
                        </td>
                        <td>
                          {services.formatarCurrency(dados.valor_parcela)}
                        </td>
                        <td>{dados.numero_parcela}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div>
                <table className="Table">
                  <thead>
                    <tr>
                      <th>Forma de pagamento</th>
                      <th>Valor</th>
                      <th>Deletar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formaPagemento.map((dados, index) => {
                      return (
                        <tr>
                          <td>{dados.tipo_pagamento}</td>
                          <td>{services.formatarCurrency(dados.valor)}</td>
                          <td>
                            <button
                              className="DeletarFormPagamentoFaturar"
                              onClick={() =>
                                deletarEstaFormaPagamento(dados, index)
                              }
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div id="FaturarVendaFaltaPagar">
                <label>
                  <p>Falta pagar:</p>
                  <input
                    type="text"
                    value={services.formatarCurrency(faltaPagar)}
                  />
                </label>
                <label>
                  <p>Troco:</p>
                  <input type="text" value={services.formatarCurrency(troco)} />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      <div id="areaButtons">
        <div>
          <button onClick={() => fechar(false)}>(ESC) - Sair</button>
          <button>NFC-e Online</button>
          <button>NFC-e Off-Line</button>
        </div>
        <div>
          <button onClick={() => faturarVendaEmBloco("concluida")}>
            Lançamento NF de bloco
          </button>
          <button onClick={() => faturarVendaEmBloco("orçamento")}>
            Orçamento
          </button>
        </div>
      </div>
    </div>
  );
}

export default FaturarVenda;
