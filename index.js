//NAVBAR SCROLL ANIMATION
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.classList.add("nav-scroll-style");
  } else {
    navbar.classList.remove("nav-scroll-style");
  }

  lastScrollTop = Math.max(scrollTop, 0);
});

// SCROLL TO TOP BUTTON
const scrollBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
  const isNearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 200;

  scrollBtn.classList.toggle("show", isNearBottom);
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

//ON-SCROLL ANIMATIONS
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      // Animate skill bars
      if (entry.target.id === "skills-grid") {
        const skillBars = entry.target.querySelectorAll(".skill-progress-fill");
        skillBars.forEach((bar) => {
          bar.style.transition = "width 1s ease-in-out";
          bar.style.width = bar.dataset.width;
        });
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".scroll-animate").forEach((el) => observer.observe(el));

// SKILL BAR HOVER ANIMATION
document.querySelectorAll(".skill-item").forEach((item) => {
  item.addEventListener("mouseover", () => {
    const bar = item.querySelector(".skill-progress-fill");
    const targetWidth = bar.dataset.width;

    // Reset animation
    bar.style.transition = "none";
    bar.style.width = "0%";
    void bar.offsetWidth; // trigger reflow
    bar.style.transition = "width 0.8s ease-in-out";
    bar.style.width = targetWidth;
  });
});

//INTERACTIVE DOT BACKGROUND
const canvas = document.getElementById("dot-background");
const ctx = canvas.getContext("2d");
const mouse = { x: null, y: null };
let dots = [];

const dotConfig = {
  radius: 1.5,
  spacing: 40,
  hoverRadius: 200,
  baseColor: "rgba(0, 0, 0, 0.2)",
  hoverColor: "rgba(0, 0, 0, 0.6)",
};

// Mouse tracking
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener("mouseout", () => (mouse.x = mouse.y = null));

// Setup and draw
function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.getElementById("home").offsetHeight;

  dots = [];
  const cols = Math.floor(canvas.width / dotConfig.spacing);
  const rows = Math.floor(canvas.height / dotConfig.spacing);

  for (let i = 0; i < cols * rows; i++) {
    const x = (i % cols) * dotConfig.spacing + dotConfig.spacing / 2;
    const y = Math.floor(i / cols) * dotConfig.spacing + dotConfig.spacing / 2;
    dots.push({ x, y });
  }
}

function drawDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach((dot) => {
    const dx = mouse.x - dot.x;
    const dy = mouse.y - dot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dotConfig.radius, 0, Math.PI * 2);
    ctx.fillStyle =
      distance < dotConfig.hoverRadius
        ? dotConfig.hoverColor
        : dotConfig.baseColor;
    ctx.fill();
  });
}

function animate() {
  drawDots();
  requestAnimationFrame(animate);
}

// PROJECT TOGGLE BUTTON
const toggleBtn = document.getElementById("toggle-projects");
const extraProjects = document.querySelectorAll(".extra-project");
const icon = toggleBtn.querySelector("i");

toggleBtn.addEventListener("click", () => {
  const showingMore = toggleBtn.textContent.includes("More");

  extraProjects.forEach((proj) => proj.classList.toggle("hidden"));
  icon.classList.toggle("rotate-180");
  toggleBtn.textContent = showingMore ? "Show Less" : "More Projects";
  toggleBtn.appendChild(icon);
});

// DYNAMIC NAVBAR LINK HIGHLIGHT
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

const observerOptions = {
  rootMargin: "0px 0px -60% 0px",
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    // Get the navigation link corresponding to the section
    const id = entry.target.getAttribute("id");
    const navLink = document.querySelector(`nav a[href="#${id}"]`);

    if (entry.isIntersecting) {
      // remove the active class from all links
      navLinks.forEach((link) => {
        link.classList.remove("bg-white/90", "font-semibold", "text-black");
      });

      // add the active class to the correct one
      if (navLink) {
        navLink.classList.add("bg-white/90", "font-semibold", "text-black");
      }
    }
  });
}, observerOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

// showTgContact
const showTgContact = document.getElementsByClassName('showTgContact')[0];
const forShow1 = document.getElementsByClassName('forShow')[0];
const forShow2 = document.getElementsByClassName('forShow')[1];

const show = () => {
  showTgContact.classList.add('hide');
  forShow1.classList.remove('hide');
  forShow2.classList.remove('hide');
}

showTgContact.addEventListener('click', show);

//INITIALIZATION
setupCanvas();
animate();
window.addEventListener("resize", setupCanvas);