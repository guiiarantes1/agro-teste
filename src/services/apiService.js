const API_BASE_URL = "http://127.0.0.1:8000/api";

const apiService = {
  async get(endpoint, token) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado, tenta renovar
          const refreshToken = localStorage.getItem('refreshToken');
          const newToken = await this.refreshAccessToken(refreshToken);

          // Atualiza o token no localStorage e refaz a request
          localStorage.setItem('accessToken', newToken.access);
          return this.get(endpoint, newToken.access);  // Refaça a request com o novo token
        }
        throw new Error(await response.text());
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async post(endpoint, token, body) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          const newToken = await this.refreshAccessToken(refreshToken);

          localStorage.setItem('accessToken', newToken.access);
          return this.post(endpoint, newToken.access, body);
        }
        throw new Error(await response.text());
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async delete(endpoint, token) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          const newToken = await this.refreshAccessToken(refreshToken);

          localStorage.setItem('accessToken', newToken.access);
          return this.delete(endpoint, newToken.access);
        }
        throw new Error(await response.text());
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  async refreshAccessToken(refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) throw new Error("Erro ao renovar o token.");
      return response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;
