import { useState , useEffect } from "react";
import fetchapi from "../api/fetchapi"
import AppContext from "./AppContext";
import PropTypes from "prop-types";

export function AppProvider({ children }) {
  const [dadosLoja , setDadosLoja] = useState({})
  const [isDark, setIsDark] = useState(false);
  const [erroApi, setErroApi] = useState(false);

  useEffect(() => {
    fetchapi.dadosEmpresa().then((response) => {
      setDadosLoja(response)
    }).catch(() => {
      setErroApi(true)
    })
  },[])

  const valores = {
    erroApi,
    setErroApi,
    isDark,
    setIsDark,
    dadosLoja,
    setDadosLoja
  };

  return <AppContext.Provider value={valores}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
