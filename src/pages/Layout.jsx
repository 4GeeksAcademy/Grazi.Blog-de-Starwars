import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { fetchList } from "../services/swapi";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.

const CATEGORIES = ["people", "vehicles", "planets"];

export const Layout = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    CATEGORIES.forEach((type) => {
      if (store[type].length > 0) return;

      dispatch({ type: "set_loading", payload: { type, value: true } });
      fetchList(type)
        .then((items) => dispatch({ type: `set_${type}`, payload: items }))
        .catch((error) => {
          dispatch({ type: "set_loading", payload: { type, value: false } });
          dispatch({ type: "set_error", payload: error.message });
        });
    });
  }, []);

  return (
    <ScrollToTop>
      <Navbar />
      <Outlet />
      <Footer />
    </ScrollToTop>
  );
};