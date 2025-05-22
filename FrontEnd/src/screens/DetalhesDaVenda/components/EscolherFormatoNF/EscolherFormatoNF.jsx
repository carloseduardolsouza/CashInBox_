import "./EscolherFormatoNF.css";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import MyPDFDocumentNotaGrande from "../../../../components/MyPDFDocumentNotaGrande";

function EscolherFormatoNF({ fechar, produtos, cliente, venda, dadosLoja }) {
  const [itemAtivo, setItemAtivo] = useState("");
  const [gerando, setGerando] = useState(false);

  const gerarNota = async () => {
    if (!itemAtivo) {
      alert("Selecione um formato!");
      return;
    }

    if (produtos.length === 0 || !cliente.id) {
      alert("Dados incompletos!");
      return;
    }

    setGerando(true);

    let documentoPDF = null;
    let nomeArquivo = "nota.pdf";

    if (itemAtivo === "NotaGrande") {
      documentoPDF = (
        <MyPDFDocumentNotaGrande
          produtos={produtos}
          cliente={cliente}
          venda={venda}
          dadosLoja={dadosLoja}
        />
      );
      nomeArquivo = "Nota_Grande.pdf";
    } else if (itemAtivo === "NotaPequena") {
      // Aqui você coloca o componente correspondente
      alert("Formato Nota Pequena ainda não implementado.");
      setGerando(false);
      return;
    } else if (itemAtivo === "NotaRomaneio") {
      // Aqui também
      alert("Formato Nota Romaneio ainda não implementado.");
      setGerando(false);
      return;
    }

    try {
      const blob = await pdf(documentoPDF).toBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="blurModal">
      <div id="EscolherFormatoNF">
        <h1 style={{ textAlign: "center" }}>Escolha formato</h1>
        <div>
          <div
            className={`blockOptionEscolherNF ${
              itemAtivo === "NotaPequena" ? "ativoEscolhaNF" : ""
            }`}
            onClick={() => setItemAtivo("NotaPequena")}
          >
            <div>Imagem</div>
            <div>
              <strong>Notinha Pequena</strong>
            </div>
          </div>

          <div
            className={`blockOptionEscolherNF ${
              itemAtivo === "NotaGrande" ? "ativoEscolhaNF" : ""
            }`}
            onClick={() => setItemAtivo("NotaGrande")}
          >
            <div>Imagem</div>
            <div>
              <strong>Nota Grande</strong>
            </div>
          </div>

          <div
            className={`blockOptionEscolherNF ${
              itemAtivo === "NotaRomaneio" ? "ativoEscolhaNF" : ""
            }`}
            onClick={() => setItemAtivo("NotaRomaneio")}
          >
            <div>Imagem</div>
            <div>
              <strong>Nota Romaneio</strong>
            </div>
          </div>
        </div>

        <div
          id="AreaButtonEscolherNF"
          className={itemAtivo === "" ? "ativo" : ""}
        >
          <button
            id="buttonAreaButtonEscolherNFCancelar"
            onClick={() => fechar(null)}
          >
            Cancelar
          </button>
          <button
            id="buttonAreaButtonEscolherNFGerarNota"
            onClick={gerarNota}
            disabled={gerando}
          >
            {gerando ? "Gerando..." : "Gerar Nota"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EscolherFormatoNF;
