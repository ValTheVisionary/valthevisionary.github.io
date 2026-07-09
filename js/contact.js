// contact.js — animated terminal "typewriter" snippet, subtle portrait
// parallax on mouse move, and client-side contact form validation.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initTerminal();
    initPortraitParallax();
    initForm();
  });

  /* ---------------- Terminal typer ---------------- */
  function initTerminal() {
    var body = document.querySelector("[data-terminal-body]");
    var titleEl = document.querySelector("[data-terminal-title]");
    if (!body || !titleEl) return;

    var SEQUENCES = [
      {
        lang: "python", ext: "py", hold: 3000,
        tokens: [
          { text: "print", cls: "tk-fn" },
          { text: "(", cls: "tk-p" },
          { text: '"Hello, World!"', cls: "tk-str" },
          { text: ")", cls: "tk-p" },
        ],
      },
      {
        lang: "javascript", ext: "js", hold: 5000,
        tokens: [
          { text: "console", cls: "tk-var" },
          { text: ".", cls: "tk-p" },
          { text: "log", cls: "tk-fn" },
          { text: "(", cls: "tk-p" },
          { text: '"Have a project you\'d like to bring to life, need help with an app, or just want to chat about the latest anime?"', cls: "tk-str" },
          { text: ")", cls: "tk-p" },
        ],
      },
      {
        lang: "java", ext: "java", hold: 4000,
        tokens: [
          { text: "System", cls: "tk-kw" },
          { text: ".", cls: "tk-p" },
          { text: "out", cls: "tk-var" },
          { text: ".", cls: "tk-p" },
          { text: "print", cls: "tk-fn" },
          { text: "(", cls: "tk-p" },
          { text: '"You\'re in the right place!"', cls: "tk-str" },
          { text: ")", cls: "tk-p" },
        ],
      },
    ];

    var seqIndex = 0;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function renderChars(seq, count) {
      var full = seq.tokens.map(function (t) { return t.text; }).join("");
      var remaining = count;
      var html = '<span class="tk-line"><span class="tk-gutter">1</span>';
      seq.tokens.forEach(function (t) {
        if (remaining <= 0) return;
        if (t.text.length <= remaining) {
          html += '<span class="' + t.cls + '">' + escapeHtml(t.text) + '</span>';
          remaining -= t.text.length;
        } else {
          html += '<span class="' + t.cls + '">' + escapeHtml(t.text.slice(0, remaining)) + '</span>';
          remaining = 0;
        }
      });
      html += '<span class="terminal__cursor"></span></span>';
      body.innerHTML = html;
      return full;
    }

    function escapeHtml(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function run() {
      var seq = SEQUENCES[seqIndex];
      titleEl.textContent = "contact." + seq.ext;
      var full = seq.tokens.map(function (t) { return t.text; }).join("");
      var i = 0;

      function typeNext() {
        renderChars(seq, i);
        if (i < full.length) {
          var ch = full[i];
          var delay = /[.,!?]/.test(ch) ? rand(220, 340) : rand(28, 78);
          i++;
          setTimeout(typeNext, delay);
        } else {
          setTimeout(deleteNext, seq.hold);
        }
      }
      function deleteNext() {
        renderChars(seq, i);
        if (i > 0) {
          i--;
          setTimeout(deleteNext, rand(14, 32));
        } else {
          setTimeout(function () {
            seqIndex = (seqIndex + 1) % SEQUENCES.length;
            run();
          }, 350);
        }
      }
      typeNext();
    }

    run();
  }

  /* ---------------- Portrait parallax ---------------- */
  function initPortraitParallax() {
    var el = document.querySelector("[data-portrait-parallax]");
    if (!el) return;
    window.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) / r.width;
      var y = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.setProperty("--px", (x * 10) + "px");
      el.style.setProperty("--py", (y * 10) + "px");
    });
    el.addEventListener("mouseleave", function () {
      el.style.setProperty("--px", "0px");
      el.style.setProperty("--py", "0px");
    });
  }

  /* ---------------- Form validation ---------------- */
  function initForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    var successEl = form.querySelector("[data-form-success]");

    function fieldWrap(name) {
      return form.querySelector('[data-field="' + name + '"]');
    }
    function setError(name, message) {
      var wrap = fieldWrap(name);
      if (!wrap) return;
      var errEl = wrap.querySelector(".field__error");
      if (message) {
        wrap.classList.add("has-error");
        errEl.textContent = message;
      } else {
        wrap.classList.remove("has-error");
        errEl.textContent = "";
      }
    }

    ["name", "email", "subject", "message"].forEach(function (name) {
      var input = form.querySelector('[name="' + name + '"]');
      if (input) {
        input.addEventListener("input", function () { setError(name, ""); });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (successEl) successEl.style.display = "none";

      var name = form.querySelector('[name="name"]').value.trim();
      var email = form.querySelector('[name="email"]').value.trim();
      var subject = form.querySelector('[name="subject"]').value.trim();
      var message = form.querySelector('[name="message"]').value.trim();

      var valid = true;
      if (name.length < 2) { setError("name", "Please enter your name."); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Please enter a valid email."); valid = false; }
      if (subject.length < 2) { setError("subject", "Please add a subject."); valid = false; }
      if (message.length < 10) { setError("message", "Message should be at least 10 characters."); valid = false; }

      if (!valid) return;

      form.reset();
      if (successEl) successEl.style.display = "block";
    });
  }
})();
