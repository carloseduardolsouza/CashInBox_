import "./CadastrarProduto.css";
import { useState, useRef } from "react";

//Icones
import { FaCamera } from "react-icons/fa";

//componentes
import CriarCategoria from "./Components/CriarCategoria/CriarCategoria";

//Biblioteca
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Select from "react-select";

function CadastrarProduto() {
  const fileInputRef = useRef(null);
  const [modal, setModal] = useState(null);

  const [images, setImages] = useState([]);
  const [openImagens, setOpenImagens] = useState(false);
  const [ref, setRef] = useState(true);

  const [imageReq, setImageReq] = useState();

  const [produto, setProduto] = useState();
  const [marca, setMarca] = useState();
  const [descrição, setDescrição] = useState();

  const [concluido, setConcluindo] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);
  const [referencia, setReferencia] = useState("");

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: state.isFocused ? "2px solid black" : "2px solid #ccc",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 123, 255, 0.2)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "black" : "#888",
      },
      borderRadius: "8px",
      padding: "0px",
    }),
  };

  const escrever = (p, e) => {
    if (p == "produto") {
      setProduto(e.target.value);
    }

    if (p == "marca") {
      setMarca(e.target.value);
    }

    if (p == "descrição") {
      setDescrição(e.target.value);
    }
  };

  const renderModal = () => {
    switch (modal) {
      case "criarCategoria":
        return <CriarCategoria fechar={setModal}/>;
      case null:
        return null;
    }
  };

  const HandleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageReq(files);

    const imagesArray = files.map((file) => {
      return URL.createObjectURL(file);
    });

    setImages((prevImages) => [...prevImages, ...imagesArray]);
    setIsDisabled(false);
    setOpenImagens(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div id="cadastrarProduto">
      {renderModal()}
      <h2>Cadastro de Produtos</h2>
      <div id="CadastroProdutos">
        <form
          className="AreaInputsNovoProduto"
          onSubmit={(e) => CadastrarProduto(e)}
        >
          <la>
            <p>Nome: </p>
            <input
              type="text"
              className="nomeNovoProduto"
              onChange={(e) => escrever("produto", e)}
              value={produto}
              required
              placeholder="Nome do produto..."
            />
          </la>
          <la>
            <p>Marca: </p>
            <Select
              id="SelectCategoriaProduto"
              placeholder="Categoria"
              styles={customStyles}
              onChange={(e) => `` /*renderInfoProduto(e)*/}
            />
            <button id="AddCategoria" onClick={(e) => {
              e.preventDefault()
              setModal("criarCategoria")
            }}>+</button>
          </la>

          <la>
            <p>Referencia: </p>
            <input
              type="text"
              disabled={ref}
              placeholder="Referencia de Tabela"
              onChange={(e) => setReferencia(e.target.value)}
              className="RefInput"
            />
            <input
              type="checkbox"
              onChange={(e) => setRef(!e.target.checked)}
              value={ref}
              className="InputCheckBox"
            />
          </la>

          <div id="DivisãoPreçoCadastroProduto">
            <la>
              <p>Preço de Compra: </p>
              <input type="number" placeholder="somente numeros" />
            </la>

            <la>
              <p>Margem:</p>
              <input type="number" placeholder="somente numeros" />
            </la>

            <la>
              <p>Preço De Venda:</p>
              <input type="number" value={""} placeholder="somente numeros" />
            </la>
          </div>

          <la>
            <p>Descrição: </p>
            <textarea
              id="texto"
              rows="4"
              cols="50"
              onChange={(e) => escrever("descrição", e)}
              value={descrição}
              required
              placeholder="descrição do produto..."
            />
          </la>

          <la>
            <p>Imagens: </p>
            <input
              type="file"
              multiple
              className="imageProduto"
              id="inputImageProduto"
              ref={fileInputRef}
              onChange={HandleImageChange}
            />
          </la>

          <div className="LinhaDivisão" />
          <button
            className={isDisabled ? "disabled" : "bttCadastrarNovoProduto"}
            disabled={isDisabled}
            type="submit"
          >
            Cadastrar
          </button>
        </form>

        {(openImagens && (
          <div className="imageProdutoOpen">
            <div>
              <Slider {...settings}>
                {images.map((image) => (
                  <div>
                    <img
                      src={image}
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        margin: "auto",
                      }}
                      className="zindex"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )) || (
          <div className="imageProduto">
            <div>
              <FaCamera />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CadastrarProduto;
