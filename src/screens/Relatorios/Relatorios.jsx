import "./Relatorios.css";
import GoalProgressBar from "./components/GoalProgressBar;"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Relatorios() {
  const despesas = [
    { name: "Frete", value: 500 },
    { name: "Aluguel", value: 1200 },
    { name: "Agua/Luz", value: 350 },
    { name: "Funcionarios", value: 5000 },
    { name: "Prolabore", value: 2000 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const faturamentoMes = [
    { name: "Janeiro", vendas: 400 },
    { name: "Fevereiro", vendas: 300 },
    { name: "Março", vendas: 200 },
    { name: "Abril", vendas: 278 },
    { name: "Maio", vendas: 189 },
  ];

  return (
    <div id="Relatorios">
      <h2>Relatórios</h2>
      <div id="primeiraDivRelatorios">
        <div id="divOlaEmpresa">
          <div id="tituloH3Relatorios">
            <h3>👋 Olá {"Lider Móveis"}</h3>
          </div>
          <div id="divDeMetasRelatorios">
            <div className="metasRelatorios">
              <strong>Meta 1</strong>
              <GoalProgressBar current={100} goal={250} />
            </div>
            <div className="metasRelatorios">
              <strong>Meta 2</strong>
              <GoalProgressBar current={50} goal={240} />
            </div>
          </div>
          <div
            id="graficoDeDespesasPizza"
            style={{ display: "flex", alignItems: "center" }}
          >
            <ResponsiveContainer width={500} height={300}>
              <PieChart>
                <Pie
                  data={despesas}
                  cx={150}
                  cy={150}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {despesas.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="divVendedorComição">
            <div className="imageVendedorComição" />
            <div>
              <p>{"Carlos Souza"}</p>
              <strong>R$ 20.000,00</strong>
            </div>
          </div>
          <div className="divVendedorComição">
            <div className="imageVendedorComição" />
            <div>
              <p>{"Carlos Souza"}</p>
              <strong>R$ 20.000,00</strong>
            </div>
          </div>
          <div className="divVendedorComição">
            <div className="imageVendedorComição" />
            <div>
              <p>{"Carlos Souza"}</p>
              <strong>R$ 20.000,00</strong>
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={faturamentoMes}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
