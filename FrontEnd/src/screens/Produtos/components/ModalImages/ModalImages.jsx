import "./ModalImages.css";
import { useState } from "react";

function ModalImages({ images, fechar }) {
  const [bigImage, setBigImage] = useState(images[0].imagem_path);

  return (
    <div className="modal-background">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={() => fechar(false)}>×</button>

        <div className="modal-main-image"
          onClick={() => window.open(`http://localhost:3322/uploads/${bigImage}`, '_blank')}
          style={{ backgroundImage: `url(http://localhost:3322/uploads/${bigImage})` }}
        />

        <div className="modal-thumbnails">
          {images.map((img, i) => (
            <div
              key={i}
              className={`modal-thumbnail-img ${bigImage === img.imagem_path ? "active" : ""}`}
              onClick={() => setBigImage(img.imagem_path)}
              style={{ backgroundImage: `url(http://localhost:3322/uploads/${img.imagem_path})` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModalImages;
