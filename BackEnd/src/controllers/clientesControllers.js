const clientesModels = require('../models/clientesModels')

const procurarCliente = async (req, res) => {
    const clientes = await clientesModels.listarCliente()
    return res.status(200).json(clientes)
}

const novoCliente = async (req , res) => {
    const clientes = await clientesModels.novoCliente(req.body)
    return res.status(201).json(clientes)
}

const deletarCliente = async (req , res) => {
    const {id} = req.params
    const deletarCliente = await clientesModels.deletarCliente(id)
    return res.status(200).json(deletarCliente)
}

const editarCliente = async (req , res) => {
    const {id} = req.params
    const editarCliente = await clientesModels.editarCliente(id , req.body)
    return res.status(200).json()
}

const procurarClienteId = async (req, res) => {
    const {id} = req.params
    const clientes = await clientesModels.procurarClienteId(id)
    return res.status(200).json(clientes)
}





module.exports = {
    novoCliente,
    procurarCliente,
    procurarClienteId,
    deletarCliente,
    editarCliente
}