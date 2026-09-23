// Deterministic, dependency-free placeholder artwork for video thumbnails.
// No AI image generation is available in this environment, so this renders
// a branded gradient card (as an inline SVG data URI) instead of plain text.

const PALETTES = [
  ["#087BFF", "#071426"],
  ["#20D5FF", "#080A0D"],
  ["#7C3AED", "#0B1D36"],
  ["#FF4D6D", "#0B1D36"],
  ["#00E676", "#071426"],
  ["#FFB020", "#080A0D"],
];

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function truncate(title, max = 28) {
  return title.length > max ? `${title.slice(0, max - 1).trimEnd()}…` : title;
}

export function generateThumbnail(title, subtitle) {
  const seed = hashString(title || "Untitled");
  const [accent, base] = PALETTES[seed % PALETTES.length];
  const angle = 20 + (seed % 50);
  const safeTitle = truncate(String(title || "Untitled"));
  const safeSubtitle = subtitle ? truncate(String(subtitle), 24) : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="g" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="${base}" />
        <stop offset="100%" stop-color="${accent}" />
      </linearGradient>
    </defs>
    <rect width="640" height="360" fill="${base}" />
    <rect width="640" height="360" fill="url(#g)" opacity="0.55" />
    <circle cx="560" cy="60" r="140" fill="${accent}" opacity="0.18" />
    <circle cx="70" cy="320" r="110" fill="${accent}" opacity="0.12" />
    <text x="32" y="290" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#FFFFFF">${escapeXml(safeTitle)}</text>
    ${safeSubtitle ? `<text x="32" y="320" font-family="Arial, sans-serif" font-size="16" fill="#AEB8C4">${escapeXml(safeSubtitle)}</text>` : ""}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
