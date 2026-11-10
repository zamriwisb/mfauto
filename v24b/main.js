/* MF Auto Expert v24 "Jubin Imej": homepage interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header: scrolled shadow ---------- */
  var header = document.getElementById("header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }
  toggle.addEventListener("click", function () { setMenu(!header.classList.contains("is-open")); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 1261px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

  /* ---------- Active nav link ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = "#" + en.target.id;
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["tentang", "servis", "pencapaian", "ulasan", "lokasi"].forEach(function (id) {
      var s = document.getElementById(id); if (s) io.observe(s);
    });
  }

  /* ---------- Reviews: show more ----------
     All 8 are visible without JS; JS collapses to the first 3. */
  var grid = document.getElementById("reviewsGrid");
  var more = document.getElementById("reviewsToggle");
  if (grid && more) {
    var total = grid.children.length;
    var labelMore = "Tunjuk " + (total - 3) + " ulasan lagi";
    var labelLess = "Tunjuk kurang";
    grid.classList.add("is-collapsed");
    more.hidden = false;
    more.setAttribute("aria-expanded", "false");
    more.textContent = labelMore;
    more.addEventListener("click", function () {
      var collapsed = grid.classList.toggle("is-collapsed");
      more.setAttribute("aria-expanded", String(!collapsed));
      more.textContent = collapsed ? labelMore : labelLess;
      if (!collapsed && grid.children[3]) {
        grid.children[3].setAttribute("tabindex", "-1");
        grid.children[3].focus({ preventScroll: true });
      }
    });
  }

  /* ---------- Slider ---------- */
  if (window.Swiper) {
    new Swiper(".hero__swiper", {
      loop: true,
      speed: 700,
      autoplay: reduceMotion ? false : { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: ".hero__dots", clickable: true },
      navigation: { prevEl: ".hero__prev", nextEl: ".hero__next" },
      a11y: { prevSlideMessage: "Banner sebelumnya", nextSlideMessage: "Banner seterusnya", paginationBulletMessage: "Ke banner {{index}}" }
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
     Page load: slim header settles, the framed banner fades up, then the
     three image tiles rise in a stagger with their chips following.
     Scroll: stats count up. gsap.from only. */
  if (!window.gsap || reduceMotion) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".header__inner > *", { y: -10, opacity: 0, duration: 0.45, stagger: 0.08, clearProps: "transform,opacity" })
    .from(".hero__frame", { y: 24, opacity: 0, duration: 0.75, clearProps: "transform,opacity" }, "-=0.2")
    .from(".tile", { y: 48, opacity: 0, duration: 0.7, stagger: 0.12, clearProps: "transform,opacity" }, "-=0.4")
    .from(".tile__chip", { y: 12, opacity: 0, duration: 0.4, stagger: 0.12, clearProps: "transform,opacity" }, "-=0.55");

  if (!window.ScrollTrigger) return;
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    var plain = el.hasAttribute("data-plain");
    var obj = { v: end };
    var fmt = function (n) { return plain ? String(Math.round(n)) : Math.round(n).toLocaleString("en-US"); };
    gsap.from(obj, {
      v: plain ? end - 14 : 0,
      duration: 1.6, ease: "power2.out", immediateRender: false,
      scrollTrigger: { trigger: ".stats", start: "top 85%", once: true },
      onUpdate: function () { el.textContent = fmt(obj.v); }
    });
  });
})();
