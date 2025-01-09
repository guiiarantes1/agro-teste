import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TabelaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoNomeProduto, setNovoNomeProduto] = useState("");
  const [novoPrecoProduto, setNovoPrecoProduto] = useState("");
  const [msgErro, setMsgErro] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!token) {
        navigate("/login?redirect=true");
        return null;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/products/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, [token, history]);

  const adicionarProduto = async () => {
    if (!novoNomeProduto || !novoPrecoProduto) {
      setMsgErro("Por favor, preencha o nome e o preço do produto.");
      return;
    }

    const novoProduto = {
      name: novoNomeProduto.charAt(0).toUpperCase() + novoNomeProduto.slice(1),
      price: parseFloat(novoPrecoProduto),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",     
        },
        body: JSON.stringify(novoProduto),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar o produto.");
      }

      const produtoCriado = await response.json();

      setProdutos((produtoAnterior) => [...produtoAnterior, produtoCriado]);
      setNovoNomeProduto("");
      setNovoPrecoProduto("");
      setMsgErro("");
    } catch (error) {
      setMsgErro(error.message);
    }
  };

  const deletarProduto = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Produto não encontrado.");
        }
        throw new Error("Erro ao deletar o produto.");
      }

      setProdutos((produtoAnterior) =>
        produtoAnterior.filter((product) => product.id !== id)
      );
      setMsgErro("");
    } catch (error) {
      setMsgErro(error.message);
    }
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h1>Lista de Produtos</h1>

      {/* Formulário para adicionar novos produtos */}
      <div
        style={{ marginBottom: "25px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <input
          type="text"
          placeholder="Nome do Produto"
          value={novoNomeProduto}
          onChange={(e) => setNovoNomeProduto(e.target.value)}
          style={{ marginRight: "10px", height: "40px" }}
        />
        <input
          type="number"
          placeholder="Preço do Produto"
          value={novoPrecoProduto}
          onChange={(e) => setNovoPrecoProduto(e.target.value)}
          style={{ marginRight: "10px", height: "40px" }}
        />
        <button onClick={adicionarProduto} style={{ backgroundColor: "green" }}>
          Adicionar Produto
        </button>
      </div>

      {/* Exibe a mensagem de erro, se houver */}
      {msgErro && (
        <div style={{ color: "red", marginBottom: "20px" }}>{msgErro}</div>
      )}

      {/* Tabela de produtos */}
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr style={{ padding: "10px" }}>
            <th>Nome</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>R$ {product.price}</td>
              <td>
                <button
                  onClick={() => deletarProduto(product.id)}
                  style={{ backgroundColor: "green" }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaProdutos;
