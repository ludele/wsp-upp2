const fs = require("fs").promises;
const templatePath = "./templates/index.maru";
const characterHandler = require("./routeHandlers/characterHandler");
const discussionHandler = require("./routeHandlers/discussionHandler");

function generateRouteList() {
  let lis = "";

  const routes = [
    { name: "Characters", url: "/characters" },
    { name: "Discussion", url: "/discussion" },
  ];

  routes.forEach((route) => {
    lis += `<li><a href="${route.url}">${route.name}</a></li>`;
  });

  return lis;
}

exports.generateRouteList = generateRouteList;

exports.handleRoute = async function (pathSegments, request, response) {
  function statusCodeResponse(code, value, type) {
    response.writeHead(code, { 'Content-Type': `${type}` });
    response.write(value);
    response.end();
  }

  if (pathSegments.length === 0) {
    const template = (await fs.readFile(templatePath)).toString();
    const routeList = generateRouteList();
    const templateWithRoutes = template.replace("%profiles%", routeList);

    statusCodeResponse(200, templateWithRoutes, "text/html");
    return;
  }

  let seg = pathSegments.shift();
  switch (seg) {
    case "characters":
      characterHandler.handleCharacterRoute(pathSegments, request, response);
      break;
    case "discussion":
      discussionHandler.handleDiscussionRoute(request, response);
      break;
    case "":
      break;
    default:
      statusCodeResponse(404, "404 Not Found", "text/plain");
      break;
  }
};
