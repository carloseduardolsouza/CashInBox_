import "./ItemProduto.css";
import { useState, useEffect } from "react";

//conexão com a api
import produtoFetch from "../../../../api/produtoFetch";

import services from "../../../../services/services";

function ItemProduto({ dado }) {
  const [openDetalhes, setOpenDetalhes] = useState(false);
  const [image, setImage] = useState("");

  const { nome, id, preco_venda, estoque_atual, descricao } = dado;

  useEffect(() => {
    async function carregarImagem() {
      try {
        const imagens = await produtoFetch.listarImagens(id);
        if (imagens && imagens.length > 0) {
          setImage(imagens[0].imagem_path);
        }
      } catch (error) {
        console.error("Erro ao carregar imagem do produto:", error);
      }
    }

    carregarImagem();
  }, []);

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
          <p>{descricao}</p>
        </div>
      )}
      <div
        className="ImageProduto"
        style={{
          backgroundImage: `url(http://localhost:3322/uploads/${image})`,
        }}
      />

      <div>
        <h2>{nome}</h2>
        <p>
          <strong>Codigo</strong>
        </p>
        <p>{id}</p>
        <p>
          <strong>Preço :</strong>
        </p>
        <p>{services.formatarCurrency(preco_venda)}</p>
        <p>
          <strong>Em Estoque :</strong>
        </p>
        <p>{`${estoque_atual} unidades`}</p>
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
