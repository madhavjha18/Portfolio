import { PROFILE } from "./profile.js";

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function ellipsizeEnd(text, maxChars) {
  const s = String(text || "");
  if (!maxChars || maxChars <= 0) return s;
  if (s.length <= maxChars) return s;
  if (maxChars <= 1) return "…";
  return `${s.slice(0, maxChars - 1)}…`;
}

function formatHandle(url) {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop() ?? "profile";
    return `@${last}`;
  } catch {
    return "set-me";
  }
}

function formatHandleShort(url, maxChars = 14) {
  return ellipsizeEnd(formatHandle(url), maxChars);
}

function formatEmailShort(email, maxLocal = 10) {
  const s = String(email || "").trim();
  const at = s.indexOf("@");
  if (at <= 0) return s;
  const local = s.slice(0, at);
  const domain = s.slice(at + 1);
  const localShort = local.length > maxLocal ? `${local.slice(0, Math.max(1, maxLocal - 1))}…` : local;
  return `${localShort}@${domain}`;
}

function setText(id, text) {
  const el = qs(id);
  if (el) el.textContent = text;
}

function setHref(id, href) {
  const el = qs(id);
  if (el) el.setAttribute("href", href);
}

function setLinkState(id, href) {
  const el = qs(id);
  if (!el) return;
  if (!href) {
    el.setAttribute("href", "#");
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("tabindex", "-1");
    el.classList.add("is-disabled");
    return;
  }
  el.setAttribute("href", href);
  el.removeAttribute("aria-disabled");
  el.removeAttribute("tabindex");
  el.classList.remove("is-disabled");
}

function toast(message) {
  let el = qs("#toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("is-in");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => el.classList.remove("is-in"), 1200);
}

async function copyText(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function mountProfile() {
  document.title = `${PROFILE.name} · Portfolio`;
  qs(".brand__text").textContent = PROFILE.name;
  qs(".hero .mono").textContent = PROFILE.name;

  const edu = `${PROFILE.education.school}\n${PROFILE.education.degree}\n${PROFILE.education.years}`;
  qs("#educationText").textContent = edu;

  const focus = qs("#focusList");
  focus.innerHTML = "";
  for (const item of PROFILE.focus) {
    const li = document.createElement("li");
    li.textContent = item;
    focus.appendChild(li);
  }

  const likes = qs("#likesList");
  likes.innerHTML = "";
  for (const item of PROFILE.likesBuilding) {
    const li = document.createElement("li");
    li.textContent = item;
    likes.appendChild(li);
  }

  const chips = qs("#heroChips");
  chips.innerHTML = "";
  for (const chip of PROFILE.heroChips) {
    const el = document.createElement("div");
    el.className = "chip";
    el.innerHTML = chip;
    chips.appendChild(el);
  }

  const gh = PROFILE.links.github;
  const li = PROFILE.links.linkedin;
  const lc = PROFILE.links.leetcode;
  const cf = PROFILE.links.codeforces;
  const gfg = PROFILE.links.gfg;
  const email = PROFILE.links.email;

  setLinkState("#linkGithub", gh);
  setLinkState("#contactGithub", gh);
  setText("#githubHandle", gh ? formatHandleShort(gh, 14) : "set-me");
  setText("#contactGithubText", gh ? formatHandleShort(gh, 16) : "set-me");

  setLinkState("#linkLinkedIn", li);
  setLinkState("#contactLinkedIn", li);
  setText("#linkedinHandle", li ? formatHandleShort(li, 14) : "set-me");
  setText("#contactLinkedInText", li ? formatHandleShort(li, 16) : "set-me");

  setLinkState("#linkLeetCode", lc);
  setLinkState("#contactLeetCode", lc);
  setText("#leetcodeHandle", lc ? formatHandleShort(lc, 14) : "set-me");
  setText("#contactLeetCodeText", lc ? formatHandleShort(lc, 16) : "set-me");

  setLinkState("#linkCodeforces", cf);
  setLinkState("#contactCodeforces", cf);
  setText("#codeforcesHandle", cf ? formatHandleShort(cf, 14) : "set-me");
  setText("#contactCodeforcesText", cf ? formatHandleShort(cf, 16) : "set-me");

  setLinkState("#linkGfg", gfg);
  setLinkState("#contactGfg", gfg);
  setText("#gfgHandle", gfg ? formatHandleShort(gfg, 14) : "set-me");
  setText("#contactGfgText", gfg ? formatHandleShort(gfg, 16) : "set-me");

  setLinkState("#linkEmail", email ? `mailto:${email}` : "");
  setLinkState("#contactEmail", email ? `mailto:${email}` : "");
  setText("#emailText", email ? formatEmailShort(email, 10) : "set-me");
  setText("#contactEmailText", email || "set-me");

  const copyBtn = qs("#copyEmailBtn");
  if (copyBtn) {
    if (!email) copyBtn.classList.add("is-disabled");
    else copyBtn.classList.remove("is-disabled");
  }

  const achievements = qs("#achievementsList");
  achievements.innerHTML = "";
  for (const item of PROFILE.achievements) {
    const liEl = document.createElement("li");
    liEl.textContent = item;
    achievements.appendChild(liEl);
  }

  const timeline = qs("#timeline");
  timeline.innerHTML = "";
  for (const exp of PROFILE.experience) {
    const box = document.createElement("div");
    box.className = "titem";
    box.innerHTML = `
      <div class="titem__head">
        <div class="titem__role">${exp.title}</div>
        <div class="titem__time">${exp.years}</div>
      </div>
      <div class="mono subtle">${exp.tagline}</div>
      <div class="divider"></div>
      <ul class="list">${exp.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
    `;
    timeline.appendChild(box);
  }

  const projects = qs("#projectsGrid");
  projects.innerHTML = "";
  for (const project of PROFILE.projects) {
    const card = document.createElement("article");
    card.className = "pcard";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${project.name} details`);
    card.dataset.project = project.id;
    card.innerHTML = `
      <div class="pcard__tag">${project.tag}</div>
      <div class="pcard__title">${project.name}</div>
      <p class="pcard__desc">${project.summary}</p>
      <div class="pcard__chips">
        ${project.tech.slice(0, 4).map((t) => `<span class="badge">${t}</span>`).join("")}
      </div>
    `;
    projects.appendChild(card);
  }

  const skills = qs("#skillsGrid");
  skills.innerHTML = "";
  for (const group of PROFILE.skills) {
    const box = document.createElement("div");
    box.className = "skillbox";
    box.innerHTML = `
      <div class="skillbox__title">
        <span>${group.label}</span>
        <span class="skillbox__pill">${group.hint}</span>
      </div>
      <div class="skillbox__items">
        ${group.items.map((s) => `<span class="badge">${s}</span>`).join("")}
      </div>
    `;
    skills.appendChild(box);
  }

  qs("#year").textContent = new Date().getFullYear().toString();
}

function mountReveals() {
  const items = qsa(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.16 },
  );

  for (const el of items) io.observe(el);
}

function mountHeaderProgress() {
  const header = qs(".header");
  const bar = qs(".progress__bar");
  const onScroll = () => {
    const y = window.scrollY || 0;
    header.dataset.elevate = y > 6 ? "true" : "false";
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = clamp((y / max) * 100, 0, 100);
    bar.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function mountNavSpy() {
  const links = qsa('[data-nav][href^="#"]');
  const targets = links
    .map((a) => qs(a.getAttribute("href")))
    .filter(Boolean)
    .map((el) => ({ el, id: el.id }));

  const linkById = new Map();
  for (const a of links) {
    const id = (a.getAttribute("href") || "").slice(1);
    linkById.set(id, a);
  }

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
      if (!visible) return;
      for (const a of links) a.removeAttribute("aria-current");
      const active = linkById.get(visible.target.id);
      if (active) active.setAttribute("aria-current", "true");
    },
    { threshold: [0.25, 0.5, 0.75] },
  );

  for (const t of targets) io.observe(t.el);
}

function mountCounters() {
  const els = qsa("[data-count]");
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        const goal = Number(el.getAttribute("data-count") || "0");
        const suffix = el.getAttribute("data-suffix") || "";
        const start = performance.now();
        const dur = motionOK ? 900 : 0;
        const from = 0;
        const step = (now) => {
          const t = dur === 0 ? 1 : clamp((now - start) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = Math.round(from + (goal - from) * eased);
          el.textContent = `${val}${suffix}`;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      }
    },
    { threshold: 0.6 },
  );
  for (const el of els) io.observe(el);
}

function mountMagnet() {
  if (!motionOK) return;
  const magnets = qsa(".magnet");
  for (const el of magnets) {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.transform = `translate3d(${x * 4}px, ${y * 4}px, 0)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  }
}

function mountTiltCards() {
  if (!motionOK) return;
  const cards = qsa(".pcard");
  const strength = 8;

  for (const card of cards) {
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = clamp((e.clientX - r.left) / r.width, 0, 1);
      const py = clamp((e.clientY - r.top) / r.height, 0, 1);
      const rx = (0.5 - py) * strength;
      const ry = (px - 0.5) * strength;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    };
    const reset = () => (card.style.transform = "");
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", reset);
    card.addEventListener("blur", reset);
  }
}

function mountProjectModal() {
  const modal = qs("#projectModal");
  const tag = qs("#modalTag");
  const title = qs("#modalTitle");
  const desc = qs("#modalDesc");
  const chips = qs("#modalChips");
  const bullets = qs("#modalBullets");

  function openProject(projectId) {
    const p = PROFILE.projects.find((x) => x.id === projectId);
    if (!p) return;

    tag.textContent = p.tag;
    title.textContent = p.name;
    desc.textContent = p.summary;
    chips.innerHTML = p.tech.map((t) => `<span class="badge">${t}</span>`).join("");
    bullets.innerHTML = p.bullets.map((b) => `<li>${b}</li>`).join("");

    if (typeof modal.showModal === "function") modal.showModal();
  }

  qs("#projectsGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".pcard");
    if (!card) return;
    openProject(card.dataset.project);
  });

  qs("#projectsGrid").addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".pcard");
    if (!card) return;
    e.preventDefault();
    openProject(card.dataset.project);
  });

  modal.addEventListener("click", (e) => {
    const dialog = e.currentTarget;
    const r = dialog.getBoundingClientRect();
    const inDialog =
      e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inDialog) dialog.close();
  });
}

function mountPalette() {
  const palette = qs("#palette");
  const list = qs("#paletteList");

  const items = [
    { label: "Home", hint: "#home", href: "#home" },
    { label: "About", hint: "#about", href: "#about" },
    { label: "Experience", hint: "#experience", href: "#experience" },
    { label: "Projects", hint: "#projects", href: "#projects" },
    { label: "Skills", hint: "#skills", href: "#skills" },
    { label: "Achievements", hint: "#achievements", href: "#achievements" },
    { label: "Contact", hint: "#contact", href: "#contact" },
  ];

  if (PROFILE.links.github) items.push({ label: "Open GitHub", hint: "↗", href: PROFILE.links.github });
  if (PROFILE.links.linkedin)
    items.push({ label: "Open LinkedIn", hint: "↗", href: PROFILE.links.linkedin });
  if (PROFILE.links.leetcode) items.push({ label: "Open LeetCode", hint: "↗", href: PROFILE.links.leetcode });
  if (PROFILE.links.codeforces)
    items.push({ label: "Open Codeforces", hint: "↗", href: PROFILE.links.codeforces });
  if (PROFILE.links.gfg) items.push({ label: "Open GeeksforGeeks", hint: "↗", href: PROFILE.links.gfg });
  if (PROFILE.links.email)
    items.push({ label: "Email", hint: PROFILE.links.email, href: `mailto:${PROFILE.links.email}` });

  list.innerHTML = "";
  for (const it of items) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pitem";
    btn.innerHTML = `<span class="pitem__k">${it.label}</span><span class="pitem__v">${it.hint}</span>`;
    btn.addEventListener("click", () => {
      palette.close();
      navigateTo(it.href);
    });
    list.appendChild(btn);
  }

  function open() {
    if (typeof palette.showModal === "function") palette.showModal();
  }

  qs("#openPalette").addEventListener("click", open);

  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === "k") {
      e.preventDefault();
      open();
    }
    if (k === "escape" && palette.open) palette.close();
  });
}

function navigateTo(href) {
  if (!href) return;
  if (/^https?:\/\//.test(href) || href.startsWith("mailto:")) {
    window.open(href, "_blank", "noreferrer");
    return;
  }
  const id = href.startsWith("#") ? href : `#${href}`;
  const target = qs(id);
  if (!target) return;

  const doScroll = () => target.scrollIntoView({ behavior: motionOK ? "smooth" : "auto", block: "start" });
  if (motionOK && "startViewTransition" in document) {
    // eslint-disable-next-line no-undef
    document.startViewTransition(() => doScroll());
  } else {
    doScroll();
  }
}

function mountNavClicks() {
  for (const a of qsa('[data-nav][href^="#"]')) {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(a.getAttribute("href"));
    });
  }
}

function mountCursor() {
  if (!motionOK) return;
  const cursor = qs(".cursor");
  let x = -100;
  let y = -100;
  let tx = -100;
  let ty = -100;

  window.addEventListener(
    "mousemove",
    (e) => {
      x = e.clientX;
      y = e.clientY;
    },
    { passive: true },
  );

  const tick = () => {
    tx += (x - tx) * 0.18;
    ty += (y - ty) * 0.18;
    cursor.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const hoverTargets = ["a", "button", ".pcard", ".pill", ".rowlink"];
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets.join(","))) cursor.style.opacity = "1";
  });
}

function mountBackground() {
  if (!motionOK) return;
  const canvas = qs("#bg");
  const ctx = canvas.getContext("2d", { alpha: true });

  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let w = 0;
  let h = 0;
  let particles = [];

  function resize() {
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = clamp(Math.floor((w * h) / 22000), 26, 70);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 1.4,
    }));
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    // Move
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -40) p.x = w + 40;
      if (p.x > w + 40) p.x = -40;
      if (p.y < -40) p.y = h + 40;
      if (p.y > h + 40) p.y = -40;
    }

    // Links
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        const max = 130;
        if (dist > max) continue;
        const alpha = 1 - dist / max;
        ctx.strokeStyle = `rgba(110, 231, 255, ${alpha * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Dots
    for (const p of particles) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

function mountContactForm() {
  const form = qs("#contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const to = PROFILE.links.email || "";
    const subject = encodeURIComponent(`Portfolio: ${name}`);
    const body = encodeURIComponent(
      `Hi Madhav,\n\n${message}\n\n— ${name}\n${email}\n`,
    );
    const href = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = href;
  });
}

function mountCopyEmail() {
  const btn = qs("#copyEmailBtn");
  if (!btn) return;
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyText(PROFILE.links.email || "");
    toast(ok ? "Email copied" : "Copy failed");
  });
}

mountProfile();
mountReveals();
mountHeaderProgress();
mountNavSpy();
mountCounters();
mountMagnet();
mountNavClicks();
mountTiltCards();
mountProjectModal();
mountPalette();
mountCursor();
mountBackground();
mountContactForm();
mountCopyEmail();
