import { useState } from "react";
import { cn } from "../../lib/utils";

export default function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      {...props}
      className={cn(
        "flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical && !reverse,
              "animate-marquee-reverse flex-row": !vertical && reverse,
              "animate-marquee-vertical flex-col": vertical && !reverse,
              "animate-marquee-vertical-reverse flex-col": vertical && reverse,
            })}
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
