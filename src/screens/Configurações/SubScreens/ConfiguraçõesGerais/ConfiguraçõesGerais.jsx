import "./ConfiguraçõesGerais.css";

//icones
import { MdAddPhotoAlternate } from "react-icons/md";

function ConfiguraçõesGerais() {
  return (
    <div id="ConfiguraçõesGerais">
      <main id="mainConfiguraçõesGerais">
        <div id="LogoDaEmpresaConfiguraçõesGerais">
          <MdAddPhotoAlternate id="MdAddPhotoAlternate" />
        </div>

        <div>
          <form id="formConfiguraçõesGerais">
            <label>
              <p>Nome do Estabelecimento:</p>
              <input type="text" />
            </label>

            <label>
              <p>CNPJ:</p>
              <input type="number" />
            </label>

            <label>
              <p>Endereço da loja:</p>
              <input type="text" />
            </label>

            <label>
              <p>Inscrição estadual:</p>
              <input type="number" />
            </label>

            <button>Salvar alterações</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ConfiguraçõesGerais;
