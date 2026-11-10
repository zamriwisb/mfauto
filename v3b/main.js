/* MF Auto Expert v3b "Moden Autofiix Hijau": homepage interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ---------- Year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header: scrolled state ---------- */
  var header = document.getElementById("header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu sheet ---------- */
  var sheet = document.getElementById("menuSheet");
  var toggle = document.getElementById("navToggle");
  function isOpen() { return header.classList.contains("is-open"); }
  function setMenu(open) {
    header.classList.toggle("is-open", open);
    document.documentElement.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }
  toggle.addEventListener("click", function () { setMenu(!isOpen()); });
  sheet.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 1025px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

  /* ---------- Active nav link (desktop pill + mobile sheet) ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll("#nav a, .sheet__nav a"));
  function setActive(id) { links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === id); }); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) setActive("#" + entry.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll('#nav a[href^="#"]').forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s && s.id !== "utama") io.observe(s);
    });
    window.addEventListener("scroll", function () { if (window.scrollY < 300) setActive("#utama"); }, { passive: true });
  }

  /* ---------- Sliders ---------- */
  if (window.Swiper) {
    var heroCount = document.querySelector(".hero__count b");
    new Swiper(".hero__swiper", {
      loop: true,
      speed: 700,
      autoplay: reduceMotion ? false : { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: ".hero__dots", clickable: true },
      navigation: { prevEl: ".hero__prev", nextEl: ".hero__next" },
      a11y: { prevSlideMessage: "Banner sebelumnya", nextSlideMessage: "Banner seterusnya", paginationBulletMessage: "Ke banner {{index}}" },
      on: { slideChange: function (s) { if (heroCount) heroCount.textContent = pad(s.realIndex + 1); } }
    });

    var reviewCount = document.querySelector(".quote-card__count b");
    new Swiper(".reviews__swiper", {
      slidesPerView: 1,
      speed: reduceMotion ? 0 : 450,
      effect: "fade",
      fadeEffect: { crossFade: true },
      autoHeight: true,
      rewind: true,
      navigation: { prevEl: ".reviews__prev", nextEl: ".reviews__next" },
      a11y: { prevSlideMessage: "Ulasan sebelumnya", nextSlideMessage: "Ulasan seterusnya" },
      on: { slideChange: function (s) { if (reviewCount) reviewCount.textContent = pad(s.activeIndex + 1); } }
    });
  }

  /* ---------- Certificate viewer ---------- */
  var viewer = document.getElementById("viewer");
  if (viewer && typeof viewer.showModal === "function") {
    var viewerImg = viewer.querySelector("img");
    document.querySelectorAll(".award__open").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var thumb = btn.querySelector("img");
        viewerImg.src = btn.getAttribute("data-full");
        viewerImg.alt = thumb ? thumb.alt : "";
        viewer.showModal();
      });
    });
    viewer.querySelector(".viewer__close").addEventListener("click", function () { viewer.close(); });
    viewer.addEventListener("click", function (e) { if (e.target === viewer) viewer.close(); });
  }

  /* ---------- Motion (GSAP) ----------
     One page-load sequence (header bar settles in: brand, nav pills,
     actions; then the banner fades up)
     + stats counting up on scroll.
     Only gsap.from is used, so content is visible without JS/GSAP. */
  if (!window.gsap || reduceMotion) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".site-header__inner", { y: -16, opacity: 0, duration: 0.5, clearProps: "transform,opacity" })
    .from(".brand", { x: -12, opacity: 0, duration: 0.5, clearProps: "transform,opacity" }, "-=0.25")
    .from("#nav a", { y: -8, opacity: 0, duration: 0.4, stagger: 0.05, clearProps: "transform,opacity" }, "-=0.35")
    .from(".header__actions > *", { y: -8, opacity: 0, duration: 0.4, stagger: 0.07, clearProps: "transform,opacity" }, "-=0.3")
    .from(".hero__swiper", { opacity: 0, duration: 0.8 }, "-=0.3");

  if (!window.ScrollTrigger) return;
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    var plain = el.hasAttribute("data-plain");
    var start = plain ? end - 14 : 0;
    var obj = { v: end }; // text keeps its final value until the tween runs
    var fmt = function (n) { return plain ? String(Math.round(n)) : Math.round(n).toLocaleString("en-US"); };
    gsap.from(obj, {
      v: start,
      duration: 1.6,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: { trigger: ".stats", start: "top 88%", once: true },
      onUpdate: function () { el.textContent = fmt(obj.v); }
    });
  });
})();
