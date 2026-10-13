import { useState, useTransition, useMemo } from "react";
import { products } from "./data";
import { CartProvider } from "./context/CartContext";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { ProductList } from "./components/ProductList";
import "./App.css";

export function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Ввод в input синхронный, фильтрация отложена через transition
  function handleSearchChange(e) {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => {
      setFilter(value);
    });
  }

  // Мемоизированная фильтрация по названию и наличию
  const visibleProducts = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = q === "" || p.title.toLowerCase().includes(q);
      const matchesStock = !onlyInStock || p.inStock;
      return matchesQuery && matchesStock;
    });
  }, [filter, onlyInStock]);

  return (
    <CartProvider>
      <div className="container">
        <Header />
        <SearchBar
          query={query}
          onSearchChange={handleSearchChange}
          onlyInStock={onlyInStock}
          onToggleStock={setOnlyInStock}
          totalFound={visibleProducts.length}
          isPending={isPending}
        />
        <ProductList products={visibleProducts} />
      </div>
    </CartProvider>
  );
}

export default App;