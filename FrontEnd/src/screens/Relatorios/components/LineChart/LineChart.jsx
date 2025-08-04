import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "./LineChart.css";

function LineChart({ title, data, dataKey, isMonetary = false }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="line-chart-container">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [
              isMonetary ? formatCurrency(value) : value.toLocaleString(), 
              title
            ]}
          />
          <Line type="monotone" dataKey={dataKey} stroke="#0295ff" strokeWidth={3} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;