import { useEffect, useState } from "react";
import services from "../../../../services/services";
import "./FaturarVenda.css";
import Select from "react-select";
import fetchapi from "../../../../api/fetchapi";

//icones
import { FaTrash } from "react-icons/fa6";

function FaturarVenda({ fechar, venda , limparVenda , limparValor}) {
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

  useEffect(() => {
    fetchapi
      .ProcurarCliente("")
      .then((data) => {
        setResultadoClientes(data);
      })
      .catch(() => {});

    fetchapi
      .ProcurarFuncionario("")
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
    let dados = {
      cliente_id: id_cliente,
      nome_cliente: nome_cliente,
      funcionario_id: id_vendedor,
      nome_funcionario: nome_vendedor,
      descontos: `R$ ${descontoReais.toFixed(2)} / ${descontoPorcentagem.toFixed(2)}%`,
      acrescimos: `R$ ${acrescimoReais.toFixed(2)} / ${acrescimoPorcentagem.toFixed(2)}%`,
      valor_total: totalPagar,
      status: status,
      observacoes: "",
      produtos: venda,
      pagamentos: formaPagemento,
    };

    fetchapi.NovaVendaEmBloco(dados).then(() => {
      limparVenda([])
      limparValor(0)
      fechar(false)
    }).catch(() => {
      //carregar erro
    })
  };

  return (
    <div id="FaturarVenda">
      <button id="ButtonFecharAbaFaturarVenda" onClick={() => fechar(false)}>
        X
      </button>
      <div id="FaturarVendaPart1">
        <div id="FaturarVendaPreços">
          <div>
            <p>Total da venda:</p>
            <input
              type="text"
              placeholder="00,00"
              value={services.formatarCurrency(valorCompra)}
            />
          </div>
          <div>
            <p style={{ marginRight: "50px" }}>Desconto:</p>
            <input
              type="text"
              placeholder="00,00"
              className="realDesconto"
              value={descontoReais}
              onChange={(e) =>
                atualizarValores("descontoReais", e.target.value)
              }
            />
            <input
              type="text"
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
              type="text"
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
            <input type="text" value={services.formatarCurrency(totalPagar)} />
          </div>
          <div>
            <p>itens</p>
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
              >
                <p>Forma de pagamento:</p>
                <select
                  onChange={(e) => setFormaPagementoAtual(e.target.value)}
                  value={formaPagementoAtual}
                >
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Pix">Pix</option>
                  <option value="Cartão de credito">Cartão de credito</option>
                  <option value="Cartão de debito">Cartão de debito</option>
                </select>
                <input
                  type="text"
                  onChange={(e) => setValorSendoPago(e.target.value)}
                  value={valorSendoPago}
                />
                <button type="submit">ok</button>
              </form>
            </div>
          </div>
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
                {formaPagemento.map((dados) => {
                  return (
                    <tr>
                      <td>{dados.tipo_pagamento}</td>
                      <td>{services.formatarCurrency(dados.valor)}</td>
                      <td>
                        <button className="DeletarFormPagamentoFaturar">
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
        <div></div>
      </div>
      <div id="areaButtons">
        <div>
          <button onClick={() => fechar(false)}>(ESC) - Sair</button>
          <button>NFC-e Online</button>
          <button>NFC-e Off-Line</button>
        </div>
        <div>
          <button onClick={() => faturarVendaEmBloco("concluida")}>Lançamento NF de bloco</button>
          <button onClick={() => faturarVendaEmBloco("orçamento")}>Orçamento</button>
        </div>
      </div>
    </div>
  );
}

export default FaturarVenda;
