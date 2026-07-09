// main.js — shared behavior across all pages: nav scroll state,
// mobile menu toggle, active-link highlighting, reveal-on-scroll,
// and the home page's scroll-driven hero video.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNavScroll();
    initNavToggle();
    initActiveLink();
    initReveal();
    initScrollHero();
  });

  // Drives the home-page hero: as the section is scrolled through, the
  // hero video is scrubbed frame-by-frame to match scroll position (no
  // autoplay — playback is entirely tied to scroll), the section stays
  // pinned in the viewport via position: sticky, and the headline copy
  // types itself out in sync with the same scroll progress. Once the
  // section has been fully scrolled through, the page continues into
  // the rest of the site as normal.
  //
  // To swap in the final video, replace
  // img/hero-scroll-video-placeholder.mp4 with the real export (keeping
  // the same filename), or update the `src` on [data-scroll-hero-video]
  // in index.html.
  function initScrollHero() {
    var section = document.querySelector("[data-scroll-hero]");
    if (!section) return;

    var video = section.querySelector("[data-scroll-hero-video]");
    var textEl = section.querySelector("[data-scroll-hero-text]");
    var messageEl = section.querySelector(".scroll-hero__message");
    var indicator = section.querySelector("[data-scroll-hero-indicator]");

    var messages = [
      "Hi, I'm Valentino Amatsaleh.",
      "Software Engineering Student.",
      "Building Real-World Applications.",
      "Always Learning, Always Creating.",
      "Welcome to My Portfolio.",
    ];

    var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var duration = 0;
    var ticking = false;

    if (video) {
      video.addEventListener("loadedmetadata", function () {
        duration = video.duration || 0;
      });
      video.addEventListener("error", function () {
        duration = 0;
      });
    }

    if (reduceMotionQuery.matches) {
      if (textEl) textEl.textContent = messages[0];
      if (messageEl) messageEl.classList.add("is-visible");
      if (indicator) indicator.classList.add("is-hidden");
      return;
    }

    function update() {
      ticking = false;

      var rect = section.getBoundingClientRect();
      var scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      var progress = -rect.top / scrollable;
      progress = Math.max(0, Math.min(1, progress));

      if (video && duration) {
        video.currentTime = progress * duration;
      }

      if (indicator) {
        indicator.classList.toggle("is-hidden", progress > 0.04);
      }

      var segmentCount = messages.length;
      var scaled = progress * segmentCount;
      var segment = Math.min(segmentCount - 1, Math.floor(scaled));
      var localProgress = scaled - segment;

      var fadeIn = 0.12;
      var fadeOut = 0.12;
      var typeEnd = 0.7;

      var message = messages[segment];
      var opacity = 1;
      if (localProgress < fadeIn) {
        opacity = localProgress / fadeIn;
      } else if (localProgress > 1 - fadeOut) {
        opacity = (1 - localProgress) / fadeOut;
      }

      var typeProgress = (localProgress - fadeIn) / (typeEnd - fadeIn);
      typeProgress = Math.max(0, Math.min(1, typeProgress));
      var charCount = Math.round(message.length * typeProgress);

      if (textEl) textEl.textContent = message.slice(0, charCount);
      if (messageEl) {
        messageEl.classList.add("is-visible");
        messageEl.style.opacity = String(opacity);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  function initNavScroll() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 8) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initNavToggle() {
    var toggle = document.querySelector(".nav__toggle");
    var links = document.querySelector(".nav__links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      links.classList.toggle("is-open", !expanded);
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
      });
    });
  }

  function initActiveLink() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      var href = a.getAttribute("href").replace("./", "");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) { io.observe(el); });
  }
})();
