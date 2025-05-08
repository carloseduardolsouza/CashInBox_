const connection = require('../models/connection')

const estastisticas = async (req , res) => {
    var receita = 0
    var despesas = 0

    const [vendas] = await connection.execute(`SELECT * FROM vendas`)
    vendas.forEach((venda) => {
        receita += +venda.total;
    });

    const response = {
        'receita': receita
    }

    res.json(response)
    
}

const editarProdutoAutomatico = async (req , res) => {
    const {
        produto,
        preçocompra,
        preçovenda,
        margem,
        emestoque
    } = req.body

    const query = `UPDATE produtos SET  preçocompra = ?, margem = ?, preçovenda = ?, emestoque = ? WHERE referencia LIKE '%${produto}%'`;
    
    const [editarProduto] = await connection.execute(query, [ preçocompra, margem , preçovenda, emestoque]); 
    console.log(produto)
        
    res.status(200).json(editarProduto)
}

module.exports = {
    estastisticas,
    editarProdutoAutomatico
}