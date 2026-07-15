// work.js — deals the four suit cards in on load, flips a card to reveal
// its meaning on hover, and renders the matching projects when clicked.

(function () {
  "use strict";

  var SUITS = [
    { id: "hearts", glyph: "\u2665", color: "red", title: "Front-End Development", short: "Hearts", description: "UI/UX implementation, styling, client-side functionality." },
    { id: "diamonds", glyph: "\u2666", color: "red", title: "Back-End Development", short: "Diamonds", description: "Databases, APIs, server-side logic, architecture." },
    { id: "spades", glyph: "\u2660", color: "black", title: "Full-Stack Development", short: "Spades", description: "End-to-end ownership of both client and server." },
    { id: "clubs", glyph: "\u2663", color: "black", title: "Solo Project / Creator", short: "Clubs", description: "Conceptualized, built and launched entirely independently." },
  ];

  var PROJECTS = {
    hearts: [
      {
        title: "Studie4SU",
        type: "School Project",
        date: "Feb 2026 \u2013 Mar 2026",
        institution: "University of Applied Sciences and Technology Suriname",
        description: "A full-stack web platform for students in Suriname to explore higher-education options, compare study programs, view open house events and complete a study-choice quiz that recommends programs based on their interests and profile. The platform includes an admin dashboard for managing schools, study programs, quizzes, open house events, users, settings and statistics.",
        contribution: "Focused primarily on frontend development, UI/UX implementation, visual animations and improving the overall user experience.",
        tech: ["HTML", "CSS", "JavaScript", "Express.js", "Prisma", "MySQL", "Figma"],
        github: "https://github.com/Veroush/studie4su",
        image: "img/portfolio-studie4su.png",
      },
    ],
    diamonds: [
      {
        title: "Inventory Management System v2",
        type: "Personal Project",
        date: "May 2026",
        description: "A full-stack inventory management application for tracking products, categories, stock movements, low-stock alerts, users and application settings. Built using an Express + Prisma backend API with a static HTML/CSS/JavaScript frontend.",
        contribution: "Focused primarily on backend development, API architecture, database modeling and server-side functionality.",
        tech: ["Node.js", "Express.js", "Prisma", "MySQL", "JavaScript", "HTML", "CSS"],
        github: "https://github.com/ValTheVisionary/Inventory-management-system-v2",
        image: "img/portfolio-inventoryv2.png",
      },
    ],
    spades: [],
    clubs: [
      {
        title: "Innovation VS Insects",
        type: "School Project",
        date: "Jan 2026 \u2013 Mar 2026",
        institution: "University of Applied Sciences and Technology Suriname",
        description: "A frontend-only educational website showcasing innovative products and solutions used to exterminate insects and pests.",
        tech: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/ValTheVisionary/Innovation-VS-Insects-Website-Frontend-only-",
        image: "img/portfolio-ivsi.png",
      },
      {
        title: "Portfolio Website",
        type: "Personal Project",
        date: "Jun 2026 \u2013 Jul 2026",
        description: "A personal portfolio website designed to showcase my projects, skills, education and software engineering journey through interactive storytelling and polished animations.",
        tech: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/ValTheVisionary/valthevisionary.github.io",
        image: "img/portfolio-portfolio.png",
      },
    ],
  };

  // Maps a technology name to a local icon path (kebab-case, in img/tech/).
  var TECH_ICONS = {
    "html": "img/tech/html-icon.svg",
    "css": "img/tech/css-icon.svg",
    "javascript": "img/tech/javascript-programming-language-icon.svg",
    "java": "img/tech/java-programming-language-icon.svg",
    "mysql": "img/tech/mysql-icon.svg",
    "github": "img/tech/github-icon.svg",
    "git": "img/tech/git-icon.svg",
    "figma": "img/tech/figma-icon.svg",
    "node.js": "img/tech/node-js-icon.svg",
    "express.js": "img/tech/express-js-icon.svg",
    "prisma": "img/tech/prisma-svgrepo-com.svg",
  };
  function techIcon(name) {
    return TECH_ICONS[name.trim().toLowerCase()] || null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var deckEl = document.querySelector("[data-deck]");
    var suitViewEl = document.querySelector("[data-suit-view]");
    if (!deckEl || !suitViewEl) return;

    renderDeck(deckEl);
    setTimeout(function () { deckEl.classList.add("is-dealt"); }, 40);

    // Event delegation: works for every play-card, present or future,
    // and fires regardless of which inner element was actually clicked.
    deckEl.addEventListener("click", function (e) {
      var card = e.target.closest ? e.target.closest(".play-card") : null;
      if (!card || !deckEl.contains(card)) return;
      var suitId = card.getAttribute("data-suit-id");
      if (!suitId || !PROJECTS.hasOwnProperty(suitId)) return;
      showSuit(suitId, deckEl, suitViewEl);
    });

    // Keyboard support: Enter/Space activates the focused card, matching
    // native button behavior and covering non-click activation paths.
    deckEl.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest ? e.target.closest(".play-card") : null;
      if (!card) return;
      e.preventDefault();
      var suitId = card.getAttribute("data-suit-id");
      if (!suitId || !PROJECTS.hasOwnProperty(suitId)) return;
      showSuit(suitId, deckEl, suitViewEl);
    });
  });

  function renderDeck(deckEl) {
    deckEl.innerHTML = SUITS.map(function (s, i) {
      var count = PROJECTS[s.id].length;
      return (
        '<button type="button" class="play-card play-card--' + s.color + '" style="--i:' + i + '" ' +
        'data-suit-id="' + s.id + '" aria-label="' + s.title + ' \u2014 ' + count + (count === 1 ? " project" : " projects") + '">' +
          '<div class="play-card__inner">' +
            '<div class="play-card__face play-card__face--front">' +
              '<span class="play-card__corner play-card__corner--tl"><span class="play-card__rank">' + "A" + '</span><span class="play-card__pip">' + s.glyph + '</span></span>' +
              '<span class="play-card__center">' + s.glyph + '</span>' +
              '<span class="play-card__corner play-card__corner--br"><span class="play-card__rank">' + "A" + '</span><span class="play-card__pip">' + s.glyph + '</span></span>' +
            '</div>' +
            '<div class="play-card__face play-card__face--back">' +
              '<span class="play-card__pip play-card__pip--sm">' + s.glyph + '</span>' +
              '<h3 class="play-card__title">' + s.title + '</h3>' +
              '<p class="play-card__desc">' + s.description + '</p>' +
              '<span class="play-card__count">' + count + (count === 1 ? " project" : " projects") + '</span>' +
            '</div>' +
          '</div>' +
        '</button>'
      );
    }).join("");
  }

  function showSuit(suitId, deckEl, suitViewEl) {
    var suit = SUITS.filter(function (s) { return s.id === suitId; })[0];
    if (!suit) return;
    var projects = PROJECTS[suitId] || [];

    deckEl.style.display = "none";
    deckEl.classList.add("is-hidden");
    suitViewEl.classList.remove("is-hidden");
    suitViewEl.style.display = "";
    suitViewEl.innerHTML = renderSuitView(suit, projects);

    var backBtn = suitViewEl.querySelector("[data-suit-back]");
    backBtn.addEventListener("click", function () {
      suitViewEl.style.display = "none";
      suitViewEl.classList.add("is-hidden");
      suitViewEl.innerHTML = "";
      deckEl.style.display = "";
      deckEl.classList.remove("is-hidden");
    });

    var section = deckEl.closest(".section");
    if (section) {
      window.scrollTo({ top: section.offsetTop - 90, behavior: "smooth" });
    }
  }

  function renderSuitView(suit, projects) {
    var cardsHtml;
    if (projects.length > 0) {
      cardsHtml = projects.map(function (p, i) { return renderProjectCard(p, i); }).join("");
    } else {
      cardsHtml =
        '<article class="project-card project-card--glass project-card--empty" style="--i:0">' +
          '<span class="project-card__empty-glyph">' + suit.glyph + '</span>' +
          '<h3>No projects here \u2014 yet.</h3>' +
          '<p class="project-card__desc">I\'m actively building toward my first end-to-end full-stack showcase. Check back soon \u2014 this seat at the table is being reserved.</p>' +
        '</article>';
    }

    return (
      '<header class="suit-view__head">' +
        '<button type="button" class="suit-view__back" data-suit-back aria-label="Back to all suits"><span aria-hidden="true">\u2190</span> Back to all suits</button>' +
        '<div class="suit-view__badge suit-view__badge--' + suit.color + '"><span class="suit-view__glyph">' + suit.glyph + '</span></div>' +
        '<p class="eyebrow" style="margin-bottom:.5rem">' + suit.short + '</p>' +
        '<h2 class="suit-view__title">' + suit.title + '</h2>' +
        '<p class="suit-view__desc">' + suit.description + '</p>' +
      '</header>' +
      '<div class="project-cards">' + cardsHtml + '</div>'
    );
  }

  function renderProjectCard(p, i) {
    var techHtml = "";
    if (p.tech && p.tech.length) {
      techHtml = '<ul class="badges" aria-label="Technologies">' + p.tech.map(function (t) {
        var icon = techIcon(t);
        var iconHtml = icon ? '<img class="tech-icon" src="' + icon + '" alt="" width="18" height="18">' : "";
        return '<li class="badge">' + iconHtml + '<span>' + t + '</span></li>';
      }).join("") + '</ul>';
    }
    var instHtml = p.institution ? '<p class="project-card__inst">' + p.institution + '</p>' : "";
    var contribHtml = p.contribution ? '<p class="project-card__desc"><strong>My contribution:</strong> ' + p.contribution + '</p>' : "";
    var thumbHtml = p.image
      ? '<div class="project-card__thumb"><img src="' + p.image + '" alt="' + p.title + ' preview" loading="lazy" width="640" height="360"></div>'
      : "";

    return (
      '<article class="project-card project-card--glass" style="--i:' + i + '">' +
        thumbHtml +
        '<div class="project-card__top">' +
          '<h3>' + p.title + '</h3>' +
          '<div class="project-card__meta"><span class="project-card__type">' + p.type + '</span><span class="project-card__dot">&middot;</span><span class="project-card__date">' + p.date + '</span></div>' +
          instHtml +
        '</div>' +
        '<p class="project-card__desc">' + p.description + '</p>' +
        contribHtml +
        techHtml +
        '<div class="project-card__actions">' +
          '<a href="' + p.github + '" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--small">' +
            '<img class="tech-icon" src="img/tech/github-icon.svg" alt="" width="18" height="18">' +
            'GitHub<span class="btn__ext" aria-hidden="true">\u2197</span>' +
          '</a>' +
        '</div>' +
      '</article>'
    );
  }
})();

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initJokerEasterEgg();
  });

  function initJokerEasterEgg() {
    var trigger = document.querySelector("[data-easter-egg]");
    var overlay = document.querySelector("[data-joker-overlay]");
    var closeBtn = document.querySelector("[data-joker-close]");
    var jokerCard = document.querySelector("[data-joker-card]");
    var hobbiesView = document.querySelector("[data-hobbies-view]");
    var deckEl = document.querySelector("[data-deck]");
    var suitViewEl = document.querySelector("[data-suit-view]");
    if (!trigger || !overlay || !jokerCard || !hobbiesView || !deckEl) return;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      overlay.classList.remove("is-hidden");
    });

    closeBtn.addEventListener("click", function () {
      overlay.classList.add("is-hidden");
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.classList.add("is-hidden");
    });

    jokerCard.addEventListener("click", function () {
      overlay.classList.add("is-hidden");

      deckEl.style.display = "none";
      deckEl.classList.add("is-hidden");
      if (suitViewEl) {
        suitViewEl.style.display = "none";
        suitViewEl.classList.add("is-hidden");
        suitViewEl.innerHTML = "";
      }

      renderHobbiesView(hobbiesView, deckEl);
    });
  }

  function renderHobbiesView(hobbiesView, deckEl) {
    var sports = ["Swimming", "Taekwondo", "Badminton", "Chess"];
    var hobbies = ["Gaming", "Anime", "Cooking", "Jogging", "Singing", "Dancing", "Fashion", "Fragrance"];

    hobbiesView.classList.remove("is-hidden");
    hobbiesView.style.display = "";
    hobbiesView.innerHTML =
      '<header class="hobbies-view__head">' +
        '<button type="button" class="suit-view__back" data-hobbies-back aria-label="Back to all suits"><span aria-hidden="true">\u2190</span> Back to all suits</button>' +
        '<p class="eyebrow" style="margin-bottom:.5rem">Wild Card</p>' +
        '<h2 class="suit-view__title">Hobbies &amp; Sports</h2>' +
        '<p class="suit-view__desc">These are the different hobbies and sports i enjoyed throughout my life.</p>' +
      '</header>' +
      '<div class="hobbies-grid">' +
        '<div class="hobbies-group"><h3>Sport</h3><ul>' +
          sports.map(function (s) { return '<li>' + s + '</li>'; }).join("") +
        '</ul></div>' +
        '<div class="hobbies-group"><h3>Hobby</h3><ul>' +
          hobbies.map(function (h) { return '<li>' + h + '</li>'; }).join("") +
        '</ul></div>' +
      '</div>';

    var backBtn = hobbiesView.querySelector("[data-hobbies-back]");
    backBtn.addEventListener("click", function () {
      hobbiesView.style.display = "none";
      hobbiesView.classList.add("is-hidden");
      hobbiesView.innerHTML = "";
      deckEl.style.display = "";
      deckEl.classList.remove("is-hidden");
    });
  }
})();
