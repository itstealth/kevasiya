import { cn } from "@/lib/utils";
import Marquee from "./marquee";

const ReviewCard = ({ src, alt, iconClassName }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "aspect-square w-32 rounded mx-4 object-contain hover:-translate-y-2 duration-300 ease-in-out",
        iconClassName
      )}
    />
  );
};

export default function IconMarquee({
  icons,
  speed = 40,
  iconClassName = "",
  containerClassName = "",
}) {
  const firstRow = icons?.slice(0, icons.length / 2);
  const secondRow = icons?.slice(icons.length / 2);

  // Fix: Use a better speed calculation for more reasonable animation durations
  // Speed 0-100 maps to duration 60s-10s (slower to faster)
  const duration = Math.max(10, 60 - speed * 0.5);

  // Debug logging
  console.log("IconMarquee speed:", speed, "duration:", duration);

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden",
        containerClassName
      )}
    >
      <Marquee
        pauseOnHover
        className={`[--duration:${duration}s]`}
        style={{ "--duration": `${duration}s` }}
      >
        {firstRow?.map((icon, index) => (
          <ReviewCard
            key={`first-${index}`}
            {...icon}
            iconClassName={iconClassName}
          />
        ))}
      </Marquee>
      <Marquee
        reverse
        pauseOnHover
        className={`[--duration:${duration + 2}s]`}
        style={{ "--duration": `${duration + 2}s` }}
      >
        {secondRow?.map((icon, index) => (
          <ReviewCard
            key={`second-${index}`}
            {...icon}
            iconClassName={iconClassName}
          />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0  bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0  bg-gradient-to-l from-background"></div>
    </div>
  );
}
