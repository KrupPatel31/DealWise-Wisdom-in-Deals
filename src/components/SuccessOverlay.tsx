import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SuccessOverlayProps {
  show: boolean;
  onClose: () => void;
  variant: "signup" | "login" | "deal";
  dealUrl?: string;
}

// Animated SVG checkmark
const AnimatedCheck = () => (
  <motion.svg
    viewBox="0 0 50 50"
    className="w-16 h-16 sm:w-20 sm:h-20"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 12 }}
  >
    <motion.circle
      cx="25"
      cy="25"
      r="22"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="2.5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
    />
    <motion.path
      d="M14 26 L22 34 L37 18"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.9, duration: 0.4, ease: "easeOut" }}
    />
  </motion.svg>
);

// Floating particles
const Particle = ({ index }: { index: number }) => {
  const angle = (index / 12) * Math.PI * 2;
  const radius = 80 + Math.random() * 60;
  const size = 3 + Math.random() * 5;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute rounded-full bg-primary/60"
      style={{ width: size, height: size }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{
        x,
        y,
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0],
      }}
      transition={{
        delay: 0.8 + index * 0.04,
        duration: 1,
        ease: "easeOut",
      }}
    />
  );
};

// Glow ring
const GlowRing = () => (
  <motion.div
    className="absolute rounded-full border-2 border-primary/30"
    initial={{ width: 0, height: 0, opacity: 0.8 }}
    animate={{ width: 300, height: 300, opacity: 0 }}
    transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
  />
);

const variantConfig = {
  signup: {
    emoji: "📧",
    title: "Verify Your Email",
    subtitle: "We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.",
    primaryAction: { label: "Go to Sign In", path: "/sign-in" },
    secondaryAction: null,
  },
  login: {
    emoji: "👋",
    title: "Welcome Back",
    subtitle: "You're now logged in",
    primaryAction: { label: "Continue Shopping", path: "/" },
    secondaryAction: { label: "View Orders", path: "/orders" },
  },
  deal: {
    emoji: "🚀",
    title: "Redirecting to Best Deal",
    subtitle: "We found the lowest price for you",
    primaryAction: null,
    secondaryAction: null,
  },
};

export const SuccessOverlay = ({ show, onClose, variant, dealUrl }: SuccessOverlayProps) => {
  const navigate = useNavigate();
  const config = variantConfig[variant];

  // Auto-redirect for deal variant
  useEffect(() => {
    if (show && variant === "deal" && dealUrl) {
      const timer = setTimeout(() => {
        window.open(dealUrl, "_blank");
        onClose();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [show, variant, dealUrl, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Blurred backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={variant !== "deal" ? onClose : undefined}
          />

          {/* Glow pulse behind card */}
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-primary/10 blur-3xl"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ delay: 0.1, duration: 1, ease: "easeOut" }}
          />

          {/* Main container */}
          <motion.div
            className="relative flex flex-col items-center gap-6 p-8 sm:p-12 rounded-3xl border border-border/50 bg-card/80 backdrop-blur-2xl shadow-2xl max-w-sm w-[90vw]"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Glow ring */}
            <div className="relative flex items-center justify-center">
              <GlowRing />
              {/* Particles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <Particle key={i} index={i} />
              ))}
              {/* Checkmark */}
              <AnimatedCheck />
            </div>

            {/* Emoji */}
            <motion.div
              className="text-3xl sm:text-4xl"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.1, type: "spring", stiffness: 300, damping: 10 }}
            >
              {config.emoji}
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-xl sm:text-2xl font-bold text-foreground text-center font-display"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
            >
              {config.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-sm sm:text-base text-muted-foreground text-center -mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
            >
              {config.subtitle}
            </motion.p>

            {/* Buttons */}
            {config.primaryAction && (
              <motion.div
                className="flex flex-col sm:flex-row gap-3 w-full mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.4, ease: "easeOut" }}
              >
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    onClose();
                    navigate(config.primaryAction!.path);
                  }}
                >
                  {config.primaryAction.label}
                </Button>
                {config.secondaryAction && (
                  <Button
                    variant="outline"
                    className="flex-1 border-border text-foreground hover:bg-muted"
                    onClick={() => {
                      onClose();
                      navigate(config.secondaryAction!.path);
                    }}
                  >
                    {config.secondaryAction.label}
                  </Button>
                )}
              </motion.div>
            )}

            {/* Deal progress bar */}
            {variant === "deal" && (
              <motion.div
                className="w-full h-1 rounded-full bg-muted overflow-hidden mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
