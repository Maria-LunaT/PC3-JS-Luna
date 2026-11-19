import { useEffect, useState } from 'react';
import {
  obtenerUniversidadesAxios,
  obtenerUniversidadesFetch,
} from './services/UniversidadesApi';
import './App.css';

export default function App() {
  const [universidades, setUniversidades] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cliente, setCliente] = useState('axios');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarUniversidades(metodo = 'axios') {
    setCargando(true);
    setError('');

    try {
      const datos =
        metodo === 'fetch'
          ? await obtenerUniversidadesFetch()
          : await obtenerUniversidadesAxios();
      setUniversidades(datos);
    } catch (problema) {
      setUniversidades([]);
      setError(`No pudimos consultar la API. ${problema.message}`);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      cargarUniversidades('axios');
    }, 0);

    return () => window.clearTimeout(temporizador);
  }, []);

  const universidadesFiltradas = universidades.filter((universidad) => {
    const texto = [
      universidad.name,
      universidad.country,
      universidad['state-province'],
      ...(universidad.domains ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return texto.includes(busqueda.trim().toLowerCase());
  });

  return (
    <div className="pagina">
      <header className="cabecera">
        <div className="contenido cabecera-interior">
          <span className="logo-texto">Universidad Perú</span>
          <span className="marca">Laboratorio React · API pública</span>
        </div>
      </header>

      <main className="contenido">
        <section className="presentacion">
          <p className="eyebrow">DIRECTORIO UNIVERSITARIO</p>
          <h1>Explora universidades del Perú</h1>
          <p>
            Consulta el registro público de universidades y filtra los
            resultados por nombre, departamento o dominio.
          </p>
        </section>

        <section className="herramientas" aria-label="Herramientas de consulta">
          <label className="campo">
            <span>Buscar universidad</span>
            <input
              type="search"
              placeholder="Ejemplo: Lima, San Marcos, edu.pe..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>

          <label className="campo selector">
            <span>Cliente HTTP</span>
            <select
              value={cliente}
              onChange={(evento) => setCliente(evento.target.value)}
            >
              <option value="axios">Axios</option>
              <option value="fetch">Fetch API</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => cargarUniversidades(cliente)}
            disabled={cargando}
          >
            {cargando ? 'Consultando…' : '↻ Recargar universidades'}
          </button>
        </section>

        <section className="resultados" aria-live="polite">
          <div className="resumen">
            <h2>Universidades disponibles</h2>
            <span>
              {universidadesFiltradas.length} de {universidades.length} resultados
            </span>
          </div>

          {cargando ? (
            <p className="mensaje">Cargando universidades desde la API...</p>
          ) : error ? (
            <div className="mensaje error" role="alert">
              {error}
            </div>
          ) : universidadesFiltradas.length === 0 ? (
            <p className="mensaje">
              No hay universidades que coincidan con esta búsqueda.
              Prueba otra palabra o recarga.
            </p>
          ) : (
            <div className="galeria">
              {universidadesFiltradas.map((universidad, indice) => (
                <article
                  className="tarjeta"
                  key={`${universidad.domains?.[0] ?? universidad.name}-${indice}`}
                >
                  <div className="tarjeta-contenido">
                    <span className="etiqueta">UNIVERSIDAD</span>
                    <h3>{universidad.name}</h3>
                    <p>{universidad['state-province'] || universidad.country}</p>
                    {universidad.web_pages?.[0] && (
                      <a
                        href={universidad.web_pages[0]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visitar sitio web
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="pie">
        Ejercicio de aprendizaje · React + Vite + Universities API
      </footer>
    </div>
  );
}