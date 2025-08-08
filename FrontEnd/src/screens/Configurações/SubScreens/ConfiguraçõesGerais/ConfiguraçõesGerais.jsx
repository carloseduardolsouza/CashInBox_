import "./ConfiguraçõesGerais.css";
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import AppContext from "../../../../context/AppContext";
import CardLogin from "../../../../components/CardLogin/CardLogin";

// Ícones
import { 
  FaBuilding, 
  FaPhone, 
  FaIdCard, 
  FaMapMarkerAlt,
  FaFileAlt,
  FaCog,
  FaKey,
  FaCheck,
  FaExclamationTriangle,
  FaSave,
  FaCamera,
  FaImage
} from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import userFetch from "../../../../api/userFetch";

// Configuração dos campos do formulário
const FORM_FIELDS = {
  NOME_ESTABELECIMENTO: 'nomeEstabelecimento',
  CNPJ: 'cnpj',
  TELEFONE: 'telefone',
  ENDERECO: 'endereco',
  INSCRICAO_ESTADUAL: 'InscriçãoEstadual'
};

// Configuração dos campos com metadados
const FIELD_CONFIG = {
  [FORM_FIELDS.NOME_ESTABELECIMENTO]: {
    label: 'Nome do Estabelecimento',
    icon: FaBuilding,
    placeholder: 'Digite o nome da empresa',
    maxLength: 100,
    minLength: 3,
    type: 'text'
  },
  [FORM_FIELDS.TELEFONE]: {
    label: 'Telefone',
    icon: FaPhone,
    placeholder: '(00) 00000-0000',
    maxLength: 15,
    minLength: 10,
    type: 'tel'
  },
  [FORM_FIELDS.CNPJ]: {
    label: 'CNPJ',
    icon: FaIdCard,
    placeholder: '00.000.000/0000-00',
    maxLength: 18,
    minLength: 14,
    type: 'text'
  },
  [FORM_FIELDS.ENDERECO]: {
    label: 'Endereço da Loja',
    icon: FaMapMarkerAlt,
    placeholder: 'Digite o endereço completo',
    maxLength: 200,
    minLength: 10,
    type: 'text'
  },
  [FORM_FIELDS.INSCRICAO_ESTADUAL]: {
    label: 'Inscrição Estadual',
    icon: FaFileAlt,
    placeholder: 'Digite a inscrição estadual',
    maxLength: 20,
    minLength: 5,
    type: 'text'
  }
};

const ConfiguraçõesGerais = () => {
  const { setErroApi, fazerLogin, setFazerLogin, adicionarAviso } = useContext(AppContext);

  // Estados consolidados
  const [state, setState] = useState({
    loading: true,
    saving: false,
    originalData: {},
    companyData: {
      [FORM_FIELDS.NOME_ESTABELECIMENTO]: "",
      [FORM_FIELDS.CNPJ]: "",
      [FORM_FIELDS.TELEFONE]: "",
      [FORM_FIELDS.ENDERECO]: "",
      [FORM_FIELDS.INSCRICAO_ESTADUAL]: ""
    }
  });

  // Utilitários de formatação memoizados
  const formatters = useMemo(() => ({
    phone: (value) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    },
    cnpj: (value) => {
      const digits = value.replace(/\D/g, '');
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    },
    numbersOnly: (value) => value.replace(/\D/g, '')
  }), []);

  // Validadores memoizados
  const validators = useMemo(() => ({
    [FORM_FIELDS.NOME_ESTABELECIMENTO]: (value) => value.trim().length >= 3,
    [FORM_FIELDS.ENDERECO]: (value) => value.trim().length >= 10,
    [FORM_FIELDS.CNPJ]: (value) => formatters.numbersOnly(value).length === 14,
    [FORM_FIELDS.TELEFONE]: (value) => formatters.numbersOnly(value).length >= 10,
    [FORM_FIELDS.INSCRICAO_ESTADUAL]: (value) => formatters.numbersOnly(value).length >= 5
  }), [formatters]);

  // Verificar se dados foram alterados
  const hasChanges = useMemo(() => {
    return Object.keys(state.companyData).some(
      key => state.companyData[key] !== state.originalData[key]
    );
  }, [state.companyData, state.originalData]);

  // Verificar se formulário é válido
  const isFormValid = useMemo(() => {
    return Object.entries(state.companyData).every(([field, value]) => 
      validators[field] ? validators[field](value) : true
    );
  }, [state.companyData, validators]);

  // Atualizar estado
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Atualizar campo específico
  const updateField = useCallback((field, value) => {
    setState(prev => ({
      ...prev,
      companyData: {
        ...prev.companyData,
        [field]: value
      }
    }));
  }, []);

  // Carregar dados da empresa
  const loadCompanyData = useCallback(async () => {
    updateState({ loading: true });
    
    try {
      const response = await userFetch.dadosEmpresa();
      const loadedData = {
        [FORM_FIELDS.NOME_ESTABELECIMENTO]: response.nomeEstabelecimento || "",
        [FORM_FIELDS.CNPJ]: response.cnpj || "",
        [FORM_FIELDS.TELEFONE]: response.telefone || "",
        [FORM_FIELDS.ENDERECO]: response.endereco || "",
        [FORM_FIELDS.INSCRICAO_ESTADUAL]: response.InscriçãoEstadual || ""
      };
      
      updateState({
        companyData: loadedData,
        originalData: { ...loadedData },
        loading: false
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setErroApi(true);
      adicionarAviso("erro", "Erro ao carregar dados da empresa");
      updateState({ loading: false });
    }
  }, [updateState, setErroApi, adicionarAviso]);

  // Carregar dados na inicialização
  useEffect(() => {
    loadCompanyData();
  }, [loadCompanyData]);

  // Handlers para cada campo
  const fieldHandlers = useMemo(() => ({
    [FORM_FIELDS.NOME_ESTABELECIMENTO]: (e) => updateField(FORM_FIELDS.NOME_ESTABELECIMENTO, e.target.value),
    [FORM_FIELDS.ENDERECO]: (e) => updateField(FORM_FIELDS.ENDERECO, e.target.value),
    [FORM_FIELDS.TELEFONE]: (e) => updateField(FORM_FIELDS.TELEFONE, formatters.numbersOnly(e.target.value)),
    [FORM_FIELDS.CNPJ]: (e) => updateField(FORM_FIELDS.CNPJ, formatters.numbersOnly(e.target.value)),
    [FORM_FIELDS.INSCRICAO_ESTADUAL]: (e) => updateField(FORM_FIELDS.INSCRICAO_ESTADUAL, formatters.numbersOnly(e.target.value))
  }), [updateField, formatters]);

  // Handler para mudança de credenciais
  const handleCredentialsChange = useCallback(() => {
    setFazerLogin(true);
  }, [setFazerLogin]);

  // Handler para upload de logo
  const handleLogoUpload = useCallback(() => {
    adicionarAviso("info", "Funcionalidade de upload em desenvolvimento 📷");
  }, [adicionarAviso]);

  // Submit do formulário
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      adicionarAviso("erro", "Por favor, verifique se todos os campos estão corretos");
      return;
    }

    if (!hasChanges) {
      adicionarAviso("info", "Nenhuma alteração foi detectada");
      return;
    }

    updateState({ saving: true });

    try {
      await userFetch.editarDadosEmpresa(state.companyData);
      updateState({ originalData: { ...state.companyData }, saving: false });
      adicionarAviso("sucesso", "Dados da empresa atualizados com sucesso! ✅");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setErroApi(true);
      adicionarAviso("erro", "Erro ao salvar alterações");
      updateState({ saving: false });
    }
  }, [isFormValid, hasChanges, state.companyData, updateState, adicionarAviso, setErroApi]);

  // Componente de campo de input
  const InputField = useCallback(({ fieldKey, value }) => {
    const config = FIELD_CONFIG[fieldKey];
    const Icon = config.icon;
    const isValid = validators[fieldKey] ? validators[fieldKey](value) : true;
    
    // Aplicar formatação para exibição
    let displayValue = value;
    if (fieldKey === FORM_FIELDS.TELEFONE) {
      displayValue = formatters.phone(value);
    } else if (fieldKey === FORM_FIELDS.CNPJ) {
      displayValue = formatters.cnpj(value);
    }

    return (
      <div className="input-group">
        <label className="input-label">
          <Icon />
          {config.label}
          <span className="required-indicator">*</span>
        </label>
        <div className="input-wrapper">
          <input
            type={config.type}
            className={`form-input ${!isValid ? 'invalid' : ''}`}
            value={displayValue}
            onChange={fieldHandlers[fieldKey]}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            required
          />
          <div className="input-icon">
            {isValid ? <FaCheck color="#10b981" /> : <FaExclamationTriangle color="#ef4444" />}
          </div>
        </div>
        {!isValid && (
          <div className="validation-message error">
            <FaExclamationTriangle />
            Campo obrigatório com formato inválido
          </div>
        )}
      </div>
    );
  }, [validators, formatters, fieldHandlers]);

  if (state.loading) {
    return (
      <div className="configuracoes-container">
        <div className="loading-state">
          <div className="loading-spinner" />
          Carregando configurações...
        </div>
      </div>
    );
  }

  return (
    <div className="configuracoes-container">
      {fazerLogin && <CardLogin fechar={setFazerLogin} />}
      
      <div className="page-header">
        <button 
          className="credentials-button"
          onClick={handleCredentialsChange}
          title="Alterar credenciais de acesso"
        >
          <FaKey />
          Alterar Credenciais
        </button>
      </div>

      <div className="main-content">
        {/* Seção do Logo */}
        <div className="logo-section">
          <h3 className="logo-title">Logo da Empresa</h3>
          <div 
            className="logo-upload-area"
            onClick={handleLogoUpload}
            title="Clique para enviar o logo da empresa"
          >
            <MdAddPhotoAlternate className="upload-icon" />
            <div className="upload-text">
              Clique aqui para<br />
              adicionar o logo
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="form-section">
          <h3 className="form-title">
            <FaBuilding />
            Dados da Empresa
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {Object.keys(FIELD_CONFIG).map(fieldKey => (
                <InputField
                  key={fieldKey}
                  fieldKey={fieldKey}
                  value={state.companyData[fieldKey]}
                />
              ))}
            </div>

            <div className="submit-section">
              <button 
                type="submit" 
                className={`submit-button ${state.saving ? 'saving' : ''}`}
                disabled={!hasChanges || !isFormValid || state.saving}
              >
                {state.saving ? (
                  <>
                    <div className="loading-spinner" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Indicador de mudanças */}
      {hasChanges && (
        <div className="changes-indicator">
          ⚠️ Você tem alterações não salvas
        </div>
      )}
    </div>
  );
};

export default ConfiguraçõesGerais;