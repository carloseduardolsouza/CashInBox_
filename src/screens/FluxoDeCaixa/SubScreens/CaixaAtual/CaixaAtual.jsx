import "./CaixaAtual.css";

//icones
import { FaMoneyBill1 } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";
import { FaCcMastercard } from "react-icons/fa6";
import { FaPix } from "react-icons/fa6";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";

function CaixaAtual() {
  return (
    <div id="CaixaAtual">
      <div className="InfoDetalhasdasCaixaAtual">
        <div>
          <div className="Resumodecaixa">
            <div>
              <h3>Resumo de Caixa # 02/05</h3>
              <p id="dataAberturaCaixa">Aberto hoje (09:30)</p>
            </div>

            <div id="DetalhesResumoCaixa">
              <div>
                <strong>Total Recebido: {"R$400,00"}</strong>
              </div>
              <p>Saldo Inicial: {"R$ 100,00"}</p>
              <p>Total Recebido: {"R$ 400,00"}</p>
              <p>Saldo Adicionado: {"R$ 5.000,00"}</p>
              <p>Saldo Retirado: {"R$ 50,00"}</p>
              <p>
                <strong>Saldo Final: {"R$ 4.230,98"}</strong>
              </p>
            </div>

            <div id="areaButtonResumoCaixa">
              <button className="buttonRetiarAddSaldo">Adicionar Saldo</button>
              <button className="buttonRetiarAddSaldo">Retirar Saldo</button>
            </div>
          </div>
        </div>
        <div id="meiosDePagamentoDiv">
          <h3>Meios de pagamento</h3>
          <div className="formasDePagamentoCaixa">
            <FaMoneyBill1 />
            <strong>Dinheiro</strong>
            <p>{"R$ 200,00"}</p>
          </div>
          <div className="formasDePagamentoCaixa">
            <FaCcMastercard/>
            <strong>Cartão de credito</strong>
            <p>{"R$ 200,00"}</p>
          </div>
          <div className="formasDePagamentoCaixa">
            <FaCreditCard/>
            <strong>Cartão de debito</strong>
            <p>{"R$ 200,00"}</p>
          </div>
          <div className="formasDePagamentoCaixa">
            <FaMoneyCheckAlt/>
            <strong>Cheque</strong>
            <p>{"R$ 200,00"}</p>
          </div>
          <div className="formasDePagamentoCaixa">
            <FaPix/>
            <strong>Pix</strong>
            <p>{"R$ 200,00"}</p>
          </div>
          <div className="formasDePagamentoCaixa">
            <BsFillCreditCard2FrontFill/>
            <strong>Crediario</strong>
            <p>{"R$ 200,00"}</p>
          </div>
        </div>
      </div>

      <div className="InfoCaixaAtual">
        <h3>Movimentações</h3>
        <div id="sectionrolavel"></div>

        <div className="FooterCaixaAtual">
          <strong>Saldo Final</strong>
          <h1>{"R$ 200,00"}</h1>
          <button id="ButtonCaixa">{"Fechar Caixa"}</button>
        </div>
      </div>
    </div>
  );
}

export default CaixaAtual;
