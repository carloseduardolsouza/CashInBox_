import "./Home.css";
import { useState, useEffect } from "react";

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
import { FaTruck } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";
import { FaComputer } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { IoMdArrowDropup } from "react-icons/io";

//componente que faz ligação com a Api
//import fetchapi from "../../api/fetchapi";

function Home() {
  const [notificaçãp, setNotificação] = useState(false);
  const [receitas, setReceitas] = useState();

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

  /*useEffect(() => {
    fetchapi.métricas().then((response) => setReceitas(response.receita))
  }, [])*/

  return (
    <div id="Homescreen">
      <div className="NotificationHomeScreen" onClick={() => ""}>
        <IoNotifications />
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
          <button onClick={() => (window.location.href = "/")}>
            <GiTakeMyMoney /> Funcionários
          </button>
          <button onClick={() => (window.location.href = "/")}>
            <FaTruck /> Fornecedores
          </button>
          <button onClick={() => (window.location.href = "/")}>
            <MdAttachMoney /> Fluxo de Caixa
          </button>
          <button onClick={() => (window.location.href = "/pontoDeVenda")}>
            <FaComputer /> PDV
          </button>
        </div>

        <div className="LoyautCardMétricasBox">
          <article className="cardMétricasBox green">
            <h2>Receitas</h2>
            <h1>{}</h1>
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
            <h2>Vendas Online</h2>
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
            <h2>Vendas Presencial</h2>
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
