import React from "react";
import { FixedSizeList as List } from "react-window";

const ListaProdutos = ({ produtos, deletarProduto, height }) => {
  const Row = ({ index, style }) => {
    const produto = produtos[index];
    return (
      <div
        style={{
          ...style,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 30px",
          borderBottom: "1px solid #ccc",
        }}
        key={produto.id}
        className="row-item"
      >
        <span  data-testid="produto-nome">{produto.name}</span>
        <span style={{ marginRight: "7px" }}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(produto.price)}
        </span>
        <button
          className="btn btn-primary"
          onClick={() => deletarProduto(produto.id)}
          data-testid={`btn-deletar-${index}`}
          style={{ marginRight: "6px" }}
        >
          <i className="bi bi-trash3"></i>
        </button>
      </div>
    );
  };

  return (
    <div
      className="table"
      style={{
        borderRadius: "7px",
        border: "1px solid #ccc",
        overflow: "hidden",
        width: "70%",
        margin: "0 auto",
        textAlign: "center",
        height: height,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "20px",
          fontWeight: "600",
          lineHeight: "25px",
          backgroundColor: "#028f76",
          padding: "10px 30px",
          color: "#fff",
        }}
        className="header"
      >
        <span>Nome</span>
        <span>Preço</span>
        <span>Ações</span>
      </div>
      <List
        height={height}
        itemCount={produtos.length}
        itemSize={60}
        width={"100%"}
        className="list"
      >
        {Row}
      </List>
    </div>
  );
};

export default ListaProdutos;
