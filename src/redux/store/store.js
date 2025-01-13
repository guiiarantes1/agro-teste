import { configureStore } from '@reduxjs/toolkit';
import produtosReducer from "../features/produtosSlice";

const store = configureStore({
  reducer: {
    produtos: produtosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['produtos/fetchProdutos/fulfilled', 'produtos/fetchProdutos/rejected'],
        ignoredPaths: ['produtos.produtos', 'produtos.error'],
      },
    }),
});

export default store;
