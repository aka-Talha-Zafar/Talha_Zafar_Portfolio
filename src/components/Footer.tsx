import { Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const HF_ICON = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
    <path d="M12 2a8 8 0 0 0-8 8c0 1.4.4 2.8 1 4l-1 6 6-1c1.2.6 2.6 1 4 1a8 8 0 0 0 0-16zm-3 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-3 5a4 4 0 0 1-3.5-2h7a4 4 0 0 1-3.5 2z" />
  </svg>
);

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

const SocialIcon = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group relative flex h-10 w-10 items-center justify-center rounded-full glass text-foreground/75 transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.7)]"
  >
    {children}
  </a>
);

const Footer = () => (
  <footer className="relative mt-12 bg-[hsl(220_30%_6%)]">
    {/* Top divider */}
    <div
      aria-hidden
      className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
    />

    <div className="container py-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Left */}
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Talha Zafar
          </h3>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-primary/80">
            AI / ML Engineer
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Lahore, Pakistan</p>
        </div>

        {/* Center */}
        <div className="md:text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            Navigate
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 md:justify-center">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right */}
        <div className="md:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            Find me on
          </p>
          <div className="mt-4 flex gap-3 md:justify-end">
            <SocialIcon href="https://github.com" label="GitHub">
              <Github className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com" label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://huggingface.co" label="HuggingFace">
              {HF_ICON}
            </SocialIcon>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground/60">
          Built with React · Deployed on Vercel
        </p>
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground/60">
          Talha Zafar — 2026
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
