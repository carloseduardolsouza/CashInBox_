import "./ItemProduto.css";
import { useState, useEffect } from "react";

// Conexão com a API
import produtoFetch from "../../../../api/produtoFetch";
import services from "../../../../services/services";
import ModalImages from "../ModalImages/ModalImages";

function ItemProduto({ dado }) {
  const [openDetalhes, setOpenDetalhes] = useState(false);
  const [modalImages, setModalImages] = useState(false);
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { nome, id, preco_venda, estoque_atual, descricao } = dado;

  async function carregarImagem() {
    try {
      const imagens = await produtoFetch.listarImagens(id);
      if (imagens && imagens.length > 0) {
        const imgPath = imagens[0].imagem_path;
        setImage(imgPath);
        setImages(imagens);

        // Pré-carregar imagem pra detectar quando ela termina
        const img = new Image();
        img.src = `http://localhost:3322/uploads/${imgPath}`;
        img.onload = () => setImageLoaded(true);
      } else {
        setImageLoaded(true); // Mesmo sem imagem, tira o loading
      }
    } catch (error) {
      console.error("Erro ao carregar imagem do produto:", error);
      setImageLoaded(true);
    }
  }

  useEffect(() => {
    carregarImagem();
  }, [id]);

  return (
    <div id="ItensTableProdutos">
      {modalImages && <ModalImages images={images} fechar={setModalImages} />}

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
        onClick={() => setModalImages(true)}
        style={{
          backgroundImage: imageLoaded
            ? `url(http://localhost:3322/uploads/${image})`
            : "none",
        }}
      >
        {!imageLoaded && <div className="loading-placeholder"></div>}
      </div>

      <div>
        <h2>{nome}</h2>
        <p>
          <strong>Código:</strong>
        </p>
        <p>{id}</p>
        <p>
          <strong>Preço:</strong>
        </p>
        <p>{services.formatarCurrency(preco_venda)}</p>
        <p>
          <strong>Em Estoque:</strong>
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
