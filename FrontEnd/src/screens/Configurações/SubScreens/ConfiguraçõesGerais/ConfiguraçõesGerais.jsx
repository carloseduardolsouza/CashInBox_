import "./ConfiguraçõesGerais.css";
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import AppContext from "../../../../context/AppContext";

import CardLogin from "../../../../components/CardLogin/CardLogin";

// Ícones
import { MdAddPhotoAlternate } from "react-icons/md";
import userFetch from "../../../../api/userFetch";

// Configuração dos campos do formulário
const CAMPOS_FORM = {
  NOME_ESTABELECIMENTO: 'nomeEstabelecimento',
  CNPJ: 'cnpj',
  TELEFONE: 'telefone',
  ENDERECO: 'endereco',
  INSCRICAO_ESTADUAL: 'InscriçãoEstadual'
};

// Validações básicas
const validarCampo = (campo, valor) => {
  switch (campo) {
    case CAMPOS_FORM.NOME_ESTABELECIMENTO:
    case CAMPOS_FORM.ENDERECO:
      return valor.trim().length >= 3;
    case CAMPOS_FORM.CNPJ:
      return valor.replace(/\D/g, '').length === 14;
    case CAMPOS_FORM.TELEFONE:
      return valor.replace(/\D/g, '').length >= 10;
    case CAMPOS_FORM.INSCRICAO_ESTADUAL:
      return valor.trim().length > 0;
    default:
      return true;
  }
};

function ConfiguraçõesGerais() {
  // Estados do formulário
  const [dadosEmpresa, setDadosEmpresa] = useState({
    [CAMPOS_FORM.NOME_ESTABELECIMENTO]: "",
    [CAMPOS_FORM.CNPJ]: "",
    [CAMPOS_FORM.TELEFONE]: "",
    [CAMPOS_FORM.ENDERECO]: "",
    [CAMPOS_FORM.INSCRICAO_ESTADUAL]: ""
  });

  // Estados de controle
  const [dadosOriginais, setDadosOriginais] = useState({});
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const { setErroApi, fazerLogin, setFazerLogin, adicionarAviso } = useContext(AppContext);

  // Verificar se houve alterações nos dados
  const dadosForamAlterados = useMemo(() => {
    return Object.keys(dadosEmpresa).some(key => 
      dadosEmpresa[key] !== dadosOriginais[key]
    );
  }, [dadosEmpresa, dadosOriginais]);

  // Verificar se todos os campos são válidos
  const formularioValido = useMemo(() => {
    return Object.entries(dadosEmpresa).every(([campo, valor]) => 
      validarCampo(campo, valor)
    );
  }, [dadosEmpresa]);

  // Carregar dados da empresa
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const response = await userFetch.dadosEmpresa();
        const dadosCarregados = {
          [CAMPOS_FORM.NOME_ESTABELECIMENTO]: response.nomeEstabelecimento || "",
          [CAMPOS_FORM.CNPJ]: response.cnpj || "",
          [CAMPOS_FORM.TELEFONE]: response.telefone || "",
          [CAMPOS_FORM.ENDERECO]: response.endereco || "",
          [CAMPOS_FORM.INSCRICAO_ESTADUAL]: response.InscriçãoEstadual || ""
        };
        
        setDadosEmpresa(dadosCarregados);
        setDadosOriginais(dadosCarregados);
      } catch (error) {
        console.error("Erro ao carregar dados da empresa:", error);
        setErroApi(true);
        adicionarAviso("erro", "Erro ao carregar dados da empresa");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [setErroApi, adicionarAviso]);

  // Handler genérico para alteração de campos
  const handleCampoChange = useCallback((campo, valor) => {
    setDadosEmpresa(prev => ({
      ...prev,
      [campo]: valor
    }));
  }, []);

  // Handlers específicos para cada campo
  const handleNomeChange = useCallback((e) => {
    handleCampoChange(CAMPOS_FORM.NOME_ESTABELECIMENTO, e.target.value);
  }, [handleCampoChange]);

  const handleTelefoneChange = useCallback((e) => {
    // Permitir apenas números
    const valor = e.target.value.replace(/\D/g, '');
    handleCampoChange(CAMPOS_FORM.TELEFONE, valor);
  }, [handleCampoChange]);

  const handleCnpjChange = useCallback((e) => {
    // Permitir apenas números
    const valor = e.target.value.replace(/\D/g, '');
    handleCampoChange(CAMPOS_FORM.CNPJ, valor);
  }, [handleCampoChange]);

  const handleEnderecoChange = useCallback((e) => {
    handleCampoChange(CAMPOS_FORM.ENDERECO, e.target.value);
  }, [handleCampoChange]);

  const handleInscricaoChange = useCallback((e) => {
    // Permitir apenas números
    const valor = e.target.value.replace(/\D/g, '');
    handleCampoChange(CAMPOS_FORM.INSCRICAO_ESTADUAL, valor);
  }, [handleCampoChange]);

  // Handler para abrir modal de login
  const handleMudarCredenciais = useCallback(() => {
    setFazerLogin(true);
  }, [setFazerLogin]);

  // Handler para upload de logo (placeholder)
  const handleLogoUpload = useCallback(() => {
    // Implementar funcionalidade de upload futuramente
    adicionarAviso("aviso", "Funcionalidade de upload em desenvolvimento");
  }, [adicionarAviso]);

  // Submit do formulário
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formularioValido) {
      adicionarAviso("erro", "Por favor, verifique se todos os campos estão preenchidos corretamente");
      return;
    }

    if (!dadosForamAlterados) {
      adicionarAviso("aviso", "Nenhuma alteração foi feita");
      return;
    }

    setSalvando(true);
    try {
      await userFetch.editarDadosEmpresa(dadosEmpresa);
      setDadosOriginais(dadosEmpresa);
      adicionarAviso("sucesso", "Dados da empresa editados com sucesso!");
    } catch (error) {
      console.error("Erro ao editar dados da empresa:", error);
      setErroApi(true);
      adicionarAviso("erro", "Erro ao salvar alterações");
    } finally {
      setSalvando(false);
    }
  }, [dadosEmpresa, formularioValido, dadosForamAlterados, adicionarAviso, setErroApi]);

  // Componente do campo de input memoizado
  const InputField = useMemo(() => ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    placeholder,
    maxLength,
    required = true 
  }) => (
    <label className="input-field">
      <p>{label}:</p>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className={!validarCampo(label, value) ? "invalid" : ""}
      />
    </label>
  ), []);

  // Formatação de valores para exibição
  const formatarTelefone = useCallback((valor) => {
    const numero = valor.replace(/\D/g, '');
    if (numero.length <= 10) {
      return numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }, []);

  const formatarCNPJ = useCallback((valor) => {
    const numero = valor.replace(/\D/g, '');
    return numero.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }, []);

  if (loading) {
    return (
      <div id="ConfiguraçõesGerais">
        <div className="loading-state">
          Carregando configurações...
        </div>
      </div>
    );
  }

  return (
    <div id="ConfiguraçõesGerais">
      {fazerLogin && <CardLogin fechar={setFazerLogin} />}
      
      <button 
        id="MudarCredenciais" 
        onClick={handleMudarCredenciais}
        title="Alterar usuário e senha"
      >
        Mudar Credenciais
      </button>
      
      <main id="mainConfiguraçõesGerais">
        <div 
          id="LogoDaEmpresaConfiguraçõesGerais"
          onClick={handleLogoUpload}
          title="Clique para adicionar logo da empresa"
        >
          <MdAddPhotoAlternate id="MdAddPhotoAlternate" />
        </div>

        <div>
          <form
            id="formConfiguraçõesGerais"
            onSubmit={handleSubmit}
          >
            <InputField
              label="Nome do Estabelecimento"
              value={dadosEmpresa[CAMPOS_FORM.NOME_ESTABELECIMENTO]}
              onChange={handleNomeChange}
              placeholder="Digite o nome da empresa"
              maxLength={100}
            />

            <InputField
              label="Telefone"
              type="tel"
              value={formatarTelefone(dadosEmpresa[CAMPOS_FORM.TELEFONE])}
              onChange={handleTelefoneChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />

            <InputField
              label="CNPJ"
              value={formatarCNPJ(dadosEmpresa[CAMPOS_FORM.CNPJ])}
              onChange={handleCnpjChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />

            <InputField
              label="Endereço da loja"
              value={dadosEmpresa[CAMPOS_FORM.ENDERECO]}
              onChange={handleEnderecoChange}
              placeholder="Digite o endereço completo"
              maxLength={200}
            />

            <InputField
              label="Inscrição estadual"
              value={dadosEmpresa[CAMPOS_FORM.INSCRICAO_ESTADUAL]}
              onChange={handleInscricaoChange}
              placeholder="Digite a inscrição estadual"
              maxLength={20}
            />

            <button 
              type="submit" 
              disabled={!dadosForamAlterados || !formularioValido || salvando}
              className={salvando ? "saving" : ""}
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ConfiguraçõesGerais;