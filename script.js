/* ══════════════════════════════════════════════════════════
   Saveurs Enchantées — Script
   ══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─── Nav scroll behaviour ───────────────────────────────── */
  const nav = document.getElementById("nav");

  function handleNavScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  /* ─── Mobile drawer ──────────────────────────────────────── */
  const burger    = document.getElementById("burger");
  const drawer    = document.getElementById("navDrawer");
  const backdrop  = document.getElementById("navBackdrop");

  function openDrawer() {
    burger.classList.add("open");
    drawer.classList.add("open");
    backdrop.classList.add("visible");
    burger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    burger.classList.remove("open");
    drawer.classList.remove("open");
    backdrop.classList.remove("visible");
    burger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function toggleDrawer() {
    drawer.classList.contains("open") ? closeDrawer() : openDrawer();
  }

  burger.addEventListener("click", toggleDrawer);
  backdrop.addEventListener("click", closeDrawer);

  // Close on drawer link click
  drawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeDrawer);
  });

  // Close on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });

  /* ─── Hero reveal (immediate) ───────────────────────────── */
  const heroRevealEls = document.querySelectorAll(".hero .reveal");

  function triggerHeroReveal() {
    heroRevealEls.forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), 200 + i * 160);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", triggerHeroReveal);
  } else {
    triggerHeroReveal();
  }

  /* ─── Scroll reveal (IntersectionObserver) ───────────────── */
  const revealEls = document.querySelectorAll(".reveal-up");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = el.style.getPropertyValue("--delay") || "0s";
          el.style.transitionDelay = delay;
          el.classList.add("is-visible");
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── Swiper — Prestations carousel ─────────────────────── */
  if (typeof Swiper !== "undefined") {

    new Swiper(".prest-swiper", {
      slidesPerView: "auto",
      spaceBetween: 20,
      grabCursor: true,
      loop: false,
      navigation: {
        prevEl: ".prest-swiper__prev",
        nextEl: ".prest-swiper__next",
      },
      pagination: {
        el: ".prest-swiper__pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          spaceBetween: 24,
        },
        1200: {
          spaceBetween: 28,
        },
      },
    });

    /* ─── Swiper — Avis ────────────────────────────────────── */
    new Swiper(".avis-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        prevEl: ".avis-swiper__prev",
        nextEl: ".avis-swiper__next",
      },
      pagination: {
        el: ".avis-swiper__pagination",
        clickable: true,
      },
      effect: "slide",
    });
  }

  /* ─── Contact form ───────────────────────────────────────── */
  const form        = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const nom   = form.querySelector("#nom").value.trim();
      const email = form.querySelector("#email").value.trim();

      if (!nom || !email) {
        shakeInvalid(form);
        return;
      }

      const btn = form.querySelector("button[type='submit']");
      btn.textContent = "Envoi en cours…";
      btn.disabled = true;

      setTimeout(() => {
        form.style.display = "none";
        formSuccess.classList.add("show");
      }, 900);
    });
  }

  function shakeInvalid(el) {
    el.style.animation = "none";
    el.offsetHeight;
    el.style.animation = "shake .35s ease";
  }

  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(styleSheet);

  /* ─── Smooth active nav highlight ───────────────────────── */
  const sections    = document.querySelectorAll("section[id]");
  const navLinkEls  = document.querySelectorAll(".nav__links li a:not(.nav__cta)");

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinkEls.forEach(a => {
            a.style.color = a.getAttribute("href") === `#${id}`
              ? "var(--gold)"
              : "";
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach(s => sectionObserver.observe(s));

})();
