import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import AppContext from "../../../../context/AppContext";
import services from "../../../../services/services";
import "./FaturarVenda.css";
import Select from "react-select";

import clientesFetch from "../../../../api/clientesFetch";
import funcionarioFetch from "../../../../api/funcionarioFetch";
import vendaFetch from "../../../../api/vendaFetch";
import userFetch from "../../../../api/userFetch";

import Concluindo from "../../../../components/Concluindo/Concluindo";
import { FaTrash } from "react-icons/fa6";

function FaturarVenda({ fechar, venda, limparVenda, limparValor }) {
  const { adicionarAviso } = useContext(AppContext);

  const [concluindo, setConcluindo] = useState(false);
  const [configCaixa, setConfigCaixa] = useState({ formas_pagamentos: [] });

  const [valorCompra, setValorCompra] = useState(0);
  const [descontoReais, setDescontoReais] = useState(0);
  const [descontoPorcentagem, setDescontoPorcentagem] = useState(0);
  const [acrescimoReais, setAcrescimoReais] = useState(0);
  const [acrescimoPorcentagem, setAcrescimoPorcentagem] = useState(0);
  const [totalPagar, setTotalPagar] = useState(0);

  const [formaPagementoAtual, setFormaPagementoAtual] = useState("Dinheiro");
  const [valorSendoPago, setValorSendoPago] = useState(0);
  const [formaPagemento, setFormaPagamento] = useState([]);
  const [faltaPagar, setFaltaPagar] = useState(0);
  const [troco, setTroco] = useState(0);

  const [resultadoClientes, setResultadoClientes] = useState([]);
  const [resultadoFuncionarios, setResultadoFuncionarios] = useState([]);

  const [id_cliente, setId_cliente] = useState(0);
  const [nome_cliente, setNome_cliente] = useState("");
  const [id_vendedor, setId_vendedor] = useState(0);
  const [nome_vendedor, setNome_vendedor] = useState("");

  const [numParcelas, setNumParcelas] = useState(1);
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState(() => {
    const hoje = new Date();
    hoje.setMonth(hoje.getMonth() + 1);
    if (hoje.getDate() !== new Date().getDate()) hoje.setDate(0);
    return hoje.toISOString().split("T")[0];
  });
  const [parcelasGeradas, setParcelasGeradas] = useState([]);

  const [alertaFormaPagamento, setAlertaFormaPagamento] = useState(false);

  const optionsClientes = useMemo(
    () =>
      resultadoClientes.map((cliente) => ({
        value: cliente.id,
        label: cliente.nome,
      })),
    [resultadoClientes]
  );

  const optionsFuncionarios = useMemo(
    () =>
      resultadoFuncionarios.map((funcionario) => ({
        value: funcionario.id,
        label: funcionario.nome,
      })),
    [resultadoFuncionarios]
  );

  const customStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        width: 340,
        borderColor: state.isFocused ? "black" : "#ccc",
        boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
        "&:hover": { borderColor: "black" },
      }),
      menu: (base) => ({ ...base, zIndex: 9999 }),
    }),
    []
  );

  const calcularTotais = useCallback(
    (novoDesconto = descontoReais, novoAcrescimo = acrescimoReais) => {
      const total = valorCompra - novoDesconto + novoAcrescimo;
      setTotalPagar(total);
      setFaltaPagar(total);
      setValorSendoPago(total);
    },
    [valorCompra, descontoReais, acrescimoReais]
  );

  const atualizarValores = (campo, valor) => {
    const v = parseFloat(valor) || 0;
    switch (campo) {
      case "descontoReais":
        setDescontoReais(v);
        setDescontoPorcentagem(valorCompra > 0 ? (v / valorCompra) * 100 : 0);
        calcularTotais(v, acrescimoReais);
        break;
      case "descontoPorcentagem":
        const desc = (valorCompra * v) / 100;
        setDescontoPorcentagem(v);
        setDescontoReais(desc);
        calcularTotais(desc, acrescimoReais);
        break;
      case "acrescimoReais":
        setAcrescimoReais(v);
        setAcrescimoPorcentagem(valorCompra > 0 ? (v / valorCompra) * 100 : 0);
        calcularTotais(descontoReais, v);
        break;
      case "acrescimoPorcentagem":
        const acre = (valorCompra * v) / 100;
        setAcrescimoPorcentagem(v);
        setAcrescimoReais(acre);
        calcularTotais(descontoReais, acre);
        break;
      default:
        break;
    }
  };

  const buscarTodosDados = useCallback(async () => {
    try {
      const [clientes, funcionarios, config] = await Promise.all([
        clientesFetch.procurarCliente(""),
        funcionarioFetch.procurarFuncionario(""),
        userFetch.verConfigVendas(),
      ]);

      setResultadoClientes(clientes);
      setResultadoFuncionarios(funcionarios);
      setConfigCaixa(config);

      const total = venda.reduce((acc, item) => acc + item.valor_total, 0);
      setValorCompra(total);
      setTotalPagar(total);
      setFaltaPagar(total);
      setValorSendoPago(total);
    } catch {
      adicionarAviso("erro", "Erro ao carregar dados.");
    }
  }, [venda, adicionarAviso]);

  useEffect(() => {
    buscarTodosDados();
  }, [buscarTodosDados]);

  const gerarParcelas = () => {
    if (!totalPagar || !numParcelas || !dataPrimeiraParcela) return;

    const valorParcela = +(totalPagar / numParcelas).toFixed(2);
    const base = new Date(dataPrimeiraParcela);

    const parcelas = Array.from({ length: numParcelas }, (_, i) => {
      const vencimento = new Date(base);
      vencimento.setMonth(base.getMonth() + i);
      return {
        numero_parcela: i + 1,
        valor_parcela: valorParcela,
        data_vencimento: vencimento.toISOString().split("T")[0],
      };
    });
    setParcelasGeradas(parcelas);
  };

  const addFormaPagamento = (e) => {
    e.preventDefault();
    if (faltaPagar <= 0) return;
    setAlertaFormaPagamento(false);

    const novaForma = {
      tipo_pagamento: formaPagementoAtual,
      valor: valorSendoPago,
    };
    setFormaPagamento((prev) => [...prev, novaForma]);

    const novoFalta = faltaPagar - valorSendoPago;
    if (novoFalta < 0) {
      setFaltaPagar(0);
      setValorSendoPago(0);
      setTroco(-novoFalta);
    } else {
      setFaltaPagar(novoFalta);
      setValorSendoPago(novoFalta);
    }
  };

  const deletarEstaFormaPagamento = (dados, index) => {
    setFormaPagamento((prev) => prev.filter((_, i) => i !== index));
    setValorSendoPago((prev) => prev + Number(dados.valor));
  };

  const faturarVendaEmBloco = (status) => {
    if (descontoPorcentagem > configCaixa.limite_desconto) {
      adicionarAviso(
        "erro",
        "ERRO - O desconto que voce deu é maior que o permitido"
      );
      return;
    }
    if (
      !formaPagemento.length &&
      status === "concluida" &&
      formaPagementoAtual !== "Crediário Próprio"
    ) {
      setAlertaFormaPagamento(true);
      return;
    }
    if (formaPagementoAtual === "Crediário Próprio" && !id_cliente) {
      adicionarAviso(
        "aviso",
        "AVISO - Escolha um cliente para vender no crediário"
      );
      return;
    }
    if (
      formaPagementoAtual === "Crediário Próprio" &&
      parcelasGeradas.length === 0
    ) {
      adicionarAviso(
        "aviso",
        "AVISO - Gere pelo menos 1 parcela para vender no crediário"
      );
      return;
    }

    setConcluindo(true);
    const dadosComuns = {
      cliente_id: id_cliente,
      nome_cliente,
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

    const apiCall =
      formaPagementoAtual === "Crediário Próprio" && status === "concluida"
        ? vendaFetch.novaVendaCrediario({
            ...dadosComuns,
            status: "Crediario pendente",
            parcelas: parcelasGeradas,
          })
        : vendaFetch.novaVendaEmBloco({
            ...dadosComuns,
            status,
            pagamentos: formaPagemento,
          });

    apiCall
      .then(() => {
        setTimeout(() => {
          setConcluindo(false);
          limparVenda([]);
          limparValor(0);
          fechar(false);
        }, 1500);
      })
      .catch(() => adicionarAviso("erro", "Erro ao concluir venda."));
  };

  return (
    <div className="blurModal">
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
                      {configCaixa.formas_pagamentos.map((dados) => {
                        return <option value={dados}>{dados}</option>;
                      })}
                    </select>
                  </div>

                  {formaPagementoAtual === "Crediário Próprio" ? (
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
                          onChange={(e) =>
                            setDataPrimeiraParcela(e.target.value)
                          }
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
            {formaPagementoAtual === "Crediário Próprio" ? (
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
                    <input
                      type="text"
                      value={services.formatarCurrency(troco)}
                    />
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
    </div>
  );
}

export default FaturarVenda;
