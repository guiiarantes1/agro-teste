import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TabelaProdutos from "../../components/TabelaProdutos";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("TabelaProdutos", () => {
  test("Deve exibir corretamente os produtos na tabela", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: "Produto 1", price: 10.0 },
        { id: 2, name: "Produto 2", price: 20.0 },
      ],
    });

    render(<TabelaProdutos />);

    expect(await screen.findByText("Produto 1")).toBeInTheDocument();
    expect(screen.getByText("Produto 2")).toBeInTheDocument();
    expect(screen.getByText("R$ 10")).toBeInTheDocument();
    expect(screen.getByText("R$ 20")).toBeInTheDocument();
  });

  test("Deve excluir um produto da lista ao clicar no botão de excluir", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: "Produto 1", price: 10.0 },
          { id: 2, name: "Produto 2", price: 20.0 },
        ],
      })
      .mockResolvedValueOnce({ ok: true });

    render(<TabelaProdutos />);

    expect(await screen.findByText("Produto 1")).toBeInTheDocument();

    const botaoExcluir = screen.getAllByText("Excluir")[0];
    fireEvent.click(botaoExcluir);

    await waitFor(() => {
      expect(screen.queryByText("Produto 1")).not.toBeInTheDocument();
    });
  });

  test("Deve adicionar um novo produto à tabela", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 3, name: "Produto 3", price: 30.0 }),
      });

    render(<TabelaProdutos />);

    const nomeInput = screen.getByPlaceholderText("Nome do Produto");
    const precoInput = screen.getByPlaceholderText("Preço do Produto");
    const botaoAdicionar = screen.getByText("Adicionar Produto");

    fireEvent.change(nomeInput, { target: { value: "Produto 3" } });
    fireEvent.change(precoInput, { target: { value: "30" } });
    fireEvent.click(botaoAdicionar);

    expect(await screen.findByText("Produto 3")).toBeInTheDocument();
    expect(screen.getByText("R$ 30")).toBeInTheDocument();
  });

  test("Deve exibir uma mensagem de erro se os campos estiverem vazios ao adicionar um produto", async () => {
    render(<TabelaProdutos />);

    const adicionarButton = screen.getByText("Adicionar Produto");
    fireEvent.click(adicionarButton);

    expect(
      await screen.findByText(
        "Por favor, preencha o nome e o preço do produto."
      )
    ).toBeInTheDocument();
  });
});
