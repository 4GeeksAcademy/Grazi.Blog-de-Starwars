const CACHE_KEYS = {
  people: "sw_people",
  vehicles: "sw_vehicles",
  planets: "sw_planets",
  favorites: "sw_favorites",
};

const loadFromCache = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const saveToCache = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return;
  }
};

export const initialStore = () => ({
  people: loadFromCache(CACHE_KEYS.people, []),
  vehicles: loadFromCache(CACHE_KEYS.vehicles, []),
  planets: loadFromCache(CACHE_KEYS.planets, []),
  favorites: loadFromCache(CACHE_KEYS.favorites, []),
  loading: { people: false, vehicles: false, planets: false },
  error: null,
});

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_loading":
      return {
        ...store,
        loading: { ...store.loading, [action.payload.type]: action.payload.value },
      };

    case "set_people":
      saveToCache(CACHE_KEYS.people, action.payload);
      return { ...store, people: action.payload, loading: { ...store.loading, people: false } };

    case "set_vehicles":
      saveToCache(CACHE_KEYS.vehicles, action.payload);
      return { ...store, vehicles: action.payload, loading: { ...store.loading, vehicles: false } };

    case "set_planets":
      saveToCache(CACHE_KEYS.planets, action.payload);
      return { ...store, planets: action.payload, loading: { ...store.loading, planets: false } };

    case "toggle_favorite": {
      const { uid, type, name } = action.payload;
      const alreadyFavorite = store.favorites.some((fav) => fav.uid === uid && fav.type === type);
      const favorites = alreadyFavorite
        ? store.favorites.filter((fav) => !(fav.uid === uid && fav.type === type))
        : [...store.favorites, { uid, type, name }];
      saveToCache(CACHE_KEYS.favorites, favorites);
      return { ...store, favorites };
    }

    case "set_error":
      return { ...store, error: action.payload };

    default:
      throw new Error("Unknown action: " + action.type);
  }
}