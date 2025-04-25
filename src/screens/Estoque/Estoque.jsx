import "./Estoque.css";
import { useEffect, useState } from "react";

//Componentes
//import IntensEstoque from "../../components/IntensEstoque/IntensEstoque";
//import Loading from "../../components/AçãoRealizada/AçãoRealizada"

//Icones
import { FaSearch } from "react-icons/fa";

//Controlador de Api
//import fetchapi from "../../api/fetchapi";

function Estoque() {
  const [pesquisar, setPesquisar] = useState("all");
  const [resultEstoque, setResultEstoque] = useState([]);
  const [loadingEstoque, setloadingEstoque] = useState(true);

  /*useEffect(() => {
        fetchapi.ProcurarProdutos(pesquisar).then((response) => {
            setResultEstoque(response)
            setloadingEstoque(false)
        })
    }, [])*/

  const changePesquisa = (e) => {
    setPesquisar(e.target.value);
  };

  /*const renderEstoque = async (e) => {
        e.preventDefault()
        setloadingEstoque(true)
        const client = await fetchapi.ProcurarProdutos(pesquisar)
        setloadingEstoque(false)
        setResultEstoque(client)
    }*/

  return (
    <div id="ESTOQUE">
      <h2>Estoque</h2>
      <div id="AreaFunçõesEstoque">
        <a href="/">Nota de Entrada</a>
      </div>
      <div>
        <form onSubmit={(e) => /*renderEstoque(e)*/ ``}>
          <button
            className="AddProduto"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/cadastrarProduto";
            }}
            type="button"
          >
            +
          </button>
          <input
            type="text"
            className="InputClientes"
            placeholder="Procurar no Estoque..."
            onChange={(e) => changePesquisa(e)}
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
            <td><a href="/" id="aTDEstoque">Comoda Capri</a></td>
            <td>R$ 50,00</td>
            <td>100%</td>
            <td>R$ 100,00</td>
            <td>10</td>
            <td>0001</td>
          </tr>
          {/*(loadingEstoque && <Loading />) ||
            resultEstoque.map((estoque) => {
              return (
                <tr>
                  <td>Comoda Capri</td>
                  <td>R$ 50,00</td>
                  <td>100%</td>
                  <td>10</td>
                  <td>0001</td>
                </tr>
              );
            })*/}
        </tbody>
      </table>
    </div>
  );
}

export default Estoque;
