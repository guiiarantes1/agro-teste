import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/apiService";

export const fetchProdutos = createAsyncThunk(
  "produtos/fetchProdutos",
  async (token, { rejectWithValue }) => {
    try {
      //pega o numero aleatorio salvo no localStorage, se for igual ao salvo no localStorage, nao utiliza o cache
      const version = localStorage.getItem("productsVersion");
      const response = await apiService.get(`/products/?v=${version}`, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const produtosSlice = createSlice({
  name: "produtos",
  initialState: {
    produtos: [],
    loading: false,
    error: null,
    ordem: { tipo: "nome", direcao: "asc" },
  },
  reducers: {
    ordenarProdutos: (state, action) => {
      const { tipo, direcao } = action.payload;
      state.produtos = [...state.produtos].sort((a, b) => {
        if (tipo === "nome") {
          return direcao === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (tipo === "preco") {
          return direcao === "asc" ? a.price - b.price : b.price - a.price;
        }
        return 0;
      });
      state.ordem = { tipo, direcao };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProdutos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProdutos.fulfilled, (state, action) => {
        state.loading = false;
        state.produtos = action.payload;
      })
      .addCase(fetchProdutos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { ordenarProdutos } = produtosSlice.actions;

export default produtosSlice.reducer;
