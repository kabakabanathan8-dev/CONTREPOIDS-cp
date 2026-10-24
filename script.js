// CONTREPOIDS Agency & Print — comportement du site
const WHATSAPP_NUMBER = "243829603023";

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

function setMenu(open) {
  if (!nav || !menuToggle) return;
  nav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
}

menuToggle?.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav?.classList.contains("open")) {
    setMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener("click", (e) => {
  if (nav?.classList.contains("open") && !nav.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
});

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Met en évidence la section visible dans le menu.
const sections = ["services", "commande", "apropos", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
if ("IntersectionObserver" in window && sections.length) {
  const links = new Map([...nav.querySelectorAll("a[href^='#']")].map((a) => [a.getAttribute("href").slice(1), a]));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove("active"));
        const active = links.get(entry.target.id);
        if (active && !active.classList.contains("nav-cta")) active.classList.add("active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
}

// Préremplit le service quand le visiteur clique sur « Demander ».
const serviceSelect = document.getElementById("service");
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const wanted = (link.dataset.service || "").toLowerCase();
    const match = [...serviceSelect.options].find((o) => o.text.toLowerCase() === wanted);
    if (match) {
      serviceSelect.value = match.value;
      serviceSelect.removeAttribute("aria-invalid");
      document.getElementById("err-service").hidden = true;
    }
  });
});

// Formulaire : vérifie les champs, puis ouvre WhatsApp avec le message préparé.
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

function checkField(id, errId, valid) {
  const field = document.getElementById(id);
  const err = document.getElementById(errId);
  field.setAttribute("aria-invalid", String(!valid));
  if (valid) field.removeAttribute("aria-describedby");
  else field.setAttribute("aria-describedby", errId);
  err.hidden = valid;
  return valid;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const service = String(data.get("service") || "").trim();
  const message = String(data.get("message") || "").trim();

  const results = [
    checkField("name", "err-name", name.length >= 2),
    checkField("service", "err-service", service.length > 0),
    checkField("message", "err-message", message.length >= 5),
  ];
  if (results.includes(false)) {
    status.textContent = "Complétez les champs signalés, puis réessayez.";
    form.querySelector("[aria-invalid='true']")?.focus();
    return;
  }

  const text = [
    "Bonjour CONTREPOIDS Agency & Print,",
    "",
    "Je souhaite un devis / des informations.",
    `Nom : ${name}`,
    phone ? `Téléphone : ${phone}` : "",
    `Service : ${service}`,
    `Besoin : ${message}`,
    "",
    "Merci.",
  ].filter((line, i, arr) => line !== "" || arr[i - 1] !== "").join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const popup = window.open(url, "_blank", "noopener,noreferrer");

  status.textContent = "";
  if (popup) {
    status.textContent = "WhatsApp s'ouvre avec votre message. Appuyez sur Envoyer pour terminer.";
  } else {
    // Si le navigateur bloque l'ouverture, on propose un lien direct.
    status.append("Votre navigateur a bloqué l'ouverture. ");
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Ouvrir WhatsApp";
    status.append(a);
  }
});

["name", "message"].forEach((id) => {
  document.getElementById(id)?.addEventListener("input", (e) => {
    const min = id === "name" ? 2 : 5;
    if (e.target.value.trim().length >= min) checkField(id, `err-${id}`, true);
  });
});
serviceSelect?.addEventListener("change", () => {
  if (serviceSelect.value) checkField("service", "err-service", true);
});
