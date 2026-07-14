// about.js — manga-panel intro hero + interactive skill tree
// for the About page.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initMangaHero();
    initSkillTree();
  });

  /* ---------------- Manga Hero ---------------- */
  function initMangaHero() {
    var hero = document.querySelector("[data-manga-hero]");
    if (!hero) return;

    var stage = 0; // 0..5
    var slotTop = hero.querySelector("[data-manga-top]");
    var slotBottom = hero.querySelector("[data-manga-bottom]");
    var center = hero.querySelector("[data-manga-center]");
    var hint = hero.querySelector("[data-manga-hint]");
    var skipBtn = hero.querySelector("[data-manga-skip]");
    var autoTimer = null;

    var panels = {
      p1: hero.getAttribute("data-p1"),
      p2: hero.getAttribute("data-p2"),
      p3: hero.getAttribute("data-p3"),
      p4: hero.getAttribute("data-p4"),
      p5: hero.getAttribute("data-p5"),
    };

    // Preload
    Object.keys(panels).forEach(function (k) {
      var img = new Image();
      img.src = panels[k];
    });

    document.body.style.overflow = "hidden";

    function render() {
      slotTop.innerHTML = "";
      slotBottom.innerHTML = "";
      center.innerHTML = "";
      center.style.display = "none";

      var topSrc = stage <= 1 ? panels.p1 : stage <= 3 ? panels.p3 : null;
      var bottomSrc = stage === 0 ? null : stage <= 2 ? panels.p2 : stage <= 3 ? panels.p4 : null;

      if (topSrc) {
        var topImg = document.createElement("img");
        topImg.src = topSrc;
        topImg.alt = "Manga panel";
        topImg.className = "manga-hero__panel " + (topSrc === panels.p1 ? "manga-hero__panel--from-left" : "manga-hero__panel--from-right");
        if (stage === 2 && topSrc === panels.p1) topImg.classList.add("is-leaving-left");
        slotTop.appendChild(topImg);
      }
      if (bottomSrc) {
        var bottomImg = document.createElement("img");
        bottomImg.src = bottomSrc;
        bottomImg.alt = "Manga panel";
        bottomImg.className = "manga-hero__panel " + (bottomSrc === panels.p2 ? "manga-hero__panel--from-right" : "manga-hero__panel--from-left");
        if (stage === 3 && bottomSrc === panels.p2) bottomImg.classList.add("is-leaving-right");
        slotBottom.appendChild(bottomImg);
      }
      if (stage >= 4) {
        center.style.display = "grid";
        var centerImg = document.createElement("img");
        centerImg.src = panels.p5;
        centerImg.alt = "Manga panel — final";
        centerImg.className = "manga-hero__panel manga-hero__panel--center";
        center.appendChild(centerImg);
      }

      if (stage === 0) hint.innerHTML = "<span>Click anywhere to continue</span>";
      else if (stage > 0 && stage < 4) hint.innerHTML = "<span>Click to turn the page &middot; " + (stage + 1) + " / 5</span>";
      else if (stage === 4) hint.innerHTML = '<span class="manga-hero__hint--scroll">Scroll to continue <span class="manga-hero__arrow">&darr;</span></span>';
      else hint.innerHTML = "";

      if (stage === 4) {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(finish, 7000);
      }
    }

    function advance() {
      if (stage < 4) {
        stage++;
        render();
      }
    }

    function finish() {
      clearTimeout(autoTimer);
      hero.classList.add("is-done");
      document.body.style.overflow = "";
      setTimeout(function () {
        hero.remove();
      }, 700);
    }

    hero.addEventListener("click", advance);
    hero.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        advance();
      }
    });
    skipBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      finish();
    });

    render();
  }

  /* ---------------- Skill Tree ---------------- */
  function initSkillTree() {
    var tree = document.querySelector("[data-skill-tree]");
    if (!tree) return;

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            tree.classList.add("is-visible");
            io.disconnect();
          }
        });
      }, { threshold: 0.15 });
      io.observe(tree);
    } else {
      tree.classList.add("is-visible");
    }

    var backdrop = document.querySelector("[data-tree-card-backdrop]");
    var card = document.querySelector("[data-tree-card]");
    var cardKind = card.querySelector("[data-tree-card-kind]");
    var cardTitle = card.querySelector("[data-tree-card-title]");
    var cardMeta = card.querySelector("[data-tree-card-meta]");
    var cardDesc = card.querySelector("[data-tree-card-desc]");
    var closeBtn = card.querySelector("[data-tree-card-close]");

    function openCard(node) {
      cardKind.textContent = node.kind || "";
      cardTitle.textContent = node.title || "";
      cardMeta.textContent = node.meta || "";
      cardMeta.style.display = node.meta ? "" : "none";
      cardDesc.textContent = node.description || "";
      backdrop.classList.remove("is-hidden");
    }
    function closeCard() {
      backdrop.classList.add("is-hidden");
    }

    closeBtn.addEventListener("click", closeCard);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeCard();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCard();
    });

    tree.querySelectorAll("[data-node]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        // Leaves represent projects — send the visitor straight to the
        // Work page instead of opening the info card.
        if (btn.getAttribute("data-kind") === "leaf") {
          window.location.href = "./work.html";
          return;
        }
        openCard({
          kind: btn.getAttribute("data-kind"),
          title: btn.getAttribute("data-title"),
          meta: btn.getAttribute("data-meta"),
          description: btn.getAttribute("data-description"),
        });
      });
    });
  }
})();
