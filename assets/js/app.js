const variables = [
  { name: "region", placeholder: "AWS Region" },
  { name: "username", placeholder: "Username" },
  { name: "password", placeholder: "Password" },
  { name: "email", placeholder: "Email" },
  { name: "name", placeholder: "Full Name" },
  { name: "client_id", placeholder: "User pool client id" },
  { name: "identity_pool_id", placeholder: "Identity Pool ID" },
  { name: "identity_id", placeholder: "Identity ID" },
  { name: "access_token", placeholder: "Access Token" },
  { name: "id_token", placeholder: "ID Token" },
  { name: "confirmation_code", placeholder: "Confirmation Code" },
  { name: "user_pool_id", placeholder: "User Pool ID" },
  { name: "access_token", placeholder: "Access Token" },
];

const commandsUrl = "assets/commands.json";
let values = {};
let originalCommands = [];

function createInputs() {
  const container = document.getElementById("inputs");
  variables.forEach((v) => {
    const input = document.createElement("input");
    input.placeholder = v.placeholder;
    input.dataset.var = v.name;
    input.addEventListener("input", () => {
      values[v.name] = input.value;
      updateVars();
    });
    container.appendChild(input);
  });
}

function renderCards(data) {
  const cards = document.getElementById("cards");
  const nav = document.getElementById("nav-buttons");
  cards.innerHTML = "";
  nav.innerHTML = "";
  originalCommands = [];

  data.forEach((main, i) => {
    const navBtn = document.createElement("button");
    navBtn.className = "nav-btn";
    navBtn.innerText = main.title;
    navBtn.onclick = () =>
      document
        .getElementById(`main-${i}`)
        .scrollIntoView({ behavior: "smooth" });
    nav.appendChild(navBtn);

    const mainCard = document.createElement("div");
    mainCard.className = "card main-card";
    mainCard.id = `main-${i}`;

    let html = `<h2>${main.title}</h2><p>${main.subtitle}</p>`;
    if (main.command) html += createCommandBox(main.command);

    if (main.subcommands) {
      html += `<div class="sub-card-container">`;
      main.subcommands.forEach((sub) => {
        html += `
          <div class="sub-card">
            <h3>${sub.title}</h3>
            <p>${sub.subtitle}</p>
            ${createCommandBox(sub.command)}
          </div>`;
      });
      html += `</div>`;
    }

    mainCard.innerHTML = html;
    cards.appendChild(mainCard);
  });

  updateVars();
}

function createCommandBox(cmd) {
  const index = originalCommands.length;
  originalCommands.push(cmd);
  return `
    <div class="bash-box">
      <pre id="cmd-${index}" class="cmd-text">${cmd}</pre>
      <button class="copy-btn" id="btn-${index}" onclick="copyCommand(${index})">Copy</button>
    </div>`;
}

function updateVars() {
  originalCommands.forEach((template, i) => {
    let updated = template;
    Object.keys(values).forEach((key) => {
      updated = updated.replace(
        new RegExp(`{{${key}}}`, "g"),
        values[key] || `{{${key}}}`
      );
    });
    document.getElementById(`cmd-${i}`).innerText = updated;
  });
}

function copyCommand(i) {
  const text = document.getElementById(`cmd-${i}`).innerText.trim();
  navigator.clipboard.writeText(text);
  const btn = document.getElementById(`btn-${i}`);
  btn.innerText = "Copied!";
  btn.disabled = true;
  setTimeout(() => {
    btn.innerText = "Copy";
    btn.disabled = false;
  }, 1500);
}

createInputs();
fetch(commandsUrl)
  .then((r) => r.json())
  .then(renderCards);
