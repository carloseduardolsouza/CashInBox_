import "./PlanosEBoletos.css";

//Icones
import { FaCheckCircle } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

function PlanosEBoletos() {
  return (
    <div id="PlanosEBoletos">
      <h2>Planos e Boletos</h2>
      <div id="PositionButton">
        <button className="Download-button">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="20"
            viewBox="0 0 640 512"
            >
            <path
                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V318.1l-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"
                fill="white"
            ></path>
            </svg>
            <span>Download Boleto</span>
        </button>
      </div>
      <div id="AreaCardPlanos">
        <div className="CardPlanos Basic card">
            <span></span>
          <div className="divHeaderCardPlanos">
            <div>img</div>
            <div>
                <p>Plano</p>
                <p style={{fontSize: "25px" , marginTop: "-10px"}}><strong>Basico+</strong></p>
            </div>
          </div>
          <div>
            <p style={{fontSize: "12px"}}>Acesse todas as funções básicas para seu negocio com melhor preço do mercado</p>
          </div>
          <div>
            <p><strong style={{fontSize: "35px"}}>R$69,90</strong>/mês</p>
          </div>
          <div>
            <strong>O que está incluso ?</strong>
            <p><FaCheckCircle /> Gerenciamento de vendas</p>
            <p><FaCheckCircle /> Gerenciamento de clientes</p>
            <p><FaCheckCircle /> Gerenciamento de estoque</p>
            <p><FaCheckCircle /> Contas para pagar</p>
            <p><FaCheckCircle /> Fluxo de caixa</p>
          </div>
          <button className="AssineAgoraPlanos button1">Assine Agora</button>
        </div>

        <div className="CardPlanos Essencial card">
            <div id="divMaisPopular"><FaStar /> Mais Popular</div>
            <span></span>
          <div className="divHeaderCardPlanos">
            <div>img</div>
            <div>
                <p>Plano</p>
                <p style={{fontSize: "25px" , marginTop: "-10px"}}><strong>Essencial+</strong></p>
            </div>
          </div>
          <div>
            <p style={{fontSize: "12px"}}>Acesse todas as funções básicas para seu negocio com melhor preço do mercado</p>
          </div>
          <div>
            <p><strong style={{fontSize: "35px"}}>R$129,90</strong>/mês</p>
          </div>
          <div>
            <strong>O que está incluso ?</strong>
            <p><FaCheckCircle /> Tudo do plano Básico</p>
            <p><FaCheckCircle /> Emição de notas fiscais</p>
            <p><FaCheckCircle /> Catalago de produtos</p>
            <p><FaCheckCircle /> Relatorios</p>
            <p><FaCheckCircle /> Gerenciamento de Funcionarios</p>
          </div>
          <button className="AssineAgoraPlanos button2">Assine Agora</button>
        </div>

        <div className="CardPlanos Premium card">
            <span></span>
          <div className="divHeaderCardPlanos">
            <div>img</div>
            <div>
                <p>Plano</p>
                <p style={{fontSize: "25px" , marginTop: "-10px"}}><strong>Premium+</strong></p>
            </div>
          </div>
          <div>
            <p style={{fontSize: "12px"}}>Acesse todas as funções básicas para seu negocio com melhor preço do mercado</p>
          </div>
          <div>
            <p><strong style={{fontSize: "35px"}}>R$199,90</strong>/mês</p>
          </div>
          <div>
            <strong>O que está incluso ?</strong>
            <p><FaCheckCircle /> Tudo do plano essencial</p>
            <p><FaCheckCircle /> Pos venda automatico</p>
            <p><FaCheckCircle /> Gerenciamento de promoções</p>
            <p><FaCheckCircle /> Automação de WhatsApp</p>
          </div>
          <button className="AssineAgoraPlanos button1">Assine Agora</button>
        </div>
      </div>
    </div>
  );
}

export default PlanosEBoletos;
