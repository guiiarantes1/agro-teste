import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "../../components/Login";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe("Login", () => {
  const mockNavigate = jest.fn();
  const mockLocation = { search: "?redirect=true" };

  beforeEach(() => {
    jest.clearAllMocks();
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    require("react-router-dom").useLocation.mockReturnValue(mockLocation);

    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  test("Deve exibir mensagem de redirecionamento quando query param 'redirect' for true", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText("Faça login para acessar esta página.")).toBeInTheDocument();
  });

  test("Deve exibir erro ao tentar logar com credenciais inválidas", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Digite seu usuário"), {
      target: { value: "usuario_invalido" },
    });
    fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
      target: { value: "senha_errada" },
    });

    fireEvent.click(screen.getByText("Entrar"));

    await waitFor(() => {
      expect(screen.getByText("Usuário ou senha inválidos")).toBeInTheDocument();
    });
  });

  test("Deve redirecionar para '/tabela' ao logar com credenciais válidas", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access: "mockAccessToken",
        refresh: "mockRefreshToken",
      }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Digite seu usuário"), {
      target: { value: "usuario_valido" },
    });
    fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
      target: { value: "senha_correta" },
    });

    fireEvent.click(screen.getByText("Entrar"));

    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toBe("mockAccessToken");
      expect(localStorage.getItem("refreshToken")).toBe("mockRefreshToken");
      expect(mockNavigate).toHaveBeenCalledWith("/tabela");
    });
  });
});
