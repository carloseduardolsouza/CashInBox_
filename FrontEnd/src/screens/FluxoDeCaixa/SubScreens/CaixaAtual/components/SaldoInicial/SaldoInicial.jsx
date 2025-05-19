import "./SaldoInicial.css"

function SaldoInicial() {
    return ( 
        <div id="SaldoInicial">
            <h2>Saldo Inicial do caixa</h2>
            <form>
                <label>
                    <span>Saldo Inicial</span>
                    <input type="number" placeholder="R$ 100,00"/>
                </label>
                <button>Concluir</button>
            </form>
        </div>
     );
}

export default SaldoInicial;