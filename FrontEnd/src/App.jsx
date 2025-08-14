import "./App.css";
import "./menu.css";
import { useState, useContext } from "react";
import AppContext from "./context/AppContext";

//Componentes
import Aviso from "./components/Aviso/Aviso";
import ApiDesconectada from "./components/ApiDesconectada/ApiDesconectada";
import AssinaturaVencida from "./components/AssinaturaVencida/AssinaturaVencida";
import CardLogin from "./components/CardLogin/CardLogin";
import UltimoLoginExpirado from "./components/UltimoLoginExpirado/UltimoLoginExpirado";

//Telas
import Home from "./screens/Home/Home";
import Error from "./screens/Error/Error";
import Vendas from "./screens/Vendas/vendas";
import Clientes from "./screens/Clientes/clientes";
import CadastrarCliente from "./screens/CadastrarCliente/CadastrarCliente";
import PontoDeVenda from "./screens/PontoDeVenda/PontoDeVenda";
import Produtos from "./screens/Produtos/Produtos";
import CadastrarProduto from "./screens/CadastrarProduto/CadastrarProduto";
import Estoque from "./screens/Estoque/Estoque";
import Configurações from "./screens/Configurações/Configurações";
import FluxoDeCaixa from "./screens/FluxoDeCaixa/FluxoDeCaixa";
import Funcionarios from "./screens/Funcionarios/Funcionarios";
import PlanosEBoletos from "./screens/PlanosEBoletos/PlanosEBoletos";
import Relatorios from "./screens/Relatorios/Relatorios";
import DetalhesDoCliente from "./screens/DetalhesDoCliente/DetalhesDoCliente";
import DetalhesDaVenda from "./screens/DetalhesDaVenda/DetalhesDaVenda";
import DetalhesDoFuncionario from "./screens/DetahesDoFuncionario/DetahesDoFuncionario";
import CadastrarFuncionario from "./screens/CadastrarFuncionario/CadastrarFuncionario";
import DetalhesDoProduto from "./screens/DetalhesDoProduto/DetalhesDoProduto";
import ContasAPagar from "./screens/ContasAPagar/ContasAPagar";
import Arquivos from "./screens/Arquivos/Arquivos"

//Home
import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";

//configurações
import { BsGear } from "react-icons/bs";
import { BsGearFill } from "react-icons/bs";

//menu
import { RiMenu2Fill } from "react-icons/ri";

//vendas
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

//clientes
import { FaUser } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";

//produtos
import { MdSell } from "react-icons/md";
import { MdOutlineSell } from "react-icons/md";

//estoque
import { BsBox2Fill } from "react-icons/bs";
import { BsBox2 } from "react-icons/bs";

//contas a pagar
import { FaMoneyBill1 } from "react-icons/fa6";
import { FaRegMoneyBillAlt } from "react-icons/fa";

//Caixa
import { PiCashRegisterFill } from "react-icons/pi";
import { PiCashRegisterLight } from "react-icons/pi";

//Relatorios
import { MdInsertChartOutlined } from "react-icons/md";
import { MdInsertChart } from "react-icons/md";

//arquivos
import { GoFileDirectory } from "react-icons/go";
import { GoFileDirectoryFill } from "react-icons/go";

import { HashRouter as Router, Link, Route, Routes } from "react-router-dom";

function App() {
  const { erroApi, vencido , fazerLogin , ultimoLoginExpirado} = useContext(AppContext);
  //Status do menu
  const [statusMenu, setStatusMenu] = useState("home");

  //Define o tamanho e se o texto ira aparecer
  const [windowWidth, setWindowWidth] = useState("45px");
  const [windowDisplay, setWindowDisplay] = useState("none");

  const style = {
    display: windowDisplay,
  };

  //controla de forma geral como o menu deve se comportar
  const menuOpen = (params) => {
    if (params == false) {
      setWindowDisplay("none");
      setWindowWidth("45px");
    }

    if (params == true) {
      setWindowWidth("160px");

      setTimeout(() => {
        setWindowDisplay("block");
      }, 190);
    }
  };

  //verifica se o menu esta aberto ou fechado
  const VerificarStatusMenu = () => {
    if (windowWidth == "45px") {
      menuOpen(true);
    } else menuOpen(false);
  };

  return (
    <div className="App">
      {erroApi && <ApiDesconectada />}
      {vencido && <AssinaturaVencida />}
      {fazerLogin && <CardLogin/>}
      {ultimoLoginExpirado  && <UltimoLoginExpirado/>}
      {<Aviso/>}
      <Router>
        <div className="MenuLateralBoxArea" style={{ width: windowWidth }}>
          <div className="MenuLateralBox Outline" onClick={VerificarStatusMenu}>
            <RiMenu2Fill className="iconsMenuLateral" />
          </div>
          <Link
            to="/"
            className="MenuLateralBox"
            onClick={() => setStatusMenu("home")}
          >
            {(statusMenu === "home" && (
              <GoHomeFill className="iconsMenuLateral" />
            )) || <GoHome className="iconsMenuLateral" />}
            <p style={style}>Home</p>
          </Link>
          <Link
            to="/vendas"
            className="MenuLateralBox"
            onClick={() => setStatusMenu("vendas")}
          >
            {(statusMenu === "vendas" && (
              <RiMoneyDollarCircleFill className="iconsMenuLateral" />
            )) || <RiMoneyDollarCircleLine className="iconsMenuLateral" />}
            <p style={style}>Vendas</p>
          </Link>
          <Link
            to="/clientes"
            className="MenuLateralBox"
            onClick={() => setStatusMenu("clientes")}
          >
            {(statusMenu === "clientes" && (
              <FaUser className="iconsMenuLateral" />
            )) || <FaRegUser className="iconsMenuLateral" />}
            <p style={style}>clientes</p>
          </Link>
          <Link
            to="/produtos"
            className="MenuLateralBox"
            onClick={() => setStatusMenu("produtos")}
          >
            {(statusMenu === "produtos" && (
              <MdSell className="iconsMenuLateral" />
            )) || <MdOutlineSell className="iconsMenuLateral" />}
            <p style={style}>produtos</p>
          </Link>
          <Link
            to="/estoque"
            className="MenuLateralBox"
            onClick={() => setStatusMenu("estoque")}
          >
            {(statusMenu === "estoque" && (
              <BsBox2Fill className="iconsMenuLateral" />
            )) || <BsBox2 className="iconsMenuLateral" />}
            <p style={style}>Estoque</p>
          </Link>
          <Link
            to="/contasPagar"
            className="MenuLateralBox"
            onClick={() => setStatusMenu("contasPagar")}
          >
            {(statusMenu === "contasPagar" && (
              <FaMoneyBill1 className="iconsMenuLateral" />
            )) || <FaRegMoneyBillAlt className="iconsMenuLateral" />}
            <p style={style}>Contas a pagar</p>
          </Link>
          <Link
            to="/fluxoDeCaixa"
            className="MenuLateralBox"
            onClick={() => setStatusMenu("fluxoDeCaixa")}
          >
            {(statusMenu === "fluxoDeCaixa" && (
              <PiCashRegisterFill className="iconsMenuLateral" />
            )) || <PiCashRegisterLight className="iconsMenuLateral" />}
            <p style={style}>Caixa</p>
          </Link>

          <Link
            to="/relatorios"
            className="MenuLateralBox"
            onClick={() => setStatusMenu("relatorios")}
          >
            {(statusMenu === "relatorios" && (
              <MdInsertChart className="iconsMenuLateral" />
            )) || <MdInsertChartOutlined className="iconsMenuLateral" />}
            <p style={style}>Relatorios</p>
          </Link>

          <Link
            to="/arquivos"
            className="MenuLateralBox"
            onClick={() => setStatusMenu("arquivos")}
          >
            {(statusMenu === "arquivos" && (
              <GoFileDirectoryFill className="iconsMenuLateral" />
            )) || <GoFileDirectory className="iconsMenuLateral" />}
            <p style={style}>Arquivos</p>
          </Link>

          <Link
            to="/configurações"
            className="MenuLateralBox Preferencias"
            onClick={() => setStatusMenu("configurações")}
          >
            {(statusMenu === "configurações" && (
              <BsGearFill className="iconsMenuLateral" />
            )) || <BsGear className="iconsMenuLateral" />}
            <p style={style}>Preferencias</p>
          </Link>
          <div className="MenuLateralBox"></div>
        </div>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/vendas" Component={Vendas} />
          <Route path="/clientes" Component={Clientes} />
          <Route path="/pontoDeVenda" Component={PontoDeVenda} />
          <Route path="/produtos" Component={Produtos} />
          <Route path="/estoque" Component={Estoque} />
          <Route path="/fluxoDeCaixa" Component={FluxoDeCaixa} />
          <Route path="/relatorios" Component={Relatorios} />
          <Route path="/arquivos" Component={Arquivos} />

          <Route path="/cadastrarProduto" Component={CadastrarProduto} />
          <Route path="/cadastrarCliente" Component={CadastrarCliente} />
          <Route path="/funcionarios" Component={Funcionarios} />
          <Route path="/planosEBoletos" Component={PlanosEBoletos} />
          <Route
            path="/cadastrarFuncionario"
            Component={CadastrarFuncionario}
          />
          <Route path="/detalhesDoCliente/:id" Component={DetalhesDoCliente} />
          <Route path="/detalhesDaVenda/:id" Component={DetalhesDaVenda} />
          <Route
            path="/detalhesDoFuncionario/:id"
            Component={DetalhesDoFuncionario}
          />
          <Route path="/detalhesDoProduto/:id" Component={DetalhesDoProduto} />
          <Route path="/contasPagar" Component={ContasAPagar} />

          <Route path="*" Component={Error} />
          <Route path="/configurações" Component={Configurações} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
