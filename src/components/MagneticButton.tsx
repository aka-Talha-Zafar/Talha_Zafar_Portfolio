import { forwardRef, useEffect, useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

/**
 * Button with subtle magnetic pull toward cursor when hovered.
 * Skips effect on coarse pointer / reduced-motion.
 */
const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ variant = "primary", className, children, ...props }, ref) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    const [enabled, setEnabled] = useState(false);

    // Combine refs
    useEffect(() => {
      if (typeof ref === "function") ref(innerRef.current);
      else if (ref) ref.current = innerRef.current;
    }, [ref]);

    useEffect(() => {
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnabled(fine && !reduced);
    }, []);

    useEffect(() => {
      if (!enabled) return;
      const el = innerRef.current;
      if (!el) return;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const radius = 110;
        if (dist < radius) {
          const f = (1 - dist / radius) * 0.35;
          el.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
        } else {
          el.style.transform = "translate(0,0)";
        }
      };
      const reset = () => {
        el.style.transform = "translate(0,0)";
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", reset);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseleave", reset);
      };
    }, [enabled]);

    const base =
      "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-[background,box-shadow,border-color,color] duration-300 ease-out will-change-transform";

    const styles =
      variant === "primary"
        ? "border border-primary/60 text-primary bg-primary/5 hover:bg-primary/15 hover:text-foreground hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)]"
        : "border border-white/15 text-foreground/85 hover:border-white/40 hover:text-foreground";

    return (
      <button ref={innerRef} className={cn(base, styles, className)} {...props}>
        {children}
      </button>
    );
  },
);
MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
