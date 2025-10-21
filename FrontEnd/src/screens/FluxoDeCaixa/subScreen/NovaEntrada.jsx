import { useState } from "react";
import services from "../../../services/services"; // Certifique-se de que esta importação está correta
import "./FormMovimentacao.css"; // Vamos criar um CSS comum para os formulários
import caixaFetch from "../../../api/caixaFetch";

function NovaEntrada({ fechar }) {
  const [formData, setFormData] = useState({
    valor: "",
    descricao: "",
    categoria: "Venda", // Categoria padrão
    tipo: "entrada",
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

  const categoriasEntrada = [
    "Venda",
    "Serviço",
    "Investimento",
    "Outras Receitas",
  ];

  const lanssarEntrada = async (e) => {
    e.preventDefault();
    await caixaFetch.novaMovimentacao(formData).then(() => {
      fechar();
    });
  };

  return (
    <div className="blurModal">
      <div id="FormMovimentacao">
        <div id="HeaderFormMovimentacao">
          <div>
            <h2>Adicionar Nova Entrada</h2>
            <p>Registre uma nova receita no caixa.</p>
          </div>
        </div>

        <div id="formWrapper">
          <form
            className="formMovimentacao"
            onSubmit={(e) => lanssarEntrada(e)}
          >
            <div className="formGroup">
              <label htmlFor="valor">Valor (R$)</label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                placeholder="Ex: 1500.50"
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
                placeholder="Ex: Pagamento Cliente X"
                required
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
                {categoriasEntrada.map((cat) => (
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
                className="btnPrimary btnEntrada"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Entrada"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovaEntrada;
