
const BASE_URL = "https://www.swapi.tech/api";

const IMAGE_BASE_URL = "https://starwars-visualguide.com/assets/img";
const IMAGE_FOLDERS = {
  people: "characters",
  vehicles: "vehicles",
  planets: "planets",
};

export const getImageUrl = (type, uid) => `${IMAGE_BASE_URL}/${IMAGE_FOLDERS[type]}/${uid}.jpg`;

export const fetchList = async (type) => {
  const response = await fetch(`${BASE_URL}/${type}?page=1&limit=100`);
  if (!response.ok) {
    throw new Error(`No se pudo obtener el listado de ${type} (status ${response.status})`);
  }
  const data = await response.json();
  return data.results.map((item) => ({ uid: item.uid, name: item.name }));
};

export const fetchDetail = async (type, uid) => {
  const response = await fetch(`${BASE_URL}/${type}/${uid}`);
  if (!response.ok) {
    throw new Error(`No se pudo obtener el detalle de ${type}/${uid} (status ${response.status})`);
  }
  const data = await response.json();
  return { uid: data.result.uid, ...data.result.properties };
};