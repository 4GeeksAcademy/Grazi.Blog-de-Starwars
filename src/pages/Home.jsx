import useGlobalReducer from "../hooks/useGlobalReducer";
import { Card } from "../components/Card";

const SECTIONS = [
  { type: "people", title: "Personajes" },
  { type: "vehicles", title: "Vehículos" },
  { type: "planets", title: "Planetas" },
];

export const Home = () => {
  const { store } = useGlobalReducer();

  return (
    <div className="container my-4">
      <div className="text-center mb-5">
        <h1 className="display-5">Banco de datos de Star Wars</h1>
        <p className="text-muted">
          Explora personajes, vehículos y planetas, y guarda tus favoritos con el ❤️ de cada tarjeta.
        </p>
      </div>

      {store.error && <div className="alert alert-danger">{store.error}</div>}

      {SECTIONS.map(({ type, title }) => (
        <section className="mb-5" key={type}>
          <h2 className="h3 border-bottom pb-2 mb-3">{title}</h2>

          {store.loading[type] ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : store[type].length === 0 ? (
            <p className="text-muted">No hay datos disponibles.</p>
          ) : (
            <div className="d-flex flex-nowrap overflow-auto pb-2 gap-3">
              {store[type].map((item) => (
                <Card key={item.uid} type={type} uid={item.uid} name={item.name} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};