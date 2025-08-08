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

// APIs
import produtoFetch from "../../api/produtoFetch";
import categoriaFetch from "../../api/categoriaFetch";

// Ícones
import { FaCamera, FaBox, FaTag, FaDollarSign, FaImage, FaPlus } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";

// Componentes
import CriarCategoria from "./Components/CriarCategoria/CriarCategoria";

// Bibliotecas
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Select from "react-select";

const CadastrarProduto = () => {
  const { setErroApi, adicionarAviso } = useContext(AppContext);
  
  const fileInputRef = useRef(null);

  // Estados do componente
  const [state, setState] = useState({
    categorias: [],
    modal: null,
    images: [],
    imageFiles: [],
    showImagePreview: false,
    isSubmitting: false
  });

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    marca: "",
    descricao: "",
    precoCompra: "",
    precoVenda: "",
    markup: 0,
    categoriaId: "",
    referencia: "",
    usarReferencia: false
  });

  // Opções do Select memoizadas
  const categoryOptions = useMemo(() => {
    return state.categorias.map((categoria) => ({
      value: categoria.id,
      label: categoria.nome,
    }));
  }, [state.categorias]);

  // Estilos customizados do Select
  const selectStyles = useMemo(() => ({
    control: (base, state) => ({
      ...base,
      border: state.isFocused ? "2px solid #3b82f6" : "2px solid #e5e7eb",
      borderRadius: "12px",
      padding: "6px 8px",
      fontSize: "16px",
      boxShadow: state.isFocused 
        ? "0 0 0 4px rgba(59, 130, 246, 0.1)" 
        : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      },
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
      fontWeight: "400"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? "#3b82f6" 
        : state.isFocused 
          ? "#dbeafe" 
          : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3b82f6" : "#dbeafe",
      }
    })
  }), []);

  // Configurações do slider
  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 4000,
  }), []);

  // Buscar categorias
  const fetchCategorias = useCallback(async () => {
    try {
      const result = await categoriaFetch.listarCategorias();
      setState(prev => ({
        ...prev,
        categorias: result
      }));
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setErroApi(true);
    }
  }, [setErroApi]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  // Atualizar dados do formulário
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Atualizar estado
  const updateState = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Calcular preços automaticamente
  const calculatePrices = useCallback((field, value) => {
    const numValue = parseFloat(value) || 0;
    
    if (field === "precoCompra") {
      const newPrecoVenda = numValue + (numValue * formData.markup) / 100;
      setFormData(prev => ({
        ...prev,
        precoCompra: numValue,
        precoVenda: newPrecoVenda
      }));
    } else if (field === "markup") {
      const newPrecoVenda = formData.precoCompra + (formData.precoCompra * numValue) / 100;
      setFormData(prev => ({
        ...prev,
        markup: numValue,
        precoVenda: newPrecoVenda
      }));
    } else if (field === "precoVenda") {
      const newMarkup = formData.precoCompra > 0 
        ? ((numValue - formData.precoCompra) / formData.precoCompra) * 100
        : 0;
      setFormData(prev => ({
        ...prev,
        precoVenda: numValue,
        markup: newMarkup
      }));
    }
  }, [formData.precoCompra, formData.markup]);

  // Handle para mudança de imagens
  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newImages = files.map(file => URL.createObjectURL(file));
    
    updateState({
      imageFiles: [...state.imageFiles, ...files],
      images: [...state.images, ...newImages],
      showImagePreview: true
    });
  }, [state.imageFiles, state.images, updateState]);

  // Handle para seleção de categoria
  const handleCategorySelect = useCallback((selectedOption) => {
    if (selectedOption) {
      updateFormData("marca", selectedOption.label);
      updateFormData("categoriaId", selectedOption.value);
    }
  }, [updateFormData]);

  // Reset do formulário
  const resetForm = useCallback(() => {
    setFormData({
      nome: "",
      marca: "",
      descricao: "",
      precoCompra: "",
      precoVenda: "",
      markup: 0,
      categoriaId: "",
      referencia: "",
      usarReferencia: false
    });
    
    updateState({
      images: [],
      imageFiles: [],
      showImagePreview: false
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [updateFormData, updateState]);

  // Submit do formulário
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (state.isSubmitting) return;
    
    updateState({ isSubmitting: true });

    const productData = {
      nome: formData.nome.charAt(0).toUpperCase() + formData.nome.slice(1).toLowerCase(),
      descricao: formData.descricao || "",
      referencia: formData.usarReferencia ? formData.referencia : "",
      codigo_barras: "",
      preco_venda: parseFloat(formData.precoVenda) || 0,
      preco_custo: parseFloat(formData.precoCompra) || 0,
      estoque_atual: 0,
      estoque_minimo: 0,
      markup: parseFloat(formData.markup).toFixed(2) || "0.00",
      categoria: formData.marca,
      categoria_id: formData.categoriaId,
      unidade_medida: "",
      ativo: true,
    };

    try {
      await produtoFetch.novoProduto(productData, state.imageFiles);
      adicionarAviso("sucesso", "Produto cadastrado com sucesso! 🎉");
      resetForm();
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      setErroApi(true);
    } finally {
      updateState({ isSubmitting: false });
    }
  }, [
    state.isSubmitting,
    state.imageFiles,
    formData,
    updateState,
    resetForm,
    adicionarAviso,
    setErroApi
  ]);

  // Render do modal
  const renderModal = () => {
    switch (state.modal) {
      case "criarCategoria":
        return (
          <CriarCategoria 
            fechar={() => updateState({ modal: null })}
            onSuccess={fetchCategorias}
          />
        );
      default:
        return null;
    }
  };

  // Validação do formulário
  const isFormValid = useMemo(() => {
    return formData.nome.trim() !== "" && 
           formData.categoriaId !== "" && 
           !state.isSubmitting;
  }, [formData.nome, formData.categoriaId, state.isSubmitting]);

  return (
    <div className="cadastrar-produto-container">
      {renderModal()}
      <div className="main-content-cad-produtos">
        {/* Formulário Principal */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Seção: Informações Básicas */}
            <div className="form-section">
              <h3 className="section-title">
                <FaTag /> Informações Básicas
              </h3>
              
              <div className="form-group">
                <label className="form-label">
                  Nome do Produto <span className="required-indicator">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Digite o nome do produto..."
                  value={formData.nome}
                  onChange={(e) => updateFormData("nome", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Categoria <span className="required-indicator">*</span>
                </label>
                <div className="category-row">
                  <div className="category-select">
                    <Select
                      placeholder="Selecione uma categoria..."
                      styles={selectStyles}
                      options={categoryOptions}
                      onChange={handleCategorySelect}
                      isSearchable
                      value={categoryOptions.find(option => option.value === formData.categoriaId)}
                    />
                  </div>
                  <button
                    type="button"
                    className="icon-button add-button"
                    onClick={() => updateState({ modal: "criarCategoria" })}
                    title="Adicionar nova categoria"
                  >
                    <FaPlus />
                  </button>
                  <button
                    type="button"
                    className="icon-button update-button"
                    onClick={fetchCategorias}
                    title="Atualizar categorias"
                  >
                    <GrUpdate />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Referência</label>
                <div className="reference-row">
                  <input
                    type="text"
                    className="form-input reference-input"
                    placeholder="Código de referência..."
                    value={formData.referencia}
                    onChange={(e) => updateFormData("referencia", e.target.value)}
                    disabled={!formData.usarReferencia}
                  />
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={formData.usarReferencia}
                      onChange={(e) => updateFormData("usarReferencia", e.target.checked)}
                      id="usar-referencia"
                    />
                    <label htmlFor="usar-referencia" className="checkbox-label">
                      Usar referência
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Descreva o produto..."
                  value={formData.descricao}
                  onChange={(e) => updateFormData("descricao", e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Seção: Preços */}
            <div className="form-section">
              <h3 className="section-title">
                <FaDollarSign /> Precificação
              </h3>
              
              <div className="pricing-section">
                <div className="pricing-grid">
                  <div className="form-group">
                    <label className="form-label">Preço de Compra</label>
                    <div className="price-input-wrapper">
                      <span className="currency-symbol">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-input price-input"
                        placeholder="0,00"
                        value={formData.precoCompra}
                        onChange={(e) => calculatePrices("precoCompra", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Margem (%)</label>
                    <input
                      type="number"
                      className="form-input margin-input"
                      placeholder="0"
                      value={formData.markup}
                      onChange={(e) => calculatePrices("markup", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preço de Venda</label>
                    <div className="price-input-wrapper">
                      <span className="currency-symbol">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-input price-input"
                        placeholder="0,00"
                        value={formData.precoVenda}
                        onChange={(e) => calculatePrices("precoVenda", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Imagens */}
            <div className="form-section">
              <h3 className="section-title">
                <FaImage /> Imagens do Produto
              </h3>
              
              <div className="form-group">
                <div className="file-input-wrapper">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="file-input"
                    onChange={handleImageChange}
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="file-input-button">
                    <FaCamera className="file-input-icon" />
                    <span className="file-input-text">
                      {state.images.length > 0 
                        ? `${state.images.length} imagem(ns) selecionada(s)`
                        : "Clique para adicionar imagens"
                      }
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Botão de Submit */}
            <div className="submit-section">
              <button
                type="submit"
                className="submit-button"
              >
                {state.isSubmitting ? (
                  <>
                    <div className="loading-spinner" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <FaBox />
                    Cadastrar Produto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview de Imagens */}
        <div className="image-preview-container">
          <div className="preview-header">
            <h3 className="preview-title">Preview das Imagens</h3>
            <p className="preview-subtitle">
              {state.images.length > 0 
                ? `${state.images.length} imagem(ns) carregada(s)`
                : "Nenhuma imagem selecionada"
              }
            </p>
          </div>
          
          <div className="image-display">
            {state.showImagePreview && state.images.length > 0 ? (
              <div className="custom-slider">
                <Slider {...sliderSettings}>
                  {state.images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="placeholder-content">
                <FaCamera className="placeholder-icon" />
                <p className="placeholder-text">
                  As imagens aparecerão aqui
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastrarProduto;