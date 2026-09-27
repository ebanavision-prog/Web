export function normalizeVideoEmbedUrl(url?: string | null): string | null {
  if (!url) return null;

  const trimmed = url.trim();

  if (/\/embed\//.test(trimmed) || /player\.vimeo\.com\/video\//.test(trimmed)) {
    return trimmed;
  }

  const youtubeWatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeWatch) {
    return `https://www.youtube.com/embed/${youtubeWatch[1]}`;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}
