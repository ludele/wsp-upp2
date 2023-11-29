const http = require("http");
const routeHandler = require("./routeHandler");
const { serveFile } = require("./fileServer"); 

const port = "3000";

async function handleRequest(request, response) {
  const url = new URL(request.url, "https://" + request.headers.host);
  const path = url.pathname;
  const pathSegments = path.split("/").filter(function (element) {
    return element !== "";
  });

  if (path.startsWith("/public/")) {
    await serveFile(request, response);
    return;
  }

  await routeHandler.handleRoute(pathSegments, request, response);
}

const app = http.createServer(handleRequest);

app.listen(port);
console.log(`Listening to ${port}`);
