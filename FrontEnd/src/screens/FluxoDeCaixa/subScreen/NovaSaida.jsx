import { useState } from "react";
import caixaFetch from "../../../api/caixaFetch"

import services from "../../../services/services"; // Certifique-se de que esta importação está correta
import "./FormMovimentacao.css"; // Usando o mesmo CSS

function NovaSaida({fechar}) {
  const [formData, setFormData] = useState({
    valor: "",
    descricao: "",
    categoria: "Aluguel", // Categoria padrão
    tipo: "saida", // Define o tipo da movimentação
    data: services.formatarData(new Date()), // Data atual formatada (ajuste conforme a necessidade do seu backend)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const novaMovimentacao = {
      ...formData,
      valor: parseFloat(formData.valor.replace(",", ".")), // Converte para número e armazena como negativo
      // Adicione aqui um ID ou outros campos que seu backend possa precisar
    };

    try {
      await caixaFetch.novaMovimentacao(novaMovimentacao);
      fechar(null)
    } catch (err) {
      console.error("Erro ao adicionar saída:", err);
      setError("Não foi possível adicionar a saída. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const categoriasSaida = [
    "Aluguel",
    "Salários",
    "Fornecedores",
    "Marketing",
    "Impostos",
    "Outras Despesas",
  ];

  return (
    <div id="FormMovimentacao">
      <div id="HeaderFormMovimentacao">
        <div>
          <h2>Adicionar Nova Saída</h2>
          <p>Registre um novo gasto no caixa.</p>
        </div>
      </div>

      <div id="formWrapper">
        <form onSubmit={handleSubmit} className="formMovimentacao">
          <div className="formGroup">
            <label htmlFor="valor">Valor (R$)</label>
            <input
              type="number"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="Ex: 500.00"
              required
              step="0.01"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="descricao">Descrição</label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Ex: Pagamento Fornecedor Y"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              {categoriasSaida.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="data">Data</label>
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="errorMessage">{error}</p>}

          <div className="formActions">
            <button
              type="button"
              className="btnSecondary"
              onClick={() => fechar(null)} // Volta para a página anterior
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btnPrimary" // Pode usar uma classe específica se houver um estilo vermelho
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Saída"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovaSaida;
