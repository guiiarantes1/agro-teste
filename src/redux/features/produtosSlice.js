import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/apiService";

export const fetchProdutos = createAsyncThunk(
  "produtos/fetchProdutos",
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/products/", token);
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
  },
  reducers: {},
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

export default produtosSlice.reducer;
