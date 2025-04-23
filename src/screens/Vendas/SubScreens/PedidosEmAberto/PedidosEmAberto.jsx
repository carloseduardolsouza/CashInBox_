import "./PedidosEmAberto.css"

function PedidosEmAberto() {
  return (
    <table className="TableVendas">
      <div className="TableHeader">
        <p className="itemTabelTitle">Produto</p>
        <p className="itemTabelTitle PreçoVendasScreenTable">Preço</p>
        <p className="itemTabelTitle QuantidadeVendasScreenTable">Quantidade</p>
        <p className="itemTabelTitle DescontoVendasScreenTable">Desconto</p>
        <p className="itemTabelTitle TotalVendasScreenTable">Total</p>
        <p className="itemTabelTitle PagamentoVendasScreenTables">Pagamento</p>
        <p className="itemTabelTitle AçõesVendasScreenTables">Ações</p>
      </div>
      {/*(loadingVendas && <Loading />) ||
                resultVendasPendentes.map((venda) => (
                  <ItensTablePendentes
                    venda={venda}
                    arrayVendas={setResultVendasPendentes}
                  />
                ))*/}
    </table>
  );
}

export default PedidosEmAberto;
