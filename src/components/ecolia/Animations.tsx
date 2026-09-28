"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Returns true if the element is currently within the initial viewport */
function isAboveFold(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function EcoliaAnimations() {
  useEffect(() => {
    // Respect reduced motion preference, test environment, or skip if matchMedia not supported
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function" ||
      process.env.NODE_ENV === "test"
    ) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Helper: Split element into characters
    function splitIntoChars(el: HTMLElement): HTMLElement[] {
      const text = el.textContent || "";
      el.textContent = "";
      const out: HTMLElement[] = [];
      const parts = text.split(/(\s+)/);
      parts.forEach((part) => {
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(part));
        } else {
          const wordSpan = document.createElement("span");
          wordSpan.style.display = "inline-block";
          wordSpan.style.whiteSpace = "nowrap";
          for (let i = 0; i < part.length; i++) {
            const span = document.createElement("span");
            span.textContent = part[i];
            span.style.display = "inline-block";
            wordSpan.appendChild(span);
            out.push(span);
          }
          el.appendChild(wordSpan);
        }
      });
      return out;
    }

    // Helper: Split element into words
    function splitIntoWords(el: HTMLElement): HTMLElement[] {
      const text = el.textContent || "";
      el.textContent = "";
      const parts = text.split(/(\s+)/);
      const out: HTMLElement[] = [];
      parts.forEach((p) => {
        if (p.trim()) {
          const span = document.createElement("span");
          span.textContent = p;
          span.style.display = "inline-block";
          el.appendChild(span);
          out.push(span);
        } else {
          el.appendChild(document.createTextNode(p));
        }
      });
      return out;
    }

    const ctx = gsap.context(() => {
      // 1. Title Character & Word Entrance Animations (.title-anim)
      const titleElements = document.querySelectorAll<HTMLElement>(".title-anim");
      titleElements.forEach((el) => {
        const a = parseFloat(el.getAttribute("data-stagger") || "") || 0.02;
        const ex = parseFloat(el.getAttribute("data-translateX") || "") || 20;
        const ry = el.getAttribute("data-translateY");
        const r = ry !== null && ry !== "" ? parseFloat(ry) : false;
        const dataY = el.getAttribute("data-y");
        const yOnly = dataY !== null && dataY !== "" ? parseFloat(dataY) : null;
        const o = (el.getAttribute("data-on-scroll") ?? "1") === "1";
        const delay = parseFloat(el.getAttribute("data-delay") || "") || 0.1;
        const ease = el.getAttribute("data-ease") || "power2.out";

        const raw = (el.textContent || "").trim();
        const useChars = raw.length <= 60;
        const targets = useChars ? splitIntoChars(el) : splitIntoWords(el);
        if (!targets.length) return;

        gsap.set(targets, { willChange: "transform,opacity" });

        const fromVars: gsap.TweenVars = {
          duration: 0.9,
          delay,
          autoAlpha: 0,
          ease,
          stagger: a,
          onComplete: () => {
            gsap.set(targets, { clearProps: "willChange" });
          },
        };

        // data-y attribute: y-only stagger (blog card titles use this)
        if (yOnly !== null) {
          fromVars.y = yOnly;
          fromVars.x = 0;
        } else if (ex > 0 && !r) {
          fromVars.x = ex;
        } else if (r && !ex) {
          fromVars.y = r;
        } else if (ex && r) {
          fromVars.x = ex;
          fromVars.y = r;
        } else {
          fromVars.x = 25;
        }

        // Above-fold elements (already in viewport): skip ScrollTrigger, animate on load
        const aboveFold = isAboveFold(el);
        if (o && !aboveFold) {
          fromVars.scrollTrigger = {
            trigger: el,
            start: "top 90%",
            once: true,
          };
        }

        gsap.from(targets, fromVars);
      });

      // 2. Fade Up Scroll Entrance Animations (.fade-anim)
      const fadeElements = document.querySelectorAll<HTMLElement>(".fade-anim");
      fadeElements.forEach((t) => {
        const direction = t.getAttribute("data-fade-from") || "bottom";
        const duration = parseFloat(t.getAttribute("data-duration") || "") || 0.6;
        const offset = parseFloat(t.getAttribute("data-fade-offset") || "") || 40;
        const delay = parseFloat(t.getAttribute("data-delay") || "") || 0.1;
        const ease = t.getAttribute("data-ease") || "power2.out";
        const onScroll = (t.getAttribute("data-on-scroll") ?? "1") === "1";

        const vars: gsap.TweenVars = {
          opacity: 0,
          ease,
          duration,
          delay,
        };

        if (direction === "top") vars.y = -offset;
        else if (direction === "bottom") vars.y = offset;
        else if (direction === "left") vars.x = -offset;
        else if (direction === "right") vars.x = offset;

        // Above-fold: skip ScrollTrigger
        const aboveFold = isAboveFold(t);
        if (onScroll && !aboveFold) {
          vars.scrollTrigger = {
            trigger: t,
            start: "top 90%",
            once: true,
          };
        }

        gsap.from(t, vars);
      });

      // 3. Image Shrink-In Entrance Animations (.tools-img, .home-blog-img)
      // NOTE: .about-hero-gallery-banner is handled separately below (staggered per-column)
      const shrinkImages = document.querySelectorAll<HTMLElement>(
        ".tools-img, .home-blog-img"
      );
      shrinkImages.forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.15, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      // 3b. About Hero Gallery — staggered CSS keyframe entrance per column
      // Initial state is set via CSS (opacity:0, translateY:80px).
      // We add .gallery-animate class which triggers the CSS @keyframes animation.
      // This approach is independent of GSAP initialization timing.
      const galleryWrap = document.querySelector<HTMLElement>(".about-hero-gallery-wrap");
      const galleryCols = document.querySelectorAll<HTMLElement>("[data-gallery-col]");
      if (galleryWrap && galleryCols.length > 0) {
        const galleryRect = galleryWrap.getBoundingClientRect();
        const inViewAtLoad = galleryRect.top < window.innerHeight;

        const triggerGallery = () => {
          galleryCols.forEach((col) => col.classList.add("gallery-animate"));
        };

        if (inViewAtLoad) {
          // Already partially in viewport at load — trigger after short delay
          setTimeout(triggerGallery, 400);
        } else {
          // Below fold: use ScrollTrigger
          ScrollTrigger.create({
            trigger: galleryWrap,
            start: "top 90%",
            once: true,
            onEnter: triggerGallery,
          });
        }
      }

      // 4. Hero Pill Badge Card Slide-in Entrance (.hero-absolute-box)
      const heroAbsoluteBox = document.querySelector<HTMLElement>(".hero-absolute-box");
      if (heroAbsoluteBox) {
        gsap.fromTo(
          heroAbsoluteBox,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            delay: 0.4,
            ease: "power3.out",
          }
        );
      }

      // 5. Hero & Image Curtain Reveal Overlays (.hero-img-overlay)
      const overlays = document.querySelectorAll<HTMLElement>(".hero-img-overlay");
      overlays.forEach((overlay) => {
        gsap.fromTo(
          overlay,
          { opacity: 0.6 },
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: overlay,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      // 6. Staggered Box Visible Entrance (.box-visible)
      const boxContainers = document.querySelectorAll<HTMLElement>(".box-visible");
      boxContainers.forEach((boxContainer) => {
        const boxDelay = +(boxContainer.getAttribute("data-delay") || 0);
        const boxStagger = +(boxContainer.getAttribute("data-stagger") || 0.08);
        const boxItems = boxContainer.querySelectorAll<HTMLElement>(".visible-item, .footer-list-item");
        if (boxItems.length > 0) {
          gsap.fromTo(
            boxItems,
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: boxStagger,
              delay: boxDelay,
              ease: "power2.out",
              scrollTrigger: {
                trigger: boxContainer,
                start: "top 90%",
                once: true,
              },
            }
          );
        }
      });


      // 8. Service Hero Video Wrap — slide up
      const serviceVideoWrap = document.querySelector<HTMLElement>(".service-hero-video-inner");
      if (serviceVideoWrap) {
        gsap.fromTo(
          serviceVideoWrap,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: serviceVideoWrap,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      // 9. Blog details rich text — line-by-line paragraph animation
      const blogRichText = document.querySelector<HTMLElement>(".blog-details-rich-text");
      if (blogRichText) {
        const richItems = blogRichText.querySelectorAll<HTMLElement>("p, h4, h5, ul, blockquote");
        if (richItems.length > 0) {
          gsap.fromTo(
            richItems,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.07,
              ease: "power2.out",
              scrollTrigger: {
                trigger: blogRichText,
                start: "top 90%",
                once: true,
              },
            }
          );
        }
      }

      // 10. Contact form / contact info fade-in
      const contactItems = document.querySelectorAll<HTMLElement>(
        ".contact-info-item, .contact-form-wrap"
      );
      contactItems.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      // Refresh ScrollTrigger after all fonts and layout settle
      // Use requestAnimationFrame + timeout for most reliable timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 300);
        });
      });

      // Also refresh on window load (images loaded)
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad, { once: true });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
