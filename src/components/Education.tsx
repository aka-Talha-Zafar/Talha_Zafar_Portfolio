import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const COURSES = [
  "Data Structures & Algorithms",
  "Artificial Intelligence",
  "Computer Vision",
  "Digital Image Processing",
  "Operating Systems",
  "Machine Learning",
  "Deep Learning",
  "Programming with Python",
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
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-primary/20 bg-[hsl(220_40%_5%)] shadow-[0_0_60px_-20px_hsl(var(--primary)/0.5)]">
            {/* macOS-style title bar */}
            <div className="flex items-center gap-2 border-b border-white/8 bg-[hsl(220_30%_8%)] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28CA41]" />
              <span className="flex-1 text-center font-mono text-[11px] text-muted-foreground/80">
                talha — zsh — ~/education/lgu
              </span>
              <span className="w-12" />
            </div>

            {/* Body */}
            <div className="p-8 md:p-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr] md:gap-10">
                {/* LGU placeholder logo */}
                <div className="flex items-start justify-center md:pt-1">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-primary/40 bg-primary/5 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)]">
                    <span className="absolute inset-2 rounded-full border border-primary/20" />
                    <span className="font-display text-2xl font-bold tracking-tight text-primary">
                      LGU
                    </span>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">
                    $ cat degree.json
                  </p>
                  <h3 className="font-display mt-3 text-2xl font-semibold text-foreground md:text-3xl">
                    Bachelor of Science in Computer Science
                  </h3>
                  <p className="mt-1 text-base text-muted-foreground">Lahore Garrison University</p>

                  <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs">
                    <div>
                      <span className="text-muted-foreground/60">duration: </span>
                      <span className="text-foreground/90">Oct 2022 – Jul 2026</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground/60">cgpa: </span>
                      <span className="text-primary">3.61 / 4.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coursework */}
              <div className="mt-10 border-t border-white/8 pt-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
                  Relevant Coursework
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
