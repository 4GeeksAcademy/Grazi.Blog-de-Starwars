import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { fetchDetail, getImageUrl } from "../services/swapi";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23343a40'/%3E%3Ctext x='50%25' y='50%25' fill='%23adb5bd' font-family='sans-serif' font-size='22' text-anchor='middle' dominant-baseline='middle'%3ESin imagen%3C/text%3E%3C/svg%3E";

const TYPE_LABELS = { people: "Personaje", vehicles: "Vehículo", planets: "Planeta" };

const FIELD_LABELS = {
  people: {
    birth_year: "Año de nacimiento",
    gender: "Género",
    height: "Altura (cm)",
    mass: "Masa (kg)",
    hair_color: "Color de cabello",
    skin_color: "Color de piel",
    eye_color: "Color de ojos",
  },
  vehicles: {
    model: "Modelo",
    manufacturer: "Fabricante",
    vehicle_class: "Clase",
    cost_in_credits: "Costo (créditos)",
    length: "Longitud (m)",
    max_atmosphering_speed: "Velocidad máxima",
    crew: "Tripulación",
    passengers: "Pasajeros",
    cargo_capacity: "Capacidad de carga",
    consumables: "Consumibles",
  },
  planets: {
    population: "Población",
    climate: "Clima",
    terrain: "Terreno",
    diameter: "Diámetro (km)",
    gravity: "Gravedad",
    orbital_period: "Periodo orbital (días)",
    rotation_period: "Periodo de rotación (horas)",
    surface_water: "Agua superficial (%)",
  },
};

export const Single = () => {
  const { type, theId } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchDetail(type, theId)
      .then(setDetail)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [type, theId]);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger">{error || "No se encontró el elemento."}</div>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const isFavorite = store.favorites.some((fav) => fav.uid === theId && fav.type === type);
  const fields = FIELD_LABELS[type] || {};

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-md-4">
          <img
            src={getImageUrl(type, theId)}
            alt={detail.name}
            className="img-fluid rounded shadow-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
          />
        </div>
        <div className="col-md-8">
          <span className="badge bg-secondary mb-2">{TYPE_LABELS[type]}</span>
          <h1>{detail.name}</h1>

          <ul className="list-group list-group-flush mb-4">
            {Object.entries(fields).map(
              ([key, label]) =>
                detail[key] !== undefined && (
                  <li key={key} className="list-group-item d-flex justify-content-between">
                    <strong>{label}</strong>
                    <span>{detail[key]}</span>
                  </li>
                )
            )}
          </ul>

          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-outline-primary">
              <i className="fa-solid fa-arrow-left me-1"></i> Volver
            </Link>
            <button
              type="button"
              className={`btn ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() =>
                dispatch({ type: "toggle_favorite", payload: { uid: theId, type, name: detail.name } })
              }
            >
              <i className={`fa-heart ${isFavorite ? "fa-solid" : "fa-regular"} me-1`}></i>
              {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};