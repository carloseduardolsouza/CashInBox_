import { useState } from "react";
import AppContext from "./AppContext";
import PropTypes from "prop-types";

export function AppProvider({ children }) {
  const [erroApi, setErroApi] = useState(false);

  const valores = {
    erroApi,
    setErroApi,
  };

  return <AppContext.Provider value={valores}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
