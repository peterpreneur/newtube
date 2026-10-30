import { useId, type ReactNode } from "react";

export type CarModel = "coupe" | "muscle" | "supercar" | "sedan" | "suv" | "racer";

type ModelShape = {
  body: string;
  cabin: string;
  windows: string[];
  wheels: [number, number];
  radius: number;
  headlight: [number, number];
  taillight: [number, number];
  trim?: (color: string) => ReactNode;
};

// Side-view silhouettes facing right, drawn in a ~312-wide box with the ground at y=0.
const MODELS: Record<CarModel, ModelShape> = {
  coupe: {
    body: "M6 -20 Q2 -22 3 -36 Q4 -52 28 -57 L112 -66 Q170 -71 232 -65 L284 -56 Q305 -51 308 -36 L307 -24 Q306 -20 300 -20 Z",
    cabin: "M98 -64 Q132 -100 176 -102 Q214 -101 238 -64 Z",
    windows: [
      "M110 -66 Q138 -93 168 -95 L170 -66 Z",
      "M178 -66 L177 -95 Q206 -93 226 -66 Z",
    ],
    wheels: [72, 248],
    radius: 26,
    headlight: [296, -46],
    taillight: [10, -46],
    trim: () => (
      <>
        <rect x="18" y="-62" width="8" height="10" fill="#111827" />
        <rect x="2" y="-68" width="46" height="7" rx="2" fill="#111827" />
      </>
    ),
  },
  muscle: {
    body: "M4 -20 L3 -52 Q4 -58 14 -59 L96 -62 L300 -60 Q312 -59 312 -46 L311 -24 Q310 -20 304 -20 Z",
    cabin: "M92 -61 L126 -96 L198 -96 L226 -61 Z",
    windows: [
      "M104 -63 L131 -90 L160 -90 L160 -63 Z",
      "M168 -63 L168 -90 L194 -90 L214 -63 Z",
    ],
    wheels: [68, 252],
    radius: 27,
    headlight: [304, -48],
    taillight: [8, -48],
    trim: () => (
      <>
        <rect x="4" y="-52" width="307" height="5" fill="#f8fafc" />
        <rect x="4" y="-44" width="307" height="3" fill="#f8fafc" />
        <rect x="296" y="-30" width="18" height="7" rx="3" fill="#e5e7eb" />
        <rect x="0" y="-30" width="16" height="7" rx="3" fill="#e5e7eb" />
      </>
    ),
  },
  supercar: {
    body: "M8 -20 Q2 -24 4 -38 Q6 -52 26 -56 L150 -72 Q200 -72 244 -58 L300 -44 Q312 -40 310 -28 L308 -20 Z",
    cabin: "M108 -68 Q150 -100 188 -96 Q214 -92 252 -56 Z",
    windows: ["M122 -70 Q154 -92 186 -89 L234 -60 Z"],
    wheels: [72, 250],
    radius: 26,
    headlight: [298, -40],
    taillight: [10, -44],
    trim: () => (
      <>
        <path d="M108 -46 L152 -52 L142 -28 L118 -28 Z" fill="#111827" opacity="0.85" />
        <path d="M30 -56 L80 -62" stroke="#111827" strokeWidth="3" opacity="0.6" />
      </>
    ),
  },
  sedan: {
    body: "M6 -20 Q2 -22 3 -34 Q4 -52 26 -57 L100 -64 L240 -62 Q296 -58 306 -42 L306 -24 Q305 -20 300 -20 Z",
    cabin: "M64 -62 Q110 -108 168 -106 Q216 -104 252 -60 Z",
    windows: [
      "M80 -64 Q114 -98 158 -99 L160 -64 Z",
      "M168 -64 L167 -99 Q206 -96 236 -64 Z",
    ],
    wheels: [74, 246],
    radius: 25,
    headlight: [298, -46],
    taillight: [10, -44],
    trim: () => (
      <path d="M120 -40 H140 M190 -40 H210" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
    ),
  },
  suv: {
    body: "M4 -26 L5 -66 Q6 -72 16 -72 L238 -72 L298 -62 Q312 -58 312 -44 L312 -28 Q310 -24 304 -24 Z",
    cabin: "M22 -70 L32 -122 Q34 -126 40 -126 L196 -126 Q202 -126 206 -120 L240 -70 Z",
    windows: [
      "M40 -74 L46 -116 L110 -116 L110 -74 Z",
      "M118 -74 L118 -116 L190 -116 L224 -74 Z",
    ],
    wheels: [74, 248],
    radius: 32,
    headlight: [304, -54],
    taillight: [8, -56],
    trim: () => (
      <>
        <rect x="40" y="-136" width="156" height="6" rx="2" fill="#111827" />
        <rect x="56" y="-130" width="4" height="6" fill="#111827" />
        <rect x="176" y="-130" width="4" height="6" fill="#111827" />
        {[70, 96, 122, 148, 174].map((cx) => (
          <circle key={cx} cx={cx} cy="-142" r="6" fill="#fef9c3" stroke="#111827" strokeWidth="2" />
        ))}
        <rect x="290" y="-36" width="26" height="12" rx="3" fill="#111827" />
        <rect x="0" y="-36" width="18" height="12" rx="3" fill="#111827" />
      </>
    ),
  },
  racer: {
    body: "M6 -20 Q2 -22 3 -36 Q6 -54 40 -58 L250 -60 Q298 -58 306 -40 L306 -24 Q305 -20 300 -20 Z",
    cabin: "M46 -58 Q96 -108 160 -106 Q210 -100 240 -60 Z",
    windows: [
      "M70 -62 Q104 -96 150 -98 L152 -62 Z",
      "M160 -62 L160 -98 Q198 -94 224 -62 Z",
    ],
    wheels: [74, 248],
    radius: 26,
    headlight: [298, -44],
    taillight: [10, -44],
    trim: () => (
      <>
        <rect x="22" y="-82" width="6" height="26" fill="#111827" />
        <rect x="-6" y="-90" width="62" height="9" rx="2" fill="#111827" />
        <circle cx="160" cy="-40" r="15" fill="#f8fafc" />
        <text
          x="160"
          y="-34"
          textAnchor="middle"
          fontSize="17"
          fontWeight="800"
          fill="#111827"
          fontFamily="ui-sans-serif, system-ui"
        >
          23
        </text>
      </>
    ),
  },
};

type CarProps = {
  model: CarModel;
  color: string;
  x: number;
  y: number;
  scale?: number;
};

export function Car({ model, color, x, y, scale = 1 }: CarProps) {
  const shape = MODELS[model];
  const clipId = useId();
  const r = shape.radius;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="160" cy="2" rx="170" ry="10" fill="#000" opacity="0.25" />
      <path d={shape.cabin} fill={color} stroke="#111827" strokeWidth="3" />
      <clipPath id={clipId}>
        <path d={shape.body} />
      </clipPath>
      <path d={shape.body} fill={color} stroke="#111827" strokeWidth="3" />
      <rect
        x="-10"
        y="-34"
        width="340"
        height="20"
        fill="#000"
        opacity="0.18"
        clipPath={`url(#${clipId})`}
      />
      {shape.windows.map((d) => (
        <path key={d} d={d} fill="#1e3a5f" stroke="#111827" strokeWidth="2" />
      ))}
      {shape.windows.map((d) => (
        <path key={`shine-${d}`} d={d} fill="#bae6fd" opacity="0.25" transform="translate(4 0) scale(0.98 1)" />
      ))}
      {shape.trim?.(color)}
      <ellipse cx={shape.headlight[0]} cy={shape.headlight[1]} rx="9" ry="5" fill="#fef9c3" stroke="#111827" strokeWidth="2" />
      <rect x={shape.taillight[0] - 6} y={shape.taillight[1] - 4} width="10" height="8" rx="2" fill="#ef4444" stroke="#111827" strokeWidth="2" />
      {shape.wheels.map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={-r} r={r + 5} fill="#111827" />
          <circle cx={wx} cy={-r} r={r} fill="#1f2937" />
          <circle cx={wx} cy={-r} r={r * 0.62} fill="#d1d5db" stroke="#111827" strokeWidth="2" />
          {[0, 72, 144, 216, 288].map((angle) => (
            <line
              key={angle}
              x1={wx}
              y1={-r}
              x2={wx + Math.cos((angle * Math.PI) / 180) * r * 0.55}
              y2={-r + Math.sin((angle * Math.PI) / 180) * r * 0.55}
              stroke="#6b7280"
              strokeWidth="3"
            />
          ))}
          <circle cx={wx} cy={-r} r={r * 0.18} fill="#374151" />
        </g>
      ))}
    </g>
  );
}
