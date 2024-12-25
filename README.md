
# MyOMDb Application

MyOMDb é uma aplicação para buscar informações de filmes e gerenciar favoritos utilizando a API OMDb. O projeto utiliza um backend em .NET e um frontend em React.

---

### Descrição da Arquitetura do Backend da Aplicação

A aplicação backend segue uma arquitetura em camadas bem definida, utilizando padrões modernos como CQRS, com uma estrutura robusta e modular. Abaixo, são descritas as camadas principais e suas respectivas responsabilidades:

---

### **1. Camada de Apresentação (API)**
- **Descrição:** Responsável por expor os endpoints RESTful e lidar com as requisições HTTP, aplicando autenticação, validação e controle de acesso.
- **Projeto:** API (WebAPI .NET 9)
- **Pacotes NuGet:**
  - `Microsoft.AspNetCore.Authentication.JwtBearer`
  - `Microsoft.EntityFrameworkCore.Design`
  - `Microsoft.AspNetCore.OpenApi`
  - `System.IdentityModel.Tokens.Jwt`
- **Principais Componentes:**
  - **BaseApiController:** 
    - Classe base para todos os controllers, contendo:
      - Instância do **Mediator** para integração com os serviços CQRS da aplicação.
      - Métodos utilitários para padronizar retornos da API (`HandleResult<T>` e `HandlePagedResult<T>`).
  - **Controllers:**
    - Implementam endpoints para entidades como `Buyers` e autenticação (`AccountController`).
    - Herdam de `BaseApiController` e utilizam o **Mediator** para acessar as funcionalidades da camada de aplicação.
    - Exemplos:
      - CRUD para compradores (em `BuyersController`).
      - Registro e login de usuários (em `AccountController`).
  - **Middleware:**
    - Gerencia o tratamento de exceções não controladas.
    - Utiliza a classe `ExceptionMiddleware` para registrar logs e retornar respostas padronizadas.
  - **Services:**
    - Implementação do `TokenService` para geração e validação de tokens JWT.
  - **Extensions:**
    - Métodos de extensão para configurar middlewares, serviços, autenticação e CORS.

---

### **2. Camada de Aplicação (Application)**
- **Descrição:** Contém as regras de negócio e implementa o padrão CQRS para lidar com comandos e consultas de forma separada.
- **Projeto:** Application (Class Library .NET 9)
- **Pacotes NuGet:**
  - `AutoMapper`
  - `MediatR.Extensions.Microsoft.DependencyInjection`
- **Principais Componentes:**
  - **Core:**
    - Classes utilitárias como:
      - `AppException`: Utilizada no middleware de exceções.
      - `PagedList` e `PagingParams`: Suporte para paginação de resultados.
      - `Result<T>`: Padrão para retorno de respostas.
  - **Services:**
    - Implementam comandos e consultas para cada funcionalidade:
      - **Favorites:** Adição, listagem e remoção de favoritos.
      - **Movies:** Pesquisa e detalhamento de filmes, consumindo o serviço OmdbAPI.
  - **Interfaces:**
    - `IUserAccessor`: Abstração para acessar dados do usuário logado.
    - `IOmdbApiService`: Integração com a API OMDb.

---

### **3. Camada de Domínio (Domain)**
- **Descrição:** Define as entidades do modelo de domínio e seus relacionamentos.
- **Projeto:** Domain (Class Library .NET 9)
- **Pacotes NuGet:**
  - `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
- **Principais Entidades:**
  - `AppUser`: Representa um usuário do sistema.
  - `FavoriteMovie`: Armazena os filmes marcados como favoritos pelos usuários.

---

### **4. Camada de Infraestrutura (Infrastructure)**
- **Descrição:** Implementa integrações com serviços externos.
- **Projeto:** Infrastructure (Class Library .NET 9)
- **Pacotes NuGet:**
  - `Microsoft.AspNetCore.Http.Abstractions`
- **Principais Componentes:**
  - **Security:**
    - `UserAccessor`: Recupera informações do usuário logado através do `HttpContext`.
  - **Movies:**
    - `OmdbApiService`: Implementação para consumir os endpoints da OMDb API (`SearchMovies` e `GetMovieDetails`).

---

### **5. Camada de Persistência (Persistence)**
- **Descrição:** Gerencia a persistência de dados no banco SQLite, usando Entity Framework Core.
- **Projeto:** Persistence (Class Library .NET 9)
- **Pacotes NuGet:**
  - `Microsoft.Data.Sqlite`
  - `Microsoft.EntityFrameworkCore.Sqlite`
  - `Bogus` (para geração de dados fake em ambiente de teste/desenvolvimento)
- **Principais Componentes:**
  - `DataContext`: Define as configurações de entidades e relacionamentos para o EF Core.
  - `Seed`: Gera dados fictícios para inicialização do banco.

---

### Fluxo da Aplicação

1. **Requisição HTTP:**
   - Enviada para os endpoints da camada de apresentação (API).
   - Exemplo: `GET /api/movies` para buscar filmes.
   
2. **Camada de Controle (Controllers):**
   - O controlador correspondente recebe a requisição e utiliza o Mediator para delegar comandos ou consultas à camada de aplicação.

3. **Camada de Aplicação:**
   - Processa comandos e consultas.
   - Interage com a camada de infraestrutura (para integração com a OMDb API) ou persistência (para consultar ou manipular o banco).

4. **Camada de Persistência:**
   - Executa operações no banco SQLite usando Entity Framework Core.

5. **Resposta:**
   - O resultado é devolvido ao controlador e enviado como resposta ao cliente, padronizado pelos métodos utilitários da `BaseApiController`.

---

### Benefícios da Arquitetura

1. **Modularidade:**
   - Camadas bem separadas facilitam a manutenção e evolução do sistema.

2. **Escalabilidade:**
   - O uso de padrões como CQRS permite escalar consultas e comandos de forma independente.

3. **Testabilidade:**
   - Camadas desacopladas permitem testes unitários e de integração mais robustos.

4. **Integração com Serviços Externos:**
   - A integração com a OMDb API está encapsulada na camada de infraestrutura, garantindo baixo acoplamento.

---

### Conclusão

Essa arquitetura garante uma aplicação backend robusta, escalável e fácil de manter. As boas práticas de design, como a separação em camadas e o uso de padrões como CQRS, tornam o sistema bem estruturado para atender às necessidades da aplicação MyOMDb.


### **Frontend**
- **Linguagem:** JavaScript/TypeScript
- **Framework:** React 18
- **Gerenciamento de Estado:** MobX
- **Estilização:** Material-UI (MUI)
- **Bibliotecas Auxiliares:**
  - React Router para roteamento.
  - Axios para chamadas HTTP ao backend.
  - react-router-dom para navegação.

### Endpoints

  * Busca filmes utilizando a OMDbAPI.
	```
	GET /movies/search?title={title}&page={page}
	```
  * Busca os detalhes de um filme específico.
	```
	GET /movies/{id}
	```
  * Adiciona um filme aos favoritos.
	```
	POST /favorites
	```
  * Retorna a lista de filmes favoritos.
	```
	GET /favorites
	```
  * Remove um filme dos favoritos.
	```
	DELETE/favorites/{id}
	```

---

## Configuração do Ambiente Local

Siga os passos abaixo para executar o projeto localmente usando o Visual Studio Code (VSCode):

### **Pré-requisitos**
Certifique-se de que você possui os seguintes softwares instalados:
- [Node.js](https://nodejs.org) (versão 22.12.0 ou superior)
- [.NET SDK](https://dotnet.microsoft.com/) (versão 9 ou superior)
- [Visual Studio Code](https://code.visualstudio.com/)

### **Extensão do VSCode**

As extenções abaixo são utilizadas para desenvolvimento e depuração da aplicação no vscode mas não são necessárias apenas para executar o projeto.

1. **.NET Install Tool**  
   This extension installs and manages different versions of the .NET SDK and Runtime.  
   **Microsoft**

2. **C#**  
   Base language support for C#.  
   **Microsoft**

3. **C# Dev Kit**  
   Official C# extension from Microsoft.  
   **Microsoft**

4. **GitHub Copilot**  
   Your AI pair programmer.  
   **GitHub**

5. **GitHub Copilot Chat**  
   AI chat features powered by Copilot.  
   **GitHub**

6. **NuGet Gallery**  
   The NuGet Gallery extension streamlines the process of installing and uninstalling NuGet packages, making it more efficient and user-friendly.  
   **pcislo**

7. **SQLite**  
   Explore and query SQLite databases.  
   **alexcvzz**

---

### **Passos para Configuração**

#### 1. Clone o Repositório

```
# Clone o repositório do projeto
git clone https://github.com/eryxjose/myomdb

# Navegue para o diretório do projeto
cd myomdb
```

#### 2. Configuração do Backend

1. Navegue até o diretório do backend:
   ```
   cd api
   ```
2. Execute a aplicação:
   ```
   dotnet run
   ```
   O servidor estará disponível em `https://localhost:5000` 
   
   Observação: Não há interface gráfica para visualização do projeto em execução no backend. 

#### 3. Configuração do Frontend

1. Navegue até o diretório do frontend (em outra janela do terminal):
   ```
   cd ../client-app
   ```
2. Instale as dependências do projeto:
   ```
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:3000`.

Observação: Não há interface web para testar a aplicação server-side. Importe a Collection disponibilizada na pasta Specs do projeto para testar a API utilizando o Postman.

#### 4. Abra o Projeto no VSCode
1. Abra o diretório do projeto no VSCode:
   ```
   code .
   ```
2. Certifique-se de que as extensões relacionadas anteriormente estão instaladas no Visual Studio Code.

---

## Estrutura do Projeto

### **Backend**
- **Pasta API:** Contém os endpoints REST e a lógica de controle.
- **Pasta Application:** Contém regras de negócio, handlers e DTOs.
- **Pasta Domain:** Define as entidades principais e enums.
- **Pasta Persistence:** Configurações do banco de dados e contextos do Entity Framework.

### **Frontend**
- **Pasta src:**
  - **features:** Contém os componentes React organizados por funcionalidade (e.g., `movies`, `favorites`).
  - **stores:** Gerenciamento de estado com MobX.
  - **layout:** Componentes globais como `NavBar`.
  - **router:** Configuração de rotas com React Router.

---

## Principais Funcionalidades

1. **Buscar Filmes:**
   - Use a API pública do OMDb para buscar filmes com título e ano.

2. **Favoritar Filmes:**
   - Adicione ou remova filmes da lista de favoritos.
   - Favoritos são armazenados no backend e sincronizados com o frontend.

3. **Autenticação:**
   - Login utilizando JWT.

4. **Gerenciamento de Estado no Frontend:**
   - O estado da aplicação é gerenciado com MobX para garantir reatividade.

---

## Contato

Se você tiver dúvidas ou problemas, entre em contato com [eryx.guimaraes@gmail.com](mailto:eryx.guimaraes@gmail.com).



