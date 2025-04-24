import "./App.css";
import "./menu.css";
import { useState } from "react";

//Telas
import Home from "./screens/Home/Home";
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
import PlanosEBoletos from "./screens/PlanosEBoletos/PlanosEBoletos"
import Relatorios from "./screens/Relatorios/Relatorios";
import NovoOrçamento from "./screens/NovoOrçamento/NovoOrçamento";
import CadastrarFuncionario from "./screens/CadastrarFuncionario/CadastrarFuncionario";

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

import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

function App() {
  //Status do menu
  const [home, setHome] = useState(true);
  const [vendas, setVendas] = useState(false);
  const [clientes, setClientes] = useState(false);
  const [produtos, setProdutos] = useState(false);
  const [estoque, setEstoque] = useState(false);
  const [contasPagar, setContasPagar] = useState(false);
  const [caixa, setCaixa] = useState(false);
  const [configs, setConfigs] = useState(false);
  const [relatorios, setRelatorios] = useState(false);

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
      <Router>
        <div className="MenuLateralBoxArea" style={{ width: windowWidth }}>
          <div className="MenuLateralBox Outline" onClick={VerificarStatusMenu}>
            <RiMenu2Fill className="iconsMenuLateral" />
          </div>
          <Link
            to="/"
            className="MenuLateralBox"
            onClick={() => {
              setVendas(false);
              setHome(true);
              setClientes(false);
              setProdutos(false);
              setEstoque(false);
              setContasPagar(false);
              setCaixa(false);
              setRelatorios(false);
              setConfigs(false);
            }}
          >
            {(home && <GoHomeFill className="iconsMenuLateral" />) || (
              <GoHome className="iconsMenuLateral" />
            )}
            <p style={style}>Home</p>
          </Link>
          <Link
            to="/vendas"
            className="MenuLateralBox"
            onClick={() => {
              setVendas(true);
              setClientes(false);
              setHome(false);
              setProdutos(false);
              setEstoque(false);
              setContasPagar(false);
              setCaixa(false);
              setRelatorios(false);
              setConfigs(false);
            }}
          >
            {(vendas && (
              <RiMoneyDollarCircleFill className="iconsMenuLateral" />
            )) || <RiMoneyDollarCircleLine className="iconsMenuLateral" />}
            <p style={style}>Vendas</p>
          </Link>
          <Link
            to="/clientes"
            className="MenuLateralBox"
            onClick={() => {
              setVendas(false);
              setClientes(true);
              setProdutos(false);
              setEstoque(false);
              setHome(false);
              setContasPagar(false);
              setCaixa(false);
              setRelatorios(false);
              setConfigs(false);
            }}
          >
            {(clientes && <FaUser className="iconsMenuLateral" />) || (
              <FaRegUser className="iconsMenuLateral" />
            )}
            <p style={style}>clientes</p>
          </Link>
          <Link
            to="/produtos"
            className="MenuLateralBox"
            onClick={() => {
              setVendas(false);
              setClientes(false);
              setProdutos(true);
              setEstoque(false);
              setHome(false);
              setContasPagar(false);
              setCaixa(false);
              setRelatorios(false);
              setConfigs(false);
            }}
          >
            {(produtos && <MdSell className="iconsMenuLateral" />) || (
              <MdOutlineSell className="iconsMenuLateral" />
            )}
            <p style={style}>produtos</p>
          </Link>
          <Link
            to="/estoque"
            className="MenuLateralBox"
            onClick={() => {
              setVendas(false);
              setClientes(false);
              setProdutos(false);
              setEstoque(true);
              setContasPagar(false);
              setHome(false);
              setCaixa(false);
              setRelatorios(false);
              setConfigs(false);
            }}
          >
            {(estoque && <BsBox2Fill className="iconsMenuLateral" />) || (
              <BsBox2 className="iconsMenuLateral" />
            )}
            <p style={style}>Estoque</p>
          </Link>
          <Link
            to="/contasPagar"
            className="MenuLateralBox"
            onClick={() => {
              setVendas(false);
              setClientes(false);
              setProdutos(false);
              setHome(false);
              setEstoque(false);
              setContasPagar(true);
              setCaixa(false);
              setRelatorios(false);
              setConfigs(false);
            }}
          >
            {(contasPagar && <FaMoneyBill1 className="iconsMenuLateral" />) || (
              <FaRegMoneyBillAlt className="iconsMenuLateral" />
            )}
            <p style={style}>Contas a pagar</p>
          </Link>
          <Link
            to="/fluxoDeCaixa"
            className="MenuLateralBox"
            onClick={() => {
              setVendas(false);
              setClientes(false);
              setProdutos(false);
              setEstoque(false);
              setContasPagar(false);
              setHome(false);
              setCaixa(true);
              setRelatorios(false);
              setConfigs(false);
            }}
          >
            {(caixa && <PiCashRegisterFill className="iconsMenuLateral" />) || (
              <PiCashRegisterLight className="iconsMenuLateral" />
            )}
            <p style={style}>Caixa</p>
          </Link>

          <Link
            to="/relatorios"
            className="MenuLateralBox"
            onClick={() => {
              setVendas(false);
              setClientes(false);
              setProdutos(false);
              setEstoque(false);
              setContasPagar(false);
              setHome(false);
              setCaixa(false);
              setRelatorios(true);
              setConfigs(false);
            }}
          >
            {(relatorios && (
              <MdInsertChart className="iconsMenuLateral" />
            )) || <MdInsertChartOutlined className="iconsMenuLateral" />}
            <p style={style}>Relatorios</p>
          </Link>

          <Link
            to="/configurações"
            className="MenuLateralBox Preferencias"
            onClick={() => {
              setVendas(false);
              setClientes(false);
              setProdutos(false);
              setEstoque(false);
              setHome(false);
              setContasPagar(false);
              setCaixa(false);
              setRelatorios(false);
              setConfigs(true);
            }}
          >
            {(configs && <BsGearFill className="iconsMenuLateral" />) || (
              <BsGear className="iconsMenuLateral" />
            )}
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

          <Route path="/cadastrarProduto" Component={CadastrarProduto} />
          <Route path="/cadastrarCliente" Component={CadastrarCliente} />
          <Route path="/novoOrçamento" Component={NovoOrçamento} />
          <Route path="/funcionarios" Component={Funcionarios} />
          <Route path="/planosEBoletos" Component={PlanosEBoletos} />
          <Route path="/cadastrarFuncionario" Component={CadastrarFuncionario} />
          
          <Route path="/configurações" Component={Configurações} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
