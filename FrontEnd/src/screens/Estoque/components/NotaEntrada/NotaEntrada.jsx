import "./NotaEntrada.css";

function NotaEntrada({fechar}) {
  return (
    <div className="blurModal">
      <div id="NotaEntrada">
        <div>
          <div className="divDisplayFlexNotaEntrada">
            <div>
              <span>Loja:</span>
              <input type="text" />
            </div>
            <div>
              <span>Chave NF-E:</span>
              <input type="text" />
            </div>
          </div>
          <div className="divDisplayFlexNotaEntrada">
            <div>
              <span>CFOP de entrada:</span>
              <input type="text" />
            </div>
            <div id="EmissãoNotaEntrada">
              <div>
                <span>Emissão:</span>
                <input type="date" />
              </div>
              <div>
                <span>Entrada:</span>
                <input type="date" />
              </div>
            </div>
          </div>
        </div>
        <div className="tabela-container">
          <table id="TableNotaEntrada">
            <thead>
              <tr>
                <th>item</th>
                <th>Codigo</th>
                <th>Descrição</th>
                <th>CST</th>
                <th>Unidade</th>
                <th>Qtde</th>
                <th>Vl. unitario</th>
                <th>Vl. total</th>
                <th>ICMS%</th>
              </tr>
            </thead>
            <tbody id="tbodyNotaEntrada">
              <tr>
                <td>dasd</td>
                <td>vhvjhvhggvgh</td>
                <td>jbhjbjhb</td>
                <td>hbjhbjhb</td>
                <td>hbjhbjhbbh</td>
                <td>hbjhbjhb</td>
                <td>hb</td>
                <td>hbjhbjhb</td>
                <td>hbbj</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="areaButtonNotaEntrada">
          <button>Gravar</button>
          <button>Importar NF-e</button>
          <button onClick={() => fechar(null)}>(ESC) Sair</button>
        </div>
      </div>
    </div>
  );
}

export default NotaEntrada;
