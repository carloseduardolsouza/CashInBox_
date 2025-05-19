import "./ConfiguraçõesGerais.css";
import { useState, useEffect } from "react";

//icones
import { MdAddPhotoAlternate } from "react-icons/md";
import fetchapi from "../../../../api/fetchapi";

function ConfiguraçõesGerais() {
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [InscriçãoEstadual, setInscriçãoEstadual] = useState("");

  const [bttDisabled, setBttDisabled] = useState(true);

  useEffect(() => {
    fetchapi.dadosEmpresa().then((response) => {
      setNomeEstabelecimento(response.nomeEstabelecimento);
      setCnpj(response.cnpj);
      setEndereco(response.endereco);
      setInscriçãoEstadual(response.InscriçãoEstadual);
      setTelefone(response.telefone);
    });
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
    await fetchapi.EditarDadosEmpresa(dadosEmpresa).then().catch();
  };

  return (
    <div id="ConfiguraçõesGerais">
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
                type="text"
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
