
# MyOMDb App

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

### Descrição da Arquitetura do Frontend da Aplicação

- **Linguagem:** JavaScript/TypeScript
- **Framework:** React 18
- **Gerenciamento de Estado:** MobX
- **Estilização:** Material-UI (MUI)
- **Bibliotecas Auxiliares:**
  - React Router para roteamento.
  - Axios para chamadas HTTP ao backend.
  - react-router-dom para navegação.

### **Descrição da Arquitetura, Bibliotecas e Fluxo para o Frontend**

O frontend da aplicação **MyOMDB** foi projetado para ser modular, escalável e altamente reativo. Ele utiliza as tecnologias e bibliotecas mais modernas para criar uma interface amigável e responsiva.

---

### **Arquitetura do Frontend**
A aplicação segue uma estrutura baseada em componentes e é organizada para garantir separação de responsabilidades e facilidade de manutenção.

1. **Camadas Principais:**
   - **Componentes:** Contém os componentes de UI que são reutilizáveis, como botões, caixas de texto, e listas de filmes.
   - **Páginas:** Contém as telas principais da aplicação, como a página de busca de filmes, favoritos e detalhes.
   - **Stores (Gerenciamento de Estado):** Utiliza **MobX** para gerenciar o estado global da aplicação, incluindo informações de autenticação, busca de filmes e favoritos.
   - **Serviços:** Implementa abstrações para consumo de APIs externas (como a OMDb API) e para lidar com operações relacionadas à autenticação e gerenciamento de dados.
   - **Roteamento:** Configurado com **React Router** para navegar entre páginas como login, busca de filmes e favoritos.

2. **Estrutura de Pastas:**

```
src/
├── app/
│   ├── api/               # Serviços de integração com APIs externas e backend
│   ├── common/            # Componentes e utilitários reutilizáveis
│   │   ├── form/          # Componentes customizados para formulários
│   │   └── modals/        # Componentes de modais reutilizáveis
│   ├── layout/            # Componentes de layout global (e.g., App, NavBar)
│   ├── models/            # Interfaces e tipos para padronização de dados
│   ├── router/            # Configuração e gerenciamento de rotas
│   └── stores/            # MobX stores para estado global da aplicação
├── features/              # Módulos específicos de funcionalidades
│   ├── errors/            # Páginas e componentes para tratamento de erros
│   ├── favorites/         # Tela e lógica para gerenciamento de favoritos
│   ├── home/              # Página inicial da aplicação
│   ├── movies/            # Funcionalidades relacionadas à busca e exibição de filmes
│   └── users/             # Funcionalidades relacionadas à autenticação e gerenciamento de usuários
```

### **Detalhes sobre as Pastas**

1. **`app/`:** Contém configurações e funcionalidades globais da aplicação.
   - **`api/`:** Abstrações para chamadas de APIs, como integração com a OMDb API e endpoints do backend.
   - **`common/`:**
     - **`form/`:** Contém componentes customizados reutilizáveis para formulários, como `MyTextInput`.
     - **`modals/`:** Componentes para exibição de modais, utilizados em várias partes da aplicação.
   - **`layout/`:** Componentes principais do layout global, como `App.tsx` e `NavBar.tsx`.
   - **`models/`:** Define interfaces e tipos para garantir consistência de dados em toda a aplicação (e.g., `Movie`, `FavoriteMovie`).
   - **`router/`:** Configuração centralizada do roteamento utilizando React Router.
   - **`stores/`:** Stores do MobX para gerenciamento de estado global (e.g., `movieStore`, `userStore`).

2. **`features/`:** Módulos específicos para cada funcionalidade da aplicação.
   - **`errors/`:** Componentes e páginas para lidar com erros (e.g., `NotFound`, `ServerError`).
   - **`favorites/`:** Tela e lógica para exibir e gerenciar a lista de filmes favoritos.
   - **`home/`:** Página inicial da aplicação (exibida em `/`).
   - **`movies/`:** Funcionalidades relacionadas à busca, exibição de lista e detalhes de filmes.
   - **`users/`:** Gerenciamento de autenticação e usuários (e.g., `LoginForm`, `RegisterForm`).

---

### **Como a Estrutura Suporta a Arquitetura**

- **Modularidade:** Cada funcionalidade (como filmes ou favoritos) tem seu próprio módulo dentro de `features`, mantendo a lógica isolada.
- **Reutilização:** Componentes comuns e utilitários estão centralizados em `app/common`, facilitando o uso em diferentes partes do projeto.
- **Gerenciamento Centralizado:** O uso de `app/stores` para MobX garante que o estado global esteja bem organizado e acessível.

---

### **Bibliotecas Utilizadas**

#### **1. React**
- Framework principal para construção da interface do usuário.
- Utiliza **Hooks** como `useState`, `useEffect` e `useContext` para lidar com o estado e o ciclo de vida dos componentes.

#### **2. MobX**
- Biblioteca para gerenciamento de estado global.
- Utiliza **stores** para organizar o estado da aplicação (por exemplo, `movieStore`, `userStore`, etc.).
- Observa as mudanças de estado com o decorador `@observable` e propaga as mudanças para os componentes com o wrapper `observer`.

#### **3. React Router**
- Gerencia as rotas da aplicação e fornece navegação entre as páginas.
- Suporte a rotas privadas e protegidas (ex.: `/favorites` só acessível após login).
- Configuração principal das rotas no arquivo `Routes.tsx`.

#### **4. Material-UI (MUI)**
- Framework de componentes de interface para estilização.
- Componentes como `Button`, `TextField`, `Typography`, e `CircularProgress` são amplamente utilizados.
- Customização de temas e estilos globais para manter a identidade visual.

#### **5. Axios**
- Biblioteca para fazer requisições HTTP.
- Usado para interagir com o backend e a OMDb API.
- Configurado para adicionar tokens de autenticação em cabeçalhos automaticamente.

#### **6. React-Toastify**
- Biblioteca para exibir notificações amigáveis ao usuário.
- Usada para mensagens de sucesso (ex.: "Filme adicionado aos favoritos!") ou erro.

#### **7. Infinite Scroller**
- Biblioteca para implementação de carregamento infinito (scroll infinito).
- Utilizada na listagem de filmes, carregando mais dados à medida que o usuário rola a página.

#### **8. Formik e Yup**
- Gerenciamento e validação de formulários.
- **Formik:** Usado para lidar com os dados e eventos dos formulários.
- **Yup:** Validação dos campos de formulário com esquemas personalizáveis.

---

### **Fluxo do Frontend**

#### **1. Autenticação**
- O usuário realiza o login ou registro na aplicação.
- Após o login, o token JWT é armazenado no `localStorage` e no estado global.
- O frontend valida o token ao carregar a aplicação para determinar se o usuário está autenticado.

#### **2. Busca de Filmes**
- O usuário digita um título de filme na caixa de pesquisa e clica no botão **Search**.
- O texto da pesquisa é armazenado no estado (`searchQuery`).
- Uma requisição é feita para a OMDb API para buscar filmes relacionados.
- Os resultados são armazenados no `movieStore` e exibidos em uma lista.

#### **3. Carregamento Infinito**
- Na página de resultados, o usuário pode rolar para carregar mais filmes.
- A cada scroll, uma nova página de filmes é buscada na OMDb API.
- A biblioteca **Infinite Scroller** lida com os eventos de scroll.

#### **4. Favoritos**
- O usuário pode adicionar ou remover filmes da lista de favoritos.
- As ações disparam requisições para o backend (SQLite) para persistir as alterações.
- A lista de favoritos é armazenada no `favoriteStore` e exibida na página **Favorites**.

#### **5. Detalhes do Filme**
- O usuário pode clicar em um filme para ver seus detalhes.
- Os detalhes do filme são buscados pela OMDb API com base no `imdbId`.
- As informações incluem título, ano, gênero, diretor, atores e sinopse.

#### **6. Logout**
- O token é removido do `localStorage`.
- O estado global é resetado e o usuário é redirecionado para a página de login.

---

### **Componentes e Páginas Principais**

#### **1. MovieDashboard**
- Tela de busca de filmes.
- Inclui:
  - Campo de busca com botão de limpar (`X`).
  - Botão de pesquisa com carregamento (`loading`).
  - Exibição de resultados com scroll infinito.

#### **2. MovieDetails**
- Exibe informações detalhadas de um filme selecionado.
- Inclui:
  - Título, ano, gênero, atores, e outros detalhes.
  - Opção para adicionar ou remover dos favoritos.

#### **3. Favorites**
- Exibe a lista de filmes favoritos do usuário.
- Opções para remover filmes da lista.

#### **4. RegisterForm / LoginForm**
- Formulários para registro e login do usuário.
- Incluem validação de campos com **Yup** e exibição de mensagens de erro.

---

### **Pontos de Destaque**
1. **Modularidade e Reutilização:**
   - Componentes e lógica desacoplados para fácil manutenção.
2. **UX Melhorada:**
   - Notificações amigáveis, carregamento infinito e feedback visual (botão de busca com `CircularProgress`).
3. **Gerenciamento Centralizado:**
   - MobX fornece um estado reativo, reduzindo dependências diretas entre componentes.

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



