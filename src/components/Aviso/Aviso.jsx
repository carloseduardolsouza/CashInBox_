import "./Aviso.css";

//Componente
import ComponenteAviso from "./componenteAviso/componenteAviso";

function Aviso() {
  return (
    <div id="Aviso">
      <ComponenteAviso tipo="atenção" aviso="ATENÇÃO - Estoque baixo" />
      <ComponenteAviso tipo="erro" aviso="ERRO - Api inativa" />
      <ComponenteAviso tipo="suscesso" aviso="SUCESSO - Novo produto cadastrado" />
      <ComponenteAviso tipo="aviso" aviso="AVISO - Fatura vencida a 2 dias" />
    </div>
  );
}

export default Aviso;
