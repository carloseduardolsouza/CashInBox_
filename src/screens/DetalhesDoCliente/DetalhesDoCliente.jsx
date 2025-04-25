import "./DetalhesDoCliente.css"
import { useState } from "react";

//SubTelas
import GeralCliente from "./SubScreens/GeralCliente/GeralCliente"
import Compras from "./SubScreens/Compras/Compras"

function DetalhesDoCliente() {
    const [compras , setCompras] = useState(false)
    return ( 
        <div id="DetalhesDoCliente">
            <h2>Detalhes do Cliente</h2>
            <header className="HeaderClientesInfo">
                <p className="bttRenderInfoClientes" onClick={() => setCompras(false)}>Detalhes</p>
                <p className="bttRenderInfoClientes" onClick={() => setCompras(true)}>Compras</p>
            </header>
            <main>
                {compras && <Compras/> || <GeralCliente/>}
            </main>
        </div>
     );
}

export default DetalhesDoCliente;