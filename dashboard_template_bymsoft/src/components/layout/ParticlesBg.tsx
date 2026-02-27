import React, { useEffect } from "react";

export default function ParticlesBg(): JSX.Element {
  useEffect(() => {
    let mounted = true;

    const cfg = {
      particles: {
        number: { value: 30, density: { enable: true, value_area: 1000 } },
        color: { value: "#ffffff" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 5 },
        },
        opacity: { value: 0.9, random: false, anim: { enable: false } },
        size: { value: 2.5, random: true, anim: { enable: false } },
        line_linked: {
          enable: true,
          distance: 300,
          color: "#ffffff",
          opacity: 0.15,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: false },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: { push: { particles_nb: 4 } },
      },
      retina_detect: true,
    };

    function initWithGlobal() {
      try {
        // @ts-ignore
        if ((window as any).particlesJS && mounted) {
          // @ts-ignore
          (window as any).particlesJS("particles-js", cfg);
          console.debug("particles.js initialized via global");
        }
      } catch (e) {
        console.error("particles.js init error", e);
      }
    }

    if ((window as any).particlesJS) {
      initWithGlobal();
      return () => {
        mounted = false;
      };
    }

    const s = document.createElement("script");
    s.src =
      "https://cdn.jsdelivr.net/gh/VincentGarreau/particles.js/particles.min.js";
    s.async = true;
    s.onload = () => {
      if (!mounted) return;
      console.debug("particles.js script loaded");
      initWithGlobal();
    };
    s.onerror = (err) => console.error("Failed to load particles.js", err);
    document.body.appendChild(s);

    return () => {
      mounted = false;
      try {
        const container = document.getElementById("particles-js");
        if (container) container.innerHTML = "";
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  return (
    <div
      id="particles-js"
      className="absolute inset-0 pointer-events-none"
      aria-hidden
    />
  );
}
