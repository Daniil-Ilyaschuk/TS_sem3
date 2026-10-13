import { useCart } from "../context/CartContext";

export function Header() {
  const { totalCount, totalPrice, clear } = useCart();

  return (
    <header className="header">
      <h1>Магазин</h1>
      <div className="cart-summary">
        <span>
          Корзина: <strong>{totalCount} шт.</strong> · <strong>{totalPrice} ₽</strong>
        </span>
        <button onClick={clear} disabled={totalCount === 0}>
          Очистить
        </button>
      </div>
    </header>
  );
}