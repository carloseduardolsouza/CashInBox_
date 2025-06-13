import "./AssinaturaVencida.css";
import { useContext } from "react";
import AppContext from "../../context/AppContext";

function AssinaturaVencida() {
  const {setFazerLogin} = useContext(AppContext)
  return (
    <div className="blurModal">
      <div id="centralizarAssinaturaVencida">
        <div class="cardAssinaturaVencida">
          <div class="header">
            <div class="image">
              <svg
                aria-hidden="true"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                ></path>
              </svg>
            </div>
            <div class="content">
              <span class="title">Assinatura Vencida</span>
              <p class="message">
                Identificamos que a sua mensalidade da Cash In Box está em
                atraso. Para evitar a suspensão dos serviços, entre em contato
                com o nosso suporte e regularize sua situação o quanto antes. <br />
                Estamos à disposição para te ajudar!
              </p>
            </div>
            <div class="actions">
              <button class="desactivate" type="button">
                Suporte
              </button>
              <button class="cancel" type="button" onClick={() => setFazerLogin(true)}>
                Mudar Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssinaturaVencida;
