export type TitleKind = "series" | "movie";

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumb: string;
  synopsis: string;
}

export interface Title {
  id: string;
  name: string;
  kind: TitleKind;
  year: number;
  rating: number;
  episodes: number;
  seasons: number;
  status: "Ongoing" | "Completed";
  genres: string[];
  studio: string;
  synopsis: string;
  poster: string;
  banner: string;
  trending: boolean;
  views: string;
  progress?: number;
}

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const GENRES = [
  "Action",
  "Romance",
  "Fantasy",
  "Horror",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Slice of Life",
] as const;

const RAW: Array<
  [string, TitleKind, number, number, number, string[], boolean, number?]
> = [
  ["Crimson Vanguard", "series", 2024, 9.1, 24, ["Action", "Fantasy"], true, 62],
  ["Neon Petal Diaries", "series", 2023, 8.4, 12, ["Romance", "Drama"], false, 30],
  ["Hollow Signal", "movie", 2025, 8.9, 1, ["Sci-Fi", "Horror"], true],
  ["Tidebreaker", "series", 2022, 8.7, 36, ["Action", "Drama"], false],
  ["Sugar & Static", "series", 2024, 7.9, 13, ["Comedy", "Slice of Life"], false, 84],
  ["Ashen Crown", "series", 2021, 9.3, 48, ["Fantasy", "Action"], true],
  ["Paper Lanterns", "movie", 2020, 8.2, 1, ["Drama", "Romance"], false],
  ["Voidrunner Zero", "series", 2025, 8.6, 10, ["Sci-Fi", "Action"], true, 12],
  ["The Quiet Kitchen", "series", 2023, 7.6, 24, ["Slice of Life", "Comedy"], false],
  ["Marrow House", "movie", 2024, 8.0, 1, ["Horror"], false],
  ["Starlight Requiem", "movie", 2022, 9.0, 1, ["Fantasy", "Drama"], true],
  ["Iron Blossom", "series", 2024, 8.5, 26, ["Action", "Romance"], false],
  ["Glass Monsoon", "series", 2021, 8.1, 22, ["Drama"], false],
  ["Hyperloop Honey", "series", 2025, 7.4, 8, ["Comedy", "Sci-Fi"], false],
  ["Grave of Foxes", "movie", 2019, 9.2, 1, ["Drama", "Fantasy"], false],
  ["Sablewind", "series", 2023, 8.8, 30, ["Action", "Fantasy"], true],
  ["Midnight Ramen Club", "series", 2022, 7.8, 16, ["Slice of Life"], false, 55],
  ["Echo Protocol", "movie", 2025, 8.3, 1, ["Sci-Fi"], false],
  ["Crimson Vanguard: Origins", "movie", 2021, 8.6, 1, ["Action"], false],
  ["Whisper of the Hollow", "series", 2020, 7.7, 12, ["Horror", "Drama"], false],
  ["Petalfall", "series", 2024, 8.9, 20, ["Romance", "Fantasy"], true],
  ["Titan Circuit", "series", 2023, 8.2, 25, ["Action", "Sci-Fi"], false],
  ["Cloudbound", "movie", 2023, 8.7, 1, ["Fantasy", "Slice of Life"], false],
  ["Bitter Orange", "series", 2022, 7.5, 11, ["Romance", "Comedy"], false],
  ["Nightgale", "series", 2025, 9.0, 6, ["Horror", "Fantasy"], true, 20],
  ["Zero Gravity Cafe", "series", 2021, 8.0, 24, ["Comedy", "Sci-Fi"], false],
  ["The Last Cartographer", "movie", 2024, 8.8, 1, ["Drama", "Fantasy"], false],
  ["Stormcaller Saga", "series", 2019, 9.4, 52, ["Action", "Fantasy"], false],
  ["Silver Tide", "movie", 2022, 7.9, 1, ["Drama"], false],
  ["Pixel Hearts", "series", 2025, 8.1, 9, ["Romance", "Slice of Life"], false],
];

const STUDIOS = ["Studio Kaida", "Lumen Works", "Orbit Animation", "House Sora"];

export const TITLES: Title[] = RAW.map(
  ([name, kind, year, rating, episodes, genres, trending, progress], i) => ({
    id: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    name,
    kind,
    year,
    rating,
    episodes,
    seasons: kind === "series" ? ((i % 3) + 1) : 1,
    status: kind === "movie" || i % 3 === 0 ? "Completed" : "Ongoing",
    genres,
    studio: STUDIOS[i % STUDIOS.length],
    synopsis: `${name} follows an unlikely crew bound by a promise made in a dying city. As old alliances fracture and a forgotten power stirs beneath the surface, every choice they make redraws the map of their world. A ${genres[0].toLowerCase()} story told with hand-painted backgrounds and a sweeping orchestral score.`,
    poster: img(`movizo-p-${i}`, 400, 600),
    banner: img(`movizo-b-${i}`, 1600, 900),
    trending,
    views: `${(2 + ((i * 7) % 40)).toFixed(1)}M`,
    progress,
  }),
);

export const byId = (id: string) => TITLES.find((t) => t.id === id);

export const trending = TITLES.filter((t) => t.trending);
export const newReleases = [...TITLES].sort((a, b) => b.year - a.year).slice(0, 12);
export const topRated = [...TITLES].sort((a, b) => b.rating - a.rating).slice(0, 12);
export const continueWatching = TITLES.filter((t) => t.progress != null);
export const myList = TITLES.slice(3, 13);

export const episodesFor = (t: Title): Episode[] =>
  Array.from({ length: Math.min(t.episodes, 12) }, (_, i) => ({
    id: `${t.id}-ep-${i + 1}`,
    number: i + 1,
    title:
      [
        "The Promise",
        "Ash and Salt",
        "Small Mercies",
        "A Door in the Rain",
        "Nightcall",
        "What the River Kept",
        "Paper Crowns",
        "Threadbare",
        "The Long Quiet",
        "Signal Fire",
        "Homeward",
        "Everything After",
      ][i] ?? `Episode ${i + 1}`,
    duration: `${22 + (i % 4)}m`,
    thumb: img(`${t.id}-ep-${i}`, 320, 180),
    synopsis:
      "A turning point arrives sooner than anyone expected, and the crew must decide what they are willing to lose.",
  }));

export const genreTiles = GENRES.map((g, i) => ({
  name: g,
  count: TITLES.filter((t) => t.genres.includes(g)).length,
  art: img(`movizo-g-${i}`, 640, 400),
}));

/* ---------- admin mock data ---------- */

export const adminStats = [
  { label: "Total Users", value: "184,204", delta: "+4.2%" },
  { label: "Total Titles", value: "1,238", delta: "+18" },
  { label: "Total Views", value: "42.9M", delta: "+9.1%" },
  { label: "Active Streams", value: "6,411", delta: "live" },
];

export const viewsOverTime = [
  { month: "Jan", views: 21 },
  { month: "Feb", views: 26 },
  { month: "Mar", views: 24 },
  { month: "Apr", views: 33 },
  { month: "May", views: 38 },
  { month: "Jun", views: 35 },
  { month: "Jul", views: 44 },
  { month: "Aug", views: 51 },
];

export const genrePopularity = GENRES.map((g, i) => ({
  genre: g,
  share: 30 - i * 3 + (i % 2 ? 4 : 0),
}));

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "Viewer" | "Moderator" | "Admin";
  status: "Active" | "Suspended";
  tier: "Free" | "Standard" | "Premium";
  joined: string;
}

export const USERS: MockUser[] = Array.from({ length: 14 }, (_, i) => ({
  id: `u-${1000 + i}`,
  name: [
    "Aiko Tanaka",
    "Marcus Reed",
    "Lena Ortiz",
    "Devon Blake",
    "Priya Nair",
    "Sam Okafor",
    "Yuki Mori",
    "Elena Vos",
    "Tomas Ruiz",
    "Hana Kim",
    "Noah Fischer",
    "Ivy Chen",
    "Omar Haddad",
    "Rosa Lima",
  ][i],
  email: `user${i + 1}@movizo.tv`,
  role: i % 7 === 0 ? "Moderator" : i === 3 ? "Admin" : "Viewer",
  status: i % 6 === 5 ? "Suspended" : "Active",
  tier: (["Free", "Standard", "Premium"] as const)[i % 3],
  joined: `2025-0${(i % 9) + 1}-1${i % 9}`,
}));

export interface MockAdmin {
  id: string;
  name: string;
  email: string;
  scope: "Admin" | "Super Admin";
  permissions: string[];
  lastActive: string;
}

export const ADMINS: MockAdmin[] = [
  {
    id: "a-1",
    name: "Rin Kobayashi",
    email: "rin@movizo.tv",
    scope: "Super Admin",
    permissions: ["content", "users", "billing", "settings"],
    lastActive: "2 min ago",
  },
  {
    id: "a-2",
    name: "Daniel Cruz",
    email: "daniel@movizo.tv",
    scope: "Admin",
    permissions: ["content", "reports"],
    lastActive: "1 h ago",
  },
  {
    id: "a-3",
    name: "Mei Watanabe",
    email: "mei@movizo.tv",
    scope: "Admin",
    permissions: ["users", "reports"],
    lastActive: "Yesterday",
  },
  {
    id: "a-4",
    name: "Jonas Weber",
    email: "jonas@movizo.tv",
    scope: "Admin",
    permissions: ["content"],
    lastActive: "3 days ago",
  },
];

export interface MockReport {
  id: string;
  target: string;
  type: "Comment" | "Title" | "Profile";
  reason: string;
  reporter: string;
  date: string;
  severity: "Low" | "Medium" | "High";
}

export const REPORTS: MockReport[] = [
  {
    id: "r-1",
    target: "“this sub is garbage lol”",
    type: "Comment",
    reason: "Harassment",
    reporter: "user4@movizo.tv",
    date: "2026-08-30",
    severity: "Medium",
  },
  {
    id: "r-2",
    target: "Marrow House",
    type: "Title",
    reason: "Missing age rating",
    reporter: "user9@movizo.tv",
    date: "2026-08-29",
    severity: "High",
  },
  {
    id: "r-3",
    target: "@voidfan88",
    type: "Profile",
    reason: "Impersonation",
    reporter: "user2@movizo.tv",
    date: "2026-08-28",
    severity: "High",
  },
  {
    id: "r-4",
    target: "“spoilers in ep 4 thread”",
    type: "Comment",
    reason: "Spoilers",
    reporter: "user7@movizo.tv",
    date: "2026-08-26",
    severity: "Low",
  },
  {
    id: "r-5",
    target: "Bitter Orange",
    type: "Title",
    reason: "Broken subtitle track",
    reporter: "user11@movizo.tv",
    date: "2026-08-24",
    severity: "Medium",
  },
];

export interface AuditEntry {
  id: string;
  admin: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
}

export const AUDIT: AuditEntry[] = Array.from({ length: 16 }, (_, i) => ({
  id: `log-${900 + i}`,
  admin: ADMINS[i % ADMINS.length].name,
  action: [
    "content.publish",
    "user.suspend",
    "genre.create",
    "settings.update",
    "admin.invite",
    "report.resolve",
  ][i % 6],
  target: [
    "Nightgale S1E4",
    "user6@movizo.tv",
    "Genre: Mecha",
    "Maintenance mode",
    "jonas@movizo.tv",
    "Report r-4",
  ][i % 6],
  ip: `10.0.${i % 8}.${20 + i}`,
  timestamp: `2026-09-0${(i % 3) + 1} 1${i % 9}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60}`,
}));

export const systemHealth = [
  { label: "API uptime", value: "99.98%", tone: "ok" as const },
  { label: "Transcode queue", value: "12 jobs", tone: "warn" as const },
  { label: "CDN error rate", value: "0.04%", tone: "ok" as const },
  { label: "Storage used", value: "684 TB / 1 PB", tone: "warn" as const },
];

export const profile = {
  name: "Sameer Padhy",
  handle: "@sameer",
  email: "sameer@movizo.tv",
  avatar: img("movizo-avatar", 200, 200),
  member: "Premium · since Jan 2024",
  stats: [
    { label: "Episodes watched", value: "1,284" },
    { label: "Hours streamed", value: "512" },
    { label: "Titles in list", value: "48" },
    { label: "Reviews written", value: "23" },
  ],
  favouriteGenres: ["Action", "Fantasy", "Sci-Fi", "Drama"],
};
