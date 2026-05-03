import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Copy, Github, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const SERVICE_ID  = "service_5dggwbr";
const TEMPLATE_ID = "template_w194q17";
const PUBLIC_KEY  = "N-SYRklffcYVf6Gmo";

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
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const email = "talhazafar402@gmail.com";
  const [copied, setCopied]   = useState(false);
  const [sending, setSending] = useState(false);

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const fd = new FormData(e.currentTarget);
    const name    = (fd.get("name")    as string).trim();
    const replyTo = (fd.get("email")   as string).trim();
    const message = (fd.get("message") as string).trim();

    setSending(true);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: name,
          reply_to:  replyTo,
          message:   message,
          name:      name,
          email:     replyTo,
        },
        { publicKey: PUBLIC_KEY },
      );
      toast.success("Message sent! I'll get back to you soon.");
      formRef.current?.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error("Failed to send — please email me directly.");
    } finally {
      setSending(false);
    }
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
              <SocialButton href="https://github.com/aka-Talha-Zafar" label="GitHub">
                <Github className="h-5 w-5" />
              </SocialButton>
              <SocialButton href="https://www.linkedin.com/in/talha-zafar6783" label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </SocialButton>
              <SocialButton href="https://www.instagram.com/talhazafar_2.0/" label="Instagram">
                <Instagram className="h-5 w-5" />
              </SocialButton>
            </div>
          </div>

          <form
            ref={formRef}
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
              className="md:col-span-2 resize-none rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-primary/60 focus:bg-primary/5 focus:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.6)] focus:outline-none"
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="rounded-full border border-primary/60 bg-primary/5 px-6 py-3 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/15 hover:text-foreground hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;