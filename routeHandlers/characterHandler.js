const fs = require("fs").promises;

const templatePath = "./templates/character.maru";
const templateList = "./templates/template-list.maru";

let judyHopps = {
  name: 'Judy Hopps',
  species: 'rabbit',
  gender: 'F',
  occupation: 'police officer',
  personalityTraits: [
    'energetic', 'overconfident', 'perky', 'heroic', 'self-righteous',
    'optimistic', 'intelligent', 'persistent', 'ambitious', 'enthusiastic',
    'diligent', 'idealistic', 'loyal', 'selfless', 'caring', 'forgiving', 'courageous'
  ],
  url: '/characters/judy-hopps'
};

let leodoreLionheart = {
  name: 'Leodore Lionheart',
  species: 'lion',
  gender: 'M',
  occupation: 'mayor',
  personalityTraits: [
    'charismatic', 'prideful', 'blustery', 'commanding', 'gruff', 'practical',
    'intelligent', 'noble', 'inspiring', 'occasionally sarcastic', 'somewhat smarmy',
    'pompous', 'dismissive', 'neglectful'
  ],
  url: '/characters/leodore-lionheart'
};

function applyTraitsToTemplate(character, template) {
  Object.keys(character).forEach((trait) => {
    if (trait === 'personalityTraits') {
      let traitsList = character[trait].map(trait => `<li>${trait}</li>`).join('');
      template = ReplaceTemplate(trait, traitsList, template);
    } else {
      template = ReplaceTemplate(trait, character[trait], template);
    }
  });

  return template;
}

exports.handleCharacterRoute = async function (pathSegments, request, response) {

  function statusCodeResponse(code, value, type) {
    response.writeHead(code, { 'Content-Type': `${type}` });
    response.write(value);
    response.end();
  }

  function ReplaceTemplate(placeholder, newValue, template) {
    return template.replaceAll(`%${placeholder}%`, `${newValue}`);
  }

  if (pathSegments.length === 0) {
    let template = (await fs.readFile(templateList)).toString();
    let lis = "";

    [judyHopps, leodoreLionheart].forEach((character) => {
      lis += `<li><a href="${character.url}">${character.name}</a></li>`;
    });

    template = ReplaceTemplate('profiles', lis, template);

    statusCodeResponse(200, template, "text/html");
    return;
  }

  let seg = pathSegments.shift();
  let template = (await fs.readFile(templatePath)).toString();



  switch (seg) {
    case "judy-hopps":
      Object.keys(judyHopps).forEach((trait) => {
        if (trait === 'personalityTraits') {
          let traitsList = judyHopps[trait].map(trait => `<li>${trait}</li>`).join('');
          template = ReplaceTemplate(trait, traitsList, template);
        } else {
          template = ReplaceTemplate(trait, judyHopps[trait], template);
        }
      });
      break;
    case "leodore-lionheart":
      Object.keys(leodoreLionheart).forEach((trait) => {
        if (trait === 'personalityTraits') {
          let traitsList = leodoreLionheart[trait].map(trait => `<li>${trait}</li>`).join('');
          template = ReplaceTemplate(trait, traitsList, template);
        } else {
          template = ReplaceTemplate(trait, leodoreLionheart[trait], template);
        }
      });
      break;
    default:
      statusCodeResponse(404, "404 Not Found", "text/plain");
      return;
  }

  statusCodeResponse(200, template, "text/html");
};
