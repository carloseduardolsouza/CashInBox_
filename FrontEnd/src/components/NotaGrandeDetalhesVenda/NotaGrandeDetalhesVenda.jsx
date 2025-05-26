import "./NotaGrandeDetalhesVenda.css";
import { forwardRef } from "react";
import services from "../../services/services";

const NotaGrandeDetalhesVenda = forwardRef(
  ({ venda, cliente, produtos, dadosLoja }, ref) => {
    return (
      <div ref={ref}>
        <div>
          <div id="cabecalhoNotaGrande">
              <img src={""} alt="#" className="LogoImpresa" />
            <div>
              <strong>CNPJ: {dadosLoja.cnpj}</strong>
              <br />
              <strong>{dadosLoja.endereco}</strong>
              <br />
              <strong>{dadosLoja.telefone}</strong>
            </div>
          </div>
          <main>
            <div>
              <p>
                <strong>Pagamento: </strong>
                {venda.pagamentos || "Desconhecido"}
              </p>
            </div>
            <div className="BoxInfo">
              <p>
                <strong>Cliente: </strong>
                {cliente.nome || "Desconhecido"}
              </p>
              <p>
                <strong>Telefone: </strong>
                {services.formatarNumeroCelular(cliente.telefone) ||
                  "Desconhecido"}
              </p>
              <p>
                <strong>Endereço: </strong>
                {cliente.endereco || "Desconhecido"}
              </p>
              <p>
                <strong>Data: </strong>
                {services.formatarData(venda.data_venda || 0) || "Desconhecido"}
              </p>
            </div>
          </main>
          <table className="table tableNotaGrande">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Vl. unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((product, index) => (
                <tr key={index}>
                  <td>{product.produto_nome}</td>
                  <td>{product.quantidade}</td>
                  <td>{services.formatarCurrency(product.preco_unitario)}</td>
                  <td>{services.formatarCurrency(product.valor_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="PreFooter">
            <h3>Qtde. itens: {produtos.length}</h3>
            <h3>Valor Total: {services.formatarCurrency(venda.valor_total)}</h3>
          </div>
          <footer>
            <div className="div"></div>
            <div className="footer">
              <p>assinatura do responsável</p>
              <p>assinatura do cliente</p>
            </div>
          </footer>
        </div>



        <div>
          <div id="cabecalhoNotaGrande2">
              <img src={""} alt="#" className="LogoImpresa" />
            <div>
              <strong>CNPJ: {dadosLoja.cnpj}</strong>
              <br />
              <strong>{dadosLoja.endereco}</strong>
              <br />
              <strong>{dadosLoja.telefone}</strong>
            </div>
          </div>
          <main>
            <div>
              <p>
                <strong>Pagamento: </strong>
                {venda.pagamentos || "Desconhecido"}
              </p>
            </div>
            <div className="BoxInfo">
              <p>
                <strong>Cliente: </strong>
                {cliente.nome || "Desconhecido"}
              </p>
              <p>
                <strong>Telefone: </strong>
                {services.formatarNumeroCelular(cliente.telefone) ||
                  "Desconhecido"}
              </p>
              <p>
                <strong>Endereço: </strong>
                {cliente.endereco || "Desconhecido"}
              </p>
              <p>
                <strong>Data: </strong>
                {services.formatarData(venda.data_venda || 0) || "Desconhecido"}
              </p>
            </div>
          </main>
          <table className="table tableNotaGrande">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Vl. unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((product, index) => (
                <tr key={index}>
                  <td>{product.produto_nome}</td>
                  <td>{product.quantidade}</td>
                  <td>{services.formatarCurrency(product.preco_unitario)}</td>
                  <td>{services.formatarCurrency(product.valor_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="PreFooter">
            <h3>Qtde. itens: {produtos.length}</h3>
            <h3>Valor Total: {services.formatarCurrency(venda.valor_total)}</h3>
          </div>
          <footer>
            <div className="div"></div>
            <div className="footer">
              <p>assinatura do responsável</p>
              <p>assinatura do cliente</p>
            </div>
          </footer>
        </div>
      </div>
    );
  }
);

export default NotaGrandeDetalhesVenda;
