// Navbar scroll animation
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.classList.add("nav-hidden");
  } else {
    navbar.classList.remove("nav-hidden");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

const scrollBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
  const scrolledToBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

  if (scrolledToBottom) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// On-scroll animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        // CHANGE: Added logic to animate skill bars when they become visible.
        if (entry.target.id === "skills-grid") {
          const skillBars = entry.target.querySelectorAll(
            ".skill-progress-fill"
          );
          skillBars.forEach((bar) => {
            // Add transition class via JS to ensure it animates on scroll
            bar.style.transition = "width 1s ease-in-out";
            bar.style.width = bar.dataset.width;
          });
        }
      }
    });
  },
  {
    threshold: 0.2, // A bit more of the section should be visible before animating
  }
);

const targets = document.querySelectorAll(".scroll-animate");
targets.forEach((target) => {
  observer.observe(target);
});

// CHANGE: Added hover animation for the new skills section.
document.querySelectorAll(".skill-item").forEach((item) => {
  item.addEventListener("mouseover", () => {
    const bar = item.querySelector(".skill-progress-fill");
    const targetWidth = bar.dataset.width;

    // Temporarily remove transition for an instant reset to 0%
    bar.style.transition = "none";
    bar.style.width = "0%";

    // This is a trick to force the browser to repaint, making the reset happen instantly
    void bar.offsetWidth;

    // Re-apply the transition and animate to the target width
    bar.style.transition = "width 0.8s ease-in-out";
    bar.style.width = targetWidth;
  });
});

// Interactive dot background (No Changes)
const canvas = document.getElementById("dot-background");
const ctx = canvas.getContext("2d");
let mouse = { x: null, y: null };

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

let dots = [];
const dotConfig = {
  count: 0,
  radius: 1.5,
  spacing: 40,
  hoverRadius: 200,
  baseColor: "rgba(0, 0, 0, 0.2)",
  hoverColor: "rgba(0, 0, 0, 0.6)",
};

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.getElementById("home").offsetHeight;
  dots = [];
  const cols = Math.floor(canvas.width / dotConfig.spacing);
  const rows = Math.floor(canvas.height / dotConfig.spacing);
  dotConfig.count = cols * rows;
  for (let i = 0; i < dotConfig.count; i++) {
    const x = (i % cols) * dotConfig.spacing + dotConfig.spacing / 2;
    const y = Math.floor(i / cols) * dotConfig.spacing + dotConfig.spacing / 2;
    dots.push({ x, y });
  }
}

function drawDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach((dot) => {
    let dx = mouse.x - dot.x;
    let dy = mouse.y - dot.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dotConfig.radius, 0, Math.PI * 2, false);
    if (distance < dotConfig.hoverRadius) {
      ctx.fillStyle = dotConfig.hoverColor;
    } else {
      ctx.fillStyle = dotConfig.baseColor;
    }
    ctx.fill();
  });
}

function animate() {
  drawDots();
  requestAnimationFrame(animate);
}

const toggleBtn = document.getElementById("toggle-projects");
const extraProjects = document.querySelectorAll(".extra-project");
const icon = toggleBtn.querySelector("i");

toggleBtn.addEventListener("click", () => {
  extraProjects.forEach((proj) => proj.classList.toggle("hidden"));
  icon.classList.toggle("rotate-180");
  toggleBtn.textContent = toggleBtn.textContent.includes("More")
    ? "Show Less"
    : "More Projects";
  toggleBtn.appendChild(icon);
});

// Dynamic navbar active link highlight
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // remove active style from all
        navLinks.forEach((link) => {
          link.classList.remove("bg-white/90", "font-semibold", "text-black");
        });

        // add active style to the current one
        const activeLink = document.querySelector(
          `nav a[href="#${entry.target.id}"]`
        );
        if (activeLink) {
          activeLink.classList.add(
            "bg-white/90",
            "font-semibold",
            "text-black"
          );
        }
      }
    });
  },
  {
    threshold: 0.6, // 60% of the section must be visible to count as active
  }
);

sections.forEach((section) => sectionObserver.observe(section));

setupCanvas();
animate();
window.addEventListener("resize", setupCanvas);
