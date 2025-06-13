import { useState, useEffect } from "react";
import fetchapi from "../api/fetchapi";
import AppContext from "./AppContext";
import PropTypes from "prop-types";

export function AppProvider({ children }) {
  const [dadosLoja, setDadosLoja] = useState({});
  const [isDark, setIsDark] = useState(false);

  const [erroApi, setErroApi] = useState(false);

  const [fazerLogin , setFazerLogin] = useState(false)

  const [vencido , setVencido] = useState(false)

  const [Whastsapp, setWhastsapp] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetchapi.pegarQrCode().then((response) => {
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
        const response = await fetchapi.dadosEmpresa();
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
    setFazerLogin
  };

  return <AppContext.Provider value={valores}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
