import axios from 'axios';

const URL_UNIVERSIDADES =
  'https://universities.hipolabs.com/search?country=Peru';

const UNIVERSIDADES_RESPALDO = [
  {
    name: 'Universidad Nacional Mayor de San Marcos',
    country: 'Peru',
    'state-province': 'Lima',
    domains: ['unmsm.edu.pe'],
    web_pages: ['https://www.unmsm.edu.pe'],
  },
  {
    name: 'Pontificia Universidad Católica del Perú',
    country: 'Peru',
    'state-province': 'Lima',
    domains: ['pucp.edu.pe'],
    web_pages: ['https://www.pucp.edu.pe'],
  },
  {
    name: 'Universidad Nacional de Ingeniería',
    country: 'Peru',
    'state-province': 'Lima',
    domains: ['uni.edu.pe'],
    web_pages: ['https://www.uni.edu.pe'],
  },
];

function validarDatos(datos) {
  if (!Array.isArray(datos) || datos.length === 0) {
    throw new Error('La API no devolvió una lista válida de universidades.');
  }

  return datos;
}

export async function obtenerUniversidadesAxios() {
  try {
    const respuesta = await axios.get(URL_UNIVERSIDADES, { timeout: 12000 });
    return validarDatos(respuesta.data);
  } catch {
    return UNIVERSIDADES_RESPALDO;
  }
}

export async function obtenerUniversidadesFetch() {
  try {
    const respuesta = await fetch(URL_UNIVERSIDADES);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    return validarDatos(datos);
  } catch {
    return UNIVERSIDADES_RESPALDO;
  }
}