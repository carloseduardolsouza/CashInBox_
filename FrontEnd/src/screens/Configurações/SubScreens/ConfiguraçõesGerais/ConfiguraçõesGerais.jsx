import "./ConfiguraçõesGerais.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../../../context/AppContext";

import CardLogin from "../../../../components/CardLogin/CardLogin";

//icones
import { MdAddPhotoAlternate } from "react-icons/md";
import userFetch from "../../../../api/userFetch";

function ConfiguraçõesGerais() {
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [InscriçãoEstadual, setInscriçãoEstadual] = useState("");

  const { setErroApi, fazerLogin, setFazerLogin , adicionarAviso } = useContext(AppContext);

  const [bttDisabled, setBttDisabled] = useState(true);

  useEffect(() => {
    userFetch
      .dadosEmpresa()
      .then((response) => {
        setNomeEstabelecimento(response.nomeEstabelecimento);
        setCnpj(response.cnpj);
        setEndereco(response.endereco);
        setInscriçãoEstadual(response.InscriçãoEstadual);
        setTelefone(response.telefone);
      })
      .catch(() => setErroApi(true));
  }, []);

  const alterarDadosDaEmpresa = async (e) => {
    e.preventDefault();

    let dadosEmpresa = {
      nomeEstabelecimento: nomeEstabelecimento,
      cnpj: cnpj,
      telefone: telefone,
      endereco: endereco,
      InscriçãoEstadual: InscriçãoEstadual,
    };
    await userFetch.editarDadosEmpresa(dadosEmpresa).then(() => {
      adicionarAviso("sucesso" , "SUCESSO - Dados da empresa editado com sucesso !")
    }).catch(() => {
      setErroApi(true)
    });
  };

  return (
    <div id="ConfiguraçõesGerais">
      {fazerLogin && <CardLogin fechar={setFazerLogin} />}
      <button id="MudarCredenciais" onClick={() => setFazerLogin(true)}>
        Mudar Credenciais
      </button>
      <main id="mainConfiguraçõesGerais">
        <div id="LogoDaEmpresaConfiguraçõesGerais">
          <MdAddPhotoAlternate id="MdAddPhotoAlternate" />
        </div>

        <div>
          <form
            id="formConfiguraçõesGerais"
            onSubmit={(e) => alterarDadosDaEmpresa(e)}
          >
            <label>
              <p>Nome do Estabelecimento:</p>
              <input
                type="text"
                value={nomeEstabelecimento}
                onChange={(e) => {
                  setNomeEstabelecimento(e.target.value);
                  setBttDisabled(false);
                }}
              />
            </label>

            <label>
              <p>Telefone:</p>
              <input
                type="number"
                value={telefone}
                onChange={(e) => {
                  setTelefone(e.target.value);
                  setBttDisabled(false);
                }}
              />
            </label>

            <label>
              <p>CNPJ:</p>
              <input
                type="number"
                value={cnpj}
                onChange={(e) => {
                  setCnpj(e.target.value);
                  setBttDisabled(false);
                }}
              />
            </label>

            <label>
              <p>Endereço da loja:</p>
              <input
                type="text"
                value={endereco}
                onChange={(e) => {
                  setEndereco(e.target.value);
                  setBttDisabled(false);
                }}
              />
            </label>

            <label>
              <p>Inscrição estadual:</p>
              <input
                type="number"
                value={InscriçãoEstadual}
                onChange={(e) => {
                  setInscriçãoEstadual(e.target.value);
                  setBttDisabled(false);
                }}
              />
            </label>

            <button type="submit" disabled={bttDisabled}>
              Salvar alterações
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ConfiguraçõesGerais;
