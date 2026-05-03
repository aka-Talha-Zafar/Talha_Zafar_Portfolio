import { Suspense, lazy } from "react";
import Hero from "@/components/Hero";

const About = lazy(() => import("@/components/About"));
const Projects = lazy(() => import("@/components/Projects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));

const SuspensePlaceholder = ({ height = 240 }: { height?: number }) => (
  <div style={{ minHeight: height }} className="w-full" />
);

const Home = () => {
  return (
    <>
      <Hero />

      <Suspense fallback={<SuspensePlaceholder height={360} />}>
        <About />
      </Suspense>

      <Suspense fallback={<SuspensePlaceholder height={360} />}>
        <Projects />
      </Suspense>

      <Suspense fallback={<SuspensePlaceholder height={360} />}>
        <Experience />
      </Suspense>

      <Suspense fallback={<SuspensePlaceholder height={360} />}>
        <Education />
      </Suspense>

      <Suspense fallback={<SuspensePlaceholder height={280} />}>
        <Contact />
      </Suspense>
    </>
  );
};

export default Home;

