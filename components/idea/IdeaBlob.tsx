// Reusable organic blob — color driven by CSS `color` property on parent.
interface IdeaBlobProps {
  variant?: "lg" | "md" | "sm";
  opacity?: number;
  className?: string;
  animationDelay?: string;
}

export function IdeaBlob({
  variant = "lg",
  opacity = 0.8,
  className = "",
  animationDelay,
}: IdeaBlobProps) {
  const size = { lg: 384, md: 288, sm: 192 }[variant];

  return (
    <div
      className={`animate-float pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, animationDelay }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ filter: "blur(8px)" }}
      >
        <path
          d="M43.3,-52.4C57.5,-40.8,71.5,-27.2,74.1,-11.3C76.7,4.6,67.9,23.2,58.2,38.9C48.5,54.6,37.9,67.5,23.9,72.7C9.9,77.9,-7.6,75.4,-23.5,69.1C-39.4,62.8,-53.7,52.7,-62.2,38.1C-70.7,23.5,-74.4,4.5,-72.1,-14.4C-69.8,-33.3,-61.5,-52,-47.3,-63.7C-33.1,-75.4,-13.1,-80.1,3.9,-83.2C20.9,-86.3,29.1,-64.1,43.3,-52.4Z"
          fill="currentColor"
          opacity={opacity}
        />
      </svg>
    </div>
  );
}
