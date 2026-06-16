import React from "react";

interface LogoProps {
  variant?: "default" | "white" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ variant = "default", size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: { width: 170, height: 36, stamp: 28, text: 14, sub: 8 },
    md: { width: 240, height: 48, stamp: 38, text: 18, sub: 10 },
    lg: { width: 320, height: 64, stamp: 52, text: 24, sub: 13 },
  };

  const s = sizes[size];

  const colors = {
    default: { primary: "#E1A106", secondary: "#0E3B2E", accent: "#E1A106" },
    white:   { primary: "#FFFFFF", secondary: "#FFFFFF", accent: "#E1A106" },
    dark:    { primary: "#0E3B2E", secondary: "#0E3B2E", accent: "#E1A106" },
  };

  const c = colors[variant];

  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox={`0 0 ${s.width} ${s.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="The Visa Ghar logo"
      role="img"
    >
      {/* Passport Stamp Circle */}
      <circle
        cx={s.stamp / 2 + 4}
        cy={s.height / 2}
        r={s.stamp / 2}
        stroke={c.accent}
        strokeWidth={2}
        fill="none"
        strokeDasharray="4 3"
      />
      {/* Inner circle */}
      <circle
        cx={s.stamp / 2 + 4}
        cy={s.height / 2}
        r={s.stamp / 2 - 5}
        stroke={c.accent}
        strokeWidth={1}
        fill="none"
      />
      {/* Plane icon inside stamp */}
      <g transform={`translate(${s.stamp / 2 + 4 - 7}, ${s.height / 2 - 7})`}>
        <path
          d="M14 2L10 6H6L2 2L6 6V10L2 14L6 10H10L14 14L10 10V6L14 2Z"
          fill={c.accent}
          opacity={0.9}
        />
      </g>

      {/* Text: The Visa Ghar */}
      <text
        x={s.stamp + 14}
        y={s.height / 2 - 3}
        fontFamily="'Fraunces', Georgia, serif"
        fontWeight="800"
        fontSize={s.text}
        fill={c.primary}
        letterSpacing="-0.02em"
      >
        The Visa Ghar
      </text>

      {/* Subtitle */}
      <text
        x={s.stamp + 14}
        y={s.height / 2 + s.sub + 6}
        fontFamily="'Hanken Grotesk', system-ui, sans-serif"
        fontWeight="500"
        fontSize={s.sub}
        fill={c.secondary}
        opacity={0.6}
        letterSpacing="0.1em"
      >
        STUDY ABROAD CONSULTANCY
      </text>
    </svg>
  );
}
