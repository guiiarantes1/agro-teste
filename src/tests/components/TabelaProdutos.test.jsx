import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import store from "../../redux/store/store"; // Ajuste o caminho para o seu store
import { BrowserRouter } from "react-router-dom"; // Importando BrowserRouter
import TabelaProdutos from "../../components/TabelaProdutos";

// Mock do react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(), // Mockando o useNavigate
}));

describe("TabelaProdutos", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });
  test("Deve redirecionar para login se não houver token", async () => {
    const mockNavigate = jest.fn();
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TabelaProdutos />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login?redirect=true");
    });
  });

  test("Deve exibir corretamente os produtos na tabela", async () => {
    localStorage.setItem("accessToken", "mockToken");

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: "Produto 1", price: 10.0 },
        { id: 2, name: "Produto 2", price: 20.0 },
      ],
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TabelaProdutos />
        </BrowserRouter>
      </Provider>
    );

    expect(await screen.findByText("Produto 1")).toBeInTheDocument();
    expect(screen.getByText("Produto 2")).toBeInTheDocument();
    expect(screen.getByText("R$ 10,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 20,00")).toBeInTheDocument();
  });
  test("Deve excluir um produto da lista ao clicar no botão de excluir", async () => {
    localStorage.setItem("accessToken", "mockToken");
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: "Produto 1", price: 10.0 },
          { id: 2, name: "Produto 2", price: 20.0 },
        ],
      })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 2, name: "Produto 2", price: 20.0 }],
      });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TabelaProdutos />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText("Produto 1")).toBeInTheDocument();

    const botaoExcluir = screen.getByTestId("btn-deletar-0");
    fireEvent.click(botaoExcluir);

    await waitFor(() => {
      expect(screen.queryByText("Produto 1")).not.toBeInTheDocument();
    });
  });

  test("Deve adicionar um novo produto à tabela", async () => {
    localStorage.setItem("accessToken", "mockToken");
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, name: "Produto 1", price: 10.0 }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, name: "Produto 2", price: 20.0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: "Produto 1", price: 10.0 },
          { id: 2, name: "Produto 2", price: 20.0 },
        ],
      });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TabelaProdutos />
        </BrowserRouter>
      </Provider>
    );

    const nomeInput = screen.getByPlaceholderText("Nome do produto");
    const precoInput = screen.getByPlaceholderText("Preço");
    const botaoAdicionar = screen.getByText("Adicionar");

    fireEvent.change(nomeInput, { target: { value: "Produto 2" } });
    fireEvent.change(precoInput, { target: { value: "20" } });
    fireEvent.click(botaoAdicionar);

    expect(screen.queryByText("Produto 2")).toBeInTheDocument();
    expect(screen.getByText("R$ 20,00")).toBeInTheDocument();
  });

  test("Deve exibir uma mensagem de erro se os campos estiverem vazios ao adicionar um produto", async () => {
    localStorage.setItem("accessToken", "mockToken");

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TabelaProdutos />
        </BrowserRouter>
      </Provider>
    );

    const adicionarButton = screen.getByText("Adicionar");
    fireEvent.click(adicionarButton);

    expect(
      await screen.findByText("Preencha o nome e preço do produto.")
    ).toBeInTheDocument();
  });
});
