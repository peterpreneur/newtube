import type { ReactNode } from "react";
import { Car } from "@/components/car-art";
import type { ThumbnailScene } from "@/lib/videos";

type VideoThumbnailProps = {
  scene: ThumbnailScene;
  title: string;
  duration: string;
};

export function VideoThumbnail({ scene, title, duration }: VideoThumbnailProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-200">
      <svg
        viewBox="0 0 640 360"
        className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
        role="img"
        aria-label={title}
      >
        {SCENES[scene]}
      </svg>
      <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
        {duration}
      </span>
    </div>
  );
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
      <ellipse cx="0" cy="0" rx="34" ry="16" />
      <ellipse cx="26" cy="-10" rx="26" ry="20" />
      <ellipse cx="54" cy="0" rx="30" ry="15" />
    </g>
  );
}

function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-4" y="-10" width="8" height="14" fill="#713f12" />
      <polygon points="0,-90 -22,-40 22,-40" fill="#166534" />
      <polygon points="0,-66 -28,-10 28,-10" fill="#15803d" />
    </g>
  );
}

function Crowd({ y, rows, seed }: { y: number; rows: number; seed: number }) {
  const colors = ["#f87171", "#facc15", "#60a5fa", "#f8fafc", "#a78bfa", "#fb923c"];
  return (
    <>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: 40 }, (_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 16 + (row % 2) * 8 + 4}
            cy={y + row * 12}
            r="4"
            fill={colors[(col * 7 + row * 3 + seed) % colors.length]}
          />
        )),
      )}
    </>
  );
}

const SCENES: Record<ThumbnailScene, ReactNode> = {
  drift: (
    <>
      <rect width="640" height="360" fill="#38bdf8" />
      <Cloud x={60} y={40} />
      <Cloud x={250} y={60} s={0.8} />
      <rect y="110" width="640" height="70" fill="#334155" />
      <polygon points="0,110 640,110 640,96 0,104" fill="#1e293b" />
      <Crowd y={122} rows={4} seed={1} />
      <g transform="rotate(-5 490 64)">
        <rect x="380" y="36" width="230" height="58" rx="4" fill="#111827" />
        <rect x="380" y="86" width="230" height="8" fill="#dc2626" />
        <text
          x="495"
          y="78"
          textAnchor="middle"
          fill="#f8fafc"
          fontSize="40"
          fontWeight="900"
          fontStyle="italic"
          fontFamily="ui-sans-serif, system-ui"
        >
          DRIFT
        </text>
      </g>
      <rect y="180" width="640" height="180" fill="#6b7280" />
      {Array.from({ length: 16 }, (_, index) => (
        <rect
          key={index}
          x={index * 40}
          y="180"
          width="40"
          height="12"
          fill={index % 2 ? "#f8fafc" : "#dc2626"}
        />
      ))}
      <path d="M0 330 Q140 300 240 316" stroke="#374151" strokeWidth="10" fill="none" opacity="0.6" />
      <path d="M0 350 Q160 320 300 334" stroke="#374151" strokeWidth="10" fill="none" opacity="0.6" />
      {[
        [40, 270, 46],
        [90, 240, 54],
        [150, 282, 40],
        [30, 320, 38],
        [120, 210, 36],
        [190, 250, 30],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#f8fafc" opacity="0.9" />
      ))}
      <Car model="coupe" color="#dc2626" x={180} y={326} scale={1.32} />
    </>
  ),
  coastal: (
    <>
      <rect width="640" height="360" fill="#7dd3fc" />
      <Cloud x={340} y={44} />
      <Cloud x={520} y={70} s={0.7} />
      <rect y="130" width="640" height="110" fill="#0284c7" />
      <path d="M260 160 h80 M420 190 h60 M500 150 h70" stroke="#e0f2fe" strokeWidth="4" strokeLinecap="round" />
      <polygon points="0,60 120,90 220,150 260,240 0,240" fill="#a16207" />
      <polygon points="0,70 110,96 190,140 150,160 0,150" fill="#65a30d" />
      <circle cx="40" cy="120" r="22" fill="#4d7c0f" />
      <circle cx="96" cy="128" r="16" fill="#4d7c0f" />
      <polygon points="0,240 640,210 640,360 0,360" fill="#4b5563" />
      <polygon points="0,236 640,206 640,214 0,244" fill="#9ca3af" />
      {Array.from({ length: 8 }, (_, index) => (
        <rect
          key={index}
          x={index * 90}
          y={300 - index * 4}
          width="50"
          height="6"
          fill="#facc15"
        />
      ))}
      <path d="M260 212 L640 196" stroke="#d1d5db" strokeWidth="6" />
      {Array.from({ length: 9 }, (_, index) => (
        <rect key={index} x={270 + index * 44} y={204 - index * 1.8} width="5" height="18" fill="#9ca3af" />
      ))}
      <Car model="muscle" color="#1d4ed8" x={150} y={316} scale={1.25} />
    </>
  ),
  garage: (
    <>
      <rect width="640" height="360" fill="#374151" />
      <rect x="150" y="30" width="340" height="140" rx="4" fill="#4b5563" />
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 20 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={162 + col * 17} cy={42 + row * 17} r="1.6" fill="#1f2937" />
        )),
      )}
      {[190, 230, 270, 310, 350, 390, 430].map((tx, index) => (
        <g key={tx} fill="#d1d5db">
          <rect x={tx - 3} y={60} width="6" height={60 + (index % 3) * 14} rx="2" />
          <circle cx={tx} cy={58} r="9" />
          <circle cx={tx} cy={58} r="4" fill="#4b5563" />
        </g>
      ))}
      <rect x="20" y="28" width="104" height="96" rx="6" fill="#111827" stroke="#f8fafc" strokeWidth="3" />
      {["DREAM", "BUILD", "DRIVE"].map((word, index) => (
        <text
          key={word}
          x="72"
          y={56 + index * 28}
          textAnchor="middle"
          fill="#f8fafc"
          fontSize="22"
          fontWeight="900"
          fontFamily="ui-sans-serif, system-ui"
        >
          {word}
        </text>
      ))}
      <rect x="520" y="130" width="110" height="160" rx="6" fill="#dc2626" stroke="#111827" strokeWidth="3" />
      {[0, 1, 2, 3, 4].map((index) => (
        <g key={index}>
          <rect x="530" y={142 + index * 28} width="90" height="20" rx="3" fill="#b91c1c" />
          <rect x="560" y={150 + index * 28} width="30" height="4" rx="2" fill="#e5e7eb" />
        </g>
      ))}
      <polygon points="0,250 640,250 640,360 0,360" fill="#9ca3af" />
      <path d="M0 250 H640" stroke="#6b7280" strokeWidth="4" />
      <ellipse cx="320" cy="300" rx="260" ry="34" fill="#d1d5db" opacity="0.4" />
      <g>
        <circle cx="50" cy="232" r="30" fill="#111827" />
        <circle cx="50" cy="232" r="14" fill="#4b5563" />
        <circle cx="50" cy="192" r="30" fill="#1f2937" />
        <circle cx="50" cy="192" r="14" fill="#4b5563" />
      </g>
      <Car model="supercar" color="#facc15" x={150} y={316} scale={1.2} />
    </>
  ),
  electric: (
    <>
      <rect width="640" height="360" fill="#bae6fd" />
      <Cloud x={420} y={36} s={0.8} />
      {[
        [220, 90, 40, 150],
        [262, 60, 36, 180],
        [300, 110, 44, 130],
        [348, 40, 30, 200],
        [382, 96, 46, 144],
        [432, 70, 34, 170],
        [470, 120, 50, 120],
      ].map(([x, y, w, h], index) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={h} fill={index % 2 ? "#60a5fa" : "#93c5fd"} />
          {Array.from({ length: Math.floor(h / 20) }, (_, row) => (
            <rect key={row} x={x + 6} y={y + 8 + row * 20} width={w - 12} height="6" fill="#e0f2fe" opacity="0.7" />
          ))}
        </g>
      ))}
      <g stroke="#f8fafc" strokeWidth="4" strokeLinecap="round">
        <line x1="580" y1="240" x2="580" y2="90" />
        <line x1="580" y1="90" x2="580" y2="40" />
        <line x1="580" y1="90" x2="622" y2="114" />
        <line x1="580" y1="90" x2="538" y2="114" />
      </g>
      <path d="M540 240 Q544 170 560 140" stroke="#713f12" strokeWidth="8" fill="none" />
      {[-60, -20, 20, 60, 100].map((angle) => (
        <ellipse
          key={angle}
          cx="560"
          cy="140"
          rx="30"
          ry="8"
          fill="#16a34a"
          transform={`rotate(${angle} 560 140) translate(26 0)`}
        />
      ))}
      <rect y="240" width="640" height="120" fill="#9ca3af" />
      <rect y="240" width="640" height="10" fill="#e5e7eb" />
      <rect x="0" y="14" width="210" height="22" fill="#e5e7eb" />
      <rect x="0" y="34" width="210" height="6" fill="#2dd4bf" />
      <rect x="150" y="36" width="10" height="210" fill="#d1d5db" />
      <rect x="40" y="120" width="62" height="160" rx="10" fill="#f8fafc" stroke="#111827" strokeWidth="3" />
      <rect x="52" y="134" width="38" height="54" rx="4" fill="#16a34a" />
      <polygon points="74,140 62,164 72,164 66,182 82,156 72,156" fill="#facc15" />
      <path d="M100 220 Q150 300 214 272" stroke="#111827" strokeWidth="5" fill="none" />
      <Car model="sedan" color="#16a34a" x={200} y={320} scale={1.25} />
    </>
  ),
  offroad: (
    <>
      <rect width="640" height="360" fill="#93c5fd" />
      <polygon points="80,200 220,50 360,200" fill="#94a3b8" />
      <polygon points="190,82 220,50 252,84 236,94 220,80 204,94" fill="#f8fafc" />
      <polygon points="300,200 450,30 600,200" fill="#64748b" />
      <polygon points="414,72 450,30 488,74 468,86 450,70 432,86" fill="#f8fafc" />
      <rect y="190" width="640" height="40" fill="#4d7c0f" />
      {[20, 70, 120, 520, 570, 620].map((px, index) => (
        <Pine key={px} x={px} y={230} s={index % 2 ? 1 : 1.2} />
      ))}
      <rect y="226" width="640" height="134" fill="#a16207" />
      <ellipse cx="320" cy="320" rx="300" ry="40" fill="#78350f" />
      {[
        [110, 240, 14],
        [80, 210, 10],
        [140, 200, 8],
        [520, 230, 12],
        [560, 200, 9],
        [500, 196, 7],
        [60, 270, 16],
        [580, 268, 15],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#78350f" />
      ))}
      <Car model="suv" color="#f97316" x={150} y={322} scale={1.12} />
    </>
  ),
  finish: (
    <>
      <rect width="640" height="360" fill="#bfdbfe" />
      <rect y="80" width="640" height="110" fill="#475569" />
      <Crowd y={92} rows={8} seed={4} />
      <rect x="120" y="40" width="12" height="160" fill="#111827" />
      <rect x="508" y="40" width="12" height="160" fill="#111827" />
      <rect x="120" y="30" width="400" height="48" rx="4" fill="#111827" />
      <text
        x="320"
        y="66"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="32"
        fontWeight="900"
        fontStyle="italic"
        fontFamily="ui-sans-serif, system-ui"
      >
        FINISH
      </text>
      <rect x="40" y="10" width="5" height="140" fill="#e5e7eb" />
      <g transform="translate(45 12) skewY(8)">
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => (
            <rect
              key={`${row}-${col}`}
              x={col * 12}
              y={row * 12}
              width="12"
              height="12"
              fill={(row + col) % 2 ? "#f8fafc" : "#111827"}
            />
          )),
        )}
      </g>
      <rect y="200" width="640" height="160" fill="#111827" />
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 16 }, (_, col) =>
          (row + col) % 2 ? null : (
            <rect key={`${row}-${col}`} x={col * 40} y={200 + row * 40} width="40" height="40" fill="#f8fafc" />
          ),
        ),
      )}
      {Array.from({ length: 24 }, (_, index) => (
        <rect
          key={index}
          x={(index * 97) % 640}
          y={20 + ((index * 53) % 170)}
          width="8"
          height="4"
          fill={["#f43f5e", "#facc15", "#22d3ee", "#a78bfa"][index % 4]}
          transform={`rotate(${(index * 37) % 180} ${(index * 97) % 640} ${20 + ((index * 53) % 170)})`}
        />
      ))}
      <Car model="racer" color="#7c3aed" x={160} y={322} scale={1.28} />
    </>
  ),
};
