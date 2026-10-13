import { memo } from "react";

export const ProductCard = memo(function ProductCard({
  product,
  qty,
  onAdd,
  onRemove,
}) {
  // Проверка перерисовок один клик -> один лог
  console.log("render", product.id);

  return (
    <div className={`card ${!product.inStock ? "card-out" : ""}`}>
      <h3>{product.title}</h3>
      <p className="price">{product.price} ₽</p>
      <p className="stock-status">
        {product.inStock ? "В наличии" : "Нет в наличии"}
      </p>

      <div className="card-actions">
        {qty > 0 ? (
          <>
            <span className="in-cart-badge">В корзине: {qty}</span>
            <button
              className="btn-add"
              onClick={() => onAdd(product)}
              disabled={!product.inStock}
            >
              +
            </button>
            <button className="btn-remove" onClick={() => onRemove(product.id)}>
              Убрать
            </button>
          </>
        ) : (
          <button
            className="btn-add"
            onClick={() => onAdd(product)}
            disabled={!product.inStock}
          >
            В корзину
          </button>
        )}
      </div>
    </div>
  );
});