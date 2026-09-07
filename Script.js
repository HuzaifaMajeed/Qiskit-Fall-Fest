const CONFIG = {
  // ---- Registration Google Form URL ----
  registrationURL: "", 


  countdownDate: "2026-10-27T09:00:00",

  // ---- Registration Deadline ----
  registrationDeadline: "2026-10-20T23:59:59",

  eventEndDate: "2026-10-29T00:00:00",

  venueName: "MSL004 & MSL005",
  venueAddress:
    "T. W. Kambule Mathematical Sciences Building, Braamfontein Campus West, Wits University",
  venueLatitude: -26.19053,
  venueLongitude: 28.02675,
  venueZoom: 15,
  googleMapsURL: "https://www.google.com/maps?q=-26.19053,28.02675",
};


function setupRegistrationButtons() {
  const buttons = [
    document.getElementById("nav-register-btn"),
    document.getElementById("mobile-register-btn"),
    document.getElementById("hero-register-btn"),
    document.getElementById("sidebar-register-btn"),
  ];

  const deadline = new Date(CONFIG.registrationDeadline).getTime();
  const isClosed = Date.now() >= deadline;

  const badge = document.querySelector(".animate-pulse")?.parentElement;
  if (badge && isClosed) {
    badge.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-red-500"></span>
      Registration Closed
    `;
    badge.classList.remove("border-qk-purple/20", "text-qk-purple");
    badge.classList.add("border-red-300", "text-red-600");
  }

  buttons.forEach((btn) => {
    if (!btn) return;
    if (isClosed) {
      btn.textContent = "Registration Closed";
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
      btn.addEventListener("click", (e) => e.preventDefault());
    } else {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (CONFIG.registrationURL) {
          window.open(CONFIG.registrationURL, "_blank");
        } else {
          alert("Registration link coming soon!");
        }
      });
    }
  });
}



function startCountdown() {
  const target = new Date(CONFIG.countdownDate).getTime();
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minsEl = document.getElementById("countdown-mins");
  const secsEl = document.getElementById("countdown-secs");

  function update() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      const endDate = new Date(CONFIG.eventEndDate).getTime();
      const isPast = now >= endDate;

      const container = daysEl.closest(".grid");
      if (container) {
        container.innerHTML = isPast
          ? `<div class="col-span-4 card-glass p-6 rounded-xl text-center shadow-lg">
               <div class="font-mono text-[24px] font-bold text-qk-purple">
                 Event was Successful!
               </div>
               <p class="text-qk-navy-mid text-sm mt-2">Thank you to everyone who participated.</p>
             </div>`
          : `<div class="col-span-4 card-glass p-6 rounded-xl text-center shadow-lg border border-qk-purple/20">
               <div class="font-mono text-[24px] font-bold text-qk-purple">
                 Event is Live!
               </div>
             </div>`;
      }
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, "0");
    hoursEl.textContent = String(h).padStart(2, "0");
    minsEl.textContent = String(m).padStart(2, "0");
    secsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}


function setupAgendaTabs() {
  const tabs = document.querySelectorAll(".agenda-tab");
  const panels = document.querySelectorAll(".agenda-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.day);
      if (target) target.classList.add("active");
    });
  });
}


function setupMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const icon = toggle.querySelector(".material-symbols-outlined");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    menu.classList.toggle("open");
    icon.textContent = isOpen ? "menu" : "close";
    toggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      icon.textContent = "menu";
    });
  });
}


function setupScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("[data-nav]");

  function onScroll() {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}


function setupMap() {
  const container = document.getElementById("map-container");
  if (!container || typeof L === "undefined") return;

  const map = L.map(container, {
    center: [CONFIG.venueLatitude, CONFIG.venueLongitude],
    zoom: CONFIG.venueZoom,
    zoomControl: false,
    attributionControl: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 19,
  }).addTo(map);

  const markerIcon = L.divIcon({
    className: "",
    html: `<div style="
      width: 28px; height: 28px;
      background: #6B4EAA;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(107,78,170,0.4);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  L.marker([CONFIG.venueLatitude, CONFIG.venueLongitude], { icon: markerIcon })
    .addTo(map)
    .bindPopup(`<b>${CONFIG.venueName}</b><br>${CONFIG.venueAddress}`);

  const nameEl = document.getElementById("venue-name");
  const addressEl = document.getElementById("venue-address");
  const gmapsLink = document.getElementById("gmaps-link");

  if (nameEl) nameEl.textContent = CONFIG.venueName;
  if (addressEl) addressEl.textContent = CONFIG.venueAddress;
  if (gmapsLink) {
    if (CONFIG.googleMapsURL) {
      gmapsLink.href = CONFIG.googleMapsURL;
    } else {
      gmapsLink.href = `https://www.google.com/maps?q=${CONFIG.venueLatitude},${CONFIG.venueLongitude}`;
    }
  }
}

function setupOrganizerDots() {
  const container = document.querySelector(".scrollbar-hide");
  const dots = document.querySelectorAll(".scroll-dot");
  if (!container || !dots.length) return;

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.dataset.index);
      const card = container.children[index];
      if (card) {
        container.scrollTo({
          left: card.offsetLeft - container.offsetLeft,
          behavior: "smooth",
        });
      }
    });
  });

  container.addEventListener(
    "scroll",
    () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.children[0].offsetWidth + 24; // 24 = gap-6
      const active = Math.round(scrollLeft / cardWidth);

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === active);
      });
    },
    { passive: true },
  );
}


document.addEventListener("DOMContentLoaded", () => {
  setupRegistrationButtons();
  startCountdown();
  setupAgendaTabs();
  setupMobileMenu();
  setupScrollSpy();
  setupMap();
  setupOrganizerDots();
});
