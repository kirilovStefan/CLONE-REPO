import type { CSSProperties } from "react";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { box: number; icon: number; radius: string }> = {
  sm: { box: 28, icon: 15, radius: "rounded-lg" },
  md: { box: 36, icon: 18, radius: "rounded-xl" },
  lg: { box: 44, icon: 22, radius: "rounded-2xl" },
};

export function Logo({
  size = "md",
  className = "",
}: {
  size?: Size;
  className?: string;
}) {
  const { box, icon, radius } = SIZES[size];
  const style: CSSProperties = { width: box, height: box };
  return (
    <span
      style={style}
      className={`bg-gold-gradient ${radius} grid shrink-0 place-items-center shadow-[0_4px_14px_rgba(216,179,106,0.3)] ${className}`}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1a1407"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    </span>
  );
}
