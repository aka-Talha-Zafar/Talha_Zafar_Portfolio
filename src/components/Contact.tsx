import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Github, Linkedin, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const HF_ICON = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
    <path d="M12 2a8 8 0 0 0-8 8c0 1.4.4 2.8 1 4l-1 6 6-1c1.2.6 2.6 1 4 1a8 8 0 0 0 0-16zm-3 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-3 5a4 4 0 0 1-3.5-2h7a4 4 0 0 1-3.5 2z" />
  </svg>
);

const SocialButton = ({
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
    className="group relative flex h-12 w-12 items-center justify-center rounded-full glass text-foreground/80 transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)]"
  >
    {children}
  </a>
);

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const email = "talhazafar7406@gmail.com";
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — please copy manually");
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message ready — opening your mail client");
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Portfolio inquiry — ${fd.get("name") || ""}`);
    const body = encodeURIComponent(
      `${fd.get("message") || ""}\n\n— ${fd.get("name") || ""} (${fd.get("email") || ""})`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="relative pt-20 pb-32" ref={ref}>
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
          Contact
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl glass-strong p-10 md:p-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "var(--gradient-radial-glow)" }}
          />
          <span
            aria-hidden
            className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          />

          <div className="relative text-center">
            <h3 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Let's work together.
            </h3>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              Open to collaborations, opportunities, and conversations.
            </p>

            <button
              onClick={copy}
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 font-mono text-base text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-[0_0_30px_-6px_hsl(var(--primary)/0.6)] md:text-lg"
              aria-label="Copy email to clipboard"
            >
              <span>{email}</span>
              <span className="text-muted-foreground transition-colors group-hover:text-primary">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </span>
            </button>

            <div className="mt-10 flex justify-center gap-4">
              <SocialButton href="https://github.com" label="GitHub">
                <Github className="h-5 w-5" />
              </SocialButton>
              <SocialButton href="https://linkedin.com" label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </SocialButton>
              <SocialButton href="https://huggingface.co" label="HuggingFace">
                {HF_ICON}
              </SocialButton>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="relative mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2"
          >
            <input
              required
              name="name"
              placeholder="Name"
              className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-primary/60 focus:bg-primary/5 focus:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.6)] focus:outline-none"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-primary/60 focus:bg-primary/5 focus:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.6)] focus:outline-none"
            />
            <textarea
              required
              name="message"
              rows={5}
              placeholder="Message"
              className="md:col-span-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-primary/60 focus:bg-primary/5 focus:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.6)] focus:outline-none"
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="rounded-full border border-primary/60 bg-primary/5 px-6 py-3 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/15 hover:text-foreground hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)]"
              >
                Send Message
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
