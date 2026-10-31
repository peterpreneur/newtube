import Image from "next/image";
import type { ReactNode } from "react";
import type { Channel, ChannelIcon } from "@/lib/channels";

type ChannelAvatarProps = {
  channel: Channel;
  className?: string;
  sizes?: string;
};

export function ChannelAvatar({
  channel,
  className,
  sizes = "40px",
}: ChannelAvatarProps) {
  if (channel.avatar) {
    return (
      <span
        className={`relative block overflow-hidden rounded-full ${className ?? ""}`}
        aria-hidden
      >
        <Image src={channel.avatar} alt="" fill sizes={sizes} className="object-cover" />
      </span>
    );
  }

  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      {ICONS[channel.icon]}
    </svg>
  );
}

const ICONS: Record<ChannelIcon, ReactNode> = {
  turbo: (
    <>
      <circle cx="20" cy="20" r="20" fill="#dc2626" />
      <circle cx="20" cy="20" r="15" fill="#f8fafc" />
      <circle cx="20" cy="20" r="12" fill="#1f2937" />
      <circle cx="20" cy="20" r="6" fill="#9ca3af" />
      <circle cx="20" cy="20" r="2" fill="#1f2937" />
    </>
  ),
  classic: (
    <>
      <circle cx="20" cy="20" r="20" fill="#1e40af" />
      <rect x="8" y="14" width="24" height="12" rx="4" fill="#e5e7eb" />
      <rect x="13" y="17" width="14" height="6" rx="1" fill="#374151" />
      <circle cx="10.5" cy="20" r="2.4" fill="#fef9c3" stroke="#111827" />
      <circle cx="29.5" cy="20" r="2.4" fill="#fef9c3" stroke="#111827" />
      <rect x="7" y="27" width="26" height="3" rx="1.5" fill="#cbd5e1" />
    </>
  ),
  garage: (
    <>
      <circle cx="20" cy="20" r="20" fill="#111827" />
      <g stroke="#facc15" strokeWidth="4" strokeLinecap="round">
        <line x1="12" y1="12" x2="28" y2="28" />
        <line x1="28" y1="12" x2="12" y2="28" />
      </g>
      <circle cx="11" cy="11" r="4" fill="#facc15" />
      <circle cx="29" cy="11" r="4" fill="#facc15" />
      <circle cx="11" cy="11" r="1.6" fill="#111827" />
      <circle cx="29" cy="11" r="1.6" fill="#111827" />
    </>
  ),
  electric: (
    <>
      <circle cx="20" cy="20" r="20" fill="#16a34a" />
      <circle cx="20" cy="20" r="15" fill="#111827" />
      <polygon points="22,8 12,22 19,22 17,32 28,17 21,17" fill="#facc15" />
    </>
  ),
  trail: (
    <>
      <circle cx="20" cy="20" r="20" fill="#f97316" />
      <polygon points="6,30 17,12 28,30" fill="#111827" />
      <polygon points="18,30 26,18 35,30" fill="#374151" />
      <polygon points="13.5,17.6 17,12 20.5,17.6 17,16" fill="#f8fafc" />
    </>
  ),
  race: (
    <>
      <circle cx="20" cy="20" r="20" fill="#dc2626" />
      <circle cx="20" cy="20" r="15" fill="#f8fafc" />
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) =>
          (row + col) % 2 ? null : (
            <rect key={`${row}-${col}`} x={12 + col * 4} y={12 + row * 4} width="4" height="4" fill="#111827" />
          ),
        ),
      )}
    </>
  ),
};
