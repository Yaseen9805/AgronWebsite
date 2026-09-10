(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function smoothScrollTo(target) {
    var el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  /* ---------- Loading overlay ---------- */
  (function loadingOverlay() {
    var overlay = document.getElementById("loadingOverlay");
    if (!overlay) return;

    var hidden = false;
    function hide() {
      if (hidden) return;
      hidden = true;
      overlay.style.pointerEvents = "none";
      overlay.style.opacity = "0";
      overlay.addEventListener(
        "transitionend",
        function () {
          overlay.hidden = true;
        },
        { once: true }
      );
      window.setTimeout(function () {
        overlay.hidden = true;
      }, 600);
    }

    window.addEventListener("load", hide);
    window.setTimeout(hide, 1200);
  })();

  /* ---------- Mobile menu ---------- */
  (function mobileMenu() {
    var toggle = document.getElementById("mobileMenuToggle");
    var menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;

    function isOpen() {
      return menu.classList.contains("active");
    }

    function open() {
      menu.classList.add("active");
      toggle.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
    }

    function close() {
      menu.classList.remove("active");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      isOpen() ? close() : open();
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("click", function (e) {
      if (!isOpen()) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        close();
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1200 && isOpen()) close();
    });
  })();

  /* ---------- Scroll-to-section buttons ---------- */
  document.querySelectorAll("[data-scroll-to]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      smoothScrollTo(btn.getAttribute("data-scroll-to"));
    });
  });

  /* ---------- Ignore placeholder "#" links ---------- */
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (link && link.getAttribute("href") === "#") {
      e.preventDefault();
    }
  });

  /* ---------- Active nav link on scroll ---------- */
  (function activeNav() {
    var navLinks = document.querySelectorAll(".center-section .navbar ul a");
    if (!navLinks.length) return;

    var sections = [];
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href");
      if (id && id.charAt(0) === "#") {
        var section = document.querySelector(id);
        if (section) sections.push({ el: section, link: link });
      }
    });
    if (!sections.length) return;

    function setActive(activeLink) {
      sections.forEach(function (s) {
        s.link.classList.toggle("active-link", s.link === activeLink);
      });
    }

    function currentSection() {
      var refLine = 150; // px from top of viewport
      var current = null;
      sections.forEach(function (s) {
        var top = s.el.getBoundingClientRect().top;
        if (top <= refLine) current = s;
      });
      return current;
    }

    var suppressUntil = 0;
    var settleTimer = null;

    function scheduleUpdate() {
      if (Date.now() < suppressUntil) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(function () {
        if (Date.now() < suppressUntil) return;
        var current = currentSection();
        setActive(current ? current.link : null);
      }, 120);
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    sections.forEach(function (s) {
      s.link.addEventListener("click", function () {
        setActive(s.link);
        // Ignore scroll-driven updates while the (possibly smooth) scroll
        // to the target section is still in flight, so the highlight
        // doesn't flicker to sections passing by mid-animation.
        suppressUntil = Date.now() + 1000;
      });
    });

    setActive(currentSection() ? currentSection().link : null);
  })();

  /* ---------- Animated stat counters ---------- */
  (function statCounters() {
    var stats = document.querySelectorAll(".stat-item h3");
    if (!stats.length || !("IntersectionObserver" in window)) return;

    function animate(el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^([\d,]+)(.*)$/);
      if (!match) return;
      var target = parseInt(match[1].replace(/,/g, ""), 10);
      var suffix = match[2];
      if (isNaN(target)) return;

      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }

      var duration = 1500;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var value = Math.floor(progress * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      window.requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    stats.forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* ---------- Farmers carousel ---------- */
  (function farmersCarousel() {
    var track = document.getElementById("farmersCards");
    var prev = document.getElementById("farmersPrev");
    var next = document.getElementById("farmersNext");
    if (!track || !prev || !next) return;

    function cardStep() {
      var card = track.querySelector(".farmer-card");
      if (!card) return track.clientWidth;
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      return card.getBoundingClientRect().width + gap;
    }

    prev.addEventListener("click", function () {
      track.scrollBy({ left: -cardStep(), behavior: reduceMotion ? "auto" : "smooth" });
    });

    next.addEventListener("click", function () {
      track.scrollBy({ left: cardStep(), behavior: reduceMotion ? "auto" : "smooth" });
    });
  })();

  /* ---------- Form helpers ---------- */
  function showFeedback(el, message, isError) {
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("error", !!isError);
    el.classList.toggle("success", !isError);
  }

  /* ---------- Contact form ---------- */
  (function contactForm() {
    var form = document.getElementById("contactForm");
    var feedback = document.getElementById("contactFeedback");
    var submitBtn = form ? form.querySelector(".btn-submit") : null;
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        showFeedback(feedback, "Please fill in all required fields correctly.", true);
        return;
      }
      var original = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("is-loading");
        submitBtn.innerHTML = "Sending&hellip;";
      }
      window.setTimeout(function () {
        showFeedback(
          feedback,
          "Thanks! Your message has been received. We'll get back to you soon.",
          false
        );
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-loading");
          submitBtn.innerHTML = original;
        }
      }, 700);
    });
  })();

  /* ---------- Newsletter form ---------- */
  (function newsletterForm() {
    var form = document.getElementById("newsletterForm");
    var feedback = document.getElementById("newsletterFeedback");
    var submitBtn = form ? form.querySelector("button") : null;
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        showFeedback(feedback, "Please enter a valid name and email.", true);
        return;
      }
      var original = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("is-loading");
        submitBtn.innerHTML = "Subscribing&hellip;";
      }
      window.setTimeout(function () {
        showFeedback(feedback, "Subscribed! Watch your inbox for updates.", false);
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-loading");
          submitBtn.innerHTML = original;
        }
      }, 600);
    });
  })();

  /* ---------- Add to cart feedback ---------- */
  document.querySelectorAll(".add-to-cart").forEach(function (btn) {
    var original = btn.innerHTML;
    var resetTimer = null;
    btn.addEventListener("click", function () {
      window.clearTimeout(resetTimer);
      btn.innerHTML = 'Added <i class="fas fa-check" aria-hidden="true"></i>';
      btn.disabled = true;
      resetTimer = window.setTimeout(function () {
        btn.innerHTML = original;
        btn.disabled = false;
      }, 1500);
    });
  });

  /* ---------- Scroll reveal ---------- */
  (function scrollReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    var groups = [
      ".service-card",
      ".products-grid .product-card",
      ".product-grid .product-card",
      ".gallery-item",
      ".farmer-card",
      ".testimonial-card",
      ".blog-feature",
      ".blog-card",
      ".feature-box",
      ".stat-item",
      ".services-header",
      ".gallery-header",
      ".farmers-text",
      ".blog-header > div",
      ".contact-form > *",
    ];

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    groups.forEach(function (selector) {
      var els = document.querySelectorAll(selector);
      els.forEach(function (el, i) {
        el.classList.add("reveal-init");
        el.style.transitionDelay = Math.min(i * 70, 280) + "ms";
        observer.observe(el);
      });
    });
  })();

  /* ---------- Back to top ---------- */
  (function backToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;

    var toggleVisibility = function () {
      btn.classList.toggle("visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  })();
})();
