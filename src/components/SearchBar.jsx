import { useRef, useEffect } from "react";

export function SearchBar({
  query,
  onSearchChange,
  onlyInStock,
  onToggleStock,
  totalFound,
  isPending,
}) {
  const inputRef = useRef(null);

  // Автофокус при монтировании
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="search-bar">
      <input
        ref={inputRef}
        type="text"
        placeholder="Поиск по названию..."
        value={query}
        onChange={onSearchChange}
      />
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={onlyInStock}
          onChange={(e) => onToggleStock(e.target.checked)}
        />
        Только в наличии
      </label>
      <div className="search-stats">
        {isPending ? (
          <span className="pending-text">Обновляем список...</span>
        ) : (
          <span>Найдено: {totalFound.toLocaleString("ru-RU")}</span>
        )}
      </div>
    </div>
  );
}