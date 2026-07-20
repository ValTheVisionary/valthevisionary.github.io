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
    initConsoleEasterEgg();
  });

  // Drives the home-page hero: as the section is scrolled through, the
  // hero video is scrubbed to match scroll position and the headline
  // copy types itself out in sync with the same scroll progress. The
  // section stays pinned in the viewport via position: sticky. Once the
  // section has been fully scrolled through, the page continues into
  // the rest of the site as normal.

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

    var videoSeeking = false;

    if (video) {
      video.addEventListener("loadedmetadata", function () {
        duration = video.duration || 0;
      });
      video.addEventListener("error", function () {
        duration = 0;
      });
      video.addEventListener("seeking", function () {
        videoSeeking = true;
      });
      video.addEventListener("seeked", function () {
        videoSeeking = false;
        ensureAnimating();
      });
    }

    if (reduceMotionQuery.matches) {
      if (textEl) textEl.textContent = messages[0];
      if (messageEl) messageEl.classList.add("is-visible");
      if (indicator) indicator.classList.add("is-hidden");
      return;
    }


    var targetProgress = 0;


    var videoProgress = 0;


    var typingProgress = 0;

    var scrollTicking = false;
    var rafId = null;
    var lastFrameTime = null;


    var VIDEO_TIME_CONSTANT = 0.12;
    var TYPING_TIME_CONSTANT = 0.35;
    var SETTLE_THRESHOLD = 0.0006;


    var MIN_SEEK_DELTA = 1 / 60;

    function computeTargetProgress() {
      scrollTicking = false;

      var rect = section.getBoundingClientRect();
      var scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        targetProgress = 0;
      } else {
        var progress = -rect.top / scrollable;
        targetProgress = Math.max(0, Math.min(1, progress));
      }

      if (indicator) {
        indicator.classList.toggle("is-hidden", targetProgress > 0.04);
      }

      ensureAnimating();
    }

    function onScroll() {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(computeTargetProgress);
    }

    function ensureAnimating() {
      if (rafId === null) {
        lastFrameTime = null;
        rafId = window.requestAnimationFrame(animate);
      }
    }


    function smoothingFactor(dt, timeConstant) {
      return 1 - Math.exp(-dt / timeConstant);
    }

    function animate(now) {
      if (lastFrameTime === null) lastFrameTime = now;
      // Clamp dt so a backgrounded tab / long stall doesn't cause a
      // huge single jump when the page becomes active again.
      var dt = Math.min(now - lastFrameTime, 100) / 1000;
      lastFrameTime = now;

      var videoLerp = smoothingFactor(dt, VIDEO_TIME_CONSTANT);
      videoProgress += (targetProgress - videoProgress) * videoLerp;

      var typingLerp = smoothingFactor(dt, TYPING_TIME_CONSTANT);
      typingProgress += (targetProgress - typingProgress) * typingLerp;

      applyVideoProgress(videoProgress);
      updateText(typingProgress);

      var videoSettled = Math.abs(targetProgress - videoProgress) < SETTLE_THRESHOLD;
      var typingSettled = Math.abs(targetProgress - typingProgress) < SETTLE_THRESHOLD;

      if (!videoSettled || !typingSettled) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        // Snap the last tiny fraction so values fully match the target,
        // then stop the loop until the next scroll/resize.
        videoProgress = targetProgress;
        typingProgress = targetProgress;
        applyVideoProgress(videoProgress);
        updateText(typingProgress);
        rafId = null;
        lastFrameTime = null;
      }
    }


    function applyVideoProgress(progress) {
      if (!video || !duration || videoSeeking) return;

      var targetTime = progress * duration;
      if (Math.abs(video.currentTime - targetTime) < MIN_SEEK_DELTA) return;

      video.currentTime = targetTime;
    }

    function updateText(progress) {
      var segmentCount = messages.length;
      var scaled = progress * segmentCount;
      var segment = Math.min(segmentCount - 1, Math.max(0, Math.floor(scaled)));
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    computeTargetProgress();
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
  function initConsoleEasterEgg() {
    console.log(
      "%c🃏 Psst... there's a joker hiding in the deck.",
      "font-family: monospace; font-size: 13px; color: #1a1a1a; background: #d8cfc4; padding: 4px 8px; border-radius: 4px;"
    );
  }

})();
