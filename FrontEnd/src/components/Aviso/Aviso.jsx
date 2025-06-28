import "./Aviso.css";
import { useContext } from "react";
import AppContext from "../../context/AppContext";

//Componente
import ComponenteAviso from "./componenteAviso/componenteAviso";

function Aviso() {
  const { avisos } = useContext(AppContext);
  return (
    <div id="Aviso">
      {avisos.map((dados) => {
        return <ComponenteAviso tipo={dados.tipo} aviso={dados.texto} />;
      })}
    </div>
  );
}

export default Aviso;
