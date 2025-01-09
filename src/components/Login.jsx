import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msgRedirecionamento, setmsgRedirecionamento] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("redirect") === "true") {
      setmsgRedirecionamento("Você precisa estar logado para acessar esta página.");
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

      navigate("/tabela");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={logar}>
        <div>
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {msgRedirecionamento && <div style={{ color: "red" }}>{msgRedirecionamento}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default Login;
