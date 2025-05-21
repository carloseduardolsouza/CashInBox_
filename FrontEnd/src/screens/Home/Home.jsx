import "./Home.css";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";

//Biblioteca de Gráficos
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

//Icones Usados
import { FaTools } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";
import { FaComputer } from "react-icons/fa6";
import { IoMdArrowDropup } from "react-icons/io";

function Home() {
  const [notificaçãp, setNotificação] = useState(false);
  const [receitas, setReceitas] = useState();

  const { isDark, setIsDark } = useContext(AppContext);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  //informações dos gráficos
  const data = [
    { name: "Jan", Despesas: 4000, Receitas: 2400 },
    { name: "Fev", Despesas: 3000, Receitas: 1398 },
    { name: "Mar", Despesas: 2000, Receitas: 9800 },
    { name: "Abr", Despesas: 2780, Receitas: 3908 },
    { name: "Mai", Despesas: 1890, Receitas: 4800 },
    { name: "Jun", Despesas: 2390, Receitas: 3800 },
    { name: "Jul", Despesas: 3490, Receitas: 4300 },
  ];

  return (
    <div id="Homescreen">
      <div className="NotificationHomeScreen">
        <button id="ButtonDarkMode" onClick={() => setIsDark(!isDark)}>
          {isDark ? "☀️" : "🌙"}
        </button>

        <button class="button">
          <svg viewBox="0 0 448 512" class="bell">
            <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
          </svg>
        </button>
      </div>

      <h1>{"CashInBox"}</h1>

      <header className="HeaderHomeDeashBoard">
        <LineChart
          width={550}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Receitas" stroke="#31c331" />
          <Line type="monotone" dataKey="Despesas" stroke="#de2727" />
        </LineChart>

        <div className="ButtonHeaderDeashBoard">
          <Link to={"/funcionarios"} className="bttButtonHeaderDeashBoard">
            <GiTakeMyMoney /> Funcionários
          </Link>
          <Link to={"/planosEBoletos"} className="bttButtonHeaderDeashBoard">
            <FaTools /> Planos e Boletos
          </Link>
          <Link to={"/fluxoDeCaixa"} className="bttButtonHeaderDeashBoard">
            <MdAttachMoney /> Fluxo de Caixa
          </Link>
          <Link to={"/pontoDeVenda"} className="bttButtonHeaderDeashBoard">
            <FaComputer /> PDV
          </Link>
        </div>

        <div className="LoyautCardMétricasBox">
          <article className="cardMétricasBox green">
            <h2>Receitas</h2>
            <h1>{"R$ 00,00"}</h1>
            <div className="linha" />
            <div className="displayFlex">
              <div>
                <p>Ultimo més</p>
                <strong>{"R$ 00,00"}</strong>
              </div>
              <div>
                <p>
                  <IoMdArrowDropup />
                </p>
                <strong>{"0%"}</strong>
              </div>
            </div>
          </article>

          <article className="cardMétricasBox red">
            <h2>Despesas</h2>
            <h1>{"R$ 00,00"}</h1>
            <div className="linha" />
            <div className="displayFlex">
              <div>
                <p>Ultimo més</p>
                <strong>{"R$ 00,00"}</strong>
              </div>
              <div>
                <p>
                  <IoMdArrowDropup />
                </p>
                <strong>{"0%"}</strong>
              </div>
            </div>
          </article>

          <article className="cardMétricasBox orange">
            <h2>Faturamento Mês</h2>
            <h1>{"R$ 00,00"}</h1>
            <div className="linha" />
            <div className="displayFlex">
              <div>
                <p>Ultimo més</p>
                <strong>{"R$ 00,00"}</strong>
              </div>
              <div>
                <p>
                  <IoMdArrowDropup />
                </p>
                <strong>{"0%"}</strong>
              </div>
            </div>
          </article>
        </div>
      </header>

      <main className="MainHomeDeashBoard">
        <article>
          <h1>Vendas este mês</h1>
          <h1 className="NotficationHome">{"0"}</h1>
        </article>

        <article>
          <h1>Contas a pagar</h1>
          <h1 className="NotficationHome">{"0"}</h1>
        </article>

        <article>
          <h1>Vendas Pendentes</h1>
          <h1 className="NotficationHome">{"0"}</h1>
        </article>
      </main>
    </div>
  );
}

export default Home;
