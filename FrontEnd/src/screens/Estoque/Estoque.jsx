import "./Estoque.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//Icones
import { FaSearch } from "react-icons/fa";

//componetes
import NotaEntrada from "./components/NotaEntrada/NotaEntrada";

function Estoque() {
  const navigate = useNavigate();
  const [modalEstoque, setModalEstoque] = useState(null);

  const renderModal = () => {
    switch (modalEstoque) {
      case "NotaEntrada":
        return <NotaEntrada fechar={setModalEstoque}/>;
      case null:
        return null;
    }
  };
  return (
    <div id="ESTOQUE">
      {renderModal()}
      <h2>Estoque</h2>
      <button id="NotaEntradaButton" onClick={() => setModalEstoque("NotaEntrada")}>Nota de Entrada</button>
      <div>
        <form onSubmit={(e) => /*renderEstoque(e)*/ ``}>
          <button
            className="AddProduto"
            onClick={(e) => {
              e.preventDefault();
              navigate("/cadastrarProduto");
            }}
            type="button"
          >
            +
          </button>
          <input
            type="text"
            className="InputClientes"
            placeholder="Procurar no Estoque..."
          />
          <button className="Search" type="submit">
            <FaSearch />
          </button>
        </form>
      </div>
      <table className="Table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço de Compra</th>
            <th>Mergem</th>
            <th>Preço de Venda</th>
            <th>Em Estoque</th>
            <th>Codigo</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <Link to={"/detalhesDoProduto/1"} id="aTDEstoque">
                Comoda Capri
              </Link>
            </td>
            <td>R$ 50,00</td>
            <td>100%</td>
            <td>R$ 100,00</td>
            <td>10</td>
            <td>0001</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Estoque;
