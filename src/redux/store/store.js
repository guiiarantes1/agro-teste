import { configureStore } from "@reduxjs/toolkit";
import produtosReducer from "../features/produtosSlice";

export const store = configureStore({
  reducer: {
    produtos: produtosReducer,
  },
});

export default store;