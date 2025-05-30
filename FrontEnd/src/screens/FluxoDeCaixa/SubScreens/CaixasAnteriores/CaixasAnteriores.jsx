import "./CaixasAnteriores.css";
import { useEffect, useState , useContext} from "react";
import fetchapi from "../../../../api/fetchapi";
import services from "../../../../services/services";
import AppContext from "../../../../context/AppContext"

function CaixasAnteriores() {
  const {setErroApi} = useContext(AppContext)
  const [caixasAnteriores, setCaixasAnteriores] = useState([]);

  useEffect(() => {
    fetchapi.BuscarCaixas().then((response) => {
      setCaixasAnteriores(response);
    }).catch(() => setErroApi(true));
  }, []);
  return (
    <div id="CaixasAnteriores">
      <table className="Table">
        <thead>
          <tr>
            <th>Caixa</th>
            <th>Abertura</th>
            <th>Fechamento</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {caixasAnteriores.map((dados) => {
            return (
              <tr>
                <td>{services.formatarData(dados.data_abertura)}</td>
                <td>{services.formatarCurrency(dados.valor_abertura)}</td>
                <td>{services.formatarCurrency(dados.valor_fechamento)}</td>
                <td>
                  <button className="DetalhesHistoricoVendas">Detalhes</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CaixasAnteriores;
