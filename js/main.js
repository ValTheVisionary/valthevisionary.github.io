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
  // hero video is scrubbed to match scroll position and the headline
  // copy types itself out in sync with the same scroll progress. The
  // section stays pinned in the viewport via position: sticky. Once the
  // section has been fully scrolled through, the page continues into
  // the rest of the site as normal.
  //
  // To keep both the video and the typing animation feeling smooth
  // (rather than jumping around on fast scrolls), the raw scroll
  // position is treated only as a *target*. A requestAnimationFrame
  // loop eases a couple of independent "current" values toward that
  // target every frame using frame-rate-independent exponential
  // smoothing (lerp). The typing progress uses a slow time constant so
  // text reveals at a readable pace even when the user scrolls very
  // quickly. Scroll handling itself only records the target progress
  // (cheap, no DOM writes) — all actual DOM/video updates happen inside
  // the rAF loop, which stops itself once things have caught up and
  // restarts on the next scroll/resize.
  //
  // The video gets its own, more careful treatment: setting
  // `currentTime` is a real (relatively expensive, async) seek
  // operation. Firing a new seek every single animation frame — even
  // toward a smoothly-eased target — causes seeks to queue up faster
  // than the browser can decode/display them, which is what actually
  // produces visible "jumping"/skipped frames on fast scrolls. To avoid
  // that: (1) a seek is only ever issued once the previous one has
  // finished (`video.seeking` is checked, and the `seeking`/`seeked`
  // events are used to know when the video is busy), and (2) seeks
  // smaller than a tiny epsilon are skipped entirely since they'd be
  // visually indistinguishable. The eased target time keeps being
  // computed every frame regardless, so as soon as the video is free it
  // seeks to the latest (already-smoothed) position — multiple frames
  // are still used to travel from the old position to the new one, it's
  // just paced by "is the video ready for another seek" instead of by
  // raw rAF ticks.
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

    // Tracks whether the video currently has an in-flight seek so we
    // never issue an overlapping one (see the block comment above).
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
        // The video just became free again — immediately try to push
        // it toward the latest smoothed target rather than waiting for
        // the next natural rAF tick, so it catches up as fast as the
        // decoder allows.
        ensureAnimating();
      });
    }

    if (reduceMotionQuery.matches) {
      if (textEl) textEl.textContent = messages[0];
      if (messageEl) messageEl.classList.add("is-visible");
      if (indicator) indicator.classList.add("is-hidden");
      return;
    }

    // Raw scroll-derived progress (0..1) — the target both smoothed
    // values chase.
    var targetProgress = 0;

    // Smoothed progress driving the video's currentTime. Uses a fast
    // time constant so it still tracks the scroll closely, but eases
    // instead of snapping — this is what prevents "frame skipping" on
    // fast scrolls.
    var videoProgress = 0;

    // Smoothed progress driving the typing animation. Uses a slower
    // time constant so text keeps revealing at a readable pace even if
    // the user scrolls straight past a whole segment.
    var typingProgress = 0;

    var scrollTicking = false;
    var rafId = null;
    var lastFrameTime = null;

    // Time constants (seconds) for exponential smoothing — smaller is
    // snappier/tighter tracking, larger is smoother/slower.
    var VIDEO_TIME_CONSTANT = 0.12;
    var TYPING_TIME_CONSTANT = 0.35;
    var SETTLE_THRESHOLD = 0.0006;

    // Smallest currentTime change (in seconds) worth issuing a new seek
    // for. Anything below this is visually indistinguishable, so
    // skipping it avoids pointless seek calls.
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

    // Exponential smoothing factor for a given time constant and
    // elapsed time — frame-rate independent, so it looks the same at
    // 30fps, 60fps or 120fps.
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

    // Pushes an eased progress value to the video, but only when it's
    // safe/worthwhile to do so — see the block comment at the top of
    // initScrollHero for why this guard exists.
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
})();
