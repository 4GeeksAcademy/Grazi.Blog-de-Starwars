import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { SearchBar } from "./SearchBar";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();

  const removeFavorite = (uid, type, name) => {
    dispatch({ type: "toggle_favorite", payload: { uid, type, name } });
  };

  return (
    <nav className="navbar navbar-light bg-light shadow-sm sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand mb-0 h1 text-decoration-none">
          <i className="fa-solid fa-star text-warning me-2"></i>
          Star Wars Blog
        </Link>

        <SearchBar />

        <div className="dropdown">
          <button
            className="btn btn-outline-danger dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-heart me-1"></i>
            Favoritos ({store.favorites.length})
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end p-2"
            style={{ minWidth: "300px", maxHeight: "360px", overflowY: "auto" }}
          >
            {store.favorites.length === 0 && (
              <li className="text-muted px-2 py-1">Todavía no guardaste favoritos.</li>
            )}
            {store.favorites.map((fav) => (
              <li key={`${fav.type}-${fav.uid}`}>
                <div className="d-flex align-items-center justify-content-between px-2 py-1">
                  <Link to={`/single/${fav.type}/${fav.uid}`} className="text-decoration-none flex-grow-1 text-truncate">
                    {fav.name}
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger p-0 ms-2"
                    title="Quitar de favoritos"
                    onClick={() => removeFavorite(fav.uid, fav.type, fav.name)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};