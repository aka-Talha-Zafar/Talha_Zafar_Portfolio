import { motion, useInView } from "framer-motion";
import { lazy, Suspense, useRef } from "react";

const StackSphere = lazy(() => import("./StackSphere"));

type Group = {
  title: string;
  accent: "primary" | "secondary" | "tertiary";
  items: string[];
};

const GROUPS: Group[] = [
  {
    title: "Core Development",
    accent: "primary",
    items: ["C", "C++", "Python", "Assembly", "FastAPI",  "HTML5", "CSS3", "Firebase"],
  },
  {
    title: "AI/ML & Data",
    accent: "secondary",
    items: ["TensorFlow", "PyTorch", "Keras", "Scikit-learn", "OpenCV", "Pandas", "NumPy", "Matplotlib", "MediaPipe", "Transformer", "CNN", "Machine Learning", "Deep Learning", "Computer Vision", "Natural Language Processing", "Data Analysis"],
  },
  {
    title: "Tools",
    accent: "tertiary",
    items: ["Git", "Linux", "VSCode", "Cursor", "Jupyter", "Kaggle", "Vercel", "HuggingFace", "GitHub", "Jira",],
  },
];

const accentClasses: Record<Group["accent"], { text: string }> = {
  primary: { text: "text-primary" },
  secondary: { text: "text-secondary" },
  tertiary: { text: "text-tertiary" },
};

const Stack = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stack" className="relative py-32" ref={ref}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-emerald-900/5 to-transparent"
      />
      <div className="container relative">
        <div className="mt-0 grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="relative order-2 hidden h-[440px] items-center justify-center lg:order-1 lg:col-span-5 lg:flex">
            <Suspense fallback={<div className="h-72 w-72 rounded-full bg-primary/10 blur-3xl" />}>
              <StackSphere />
            </Suspense>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="space-y-8">
              {GROUPS.map((group, gi) => {
                const a = accentClasses[group.accent];
                return (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.15 + gi * 0.08 }}
                  >
                    <h3 className={`font-mono text-[11px] uppercase tracking-[0.25em] ${a.text}`}>
                      {group.title}
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-[14px] py-1.5 text-[13px] font-normal tracking-[0.02em] text-foreground transition-colors duration-200 hover:border-primary/60 hover:bg-primary/[0.06]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
