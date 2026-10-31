export type Comment = {
  id: string;
  author: string;
  avatarColor: string;
  hoursAgo: number;
  text: string;
  likes: number;
};

const COMMENTS: Record<string, Comment[]> = {
  "drift-day": [
    {
      id: "c1",
      author: "GearHead42",
      avatarColor: "#2563eb",
      hoursAgo: 72,
      text: "That drift was incredibly smooth!",
      likes: 742,
    },
    {
      id: "c2",
      author: "SidewaysSally",
      avatarColor: "#db2777",
      hoursAgo: 48,
      text: "The angle on that second corner was unreal. What tire pressures were you running?",
      likes: 318,
    },
    {
      id: "c3",
      author: "BoostJunkie",
      avatarColor: "#ea580c",
      hoursAgo: 48,
      text: "Came for the cars, stayed for the tire smoke.",
      likes: 205,
    },
  ],
  "classic-style": [
    {
      id: "c1",
      author: "ChromeAndCoffee",
      avatarColor: "#0891b2",
      hoursAgo: 96,
      text: "That paint job deserves its own video.",
      likes: 512,
    },
    {
      id: "c2",
      author: "VintageVroom",
      avatarColor: "#65a30d",
      hoursAgo: 72,
      text: "My dad had one of these. Brought back so many memories.",
      likes: 287,
    },
  ],
  "dream-garage": [
    {
      id: "c1",
      author: "TorqueWrench",
      avatarColor: "#ca8a04",
      hoursAgo: 120,
      text: "Where did you get that tool chest? Need it.",
      likes: 433,
    },
    {
      id: "c2",
      author: "LiftLife",
      avatarColor: "#7c3aed",
      hoursAgo: 96,
      text: "The lighting upgrade alone is worth the watch.",
      likes: 198,
    },
  ],
  "electric-road-trip": [
    {
      id: "c1",
      author: "AmpedUp",
      avatarColor: "#16a34a",
      hoursAgo: 144,
      text: "Really helpful breakdown of the charging stops. Planning my own trip now!",
      likes: 276,
    },
  ],
  "mud-mountains": [
    {
      id: "c1",
      author: "DiffLocker",
      avatarColor: "#b45309",
      hoursAgo: 168,
      text: "That hill climb at 9:40 had me holding my breath.",
      likes: 389,
    },
    {
      id: "c2",
      author: "TrailMix",
      avatarColor: "#0f766e",
      hoursAgo: 120,
      text: "Respect to whoever has to wash that rig afterwards.",
      likes: 241,
    },
  ],
  "final-lap": [
    {
      id: "c1",
      author: "PitWallPete",
      avatarColor: "#dc2626",
      hoursAgo: 72,
      text: "0.2 seconds! Best finish of the season, no contest.",
      likes: 604,
    },
  ],
};

export function getComments(videoId: string): Comment[] {
  return COMMENTS[videoId] ?? [];
}
