import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProdutos } from "../redux/features/produtosSlice";
import "../styles/TabelaProdutos.css";
import Toast from "./shared/Toast";
import apiService from "../services/apiService";
import ListaProdutos from "./ListaProdutos";

const TabelaProdutos = () => {
  const [novoNomeProduto, setNovoNomeProduto] = useState("");
  const [novoPrecoProduto, setNovoPrecoProduto] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [ordenacao, setOrdenacao] = useState({ campo: "", ordem: "" });
  const height = window.innerHeight * 0.7;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refresh_token");
  const produtos = useSelector((state) => state.produtos.produtos);

  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => setToast({ ...toast, visible: false });

  const fetchProdutosData = async () => {
    if (!token) {
      navigate("/login?redirect=true");
      return;
    }

    try {
      dispatch(fetchProdutos(token));
    } catch (error) {
      showToast(
        "Erro ao buscar produtos. Tente novamente mais tarde.",
        "danger"
      );
    }
  };

  useEffect(() => {
    fetchProdutosData();
  }, [token, refreshToken, navigate, dispatch]);

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
      //gera um numero aleatorio e salva no localStorage para o get nao utilizar o cache
      localStorage.setItem(
        "productsVersion",
        Math.random().toString().slice(2)
      );
      showToast("Produto adicionado com sucesso!", "success");
      setNovoNomeProduto("");
      setNovoPrecoProduto("");
      dispatch(fetchProdutos(token));
    } catch (error) {
      showToast(error.message, "danger");
    }
  };

  const deletarProduto = async (id) => {
    try {
      //gera um numero aleatorio e salva no localStorage para o get nao utilizar o cache
      localStorage.setItem(
        "productsVersion",
        Math.random().toString().slice(2)
      );
      await apiService.delete(`/products/${id}/`, token);
      showToast("Produto deletado com sucesso!", "success");
      dispatch(fetchProdutos(token));
    } catch (error) {
      showToast(error.message, "danger");
    }
  };

  const ordenarProdutos = (campo, ordem) => {
    if (campo === ordenacao.campo && ordem === ordenacao.ordem) {
      setOrdenacao({ campo: "id", ordem: "asc" });
    } else {
      setOrdenacao({ campo, ordem });
    }
  };

  const produtosOrdenados = [...produtos].sort((a, b) => {
    if (ordenacao.campo === "nome") {
      return ordenacao.ordem === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (ordenacao.campo === "preco") {
      return ordenacao.ordem === "asc" ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });

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
            className="mb-3 me-3 md-3"
            style={{ fontSize: "20px", fontWeight: "500" }}
          >
            Adicionar Produto:
          </p>
          <div className="mb-3 me-3 md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nome do produto"
              value={novoNomeProduto}             
              onChange={(e) => setNovoNomeProduto(e.target.value)}
            />
          </div>
          <div className="mb-3 me-3 md-3">
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
          <button type="submit" className="btn btn-primary mb-3 me-3 md-3">
            Adicionar
          </button>
        </form>

        <div className="dropdown d-flex">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            id="btnDropdown"
          >
            Ordenar por
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => ordenarProdutos("nome", "asc")}
              >
                A<i className="bi bi-arrow-right-short"></i>Z
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => ordenarProdutos("nome", "desc")}
              >
                Z<i className="bi bi-arrow-right-short"></i>A
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => ordenarProdutos("preco", "asc")}
              >
                Preço<i className="bi bi-arrow-up-short"></i>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => ordenarProdutos("preco", "desc")}
              >
                Preço<i className="bi bi-arrow-down-short"></i>
              </a>
            </li>
          </ul>
        </div>
        <ListaProdutos
          produtos={produtosOrdenados}
          deletarProduto={deletarProduto}
          height={height}
        />
      </div>
    </div>
  );
};

export default TabelaProdutos;
