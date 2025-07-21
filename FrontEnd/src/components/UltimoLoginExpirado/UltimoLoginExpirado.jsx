import "./UltimoLoginExpirado.css";

function UltimoLoginExpirado() {
  const reiniciarAplicacao = () => {
    window.electronAPI.reiniciarApp();
  };

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
              <span class="title">🚫 Ultimo login a mais de 7 dias</span>
              <p class="message">
                Oops! Detectamos que seu ultimo acesso a internet foi a mais de
                3 dias <strong>Cash In Box</strong> não consegue validar sua
                mensalidade. 😕
                <br />
                <br />
                Para recuperar o <strong>acesso os nossos serviços</strong>,
                conecte sua maquina a internet e reinicie o programa , se isso
                não resolver entre contato com o suporte.
                <br />
                <br />
                📞 Estamos prontos para te ajudar — conte com a gente!
              </p>
            </div>

            <div class="actions">
              <button class="desactivate" type="button">
                Suporte
              </button>
              <button
                class="cancel"
                type="button"
                onClick={() => reiniciarAplicacao()}
              >
                Reiniciar Programa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UltimoLoginExpirado;
