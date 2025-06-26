import "./ModalImages.css";
import { useState } from "react";

function ModalImages({ images , fechar }) {
  console.log(images);
  const [bigImage, setBigImage] = useState(images[0].imagem_path);
  return (
    <div className="blurModal">
      <div id="ModalImages">
        <button onClick={() => fechar(false)} id="closeModalImages">X</button>
        <div id="centralizarImagemModalImages">
          <div
            id="bigImageModalImage"
            onClick={() => window.open(`http://localhost:3322/uploads/${bigImage}`, '_blank')}
            style={{
              backgroundImage: `url(http://localhost:3322/uploads/${bigImage})`,
            }}
          />
        </div>

        <div id="divSmallImages">
          {images.map((dados) => {
            return (
              <div
                className="smallImage"
                onClick={() => setBigImage(dados.imagem_path)}
                style={{
                  backgroundImage: `url(http://localhost:3322/uploads/${dados.imagem_path})`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ModalImages;
