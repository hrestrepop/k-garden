interface Props {
  size?: number;
}

export default function KGardenMark({ size = 20 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="#10B981" />
      {/* K glyph: vertical stem + two diagonal arms meeting at the stem */}
      <path
        d="M11 8v16M11 16l9-8M11 16l9 8"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* sprouting leaf accent off the upper arm */}
      <path
        d="M20 9c2.2-1 4-.4 4.6.4-.9.9-2.8 1.3-4.6-.4Z"
        fill="#D1FAE5"
      />
    </svg>
  );
}
