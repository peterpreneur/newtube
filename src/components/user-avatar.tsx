type UserAvatarProps = {
  className?: string;
};

export function UserAvatar({ className }: UserAvatarProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#1d4ed8" />
      <path d="M4 20 Q4 16 9 15 L12 11 Q16 9 21 10 L24 14 Q28 15 28 19 L28 21 L4 21 Z" fill="#dc2626" />
      <path d="M13 14 L15 11.5 L20 11.5 L22 14 Z" fill="#bfdbfe" />
      <circle cx="10" cy="21" r="3" fill="#111827" />
      <circle cx="23" cy="21" r="3" fill="#111827" />
    </svg>
  );
}

type InitialAvatarProps = {
  name: string;
  color: string;
  className?: string;
};

export function InitialAvatar({ name, color, className }: InitialAvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className ?? ""}`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
