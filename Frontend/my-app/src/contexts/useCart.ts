// useCart.ts
import { useContext } from "react";
import contextObj from "./CartContext";

// Export the useCart hook
export const useCart = () => useContext(contextObj.CartContext);
