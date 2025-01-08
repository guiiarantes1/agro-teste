import React, { useState, useEffect } from "react";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (!newProductName || !newProductPrice) {
      setErrorMessage("Por favor, preencha o nome e o preço do produto.");
      return;
    }

    const nextId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: nextId,
      name: newProductName,
      price: parseFloat(newProductPrice),
    };

    setProducts([...products, newProduct]);
    setNewProductName("");
    setNewProductPrice("");
    setErrorMessage("");
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h1>Lista de Produtos</h1>

      {/* Formulário para adicionar novos produtos */}
      <div
        style={{ marginBottom: "25px", display: "flex", alignItems: "center" }}
      >
        <input
          type="text"
          placeholder="Nome do Produto"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          style={{ marginRight: "10px", height: "40px" }}
        />
        <input
          type="number"
          placeholder="Preço do Produto"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
          style={{ marginRight: "10px", height: "40px" }}
        />
        <button onClick={handleAddProduct} style={{ backgroundColor: "green" }}>
          Adicionar Produto
        </button>
      </div>

      {/* Exibe a mensagem de erro, se houver */}
      {errorMessage && (
        <div style={{ color: "red", marginBottom: "20px" }}>{errorMessage}</div>
      )}

      {/* Tabela de produtos */}
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr style={{ padding: "10px" }}>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>R$ {product.price.toFixed(2)}</td>
              <td>
                <button
                  onClick={() => handleDelete(product.id)}
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

export default ProductsTable;
