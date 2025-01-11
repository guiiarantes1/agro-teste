import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msgErro, setMsgErro] = useState("");
  const [msgRedirecionamento, setmsgRedirecionamento] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("redirect") === "true") {
      setmsgRedirecionamento("Faça login para acessar esta página.");
    }
  }, [location.search]);

  const logar = async (e) => {
    e.preventDefault();

    const credentials = {
      username,
      password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos");
      }

      const data = await response.json();

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      setMsgErro("");
      navigate("/tabela");
    } catch (err) {
      setMsgErro(err.message);
    }
  };

  return (
    <div className="container">
      <div className="imagem">
        <h2>
          <span style={{ color: "#F7941F" }}>B</span>em-vindo
        </h2>
        <img className="agroImg" src="public\agro.png" alt="" />
      </div>

      <div className="login">
        <h2 className="bemvindo" style={{ opacity: "0" }}>
          <span style={{ color: "#F7941F" }}>B</span>em-vindo
        </h2>
        <h2>LOGIN</h2>

        <form onSubmit={logar}>
          <label htmlFor="inputUsuario" className="form-label">
            Usuário
          </label>
          <div className="mb-4 input-group">
            <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-person"></i>
            </span>
            <input
              type="text"
              className="form-control"
              id="inputUsuario"
              value={username}
              placeholder="Digite seu usuário"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <label htmlFor="inputSenha" className="form-label">
            Senha
          </label>

          <div className="mb-4 input-group">
            <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-lock"></i>
            </span>
            <input
              placeholder="Digite sua senha"
              type="password"
              className="form-control"
              id="inputSenha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 d-flex">
            <button type="submit" className="btn btn-primary" id="btnEntrar" style={{ margin: "0 0 0 auto" }}>
              Entrar
            </button>
          </div>
        </form>

        {msgErro && (
          <div
            style={{ color: "#d14334", textAlign: "center", fontWeight: "600" }}
          >
            {msgErro}
          </div>
        )}

        {msgRedirecionamento && (
          <div
            style={{ color: "#d14334", textAlign: "center", fontWeight: "600" }}
          >
            {msgRedirecionamento}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
