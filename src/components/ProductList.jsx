import { ErrorBoundary } from "react-error-boundary";
import { ProductCard } from "./ProductCard";
import { useCart } from "../context/CartContext";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-box">
      <p>Произошла ошибка при загрузке каталога: {error.message}</p>
      <button onClick={resetErrorBoundary}>Повторить</button>
    </div>
  );
}

export function ProductList({ products }) {
  // Достаём только стабильные функции и словарь количеств
  const { qtyById, add, remove } = useCart();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            qty={qtyById[product.id] ?? 0}
            onAdd={add}
            onRemove={remove}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
}