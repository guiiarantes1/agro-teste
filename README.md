# README - AGRO-TESTE

## Gerenciamento de Produtos - Interface Frontend

Interface frontend desenvolvida em React que consome a API de gerenciamento de produtos (api-agro-teste).

## Tecnologias Utilizadas

- React 18+
- Redux Toolkit
- React Testing Library
- Bootstrap para estilização responsiva
- React-Window para virtualização de listas



## Instalação

### Instalando o Node.js

Baixe e instale o Node.js no [site oficial](https://nodejs.org/). Verifique a versão após a instalação:

```bash
node --version
npm --version
```

### Passos para configurar o Frontend

1. Clone o repositório:

   ```bash
   git clone https://github.com/guiiarantes1/agro-teste.git
   cd agro-teste
   ```

2. Instale as dependências: (Todas inclusas no package.json)

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

## Documentação da API Consumida

[Documentação da api](https://github.com/guiiarantes1/api-agro-teste)

### Retorna todos os produtos

```http
GET /api/products/
```

| Parâmetro   | Tipo     | Descrição                                   |
| :---------- | :------- | :------------------------------------------ |
| `Authorization` | `string` | **Obrigatório**. Token JWT no formato `Bearer {token}` |

## Exemplos de Uso

```javascript
import React from 'react';
import { useSelector } from 'react-redux';

function ProductList() {
 const produtos = useSelector((state) => state.produtos.produtos);

  return (
    <ul>
      {produtos.map((product) => (
        <li key={produto.id}>{produto.name} - ${produto.price}</li>
      ))}
    </ul>
  );
}

export default ProductList;
```



