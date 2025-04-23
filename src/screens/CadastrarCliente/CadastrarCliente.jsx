import "./CadastrarCliente.css"
import { useState } from "react"

//Assets
//import ImageUser from "../../assets/user.jpg"

//Controlador de api
//import NovoClienteApi from "../../api/fetchapi"

//Componentes
//import Concluindo from "../../components/Concluindo/Concluindo"

//icones
import { FaUserAlt } from "react-icons/fa";

function CadastrarCliente() {
    const [nome ,setNome] = useState('')
    const [numero ,setNumero] = useState('')
    const [endereço ,setEndereço] = useState('')
    const [cpf ,setCpf] = useState('')
    const [email ,setEmail] = useState('')
    const [genero ,setGenero] = useState('Selecione o Genero')
    const [nascimento ,setNascimento] = useState('')

    const [concluido , setConcluindo] = useState(false)

    const Data = new Date()
    const log = `${Data.getUTCDate()}/${Data.getUTCMonth() + 1}/${Data.getUTCFullYear()}`

    const CadastrarCliente = (e) => {
        e.preventDefault()
        if(nascimento == "" || nascimento == undefined || nascimento == null) {
            setNascimento("desconhecido")
        }
        if(endereço == "" || endereço == undefined || endereço == null) {
            setEndereço("Desconhecido")
        }
        if(cpf == "" || cpf == undefined || cpf == null) {
            setCpf("desconhecido")
        }
        if(email == "" || email == undefined || email == null) {
            setEmail("desconhecido")
        }
        
        const dados = {
            "nome" : nome,
            "date_nascimento" : nascimento,
            "genero" : genero,
            "telefone" : numero,
            "cpf" : cpf,
            "endereço" : endereço,
            "email" : email,
            "observação" : "***"
        }
        setConcluindo(true)
        //NovoClienteApi.NovoCliente(dados)
        
        setCpf('')
        setEmail('')
        setEndereço('')
        setGenero('')
        setNascimento('')
        setNome('')
        setNumero('')
        
        setTimeout(() => {
            setConcluindo(false);
        }, 1500)
    }

    const escreverDados = (param , e) => {
        if(param == "nome") {
            setNome(e.target.value)
        }

        if(param == "numero") {
            setNumero(e.target.value)
        }

        if(param == "Endereço") {
            setEndereço(e.target.value)
        }

        if(param == "CPF") {
            setCpf(e.target.value)
        }

        if(param == "Email") {
            setEmail(e.target.value)
        }

        if(param == "Gênero") {
            setGenero(e.target.value)
        }

        if(param == "Nascimento") {
            setNascimento(e.target.value)
        }
    }

    return ( 
    <div id="novoCliente">
        <h2>Novo Cliente</h2>
        <p>{log}</p>
        <div id="CENTRALIZAR">

        <main className="MainNovoCliente">
        <div alt="Imagem User" className="ImageUser"><FaUserAlt /></div>
        <form className="articleNovoCliente" onSubmit={(e) => CadastrarCliente(e)}>
            <p><strong>Nome: </strong></p>
            <input type="text" className="InputNovoCliente" onChange={(event) => escreverDados("nome" , event)} value={nome} placeholder="Nome" required/>
            <p><strong>Numero: </strong></p>
            <input type="number" className="InputNovoCliente" onChange={(event) => escreverDados("numero", event)} value={numero} placeholder="Numero" required/>
            <p><strong>Endereço</strong></p>
            <input type="text" className="InputNovoCliente" onChange={(event) => escreverDados("Endereço", event)} value={endereço} placeholder="Endereço"/>
            <p><strong>CPF</strong></p>
            <input type="number" className="InputNovoCliente" onChange={(event) => escreverDados("CPF", event)} value={cpf} placeholder="CPF"/>
            <p><strong>Email</strong></p>
            <input type="text" className="InputNovoCliente" onChange={(event) => escreverDados("Email", event)} value={email} placeholder="Email"/>
            <p><strong>Gênero</strong></p>
            <select className="SelectNovoCliente" onChange={(event) => escreverDados("Gênero", event)} value={genero}>
                <option value="Selecione o Genero">Selecione o Genero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
            </select>
            <p>Nascimento: </p>
            <input type="date" className="DataNovoCliente" onChange={(event) => escreverDados("Nascimento", event)} value={nascimento}/>
            <button className="CadastrarNovoCliente" type="submit">Cadastrar</button>
            {/*concluido && <Concluindo/>*/}
        </form>
        </main>
        </div>
    </div>
    );
}

export default CadastrarCliente;