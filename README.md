# BFF Product Order Management Microservice

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

> Microserviço de gerenciamento de produtos, pedidos e usuários construído com NestJS.

## 📋 Índice

- [Sobre](#sobre)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)

## 📖 Sobre

O BFF Product Order Management é um monolito desenvolvido com NestJS que gerencia:
- **Usuários**: Criação e autenticação de usuários
- **Produtos**: CRUD de produtos com controle de estoque
- **Pedidos**: Gerenciamento de pedidos com transações ACID

Observação: Este monolito deveria ser divido em microserviços de acordo com cada responsabilidade e contexto especializado.

## 🛠 Tecnologias

- **Runtime**: Node.js 18+
- **Framework**: NestJS 10+
- **Linguagem**: TypeScript 5+
- **Database**: TypeORM + PostgreSQL (via Docker)
- **Testes**: Jest
- **Documentação**: Swagger/OpenAPI
- **Validação**: class-validator, class-transformer
- **Containerização**: Docker & Docker Compose

## ✅ Requisitos

- Node.js >= 18.0.0
- npm ou yarn >= 8.0.0
- Docker e Docker Compose
- Git

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/bff-product-order-management.git
cd bff-product-order-management
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=th9UnV18YGz
DB_DATABASE=bff_product_order_management 

# Server
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=zNlhm55xbKCQTfoUtyaAaRH0HRGDSFtgibmhEiKLZ4z
JWT_EXPIRES_IN=1h

# Logging
LOG_LEVEL=debug
```

### 4. Configure o banco de dados com Docker

**Opção A: Usando Docker Compose (Recomendado)**

```bash
# Inicie o PostgreSQL via Docker Compose
docker-compose up -d

# Aguarde ~30 segundos para o banco ficar pronto
docker-compose ps

# Verifique os logs se houver problemas
docker-compose logs db
```

**Verifique a conexão:**

```bash
# Teste a conexão com o banco
psql -h localhost -p 5432 -U postgres -d bfb_product_management
# Digite a senha quando solicitado: th9UnV18YGz
```

**Se houver erro de autenticação:**

```bash
# Pare o container e remova o volume antigo
docker-compose down
docker volume rm bff-product-order-management_pgdata

# Reinicie o container
docker-compose up -d

# Aguarde ~30 segundos e teste novamente
```

**Opção B: Usando PostgreSQL Local**

Se preferir usar PostgreSQL instalado localmente:

```bash
# Crie o banco de dados PostgreSQL
createdb -U postgres bff_product_order_management
# Digite a senha quando solicitado
```

### 5. Execute as migrations

```bash
# Compile o projeto
npm run build

# Execute as migrations
npm run migration:run
```

Se tudo estiver correto, você verá:
```
query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC
[TypeORM] migrations run successfully
```

## 🚀 Execução

### Modo Desenvolvimento

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`

### Modo Produção

```bash
# Compile o projeto
npm run build

# Inicie a aplicação
npm run start:prod
```

### Modo Debug

```bash
npm run start:debug
```

## 🐳 Gerenciamento do Docker

### Comandos Docker Compose

```bash
# Inicie o PostgreSQL em background
docker-compose up -d

# Verifique se o container está rodando
docker-compose ps

# Veja os logs do banco de dados
docker-compose logs db

# Veja logs em tempo real
docker-compose logs -f db

# Limpe e reinicie tudo
docker-compose down

# Remove também o volume de dados
docker-compose down -v

# Recrie os containers
docker-compose up -d
```

### Conectar ao Banco via CLI

```bash
# Conecte ao PostgreSQL
psql -h localhost -p 5432 -U postgres -d bfb_product_management

# Dentro do psql:
# \dt - lista todas as tabelas
# \d nome_tabela - descreve uma tabela
# \q - sai
```

## 🧪 Testes

### Executar todos os testes

```bash
npm run test
```

### Testes em modo watch

```bash
npm run test:watch
```

### Testes com cobertura

```bash
npm run test:cov
```

### Testes e2e

```bash
npm run test:e2e
```

## 📚 Documentação da API

### Acessar Swagger UI

Com a aplicação rodando, acesse:
```
http://localhost:3000/api
```

### Endpoints

#### **Usuários** (`/v1/users`)

##### Criar Usuário
```http
POST /v1/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha_segura_123"
}
```

**Resposta (201 Created)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2026-04-06T10:30:00.000Z"
}
```

---

#### **Produtos** (`/v1/products`)

##### Listar Todos os Produtos
```http
GET /v1/products
Authorization: Bearer {token}
```

**Resposta (200 OK)**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Notebook Dell",
    "description": "Notebook de alta performance",
    "price": 3500.00,
    "stockQuantity": 15,
    "createdAt": "2026-04-06T10:30:00.000Z"
  }
]
```

##### Criar Produto
```http
POST /v1/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Mouse Logitech",
  "description": "Mouse sem fio",
  "price": 89.90,
  "stockQuantity": 50
}
```

**Resposta (201 Created)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Mouse Logitech",
  "description": "Mouse sem fio",
  "price": 89.90,
  "stockQuantity": 50,
  "createdAt": "2026-04-06T10:30:00.000Z"
}
```

##### Obter Produto por ID
```http
GET /v1/products/{id}
Authorization: Bearer {token}
```

##### Atualizar Produto
```http
PUT /v1/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Mouse Logitech MX Master",
  "price": 149.90,
  "stockQuantity": 40
}
```

##### Deletar Produto
```http
DELETE /v1/products/{id}
Authorization: Bearer {token}
```

---

#### **Pedidos** (`/v1/orders`)

##### Listar Todos os Pedidos
```http
GET /v1/orders
Authorization: Bearer {token}
```

**Resposta (200 OK)**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "product": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Notebook Dell"
        },
        "quantity": 1,
        "priceAtPurchase": 3500.00
      }
    ],
    "totalPrice": 3500.00,
    "status": "PAID",
    "createdAt": "2026-04-06T10:30:00.000Z"
  }
]
```

##### Criar Pedido
```http
POST /v1/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 2
    },
    {
      "productId": "550e8400-e29b-41d4-a716-446655440002",
      "quantity": 1
    }
  ]
}
```

**Resposta (201 Created)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva"
  },
  "items": [
    {
      "product": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Notebook Dell"
      },
      "quantity": 2,
      "priceAtPurchase": 3500.00
    }
  ],
  "totalPrice": 7000.00,
  "status": "PAID",
  "createdAt": "2026-04-06T10:30:00.000Z"
}
```

---

### Códigos de Status HTTP

| Status | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Não autorizado |
| 404 | Not Found - Recurso não encontrado |
| 422 | Unprocessable Entity - Erro de validação |
| 500 | Internal Server Error - Erro no servidor |

---

### Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer {seu_token_jwt}
```

## 📁 Estrutura do Projeto

```
src/
├── auth/
│   ├── common/
│   │   └── public.decorator.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── user/
│   ├── dto/
│   │   └── user-response.dto.ts
│   ├── entity/
│   │   └── user.entity.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
├── product/
│   ├── common/
│   │   └── product-response.mapper.ts
│   ├── dto/
│   │   └── product-response.dto.ts
│   ├── entity/
│   │   └── product.entity.ts
│   ├── repository/
│   │   └── product.repository.ts
│   ├── product.controller.ts
│   ├── product.service.ts
│   └── product.module.ts
├── order/
│   ├── common/
│   │   ├── builders/
│   │   │   ├── create-order.build.ts
│   │   │   ├── create-order-item.build.ts
│   │   │   └── index.ts
│   │   └── order-response.mapper.ts
│   ├── dto/
│   │   └── order-response.dto.ts
│   ├── entity/
│   │   ├── order.entity.ts
│   │   └── order-items.entity.ts
│   ├── repository/
│   │   └── order.repository.ts
│   ├── order.controller.ts
│   ├── order.service.ts
│   └── order.module.ts
├── config/
│   ├── database.config.ts
│   └── logger.config.ts
├── migrations/
│   └── 1775524598110-InitialSchema.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start           # Iniciar aplicação
npm run start:dev      # Iniciar em modo desenvolvimento com watch
npm run start:debug    # Iniciar com debugger
npm run start:prod     # Iniciar em modo produção

# Testes
npm run test           # Rodar todos os testes
npm run test:watch    # Rodar testes em modo watch
npm run test:cov      # Rodar testes com cobertura
npm run test:e2e      # Rodar testes e2e

# Build
npm run build         # Compilar projeto

# Database
npm run migration:run      # Executar migrations
npm run migration:revert   # Reverter última migration
npm run migration:create   # Criar nova migration

# Lint
npm run lint          # Verificar código com ESLint
npm run lint:fix      # Corrigir problemas automáticos
```

## 🔐 Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT para autenticação
- Validação de dados com class-validator
- Proteção contra SQL injection via TypeORM
- Rate limiting (opcional)
- CORS configurado

## 🚨 Tratamento de Erros

A API retorna erros estruturados:

```json
{
  "statusCode": 400,
  "message": "Invalid input data",
  "error": "Bad Request"
}
```

## 📝 Logs

Os logs são salvos em arquivos na pasta `logs/`:
- `application.log` - Geral
- `error.log` - Apenas erros

Configure o nível de log em `.env`:
```env
LOG_LEVEL=debug  # debug, info, warn, error
```
---

**Desenvolvido com ❤️ usando NestJS**