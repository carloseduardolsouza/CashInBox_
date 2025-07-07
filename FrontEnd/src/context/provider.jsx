import { useState, useEffect } from "react";
import whatsappFetch from "../api/whatsappFetch";
import userFetch from "../api/userFetch";
import AppContext from "./AppContext";
import PropTypes from "prop-types";

export function AppProvider({ children }) {
  const [dadosLoja, setDadosLoja] = useState({});
  const [isDark, setIsDark] = useState(false);

  const [erroApi, setErroApi] = useState(false);

  const [fazerLogin, setFazerLogin] = useState(false);
  const [ultimoLoginExpirado, setUltimoLoginExpirado] = useState(false);

  const [vencido, setVencido] = useState(false);

  const [Whastsapp, setWhastsapp] = useState(false);

  const [avisos, setAvisos] = useState([]);

  // Função para adicionar um aviso
  const adicionarAviso = (tipo, texto) => {
    const novoAviso = {
      id: Date.now(), // ID único
      tipo,
      texto,
    };
    setAvisos((prev) => [...prev, novoAviso]);

    // Remover automaticamente depois de 5 segundos (opcional)
    setTimeout(() => {
      setAvisos((prev) => prev.filter((a) => a.id !== novoAviso.id));
    }, 5000);
  };

  // Função de tratamento de erro
  const tratarErroApi = (response) => {
    console.log(response);
    if (response.message === "Último login expirado. Refaça a autenticação.") {
      setUltimoLoginExpirado(true);
      return;
    }

    if (response.message === "Erro ao ler credenciais.") {
      setFazerLogin(true);
      return;
    }

    if (
      response.message ===
      "Assinatura vencida. Por favor, renove sua assinatura."
    ) {
      setVencido(true);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await whatsappFetch.pegarQrCode().then((response) => {
        if (response.status_bot === "online") {
          setWhastsapp(true);
        } else {
          setWhastsapp(false);
        }
      });
    } catch (error) {
      console.error("Erro ao buscar status:", error);
    }
  };

  useEffect(() => {
    const fetchDadosEmpresa = async () => {
      try {
        const response = await userFetch.dadosEmpresa();
        setDadosLoja(response);
      } catch {
        setErroApi(true);
      }
    };

    fetchDadosEmpresa();

    const interval = setInterval(() => {
      fetchStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const valores = {
    adicionarAviso,
    avisos,

    tratarErroApi,

    erroApi,
    setErroApi,
    isDark,
    setIsDark,
    dadosLoja,
    setDadosLoja,
    Whastsapp,
    setWhastsapp,
    vencido,
    setVencido,
    fazerLogin,
    setFazerLogin,
    ultimoLoginExpirado
  };

  return <AppContext.Provider value={valores}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
