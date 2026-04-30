import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import NeuralGraph from "./NeuralGraph";

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-32" ref={ref}>
      <div className="container grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
          >
            <span className="mr-2 inline-block h-px w-6 bg-muted-foreground/60 align-middle" />
            01 / About
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display mt-4 text-4xl font-semibold tracking-tight md:text-6xl"
          >
            About
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            <p>
              Talha Zafar is an AI/ML Engineer with hands-on experience designing and deploying
              end-to-end machine learning systems. His work spans computer vision, natural language
              processing, and real-time inference — from training custom architectures on
              domain-specific datasets to building and shipping production-grade APIs and full-stack
              AI applications.
            </p>
            <p>
              His focus is on systems that work in the real world: optimized, deployed, and
              integrated. He approaches problems with an engineering mindset — choosing the right
              tool, validating rigorously, and building for production from day one.
            </p>
          </motion.div>
        </div>

        <div className="relative hidden lg:col-span-5 lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative aspect-square w-full"
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "var(--gradient-radial-glow)" }}
            />
            <NeuralGraph />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
