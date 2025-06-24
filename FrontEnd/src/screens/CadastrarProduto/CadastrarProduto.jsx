import "./CadastrarProduto.css";
import { useState, useRef, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";

//Conexão com a api
import fetchapi from "../../api/fetchapi";

//Icones
import { FaCamera } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";

//componentes
import CriarCategoria from "./Components/CriarCategoria/CriarCategoria";

//Biblioteca
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Select from "react-select";

function CadastrarProduto() {
  const { setErroApi } = useContext(AppContext);
  const [resulCategoria, setResultCategorias] = useState([]);

  const fileInputRef = useRef(null);
  const [modal, setModal] = useState(null);

  const [images, setImages] = useState([]);
  const [openImagens, setOpenImagens] = useState(false);
  const [ref, setRef] = useState(true);

  const [imageReq, setImageReq] = useState();

  const [nomeProduto, setNomeProduto] = useState("");
  const [marca, setMarca] = useState();
  const [descrição, setDescrição] = useState();
  const [preçoCompra, setPreçoCompra] = useState("");
  const [preçoVenda, setPreçoVenda] = useState("");
  const [markup, setMarkup] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [referencia, setReferencia] = useState("");

  const [isDisabled, setIsDisabled] = useState(false);

  const buscarCategorias = async () => {
    try {
      const resultado = await fetchapi.listarCategorias();
      setResultCategorias(resultado);
    } catch (err) {
      setErroApi(true);
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, []);

  const categorias = resulCategoria.map((categoria) => ({
    value: categoria.id,
    label: categoria.nome,
  }));

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

  const renderModal = () => {
    switch (modal) {
      case "criarCategoria":
        return <CriarCategoria fechar={setModal} />;
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
    setOpenImagens(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const CadastrarProduto = (e) => {
    e.preventDefault();
    let dados = {
      nome: nomeProduto.charAt(0).toUpperCase() + nomeProduto.slice(1).toLowerCase(),
      descricao: descrição,
      referencia: referencia,
      codigo_barras: "",
      preco_venda: preçoVenda || 0,
      preco_custo: preçoCompra,
      estoque_atual: 0,
      estoque_minimo: 0,
      markup: markup.toFixed(2) || 0,
      categoria: marca,
      categoria_id: categoria,
      unidade_medida: "",
      ativo: true,
    };

    fetchapi
      .novoProduto(dados, imageReq)
      .then((resposta) => {
        setCategoria("");
        setDescrição("");
        setImageReq([]);
        setImages([]);
        setMarca("");
        setMarkup("");
        setNomeProduto("");
        setPreçoCompra("");
        setPreçoVenda("");
        setOpenImagens(false);
      })
      .catch((erro) => {
        setErroApi(true);
      });
  };

  const calculeValor = (campo, valor) => {
    valor = parseFloat(valor) || 0;

    if (campo === "precoCompra") {
      setPreçoCompra(valor);
      const novoPrecoVenda = valor + (valor * markup) / 100;
      setPreçoVenda(novoPrecoVenda);
    } else if (campo === "margem") {
      setMarkup(valor);
      const novoPrecoVenda = preçoCompra + (preçoCompra * valor) / 100;
      setPreçoVenda(novoPrecoVenda);
    } else if (campo === "precoVenda") {
      setPreçoVenda(valor);
      const novaMargem = ((valor - preçoCompra) / preçoCompra) * 100;
      setMarkup(novaMargem);
    }
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
              onChange={(e) => setNomeProduto(e.target.value)}
              value={nomeProduto}
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
              options={categorias}
              onChange={(e) => {
                setMarca(e.label);
                setCategoria(e.value);
              }}
            />
            <button
              id="AddCategoria"
              onClick={(e) => {
                e.preventDefault();
                setModal("criarCategoria");
              }}
            >
              +
            </button>
            <button
              id="AtualizarCategoria"
              type="button"
              onClick={(e) => buscarCategorias(e)}
            >
              <GrUpdate />
            </button>
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
              <input
                type="number"
                placeholder="somente numeros"
                value={preçoCompra}
                onChange={(e) => calculeValor("precoCompra", e.target.value)}
              />
            </la>

            <la>
              <p>Margem:</p>
              <input
                type="number"
                placeholder="somente numeros"
                value={markup}
                onChange={(e) => calculeValor("margem", e.target.value)}
              />
            </la>

            <la>
              <p>Preço De Venda:</p>
              <input
                type="number"
                value={preçoVenda}
                placeholder="somente numeros"
                onChange={(e) => calculeValor("precoVenda", e.target.value)}
              />
            </la>
          </div>

          <la>
            <p>Descrição: </p>
            <textarea
              id="texto"
              rows="4"
              cols="50"
              onChange={(e) => setDescrição(e.target.value)}
              value={descrição}
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
