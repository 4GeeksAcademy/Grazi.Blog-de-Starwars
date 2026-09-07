import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const TYPE_LABELS = { people: "Personaje", vehicles: "Vehículo", planets: "Planeta" };

export const SearchBar = () => {
  const { store } = useGlobalReducer();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const allItems = useMemo(
    () => [
      ...store.people.map((item) => ({ ...item, type: "people" })),
      ...store.vehicles.map((item) => ({ ...item, type: "vehicles" })),
      ...store.planets.map((item) => ({ ...item, type: "planets" })),
    ],
    [store.people, store.vehicles, store.planets]
  );

  const suggestions =
    query.trim().length > 0
      ? allItems.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8)
      : [];

  const handleSelect = (item) => {
    setQuery("");
    navigate(`/single/${item.type}/${item.uid}`);
  };

  return (
    <div className="position-relative flex-grow-1 mx-3" style={{ maxWidth: "320px" }}>
      <input
        type="search"
        className="form-control"
        placeholder="Buscar personaje, vehículo o planeta..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul
          className="list-group position-absolute w-100 shadow-sm"
          style={{ zIndex: 1050, top: "100%", maxHeight: "300px", overflowY: "auto" }}
        >
          {suggestions.map((item) => (
            <li
              key={`${item.type}-${item.uid}`}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelect(item)}
            >
              {item.name} <small className="text-muted">({TYPE_LABELS[item.type]})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};