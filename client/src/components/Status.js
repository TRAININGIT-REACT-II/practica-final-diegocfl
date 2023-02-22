import "./Status.css";

// Mostramos si el servidor funciona o no.
const Status = ({ status }) => {
  const css = status ? "status status-ok" : "status";
  const text = status ? "OK" : "NO CONECTA";

  return <span className={css}>{text}</span>;
};

export default Status;
