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

    var stage = 0; // 0..4
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

    function makeImg(src, extraClass) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = "Manga panel";
      img.className = "manga-hero__panel " + extraClass;
      return img;
    }

    function replaceSlot(slotEl, newSrc, exitClass, enterClass) {
      var oldImg = slotEl.querySelector("img");
      if (oldImg) {
        oldImg.classList.add(exitClass);
        oldImg.addEventListener("animationend", function handler() {
          oldImg.removeEventListener("animationend", handler);
          if (oldImg.parentNode === slotEl) slotEl.removeChild(oldImg);
        });
      }
      slotEl.appendChild(makeImg(newSrc, enterClass));
    }

    function showInitial() {
      slotTop.innerHTML = "";
      slotTop.appendChild(makeImg(panels.p1, "manga-hero__panel--from-left"));
    }

    function showStage1() {
      // Panel 2 slides in from the right, into the bottom half.
      slotBottom.innerHTML = "";
      slotBottom.appendChild(makeImg(panels.p2, "manga-hero__panel--from-right"));
    }

    function showStage2() {
      // Panel 1 exits (fade + slide left); Panel 3 slides in from the
      // right, taking Panel 1's spot. Panel 2 (bottom) stays untouched.
      replaceSlot(slotTop, panels.p3, "is-leaving-left", "manga-hero__panel--from-right");
    }

    function showStage3() {
      // Panel 2 exits (fade + slide right); Panel 4 slides in from the
      // left, taking Panel 2's spot. Panel 3 (top) stays untouched.
      replaceSlot(slotBottom, panels.p4, "is-leaving-right", "manga-hero__panel--from-left");
    }

    function showStage4() {
      // Panels 3 and 4 fade away simultaneously, then Panel 5 fades
      // into the center. 
      slotTop.querySelectorAll("img").forEach(function (img) {
        img.classList.add("is-leaving-left");
      });
      slotBottom.querySelectorAll("img").forEach(function (img) {
        img.classList.add("is-leaving-right");
      });

      center.innerHTML = "";
      center.style.display = "grid";
      center.appendChild(makeImg(panels.p5, "manga-hero__panel--center"));
    }

    function updateHint() {
      if (stage === 0) hint.innerHTML = "<span>Click anywhere to continue</span>";
      else if (stage > 0 && stage < 4) hint.innerHTML = "<span>Click to turn the page &middot; " + (stage + 1) + " / 5</span>";
      else hint.innerHTML = "";
    }

    function advance() {
      if (stage >= 4) return;
      stage++;
      if (stage === 1) showStage1();
      else if (stage === 2) showStage2();
      else if (stage === 3) showStage3();
      else if (stage === 4) showStage4();

      updateHint();

      if (stage === 4) {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(finish, 7000);
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

    showInitial();
    updateHint();
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
