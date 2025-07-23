import "./VendasECaixa.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../../../context/AppContext";
import userFetch from "../../../../api/userFetch";

function VendasECaixa() {
  const { adicionarAviso } = useContext(AppContext);
  const [formasSelecionadas, setFormasSelecionadas] = useState([]);
  const [formData, setFormData] = useState({
    abertura_senha: false,
    abertura_caixa: false,
    fechamento_caixa: false,
    formas_pagamentos: [],
    limite_desconto: "",
  });

  const opcoesPagamento = [
    "Dinheiro",
    "Cartão de débito",
    "Cartão de crédito",
    "Crediário Próprio",
    "Pix",
  ];

  const adicionarForma = (e) => {
    const valor = e.target.value;
    if (valor && !formasSelecionadas.includes(valor)) {
      const novasFormas = [...formasSelecionadas, valor];
      setFormasSelecionadas(novasFormas);
      setFormData((prev) => ({ ...prev, formas_pagamentos: novasFormas }));
    }
    e.target.value = "";
  };

  const removerForma = (forma) => {
    const novasFormas = formasSelecionadas.filter((f) => f !== forma);
    setFormasSelecionadas(novasFormas);
    setFormData((prev) => ({ ...prev, formas_pagamentos: novasFormas }));
  };

  const buscarDados = async () => {
    const dados = await userFetch.verConfigVendas();

    // Corrige valores nulos ou undefined
    const valores = {
      abertura_senha: Boolean(dados.abertura_senha),
      abertura_caixa: Boolean(dados.abertura_caixa),
      fechamento_caixa: Boolean(dados.fechamento_caixa),
      formas_pagamentos: dados.formas_pagamentos || [],
      limite_desconto: dados.limite_desconto || "",
    };

    setFormData(valores);
    setFormasSelecionadas(valores.formas_pagamentos);
  };

  const editarDados = async () => {
    // Garante que limite_desconto é número antes de enviar
    const payload = {
      ...formData,
      limite_desconto: Number(formData.limite_desconto),
    };

    await userFetch.editarConfigVendas(payload).then(() => {
      adicionarAviso("sucesso", "SUCESSO - Dados editar com sucesso !");
    });
    buscarDados();
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    buscarDados();
  }, []);

  return (
    <div id="VendasECaixa">
      <div className="section">
        <h3>📦 Abertura e Caixa</h3>

        <label className="toggle">
          <span>Abertura com senha?</span>
          <input
            type="checkbox"
            name="abertura_senha"
            checked={formData.abertura_senha}
            onChange={handleChange}
          />
        </label>

        <label className="toggle">
          <span>Abertura de caixa obrigatória antes da venda?</span>
          <input
            type="checkbox"
            name="abertura_caixa"
            checked={formData.abertura_caixa}
            onChange={handleChange}
          />
        </label>

        <label className="toggle">
          <span>
            Exigir fechamento de caixa por operador no final do turno?
          </span>
          <input
            type="checkbox"
            name="fechamento_caixa"
            checked={formData.fechamento_caixa}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="section">
        <h3>💰 Formas de Pagamento</h3>

        <label className="field">
          <span>Formas de pagamento aceitas:</span>
          <select onChange={adicionarForma} defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            {opcoesPagamento.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </label>

        <div className="lista-formas">
          {formasSelecionadas.map((forma, index) => (
            <div key={index} className="forma-item">
              {forma}
              <button type="button" onClick={() => removerForma(forma)}>
                ✖
              </button>
            </div>
          ))}
        </div>

        <label className="field">
          <span>Limite de desconto (%):</span>
          <input
            type="number"
            name="limite_desconto"
            placeholder="Ex: 10"
            min={0}
            value={formData.limite_desconto}
            onChange={handleChange}
          />
        </label>

        <button className="salvarBtn" onClick={editarDados}>
          💾 Salvar Configurações
        </button>
      </div>
    </div>
  );
}

export default VendasECaixa;
