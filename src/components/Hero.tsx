// Hero.tsx
// Change from the version you have:
//   The NeuralHero wrapper div must have NO background and NO overflow:hidden.
//   mix-blend-mode:screen on the canvas makes the black clear-color invisible,
//   but only if nothing clips or tints the canvas from the outside.
//
// The only line changed vs your existing Hero.tsx is the wrapper div for NeuralHero:
//   Before: className="h-[480px] items-center justify-center lg:col-span-5 lg:flex"
//   After:  same classes but add  style={{ background: "transparent" }}
//           and ensure overflow is NOT hidden on this div.
//
// Everything else in Hero.tsx is identical to what you already have.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MagneticButton from "./MagneticButton";

const NeuralHero = lazy(() => import("./NeuralHero"));
import HeroStarfield from "./HeroStarfield";

const PHRASES = [
  "End-to-End Intelligent Systems.",
  "Deep Learning.",
  "Natural Language Processing.",
  "Computer Vision.",
];

const Typewriter = () => {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(PHRASES[i]);
      const t = setTimeout(() => setI((p) => (p + 1) % PHRASES.length), 2400);
      return () => clearTimeout(t);
    }
    const full = PHRASES[i];
    if (!deleting && text === full) {
      const t = setTimeout(() => setDeleting(true), 1600);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((p) => (p + 1) % PHRASES.length);
      return;
    }
    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? full.slice(0, prev.length - 1) : full.slice(0, prev.length + 1),
      );
    }, deleting ? 35 : 70);
    return () => clearTimeout(t);
  }, [text, deleting, i]);

  return (
    <span className="font-display text-2xl font-medium text-primary md:text-3xl">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[2px] bg-primary align-middle animate-blink" />
    </span>
  );
};

const Hero = () => {
  const [webglOk, setWebglOk] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      setWebglOk(!!gl);
    } catch {
      setWebglOk(false);
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center pt-28"
      style={{ overflow: "visible" }}
    >
      {/* Starfield background */}
      <HeroStarfield />

      {/* Ambient radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-radial-glow)" }}
      />

      <div className="container relative z-[1] grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
        {/* ── Left column — text ─────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
          >
            Machine Learning Engineer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display mt-5 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl"
          >
            <span className="text-gradient">Talha Zafar</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 h-10"
          >
            <Typewriter />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Crafting intelligent systems from concept to production, Specializing in AI/ML development with a focus on Deep Learning & NLP architecture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton variant="primary" onClick={() => navigate("/projects")}>
              View Projects
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={() => navigate("/contact")}>
              Get in Touch
            </MagneticButton>
          </motion.div>
        </div>

        {/* ── Right column — Neural Network ──────────────────────────────── */}
        {/*
          KEY CHANGES vs previous version:
          1. No background on this div (transparent by default — good)
          2. No overflow-hidden — don't clip the canvas
          3. The canvas inside uses mix-blend-mode:screen so its black
             background is invisible and the glow floats on the page bg
        */}
        <div
          className="relative h-[480px] items-center justify-center lg:col-span-5 lg:flex"
          style={{ background: "transparent", overflow: "visible" }}
        >
          {webglOk ? (
            <Suspense
              fallback={
                <div className="h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
              }
            >
              <NeuralHero />
            </Suspense>
          ) : (
            <div
              aria-hidden
              className="h-80 w-80 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, hsl(199 89% 60% / 0.55), hsl(234 89% 74% / 0.3) 40%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          scroll
        </span>
        <span className="block h-10 w-px overflow-hidden bg-muted-foreground/20">
          <span className="block h-full w-full bg-primary animate-scroll-line" />
        </span>
      </div>
    </section>
  );
};

export default Hero;