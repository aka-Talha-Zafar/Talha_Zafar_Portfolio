import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Github } from "lucide-react";

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
    {children}
  </span>
);

const Waveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const draw = () => {
      const w = c.clientWidth;
      const h = c.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.2;
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const amp = 14 - layer * 3;
        const freq = 0.018 + layer * 0.006;
        const speed = 0.015 + layer * 0.005;
        const baseY = h / 2 + (layer - 1) * 6;
        for (let x = 0; x <= w; x += 2) {
          const y = baseY + Math.sin(x * freq + t * speed) * amp * Math.sin(x * 0.004 + t * 0.01);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = layer === 0 ? "hsl(199 89% 60% / 0.55)" : layer === 1 ? "hsl(234 89% 74% / 0.35)" : "hsl(199 89% 60% / 0.18)";
        ctx.stroke();
      }
      t += reduced ? 0 : 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />;
};

const Card = ({
  children,
  className = "",
  accent = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  accent?: "primary" | "secondary";
}) => (
  <div
    className={`group relative isolate overflow-hidden rounded-2xl glass-strong p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.4)] ${className}`}
  >
    <span
      aria-hidden
      className={`absolute inset-x-6 top-0 h-px ${accent === "primary" ? "bg-gradient-to-r from-transparent via-primary to-transparent" : "bg-gradient-to-r from-transparent via-secondary to-transparent"}`}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-60"
      style={{
        background:
          accent === "primary"
            ? "radial-gradient(circle at 80% -10%, hsl(199 89% 60% / 0.15), transparent 60%)"
            : "radial-gradient(circle at 80% -10%, hsl(234 89% 74% / 0.18), transparent 60%)",
      }}
    />
    <div className="relative">{children}</div>
  </div>
);

const SignVerse = () => (
  <Card className="lg:col-span-2" accent="primary">
    <Waveform />
    <div className="relative">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
          ⟶ Featured
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <h3 className="font-display mt-5 text-3xl font-semibold md:text-4xl">SignVerse</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Bidirectional ASL Translation Platform
      </p>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        A full-stack AI platform enabling real-time bidirectional translation between American Sign
        Language and English text. The sign recognition module uses a Conv1D stem with a Transformer
        Encoder trained on 250 ASL classes using MediaPipe Holistic landmark extraction. The
        text-to-sign module is retrieval-based, animating holistic keyframe sequences through a
        Three.js avatar powered by KalidoKit. Deployed across a React/Vite frontend on Vercel and a
        FastAPI backend on HuggingFace Spaces.
      </p>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {["Python", "PyTorch", "MediaPipe", "FastAPI", "React", "Three.js", "HuggingFace", "Vercel"].map(
          (t) => (
            <Pill key={t}>{t}</Pill>
          ),
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#"
          className="group/btn inline-flex items-center gap-2 rounded-full border border-primary/50 px-4 py-2 text-xs font-medium text-primary transition-all hover:bg-primary/10 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)]"
        >
          Live Demo
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-foreground/85 transition-all hover:border-white/30 hover:text-foreground"
        >
          <Github className="h-3.5 w-3.5" />
          GitHub
        </a>
      </div>
    </div>
  </Card>
);

const Pneumonia = () => (
  <Card accent="secondary">
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-secondary">
        ⟶ Research
      </span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
    <h3 className="font-display mt-5 text-2xl font-semibold">Pneumonia Detection</h3>
    <p className="mt-1 text-sm text-muted-foreground">Deep Learning on Chest Radiographs</p>
    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
      Chest X-ray classification using ResNet50, VGG16, and GoogLeNet with Grad-CAM explainability
      for visual diagnosis support.
    </p>
    <div className="mt-5 flex flex-wrap gap-1.5">
      {["Python", "ResNet50", "TensorFlow", "Grad-CAM", "OpenCV"].map((t) => (
        <Pill key={t}>{t}</Pill>
      ))}
    </div>
    <div className="mt-7">
      <button
        disabled
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-muted-foreground/60"
      >
        Paper
        <span className="font-mono text-[10px] text-muted-foreground/60">— pending</span>
      </button>
    </div>
  </Card>
);

const Ghost = () => (
  <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-white/10 p-8">
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/60">
      More coming soon
    </p>
  </div>
);

const Projects = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative pt-20 pb-32" ref={ref}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-emerald-900/5 to-transparent"
      />
      <div className="container relative">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display mt-0 text-4xl font-semibold tracking-tight md:text-6xl"
        >
          Projects
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          <SignVerse />
          <Pneumonia />
          <Ghost />
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
