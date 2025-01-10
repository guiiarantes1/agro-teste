import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TabelaProdutos.css";
import Toast from "./shared/Toast";
import apiService from "../services/apiService";

const TabelaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoNomeProduto, setNovoNomeProduto] = useState("");
  const [novoPrecoProduto, setNovoPrecoProduto] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refresh_token");
  const produtosPorPagina = 15;

  const indexUltimoProduto = paginaAtual * produtosPorPagina;
  const indexPrimeiroProduto = indexUltimoProduto - produtosPorPagina;
  const produtosNaPagina = produtos.slice(
    indexPrimeiroProduto,
    indexUltimoProduto
  );
  const totalPaginas = Math.ceil(produtos.length / produtosPorPagina);

  // Exibe o Toast
  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => setToast({ ...toast, visible: false });

  const fetchProdutos = async () => {
    if (!token) {
      navigate("/login?redirect=true");
      return;
    }

    try {
      const produtosData = await apiService.get("/products/", token);
      setProdutos(produtosData);
    } catch (error) {
      if (error.message.includes("401") && refreshToken) {
        try {
          const { access: newToken } = await apiService.refreshAccessToken(
            refreshToken
          );
          localStorage.setItem("access_token", newToken);
          const produtosData = await apiService.get("/products/", newToken);
          setProdutos(produtosData);
        } catch (refreshError) {
          navigate("/login");
        }
      } else {
        console.error("Erro ao buscar produtos:", error);
        showToast(
          "Erro ao buscar produtos. Tente novamente mais tarde.",
          "danger"
        );
      }
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [token, refreshToken, navigate]);

  // Adiciona um novo produto
  const adicionarProduto = async () => {
    if (!novoNomeProduto || !novoPrecoProduto) {
      showToast("Preencha o nome e preço do produto.", "danger");
      return;
    }

    const novoProduto = {
      name: novoNomeProduto.trim(),
      price: parseFloat(novoPrecoProduto),
    };

    try {
      const produtoCriado = await apiService.post(
        "/products/",
        token,
        novoProduto
      );
      setProdutos((prev) => [...prev, produtoCriado]);
      setNovoNomeProduto("");
      setNovoPrecoProduto("");
      showToast("Produto adicionado com sucesso!", "success");
    } catch (error) {
      showToast(error.message, "danger");
    }
  };

  // Remove um produto
  const deletarProduto = async (id) => {
    try {
      await apiService.delete(`/products/${id}/`, token);
      setProdutos((prev) => prev.filter((produto) => produto.id !== id));
      showToast("Produto deletado com sucesso!", "success");
    } catch (error) {
      showToast(error.message, "danger");
    }
  };

  const mudarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  };

  const renderTabela = () => (
    <table
      className="table table-success table-striped mx-auto text-center"
      style={{ borderRadius: "7px", overflow: "hidden" }}
    >
      <thead
        style={{ fontSize: "20px", fontWeight: "600", lineHeight: "25px" }}
      >
        <tr>
          <th>Nome</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {produtosNaPagina.map((produto) => (
          <tr key={produto.id}>
            <td>{produto.name}</td>
            <td>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(produto.price)}
            </td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => deletarProduto(produto.id)}
              >
                <i className="bi bi-trash3"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPaginacao = () => (
    <nav className="paginacao">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>
          <button
            className="page-link bg-gray-100 text-black border-0"
            style={{ borderRadius: "7px 0px 0px 7px" }}
            onClick={() => mudarPagina(paginaAtual - 1)}
            aria-label="Anterior"
          >
            &laquo;
          </button>
        </li>
        {[...Array(totalPaginas).keys()].map((_, index) => (
          <li
            key={index + 1}
            className={`page-item ${paginaAtual === index + 1 ? "active" : ""}`}
          >
            <button
              className="page-link bg-gray-100 text-black border-0"
              style={{ borderRadius: "0px" }}
              onClick={() => mudarPagina(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            paginaAtual === totalPaginas ? "disabled" : ""
          }`}
        >
          <button
            className="page-link bg-gray-100 text-black border-0"
            style={{ borderRadius: "0px 7px 7px 0px" }}
            onClick={() => mudarPagina(paginaAtual + 1)}
            aria-label="Próximo"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="main">
      <div className="body">
        <Toast
          show={toast.visible}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
        <h1 className="titulo">
          <span style={{ color: "#F7941F" }}>L</span>ista de Produtos
        </h1>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            adicionarProduto();
          }}
        >
          <p
            className="mb-5 me-3 md-3"
            style={{ fontSize: "20px", fontWeight: "500" }}
          >
            Adicionar Produto:
          </p>
          <div className="mb-5 me-3 md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nome do produto"
              value={novoNomeProduto}
              onChange={(e) => setNovoNomeProduto(e.target.value)}
            />
          </div>
          <div className="mb-5 me-3 md-3">
            <input
              type="tel"
              pattern="[0-9.]*"
              className="form-control"
              placeholder="Preço"
              value={novoPrecoProduto}
              onChange={(e) => {
                const valor = e.target.value.replace(",", ".");
                if (/[^0-9.]/.test(valor)) {
                  showToast("Digite apenas números e pontos.", "danger");
                }
                setNovoPrecoProduto(valor.replace(/[^0-9.]/g, ""));
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary mb-5 me-3 md-3">
            Adicionar
          </button>
        </form>
        {renderTabela()}
        {renderPaginacao()}
      </div>
    </div>
  );
};

export default TabelaProdutos;
