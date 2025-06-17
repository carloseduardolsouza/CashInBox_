import "./Home.css";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";

import services from "../../services/services";
import fetchapi from "../../api/fetchapi";

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
import { FaBoxOpen } from "react-icons/fa";

function Home() {
  const [relatoriosBasicos, setRelatoriosBasicos] = useState({});
  const { isDark, setIsDark, dadosLoja, setErroApi , setVencido , setFazerLogin } = useContext(AppContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  useEffect(() => {
    fetchapi
      .buscarRelatoriosBasicos()
      .then((response) => {
        if (
        response.message ===
        "Assinatura vencida. Por favor, renove sua assinatura."
      ) {
        setVencido(true);
        return;
      }

      if (response.message === "Erro ao ler credenciais.") {
        setFazerLogin(true)
        return
      }

      if (Array.isArray(response)) {
        setRelatoriosBasicos(response);
      } else {
        setRelatoriosBasicos([]); // Evita o erro
        console.warn("Resposta inesperada:", response);
      }

        setRelatoriosBasicos(response);

        const newData = response.faturamento.map((dados) => ({
          name: dados.mes,
          Despesas: 0,
          Receitas: dados.faturamento,
        }));

        setData(newData);
      })
      .catch(() => {
        const newData = [];
        for (let i = 0; i < 7; i++) {
          newData.push({
          name: "Mês",
          Despesas: 10,
          Receitas: 40,
        })
        }
        setData(newData)
        setErroApi(true);
      });
  }, []);

  // Calcular o faturamento atual, anterior e a variação
  const faturamentoArray = relatoriosBasicos.faturamento || [];
  const len = faturamentoArray.length;

  const faturamentoAtual = len >= 1 ? faturamentoArray[len - 1].faturamento : 0;
  const faturamentoAnterior =
    len >= 2 ? faturamentoArray[len - 2].faturamento : 0;

  const variacao = len >= 1 ? faturamentoArray[len - 1].variacao : 0;

  return (
    <div id="Homescreen">
      <div className="NotificationHomeScreen">
        <button id="ButtonDarkMode" onClick={() => setIsDark(!isDark)}>
          {isDark ? "☀️" : "🌙"}
        </button>

        <button className="button">
          <svg viewBox="0 0 448 512" className="bell">
            <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
          </svg>
        </button>
      </div>

      <h1>{dadosLoja.nomeEstabelecimento || "CashInBox..."}</h1>

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
                <p>Último mês</p>
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
                <p>Último mês</p>
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
            <h1>{services.formatarCurrency(faturamentoAtual || 0)}</h1>
            <div className="linha" />
            <div className="displayFlex">
              <div>
                <p>Último mês</p>
                <strong>
                  {services.formatarCurrency(faturamentoAnterior || 0)}
                </strong>
              </div>
              <div>
                <p>
                  <IoMdArrowDropup />
                </p>
                <strong>{variacao}%</strong>
              </div>
            </div>
          </article>
        </div>
      </header>
    </div>
  );
}

export default Home;
