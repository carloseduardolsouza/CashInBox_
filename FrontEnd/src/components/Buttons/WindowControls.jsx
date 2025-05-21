import "./WindowControls.css"

const WindowControls = () => {
  return (
    <div id="WindowControls">

      <button id="buttonMinimizeElectron" onClick={() => window.electronAPI.minimize()}>—</button>
      <button id="buttonCloseElectron" onClick={() => window.electronAPI.close()}>✕</button>
    </div>
  );
};

export default WindowControls;
