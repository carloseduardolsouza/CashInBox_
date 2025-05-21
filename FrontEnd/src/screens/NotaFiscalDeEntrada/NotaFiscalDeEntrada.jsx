import "./NotaFiscalDeEntrada.css";
import { useState } from "react";

function NotaFiscalDeEntrada() {
    const [linhaSelecionada , setLinhaSelecionada] = useState(true)
  return (
    <div id="NotaFiscalDeEntrada">
      <h2>Importar Nota Fiscal</h2>
      <div id="chaveNF">
        <div>
          <span>Informa a chave de acesso e clique em importar nota</span>
          <input type="number" />
        </div>
        <button>Importar Nota</button>
      </div>

      <div class="tabela-container">
        <table id="tabelaNotaDeEntrada" className="Table">
          <thead>
            <tr>
              <th>Cod. Produto</th>
              <th>Descrição</th>
              <th>Qtde. Total</th>
              <th>Preço custo</th>
              <th>Cód. produto</th>
              <th>CFOP</th>
              <th>ICMS</th>
              <th>IPI</th>
              <th>PIS</th>
              <th>COFINS</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`"" ${linhaSelecionada ? "linhaSelecionada" : ""}`}>
              <td>dasdasd</td>
              <td>hjvhjv</td>
              <td>hvhvhv</td>
              <td>klk</td>
              <td>ds</td>
              <td>mnlklk</td>
              <td>aqqa</td>
              <td>uyuyu</td>
              <td>cvcvc</td>
              <td>zszs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="divButtonsNotaFiscal">
        <button>Editar Produto</button>
        <button>Concluir</button>
        <button>(ESC) - Sair</button>
      </div>
    </div>
  );
}

export default NotaFiscalDeEntrada;
