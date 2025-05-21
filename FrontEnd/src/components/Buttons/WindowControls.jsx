import "./WindowControls.css"

const WindowControls = () => {
  return (
    <div id="WindowControls">

      <button onClick={() => window.electronAPI.minimize()}>—</button>
      <button onClick={() => window.electronAPI.close()}>✕</button>
    </div>
  );
};

export default WindowControls;
