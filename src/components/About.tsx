import { motion } from "framer-motion";
import { useInView } from "framer-motion";
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
    items: ["Git", "GitHub", "Linux", "VSCode", "Cursor", "Jupyter Notebook", "Kaggle", "Vercel", "HuggingFace", "Jira",],
  },
];

const accentClasses: Record<Group["accent"], { text: string }> = {
  primary: { text: "text-primary" },
  secondary: { text: "text-secondary" },
  tertiary: { text: "text-tertiary" },
};

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative pt-20 pb-32" ref={ref}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-emerald-900/5 to-transparent"
      />
      <div className="container relative grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display mt-0 text-4xl font-semibold tracking-tight md:text-6xl"
          >
            About
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-16 max-w-none space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            <p>
              I'm <span className="font-semibold text-foreground">Talha Zafar</span>, a CS graduate from <span className="font-semibold text-foreground">Lahore Garrison University</span> specializing in AI/ML. I build intelligent systems across computer vision and NLP, with a couple of shipped projects in the AI space that I'm genuinely proud of. I've also done two internships in mobile development, one on-site at <span className="font-semibold text-foreground">Naseeb Online Services (Pvt)Ltd - [Rozee.pk]</span> and one fully remote with <span className="font-semibold text-foreground">Chelan Technologies</span>, a US-based team, which taught me as much about working in real engineering environments as any technical project did.
            </p>
            <p>
              Outside of ML, I'm comfortable across the stack Linux, Jira, Kaggle, and HuggingFace, from wrangling datasets to managing model versioning and deployments. I have a habit of picking up problems that aren't assigned to me and figuring them out anyway, that's just how I'm wired. If it's broken, undertested, or just interesting enough, I'm probably already looking into it.
            </p>
          </motion.div>

          <div className="mt-32 grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
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
      </div>
    </section>
  );
};

export default About;
