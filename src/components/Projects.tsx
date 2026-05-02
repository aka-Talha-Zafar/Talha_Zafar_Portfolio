import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ProjectButton = {
  label: string;
  href: string;
  isPrimary?: boolean;
  isPending?: boolean;
  icon?: "github";
};

type Project = {
  id: string;
  title: string;
  label: string;
  shortDesc: string;
  summary: string;
  fullDesc: string;
  stacks: string[];
  accent: "primary" | "secondary";
  hasWaveform: boolean;
  buttons: ProjectButton[];
};

const PROJECTS_DATA: Project[] = [
  {
    id: "signverse",
    title: "SignVerse",
    label: "Featured",
    shortDesc: "Bidirectional ASL translation between sign language and text.",
    summary:
      "A compact summary of the project is shown here, with the full details available on the Projects page.",
    fullDesc: "SignVerse is a comprehensive ASL-to-text and text-to-ASL translation system that bridges communication gaps. Using advanced computer vision with MediaPipe for hand pose detection and deep learning models trained on extensive ASL datasets, it provides real-time translation. The FastAPI backend handles processing while the React frontend offers an intuitive interface with Three.js 3D visualizations. Deployed on Vercel, it processes video input and generates natural sign language animations or text transcriptions with high accuracy.",
    stacks: ["Python", "PyTorch", "MediaPipe", "FastAPI", "React", "Three.js", "HuggingFace", "Vercel"],
    accent: "primary",
    hasWaveform: true,
    buttons: [
      { label: "Live Demo", href: "https://sign-verse-self.vercel.app/", isPrimary: true },
      { label: "GitHub", href: "https://github.com/aka-Talha-Zafar/SignVerse", icon: "github" },
    ],
  },
  {
    id: "pneumonia",
    title: "Pneumonia Detection",
    label: "Research",
    shortDesc: "Deep Learning on Chest Radiographs",
    summary:
      "Chest X-ray classification using multiple deep learning models with explainable AI support for diagnosis.",
    fullDesc: "This project implements an advanced deep learning system for pneumonia detection in chest X-rays using multiple state-of-the-art architectures including ResNet50, VGG16, and GoogLeNet. The model employs Grad-CAM (Gradient-weighted Class Activation Mapping) to provide explainable AI insights, highlighting regions of interest in the X-rays that contribute to the diagnosis. OpenCV is used for image preprocessing and augmentation. The system achieves high accuracy and sensitivity, making it a viable tool for radiologists to expedite diagnosis and reduce manual review time.",
    stacks: ["Python", "ResNet50", "TensorFlow", "Grad-CAM", "OpenCV"],
    accent: "secondary",
    hasWaveform: false,
    buttons: [
      { label: "Paper", href: "#", isPending: true },
    ],
  },
];

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-transparent px-4 py-1.5 text-[13px] font-normal leading-none tracking-[0.02em] text-muted-foreground whitespace-nowrap">
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
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: "primary" | "secondary";
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={`group relative isolate overflow-hidden rounded-2xl glass-strong p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.4)] ${onClick ? "cursor-pointer" : ""} ${className}`}
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
      <div className="relative flex h-full flex-col">{children}</div>
  </div>
);

const ProjectModal = ({ project, isOpen, onClose }: { project: Project | null; isOpen: boolean; onClose: () => void }) => {
  if (!project) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/10 bg-gradient-to-br from-slate-950 to-slate-900 p-0">
        <DialogHeader className="border-b border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${project.accent === "primary" ? "text-primary" : "text-secondary"}`}>
                ⟶ {project.label}
              </span>
              <DialogTitle className="font-display mt-2 text-[32px] font-semibold leading-[1.02] tracking-[-0.03em]">
                {project.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Description</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{project.fullDesc}</p>
          </div>
          
          <div>
            <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.stacks.map((tech) => (
                <Pill key={tech}>{tech}</Pill>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 pt-4">
            {project.buttons.map((btn) => (
              btn.isPending ? (
                <button
                  key={btn.label}
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-muted-foreground/60"
                >
                  {btn.label}
                  <span className="font-mono text-[10px]">— pending</span>
                </button>
              ) : (
                <a
                  key={btn.label}
                  href={btn.href}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                    btn.isPrimary
                      ? "border-primary/50 text-primary hover:bg-primary/10 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)]"
                      : "border-white/15 text-foreground/85 hover:border-white/30 hover:text-foreground"
                  }`}
                >
                  {btn.label}
                  {btn.icon === "github" && <Github className="h-3.5 w-3.5" />}
                  {btn.isPrimary && <ArrowUpRight className="h-3.5 w-3.5" />}
                </a>
              )
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => (
  <div className="aspect-square">
    <Card className="h-full flex cursor-pointer flex-col" accent={project.accent} onClick={onClick}>
      {project.hasWaveform && <Waveform />}
      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-3">
          <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${project.accent === "primary" ? "text-primary" : "text-secondary"}`}>
            ⟶ {project.label}
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <h3 className="font-display mt-5 text-[32px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[32px]">
          {project.title}
        </h3>
        <p className="mt-1 min-h-[40px] text-sm leading-snug text-muted-foreground">
          {project.shortDesc}
        </p>
        <p className="mt-4 min-h-[68px] text-sm leading-relaxed text-muted-foreground/80">
          {project.summary}
        </p>
        <div className="mt-5 flex min-h-[76px] flex-wrap content-start gap-2">
          {project.stacks.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
        <div className="mt-auto pt-5 flex flex-wrap gap-3">
          {project.buttons.map((btn) => (
            btn.isPending ? (
              <button
                key={btn.label}
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-muted-foreground/60"
              >
                {btn.label}
                <span className="font-mono text-[10px]">— pending</span>
              </button>
            ) : (
              <a
                key={btn.label}
                href={btn.href}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                  btn.isPrimary
                    ? "group/btn border-primary/50 text-primary hover:bg-primary/10 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)]"
                    : "border-white/15 text-foreground/85 hover:border-white/30 hover:text-foreground"
                }`}
              >
                {btn.label}
                {btn.icon === "github" && <Github className="h-3.5 w-3.5" />}
                {btn.isPrimary && <ArrowUpRight className="h-3.5 w-3.5" />}
              </a>
            )
          ))}
        </div>
      </div>
    </Card>
  </div>
);

const Ghost = () => (
  <div className="aspect-square">
    <div className="relative flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 p-8">
      <Waveform />
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/60 relative z-10">
        More coming soon
      </p>
    </div>
  </div>
);

const Projects = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS_DATA[0] | null>(null);

  return (
    <>
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
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
        >
          {PROJECTS_DATA.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
          <Ghost />
        </motion.div>
        <div className="mt-8 flex justify-center">
          <a
            href="/projects"
            className="rounded-full border border-primary/60 bg-primary/5 px-6 py-3 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/15 hover:text-foreground hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)]"
          >
            View all projects
          </a>
        </div>
      </div>
    </section>
    <ProjectModal
      project={selectedProject}
      isOpen={!!selectedProject}
      onClose={() => setSelectedProject(null)}
    />
    </>
  );
};

export default Projects;
