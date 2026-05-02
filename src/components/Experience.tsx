import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Role = {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
  stack: string[];
};

const ROLES: Role[] = [
  {
    role: "React Native Developer — Intern",
    company: "Rozee.PK",
    duration: "2024 | Lahore, Pakistan",
    bullets: [
      "Developed and maintained cross-platform mobile application features using React Native and TypeScript.",
      "Collaborated with the product team to implement UI improvements and optimize component performance.",
      "Integrated third-party APIs and handled state management across multiple application screens.",
    ],
    stack: ["React Native", "TypeScript", "JavaScript", "REST APIs"],
  },
  {
    role: "React Native Intern (Remote)",
    company: "Chelan Technologies",
    duration: "Jul 2024 – Jul 2025 | Washington, USA",
    bullets: [
      "Developed mobile application features using React Native, TypeScript, and Firebase.",
      "Contributed to UI/UX improvements and built scalable front-end logic across multiple modules.",
      "Operated in a fully remote, internationally distributed engineering team.",
    ],
    stack: ["React Native", "TypeScript", "Firebase"],
  },
];

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
    {children}
  </span>
);

const Experience = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 80%", "end 30%"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative pt-20 pb-32" ref={ref}>
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
          Experience
        </motion.h2>

        <div ref={railRef} className="relative mt-16 pl-10 md:pl-14">
          {/* Rail background */}
          <div
            aria-hidden
            className="absolute left-3 top-0 h-full w-px bg-white/8 md:left-5"
          />
          {/* Rail progress */}
          <motion.div
            aria-hidden
            style={{ height: railHeight }}
            className="absolute left-3 top-0 w-px bg-gradient-to-b from-primary via-primary/60 to-secondary/40 shadow-[0_0_12px_hsl(var(--primary)/0.6)] md:left-5"
          />

          <div className="space-y-10">
            {ROLES.map((r, i) => (
              <motion.div
                key={r.company}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
                className="relative"
              >
                {/* Dot */}
                <span
                  aria-hidden
                  className="absolute -left-[30px] top-7 flex h-3.5 w-3.5 items-center justify-center md:-left-[38px]"
                >
                  <span className="absolute inline-flex h-full w-full animate-pulse-glow rounded-full bg-primary/40" />
                  <span className="relative h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
                </span>

                {/* Card */}
                <div className="group relative isolate overflow-hidden rounded-2xl glass-strong p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.4)]">
                  <span
                    aria-hidden
                    className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground md:text-2xl">
                        {r.role}
                      </h3>
                      <p className="mt-1 text-sm text-primary/90">{r.company}</p>
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {r.duration}
                    </span>
                  </div>

                  <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-primary/70"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {r.stack.map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
