import "./ItemProduto.css";
import { useState } from "react";

function ItemProduto() {
    const [openDetalhes , setOpenDetalhes] = useState(false)
  return (
    <div id="ItensTableProdutos">
      {openDetalhes && (
        <div className="openDetalhes">
          <button
            className="ExitDetalhesProduto"
            onClick={() => setOpenDetalhes(false)}
          >
            X
          </button>
          <h4>Detalhes</h4>
          <p>{'descrição'}</p>
        </div>
      )}
      <div className="ImageProduto" />

      <div>
        <h2>{"produto"}</h2>
        <p>
          <strong>Codigo</strong>
        </p>
        <p>{"id"}</p>
        <p>
          <strong>Preço :</strong>
        </p>
        <p>{"1"}</p>
        <p>
          <strong>Em Estoque :</strong>
        </p>
        <p>{`${"1"} unidades`}</p>
        <button
          className="DetalhesProdutos"
          onClick={() => setOpenDetalhes(true)}
        >
          Detalhes
        </button>
      </div>
    </div>
  );
}

export default ItemProduto;
