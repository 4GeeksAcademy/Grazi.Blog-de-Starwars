import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getImageUrl } from "../services/swapi";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23343a40'/%3E%3Ctext x='50%25' y='50%25' fill='%23adb5bd' font-family='sans-serif' font-size='18' text-anchor='middle' dominant-baseline='middle'%3ESin imagen%3C/text%3E%3C/svg%3E";

export const Card = ({ type, uid, name }) => {
  const { store, dispatch } = useGlobalReducer();
  const isFavorite = store.favorites.some((fav) => fav.uid === uid && fav.type === type);

  const toggleFavorite = () => {
    dispatch({ type: "toggle_favorite", payload: { uid, type, name } });
  };

  return (
    <div className="card flex-shrink-0" style={{ width: "14rem" }}>
      <img
        src={getImageUrl(type, uid)}
        className="card-img-top"
        alt={name}
        style={{ height: "16rem", objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK_IMAGE;
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate" title={name}>
          {name}
        </h5>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Link to={`/single/${type}/${uid}`} className="btn btn-outline-primary btn-sm">
            Ver más
          </Link>
          <button
            type="button"
            className={`btn btn-sm ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
            onClick={toggleFavorite}
            title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <i className={`fa-heart ${isFavorite ? "fa-solid" : "fa-regular"}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  type: PropTypes.oneOf(["people", "vehicles", "planets"]).isRequired,
  uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
};