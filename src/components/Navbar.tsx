import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  return (
    <>
      {/* Wrapper does centering; motion element can animate without overriding it */}
      <div
        className={cn(
          "fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-500",
          scrolled ? "w-[min(96vw,1200px)]" : "w-[min(96vw,1280px)]",
        )}
      >
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full"
        >
          <nav
            className={cn(
              "rounded-full px-6 py-2.5",
              "glass-strong",
              scrolled && "shadow-[0_8px_40px_-12px_hsl(218_50%_0%/0.6)]",
            )}
          >
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8">
              <Link
                to="/"
                className="whitespace-nowrap font-display text-sm font-semibold tracking-tight text-foreground"
                aria-label="Talha Zafar — home"
              >
                <span className="text-primary">T</span>alha{" "}
                <span className="text-primary">Z</span>afar
              </Link>

              <ul className="hidden items-center gap-1 sm:flex">
                {SECTIONS.map((s) => (
                  <li key={s.href}>
                    <NavLink
                      to={s.href}
                      className={({ isActive }) =>
                        cn(
                          "group relative rounded-full px-2.5 py-1.5 text-[11px] font-medium tracking-wide transition-colors sm:px-3 sm:text-xs",
                          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <span className="relative inline-flex flex-col items-center">
                          <span>{s.label}</span>
                          <span
                            aria-hidden
                            className={cn(
                              "mt-1 h-[2px] w-full origin-center rounded-full bg-primary transition-transform duration-200",
                              isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                            )}
                          />
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setOpen(true)}
                className="text-foreground sm:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </motion.header>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between p-6">
              <span className="font-display text-sm">
                <span className="text-primary">T</span>alha{" "}
                <span className="text-primary">Z</span>afar
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="flex flex-col items-center justify-center gap-6 px-6 pt-12">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <button
                    onClick={() => go(s.href)}
                    className="font-display text-3xl font-semibold tracking-tight text-foreground"
                  >
                    {s.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
