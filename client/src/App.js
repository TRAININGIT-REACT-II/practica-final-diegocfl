import { useEffect, useState } from "react";
import Status from "./components/Status";

// Componente principal de la aplicación.
const App = () => {
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargamos el estado del servidor
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setStatus(data.status === "ok"))
      .finally(() => setLoading(false));
  }, []);

  // Mostramos la aplicación
  return (
    <main>
      <h1>Curso de React de TrainingIT</h1>
      <p>
        Estado del servidor:
        {loading ? " Cargando..." : <Status status={status} />}
      </p>
    </main>
  );
};

export default App;
