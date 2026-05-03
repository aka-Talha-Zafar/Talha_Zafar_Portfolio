import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const COURSES = [
  "Python Programming",
  "Object-Oriented Programming",
  "Data Structures & Algorithms",
  "Assembly Language",
  "Database Management Systems",
  "Operating Systems",
  "Computer Networks",
  "Cloud Computing",
  "Software Engineering",
  "Web Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
];

const KEY_SKILLS = [
  { name: "Python",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Pandas",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
  { name: "NumPy",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
  { name: "Scikit-learn", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },
  { name: "Matplotlib",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg" },
  { name: "PyTorch",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  { name: "OpenCV",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
  { name: "MediaPipe",    icon: "/images/mediapipe.png", whiteBg: true },
  { name: "Git",          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invert: true },
  { name: "Firebase",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg" },
];

const Education = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="relative pt-20 pb-32" ref={ref}>
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
          Education
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <div className="relative mx-auto max-w-4xl">
            <div className="group relative isolate overflow-hidden rounded-2xl glass-strong p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.4)]">
              <span
                aria-hidden
                className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
              />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr] md:gap-10">
                {/* LGU placeholder logo (matching other cards) */}
                <div className="flex items-start justify-center md:pt-1">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] shadow-[0_8px_24px_hsl(var(--primary)/0.06)] overflow-hidden">
                    <img
                      src="/images/lgu_logo.png"
                      alt="Lahore Garrison University logo"
                      className="h-full w-full rounded-full object-cover object-center"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                    Bachelor's in Computer Science
                  </h3>
                  <p className="mt-1 text-base text-muted-foreground">Lahore Garrison University</p>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
                    <span className="text-foreground/90">Nov 2022 – Jun 2026</span>
                  </div>
                </div>
              </div>

              {/* Coursework */}
              <div className="mt-8 border-t border-white/8 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
                  Relevant Courses
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                  {COURSES.map((c) => (
                    <li
                      key={c}
                      className="flex items-center gap-3 font-mono text-xs text-foreground/85"
                    >
                      <span className="text-primary/70">›</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Skills */}
              <div className="mt-8 border-t border-white/8 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
                  Key Skills
                </p>
                <div className="mt-4 flex flex-wrap gap-4 items-center">
                  {KEY_SKILLS.map((skill) => (
                    <div
                      key={skill.name}
                      className={`h-12 w-12 flex-shrink-0 ${skill.whiteBg ? "rounded-full bg-white p-1.5" : ""}`}
                      title={skill.name}
                    >
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        loading="lazy"
                        className="h-full w-full object-contain"
                        style={skill.invert ? { filter: "invert(1)" } : undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;