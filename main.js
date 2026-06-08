(function () {
  "use strict";

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
  const PHONE_MIN_DIGITS = 10;

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navBackdrop = document.getElementById("nav-backdrop");
  const scrollProgress = document.getElementById("scroll-progress");
  const navLinks = document.querySelectorAll("[data-nav]");
  const form = document.getElementById("apply-form");
  const submitBtn = document.getElementById("submit-btn");
  const formStatus = document.getElementById("form-status");
  const yearEl = document.getElementById("year");

  const SERVICE_MAP = {
    gst: "GST Registration & Return Filing",
    "pvt-ltd": "Private Limited Company Registration",
    msme: "MSME / UDYAM Registration",
    "pf-esi": "PF & ESIC Compliance",
    dsc: "Digital Signature Procurement",
    "income-tax": "Income Tax E-Filing",
    iec: "IEC (Import Export Code)",
    "tds-tcs": "TDS & TCS Filing",
    bookkeeping: "Accounts Bookkeeping",
    audit: "Internal Auditing",
    project: "Project Report Preparation",
    registrations: "PAN, TAN & Registrations",
  };

  // Set copyright year
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ===== NAVIGATION FUNCTIONS =====

  function setMenuOpen(open) {
    if (!navToggle || !navMenu) return;
    const isOpen = open;

    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    navMenu.classList.toggle("is-open", isOpen);
    navMenu.setAttribute("aria-hidden", String(!isOpen));

    if (navBackdrop) {
      navBackdrop.classList.toggle("is-open", isOpen);
      navBackdrop.setAttribute("aria-hidden", String(!isOpen));
    }

    document.body.classList.toggle("nav-open", isOpen);

    if (!isOpen) {
      navMenu.querySelectorAll(".nav__item").forEach(function (item) {
        item.style.animation = "none";
        void item.offsetWidth;
        item.style.animation = "";
      });
    }
  }

  // Nav toggle button
  if (navToggle) {
    navToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });
  }

  // Backdrop click to close
  if (navBackdrop) {
    navBackdrop.addEventListener("click", function () {
      setMenuOpen(false);
    });
  }

  // Escape key to close
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setMenuOpen(false);
    }
  });

  // Close menu when nav links are clicked
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  // ===== SMOOTH SCROLLING =====

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      setMenuOpen(false);
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (header ? header.offsetHeight : 0) -
        8;
      window.scrollTo({ top: top, behavior: "smooth" });
      history.pushState(null, "", id);
    });
  });

  // ===== ACTIVE NAV & SCROLL PROGRESS =====

  const navSectionIds = ["home", "about-sba", "about", "services", "apply"];
  const sections = navSectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateActiveNav() {
    const scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 120;
    let current = "home";
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section.id;
      }
    });
    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    if (scrollProgress) {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = pct + "%";
    }
    updateActiveNav();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ===== COUNTER ANIMATION =====

  function animateCounter(el, target, duration) {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = String(target);
      }
    }
    requestAnimationFrame(tick);
  }

  const statNums = document.querySelectorAll(".stat-card__num[data-count]");
  if (statNums.length && "IntersectionObserver" in window) {
    const statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          if (!isNaN(target) && !el.dataset.counted) {
            el.dataset.counted = "true";
            animateCounter(el, target, 1600);
          }
          statObserver.unobserve(el);
        });
      },
      { threshold: 0.4 },
    );
    statNums.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  // ===== SCROLL REVEAL =====

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ===== SERVICE CARD CLICK TO APPLY =====

  document.querySelectorAll(".service-card").forEach(function (card) {
    card.style.cursor = "pointer";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    function goToApply() {
      const key = card.getAttribute("data-service");
      const select = document.getElementById("service");
      const value = SERVICE_MAP[key];
      if (select && value) {
        select.value = value;
      }
      setMenuOpen(false);
      const applyEl = document.getElementById("apply");
      if (applyEl) {
        const top =
          applyEl.getBoundingClientRect().top +
          window.scrollY -
          (header ? header.offsetHeight : 0) -
          8;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    }

    card.addEventListener("click", goToApply);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToApply();
      }
    });
  });

  // ===== FORM VALIDATION & SUBMISSION =====

  function digitsOnly(str) {
    return (str || "").replace(/\D/g, "");
  }

  function showError(id, message) {
    const input = document.getElementById(id);
    const err = document.getElementById(id + "-error");
    if (input) {
      input.classList.toggle("is-invalid", Boolean(message));
      input.setAttribute("aria-invalid", Boolean(message));
    }
    if (err) {
      err.textContent = message || "";
    }
  }

  function clearErrors() {
    ["name", "phone", "service"].forEach(function (id) {
      showError(id, "");
    });
  }

  function validateForm() {
    clearErrors();
    let valid = true;
    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const service = document.getElementById("service");

    const nameVal = (name && name.value.trim()) || "";
    if (nameVal.length < 2) {
      showError("name", "Please enter your full name.");
      valid = false;
    }

    const phoneDigits = digitsOnly(phone && phone.value);
    if (phoneDigits.length < PHONE_MIN_DIGITS) {
      showError(
        "phone",
        "Please enter a valid phone number (at least 10 digits).",
      );
      valid = false;
    }

    if (!service || !service.value) {
      showError("service", "Please select a service.");
      valid = false;
    }

    return valid;
  }

  function setFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = "form__status";
    if (type) {
      formStatus.classList.add("is-" + type);
    }
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle("is-loading", loading);
  }

  if (form) {
    form.setAttribute("action", FORMSPREE_ENDPOINT);
    form.setAttribute("novalidate", "");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      setFormStatus("");

      if (!validateForm()) {
        setFormStatus("Please fix the errors above.", "error");
        return;
      }

      if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
        setFormStatus(
          "Form is not connected yet. Replace YOUR_FORM_ID in main.js with your Formspree form ID.",
          "error",
        );
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          form.reset();
          clearErrors();
          setFormStatus(
            "Thank you! Your application was submitted. We will contact you within one business day.",
            "success",
          );
        } else {
          const data = await response.json().catch(function () {
            return {};
          });
          const msg =
            (data.errors &&
              data.errors
                .map(function (err) {
                  return err.message;
                })
                .join(" ")) ||
            "Something went wrong. Please try again or call us directly.";
          setFormStatus(msg, "error");
        }
      } catch (err) {
        setFormStatus(
          "Network error. Please check your connection and try again.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    });

    // Clear errors on input
    ["name", "phone", "service"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", function () {
          showError(id, "");
        });
        el.addEventListener("change", function () {
          showError(id, "");
        });
      }
    });
  }

  // ===== WHATSAPP BUTTON MOBILE HANDLING =====
  const whatsappBtn = document.querySelector(".whatsapp-float");

  if (whatsappBtn) {
    // For mobile: open in same tab (better for PWA/standalone mode)
    if (/Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)) {
      whatsappBtn.addEventListener("click", function (e) {
        // Check if WhatsApp is installed
        const start = Date.now();

        // Try to open WhatsApp
        setTimeout(function () {
          const end = Date.now();
          // If no response within 500ms, probably WhatsApp isn't installed
          if (end - start < 600) {
            // WhatsApp opened successfully
            return;
          }
          // Fallback: open WhatsApp Web
          window.open(whatsappBtn.href, "_blank");
        }, 100);
      });
    }

    // Hide WhatsApp button when scrolling near footer
    let scrollTimeout;
    window.addEventListener(
      "scroll",
      function () {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(function () {
          const footer = document.querySelector(".footer");
          if (footer) {
            const footerTop = footer.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (footerTop < windowHeight + 100) {
              whatsappBtn.style.opacity = "0";
              whatsappBtn.style.pointerEvents = "none";
            } else {
              whatsappBtn.style.opacity = "1";
              whatsappBtn.style.pointerEvents = "auto";
            }
          }
        }, 50);
      },
      { passive: true },
    );
  }

  // ===== IMAGE LAZY LOADING =====
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window && lazyImages.length) {
    const imageObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;

            // If the image has a data-src, load it
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }

            // Add loaded class when image is fully loaded
            img.onload = function () {
              img.classList.add("loaded");
            };

            // If image is already cached and loaded
            if (img.complete) {
              img.classList.add("loaded");
            }

            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      },
    );

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(function (img) {
      img.classList.add("loaded");
    });
  }
})();
