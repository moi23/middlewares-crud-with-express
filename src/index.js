const express = require("express");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());

/** METODOS HTTP:
 *
 *  GET : PARA BUSCAR ALGO
 *  POST : PARA ADICIONAR ALGO
 *  PUT / PATCH : PARA ALTERAR ALGO
 *  DELETE : PARA DELETAR ALGO
 */

/** TIPOS DE PARÂMETROS
 *
 * QUERY PARAMS: Filtros & Paginação
 * ROUTE PARAMS: Identificar e Atualizar ou Deletar
 * REQUEST BODY: Conteúdo na hora de criar ou
 * editar (aquele json que o data usa JSON)
 *
 */

/**
 * Middleware:
 *
 * Interceptador de requisições que pode interromper a requisição
 * ou alterar os dados da requisição
 */

// Memoria/ Estado
const projects = [];

//Example - Middleware
function logRequest(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);

  return next(); // chamando o próximo middleware
}
//chamando o Middleware
app.use(logRequest);

// LISTAR APENAS
app.get("/projects", (request, response) => {
  // const query = request.query;
  const { title, owner } = request.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;

  return response.json(projects);
});

// CRIAR APENAS
app.post("/projects", (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuid(), title, owner };

  projects.push(project);
  return response.json(project);
});

// ALTERAR APENAS
app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  // .findIndex() percorre o id e vai comparando se alguma posição
  // é igual ao id acima se algum for ele retorna true

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found :(" });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

// DELETAR APENAS
app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found :(" });
  }

  //splice() ele retira um indice do array
  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("Your Service it is online on port *3333* xD");
});
