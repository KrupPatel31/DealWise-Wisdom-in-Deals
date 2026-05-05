import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GalaxyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const RANDOM = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const GalaxyButton = React.forwardRef<HTMLButtonElement, GalaxyButtonProps>(
  ({ className, children, ...props }, ref) => {
    const containerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const btn = containerRef.current;
      if (!btn) return;
      const stars = btn.querySelectorAll<HTMLElement>(".galaxy-star");
      stars.forEach((star) => {
        star.style.setProperty("--angle", `${RANDOM(0, 360)}`);
        star.style.setProperty("--duration", `${RANDOM(6, 20)}`);
        star.style.setProperty("--delay", `${RANDOM(1, 10)}`);
        star.style.setProperty("--alpha", `${RANDOM(40, 90) / 100}`);
        star.style.setProperty("--size", `${RANDOM(2, 6)}`);
        star.style.setProperty("--distance", `${RANDOM(40, 200)}`);
      });
    }, []);

    return (
      <button
        ref={(node) => {
          (
            containerRef as React.MutableRefObject<HTMLButtonElement | null>
          ).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
              node;
        }}
        className={cn("galaxy-btn", className)}
        {...props}
      >
        <span className="galaxy-spark" />
        <span className="galaxy-backdrop" />
        <span className="galaxy-galaxy">
          <div className="galaxy-ring">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="galaxy-star" />
            ))}
          </div>
        </span>
        <span className="galaxy-text">{children}</span>
      </button>
    );
  },
);

GalaxyButton.displayName = "GalaxyButton";

export { GalaxyButton };
