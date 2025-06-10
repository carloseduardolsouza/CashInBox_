import "./Concluindo.css";
import { useState, useEffect } from "react";

import { FaRegCheckCircle } from "react-icons/fa";

function AçãoRealizada() {
  const [counter, setCounter] = useState(0);
  const [notConcluido, setNotConcluido] = useState(true);

  // Esta função será chamada a cada intervalo de tempo
  useEffect(() => {
    const interval = setInterval(() => {
      // Atualiza o contador a cada segundo
      setCounter((prevCounter) => prevCounter + 1);
    }, 1500); // Intervalo de 1500 milissegundos = 1,5 segundos

    // Define notConcluido como false após 4 segundos (apenas para fins de demonstração)
    setTimeout(() => {
      setNotConcluido(false);
      clearInterval(interval); // Limpa o intervalo
    }, 1000);

    // Retorna uma função de limpeza para limpar o intervalo quando o componente é desmontado ou o intervalo é atualizado
    return () => clearInterval(interval);
  }, []); // O segundo argumento [] garante que este efeito só seja executado uma vez, quando o componente é montado

  return (
    <div id="AçãoRealizadasss">
      {notConcluido ? (
        <div id="wifi-loader">
          <svg className="circle-outer" viewBox="0 0 86 86">
            <circle className="back" cx="43" cy="43" r="40"></circle>
            <circle className="front" cx="43" cy="43" r="40"></circle>
            <circle className="new" cx="43" cy="43" r="40"></circle>
          </svg>
          <svg className="circle-middle" viewBox="0 0 60 60">
            <circle className="back" cx="30" cy="30" r="27"></circle>
            <circle className="front" cx="30" cy="30" r="27"></circle>
          </svg>
          <svg className="circle-inner" viewBox="0 0 34 34">
            <circle className="back" cx="17" cy="17" r="14"></circle>
            <circle className="front" cx="17" cy="17" r="14"></circle>
          </svg>
          <div className="text" data-text="concluindo"></div>
        </div>
      ) : (
        <h1 className="H1ConcluidoAção">
          <FaRegCheckCircle /> concluido
        </h1>
      )}
    </div>
  );
}

export default AçãoRealizada;
