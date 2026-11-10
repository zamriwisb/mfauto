/* MF Auto Expert: inner page interactions (Tentang Kami, Servis, Hubungi).
   Works with both header styles: v3b (#menuSheet) and v24b (#nav drops down). */
(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header: scrolled state ---------- */
  var header = document.getElementById("header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var sheet = document.getElementById("menuSheet");
  var menu = sheet || document.getElementById("nav");
  function isOpen() { return header.classList.contains("is-open"); }
  function setMenu(open) {
    header.classList.toggle("is-open", open);
    if (sheet) document.documentElement.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(!isOpen()); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia(sheet ? "(min-width: 1025px)" : "(min-width: 1261px)")
      .addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- Service tabs: keep the current one in view on small screens ---------- */
  var cur = document.querySelector('.subnav a[aria-current="page"]');
  if (cur) { var bar = cur.parentNode; bar.scrollLeft = cur.offsetLeft - (bar.clientWidth - cur.offsetWidth) / 2; }

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

  /* ---------- Hubungi: enquiry form → WhatsApp ----------
     No server: the form writes a WhatsApp message and opens it.
     ?servis=enjin|tayar|khas preselects the service. */
  var form = document.getElementById("waForm");
  if (form) {
    var select = form.querySelector("#f-servis");
    var pre = new URLSearchParams(window.location.search).get("servis");
    if (pre && select) {
      Array.prototype.forEach.call(select.options, function (o) { if (o.getAttribute("data-key") === pre) select.value = o.value; });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var v = function (id) { var el = form.querySelector("#" + id); return el ? el.value.trim() : ""; };
      var date = v("f-tarikh");
      if (date) { var p = date.split("-"); if (p.length === 3) date = p[2] + "/" + p[1] + "/" + p[0]; }
      var lines = [
        "Salam MF Auto Expert, saya ingin bertanya tentang servis.",
        "",
        "Nama: " + v("f-nama"),
        "No. telefon: " + v("f-telefon"),
        "Kereta: " + v("f-kereta"),
        "Servis: " + v("f-servis")
      ];
      if (date) lines.push("Tarikh pilihan: " + date);
      if (v("f-mesej")) lines.push("", v("f-mesej"));
      window.open("https://wa.me/60179837220?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  }
})();
