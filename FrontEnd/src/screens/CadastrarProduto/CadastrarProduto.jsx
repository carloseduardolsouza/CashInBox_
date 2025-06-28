import "./CadastrarProduto.css";
import {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import AppContext from "../../context/AppContext";

// Conexão com a API
import produtoFetch from "../../api/produtoFetch";
import categoriaFetch from "../../api/categoriaFetch";

// Ícones
import { FaCamera } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";

// Componentes
import CriarCategoria from "./Components/CriarCategoria/CriarCategoria";

// Bibliotecas
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Select from "react-select";

function CadastrarProduto() {
  const { setErroApi, adicionarAviso } = useContext(AppContext);

  const fileInputRef = useRef(null);

  const [resulCategoria, setResultCategorias] = useState([]);
  const [modal, setModal] = useState(null);
  const [images, setImages] = useState([]);
  const [openImagens, setOpenImagens] = useState(false);
  const [ref, setRef] = useState(true);
  const [imageReq, setImageReq] = useState([]);

  const [nomeProduto, setNomeProduto] = useState("");
  const [marca, setMarca] = useState();
  const [descricao, setDescricao] = useState();
  const [precoCompra, setPrecoCompra] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [markup, setMarkup] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [referencia, setReferencia] = useState("");

  const [isDisabled, setIsDisabled] = useState(false);

  const categorias = useMemo(() => {
    return resulCategoria.map((c) => ({
      value: c.id,
      label: c.nome,
    }));
  }, [resulCategoria]);

  const customStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        border: state.isFocused ? "2px solid black" : "2px solid #ccc",
        boxShadow: state.isFocused
          ? "0 0 0 2px rgba(0, 123, 255, 0.2)"
          : "none",
        "&:hover": {
          borderColor: state.isFocused ? "black" : "#888",
        },
        borderRadius: "8px",
        padding: "0px",
      }),
    }),
    []
  );

  const buscarCategorias = useCallback(async () => {
    try {
      const resultado = await categoriaFetch.listarCategorias();
      setResultCategorias(resultado);
    } catch {
      setErroApi(true);
    }
  }, [setErroApi]);

  useEffect(() => {
    buscarCategorias();
  }, [buscarCategorias]);

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    setImageReq(files);
    const imagesArray = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imagesArray]);
    setOpenImagens(true);
  }, []);

  const calculeValor = useCallback(
    (campo, valor) => {
      valor = parseFloat(valor) || 0;

      if (campo === "precoCompra") {
        setPrecoCompra(valor);
        setPrecoVenda(valor + (valor * markup) / 100);
      } else if (campo === "margem") {
        setMarkup(valor);
        setPrecoVenda(precoCompra + (precoCompra * valor) / 100);
      } else if (campo === "precoVenda") {
        setPrecoVenda(valor);
        setMarkup(((valor - precoCompra) / precoCompra) * 100);
      }
    },
    [precoCompra, markup]
  );

  const renderModal = () => {
    if (modal === "criarCategoria") return <CriarCategoria fechar={setModal} />;
    return null;
  };

  const resetForm = () => {
    setNomeProduto("");
    setMarca("");
    setDescricao("");
    setPrecoCompra("");
    setPrecoVenda("");
    setMarkup(0);
    setCategoria("");
    setReferencia("");
    setImageReq([]);
    setImages([]);
    setOpenImagens(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dados = {
      nome:
        nomeProduto.charAt(0).toUpperCase() +
        nomeProduto.slice(1).toLowerCase(),
      descricao,
      referencia,
      codigo_barras: "",
      preco_venda: precoVenda || 0,
      preco_custo: precoCompra,
      estoque_atual: 0,
      estoque_minimo: 0,
      markup: markup.toFixed(2) || 0,
      categoria: marca,
      categoria_id: categoria,
      unidade_medida: "",
      ativo: true,
    };

    try {
      await produtoFetch.novoProduto(dados, imageReq);
      adicionarAviso("sucesso", "SUCESSO - produto cadastrado com sucesso!");
      resetForm();
    } catch {
      setErroApi(true);
    }
  };

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }),
    []
  );

  return (
    <div id="cadastrarProduto">
      {renderModal()}
      <h2>Cadastro de Produtos</h2>
      <div id="CadastroProdutos">
        <form className="AreaInputsNovoProduto" onSubmit={handleSubmit}>
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
              onClick={buscarCategorias}
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
                value={precoCompra}
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
                value={precoVenda}
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
              onChange={(e) => setDescricao(e.target.value)}
              value={descricao}
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
              onChange={handleImageChange}
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

        {openImagens ? (
          <div className="imageProdutoOpen">
            <div>
              <Slider {...sliderSettings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        margin: "auto",
                      }}
                      className="zindex"
                      alt="Preview"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ) : (
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
