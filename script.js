/* Terminal Portfolio by Ish
   - Commands: help, about, skills, projects, contact, ls, theme, clear, exit
   - Extras: command history (↑ ↓), typewriter, modal project details, theme persist, status clock
*/

// ====== Data ======
const PROFILE = {
  name: "Ishtiyaaq Rajah",
  role: "Web Developer & Ethical Hacker",
  location: "Potchefstroom, South Africa",
  email: "i.rajah@outlook.com",
  website: "https://example.com",
  github: "https://github.com/rajah09sa",
  linkedin: "https://www.linkedin.com/in/ish",
  about: [
    "I build secure, performant web applications and break things (ethically) to make them stronger.",
    "My focus: full-stack JavaScript, threat modeling, secure code reviews, and red-team informed development.",
    "I care about clean architecture, test coverage, and practical defenses like input validation and least privilege."
  ],
  skills: {
    dev: ["HTML", "CSS", "JavaScript", "TypeScript", "Node.js", "React", "Next.js", "Express", "PostgreSQL", "MongoDB"],
    security: ["OWASP Top 10", "Threat Modeling", "SAST/DAST", "Burp Suite", "Nmap", "Wireshark", "Metasploit", "Kali Linux"],
    practices: ["Secure SDLC", "CI/CD", "Docker", "Terraform basics", "Zero Trust principles", "Blue/Red collaboration"]
  },
  projects: [
    {
      id: "recon-suite",
      name: "Recon Suite",
      tags: ["Security", "Automation", "Node.js"],
      summary: "CLI toolkit automating recon (subdomains, ports, tech stack) with safe rate limits.",
      details: "Built with Node.js and async pipelines; integrates Nmap, httpx, and custom parsers; exports JSON for triage.",
      link: "https://github.com/ish/recon-suite"
    },
    {
      id: "secure-notes",
      name: "Secure Notes",
      tags: ["Web", "Crypto", "React"],
      summary: "End-to-end encrypted notes app with WebCrypto, zero-knowledge design.",
      details: "React + IndexedDB, passphrase-derived keys (PBKDF2), AES-GCM; comprehensive threat model and unit tests.",
      link: "https://github.com/ish/secure-notes"
    },
    {
      id: "bug-bounty-playbook",
      name: "Bug Bounty Playbook",
      tags: ["Docs", "Security"],
      summary: "Structured checklists for common web vulns, payload banks, and reporting templates.",
      details: "Organized by OWASP categories; includes safe reproduction steps and remediation guidance.",
      link: "https://github.com/ish/bug-bounty-playbook"
    }
  ]
};

// ====== Elements ======
const screenEl = document.getElementById("screen");
const promptForm = document.getElementById("prompt");
const promptInput = document.getElementById("prompt-input");
const btnTheme = document.getElementById("btn-theme");
const btnClear = document.getElementById("btn-clear");
const btnHelp = document.getElementById("btn-help");
const statusTime = document.getElementById("status-time");

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

// ====== State ======
let history = [];
let historyIndex = -1;

// ====== Utilities ======
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function setTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
}

function printLine(text = "", options = {}) {
  const { prefix = "", classes = "" } = options;
  const line = document.createElement("div");
  line.className = `line ${classes}`;
  const pre = document.createElement("span");
  pre.className = "prefix";
  pre.textContent = prefix;
  const content = document.createElement("span");
  content.className = "content";
  content.textContent = text;
  if (prefix) line.appendChild(pre);
  line.appendChild(content);
  screenEl.appendChild(line);
  screenEl.scrollTop = screenEl.scrollHeight;
}

async function typeLines(lines, delay = 18, prefix = "") {
  for (const text of lines) {
    const line = document.createElement("div");
    line.className = "line";
    const pre = document.createElement("span");
    pre.className = "prefix";
    pre.textContent = prefix;
    const content = document.createElement("span");
    content.className = "content";
    line.appendChild(pre);
    line.appendChild(content);
    screenEl.appendChild(line);
    screenEl.scrollTop = screenEl.scrollHeight;

    // typewriter
    for (let i = 0; i <= text.length; i++) {
      content.textContent = text.slice(0, i);
      await sleep(delay);
    }
  }
}

function formatList(label, items) {
  const maxLen = items.reduce((m, s) => Math.max(m, s.length), 0);
  return [
    `> ${label}:`,
    ...items.map((s) => `  - ${s}`)
  ];
}

function ls() {
  const dirs = ["about", "skills", "projects", "contact"];
  return [
    "total 4",
    ...dirs.map((d) => d)
  ];
}

function banner() {
  const lines = [
    "┌───────────────────────────────────────────────────────────┐",
    "│  Ish — Web Developer & Ethical Hacker                     │",
    "│  Type 'help' to get started.                              │",
    "└───────────────────────────────────────────────────────────┘"
  ];
  const div = document.createElement("div");
  div.className = "banner";
  div.setAttribute("aria-label", "Boot banner");
  div.textContent = lines.join("\n");
  screenEl.appendChild(div);
}

function openProjectModal(project) {
  modalTitle.textContent = project.name;
  modalBody.innerHTML = `
    <p><strong>Tags:</strong> ${project.tags.join(", ")}</p>
    <p>${project.details}</p>
    <p><a class="link" href="${project.link}" target="_blank" rel="noopener noreferrer">View repository</a></p>
  `;
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    // Fallback for old browsers: print to screen
    printLine(`[modal unsupported] ${project.name} — ${project.details}`);
  }
}

function timeString() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

// ====== Commands ======
const COMMANDS = {
  help: async () => {
    const lines = [
      "Available commands:",
      "  help         List commands",
      "  about        Who I am",
      "  skills       Tech & security stack",
      "  projects     Selected work",
      "  contact      Get in touch",
      "  ls           List sections",
      "  theme        Toggle dark/light theme",
      "  clear        Clear terminal",
      "  exit         Close prompt (disable input)"
    ];
    await typeLines(lines, 10, "");
  },

  about: async () => {
    await typeLines([
      `Name: ${PROFILE.name}`,
      `Role: ${PROFILE.role}`,
      `Location: ${PROFILE.location}`,
      "",
      ...PROFILE.about
    ], 10);
  },

  skills: async () => {
    const lines = [
      ...formatList("Development", PROFILE.skills.dev),
      "",
      ...formatList("Security", PROFILE.skills.security),
      "",
      ...formatList("Practices", PROFILE.skills.practices)
    ];
    await typeLines(lines, 10);
  },

  projects: async () => {
    for (const p of PROFILE.projects) {
      await typeLines([
        `• ${p.name}`,
        `  - ${p.summary}`,
        `  - tags: ${p.tags.join(", ")}`,
        `  - more: project ${p.id}`
      ], 10);
      await sleep(50);
    }
    printLine("Tip: type project <id> to open details.");
  },

  contact: async () => {
    await typeLines([
      `Email: ${PROFILE.email}`,
      `Website: ${PROFILE.website}`,
      `GitHub: ${PROFILE.github}`,
      `LinkedIn: ${PROFILE.linkedin}`
    ], 10);
  },

  ls: async () => {
    await typeLines(ls(), 5);
  },

  theme: async () => {
    toggleTheme();
    printLine(`Theme: ${document.documentElement.getAttribute("data-theme")}`);
  },

  clear: async () => {
    screenEl.innerHTML = "";
    banner();
  },

  exit: async () => {
    promptInput.disabled = true;
    printLine("Prompt disabled. Refresh page or type 'enable' to re-activate.");
  },

  enable: async () => {
    promptInput.disabled = false;
    printLine("Prompt enabled.");
  },

  // dynamic: project <id>
  project: async (id) => {
    const proj = PROFILE.projects.find((p) => p.id === id);
    if (!proj) {
      printLine(`Project not found: ${id}`, { prefix: "error: " });
      return;
    }
    openProjectModal(proj);
  }
};

// ====== Input handling ======
function parseCommand(raw) {
  const text = raw.trim();
  if (!text) return null;
  const parts = text.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  return { cmd, args, raw: text };
}

async function execute({ cmd, args, raw }) {
  // echo the command
  printLine(raw, { prefix: "ish@portfolio$ " });

  if (cmd in COMMANDS) {
    await COMMANDS[cmd](...args);
  } else if (cmd === "project" && args.length) {
    await COMMANDS.project(args[0]);
  } else {
    printLine(`Command not found: ${cmd}. Type 'help'.`, { prefix: "error: " });
  }
}

// ====== History navigation ======
function onHistoryNav(e) {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (history.length === 0) return;
    historyIndex = Math.max(0, historyIndex - 1);
    promptInput.value = history[historyIndex] || "";
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (history.length === 0) return;
    historyIndex = Math.min(history.length, historyIndex + 1);
    promptInput.value = historyIndex >= history.length ? "" : (history[historyIndex] || "");
  }
}

// ====== Boot ======
function boot() {
  // theme
  const saved = localStorage.getItem("theme");
  setTheme(saved || "dark");

  // banner
  banner();

  // greeting
  typeLines([
    `Welcome, ${PROFILE.name}.`,
    `You are in a safe, simulated terminal. No commands run on your real system.`,
    `Start with 'help'.`
  ], 12);

  // focus prompt
  promptInput.focus();

  // status clock
  statusTime.textContent = timeString();
  setInterval(() => statusTime.textContent = timeString(), 30_000);
}

// ====== Events ======
promptForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const parsed = parseCommand(promptInput.value);
  if (!parsed) return;

  // add to history
  history.push(parsed.raw);
  historyIndex = history.length;

  // clear input
  promptInput.value = "";

  // execute
  await execute(parsed);
});

promptInput.addEventListener("keydown", onHistoryNav);

btnTheme.addEventListener("click", () => COMMANDS.theme());
btnClear.addEventListener("click", () => COMMANDS.clear());
btnHelp.addEventListener("click", () => COMMANDS.help());

modalClose.addEventListener("click", () => {
  if (typeof modal.close === "function") modal.close();
});

// Close modal on Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && typeof modal.close === "function" && modal.open) {
    modal.close();
  }
});

// Click backdrop to close dialog
modal.addEventListener("click", (e) => {
  const rect = modal.getBoundingClientRect();
  const inDialog = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inDialog && typeof modal.close === "function") modal.close();
});

// Allow clicking on screen to focus prompt
screenEl.addEventListener("click", () => promptInput.focus());

// Init
boot();