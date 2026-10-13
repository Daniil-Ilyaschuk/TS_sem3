import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "shop_cart_data";

const initialCart = { items: [] };

function getInitialCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialCart;
  } catch (e) {
    console.error("Ошибка чтения localStorage:", e);
    return initialCart;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.product.id
      );

      if (existingIndex > -1) {
        const nextItems = [...state.items];
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          qty: nextItems[existingIndex].qty + 1,
        };
        return { ...state, items: nextItems };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: action.product.id,
            title: action.product.title,
            price: action.product.price,
            qty: 1,
          },
        ],
      };
    }

    case "remove": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    }

    case "clear":
      return initialCart;

    default:
      return state;
    }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, getInitialCart);

  // Cохранение в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Ошибка сохранения в localStorage:", e);
    }
  }, [cart]);

  // Стабильные действия через useCallback
  const add = useCallback((product) => {
    dispatch({ type: "add", product });
  }, []);

  const remove = useCallback((id) => {
    dispatch({ type: "remove", id });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const { totalCount, totalPrice, qtyById } = useMemo(() => {
    let count = 0;
    let price = 0;
    const qtyMap = {};

    for (const item of cart.items) {
      count += item.qty;
      price += item.qty * item.price;
      qtyMap[item.id] = item.qty;
    }

    return { totalCount: count, totalPrice: price, qtyById: qtyMap };
  }, [cart.items]);

  const value = useMemo(
    () => ({
      items: cart.items,
      totalCount,
      totalPrice,
      qtyById,
      add,
      remove,
      clear,
    }),
    [cart.items, totalCount, totalPrice, qtyById, add, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Пользовательский хук для получения состояния корзины
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart должен использоваться внутри CartProvider");
  }
  return context;
}