import { Github, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

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
            Machine Learning Engineer
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
          <p className="mt-10 font-mono text-[11px] tracking-wider text-muted-foreground/60 md:text-center">
            © 2026 | Talha Zafar 
          </p>
        </div>

        {/* Right */}
        <div className="md:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            Find me on
          </p>
          <div className="mt-4 flex gap-3 md:justify-end">
            <SocialIcon href="https://github.com/aka-Talha-Zafar" label="GitHub">
              <Github className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://www.linkedin.com/in/talha-zafar6783/" label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/talhazafar_2.0/" label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialIcon>
          </div>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
