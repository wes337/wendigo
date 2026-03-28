const STORAGE_KEY = process.env.BUNNY_STORAGE_KEY;
const STORAGE_ZONE = "wes-storage";
const STORAGE_HOST = "storage.bunnycdn.com";
const CDN_HOST = "w-img.b-cdn.net";

export async function uploadFile(key, buffer) {
  const res = await fetch(
    `https://${STORAGE_HOST}/${STORAGE_ZONE}/wendigo/${key}`,
    {
      method: "PUT",
      headers: {
        AccessKey: STORAGE_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    },
  );

  if (!res.ok) throw new Error(`Bunny upload failed: ${res.status}`);
  return `https://${CDN_HOST}/wendigo/${key}`;
}

export async function listFiles(path = "") {
  const encoded = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const res = await fetch(
    `https://${STORAGE_HOST}/${STORAGE_ZONE}/wendigo/${encoded}/`,
    {
      headers: { AccessKey: STORAGE_KEY },
    },
  );

  if (!res.ok) throw new Error(`Bunny list failed: ${res.status} for ${path}`);
  return res.json();
}

const AUDIO_EXTS = new Set(["wav", "mp3", "ogg", "flac", "m4a", "aac"]);

function encodeCdnPath(path) {
  return path
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
}

export async function listSamplePacks(root = "samples") {
  const packs = await listFiles(root);
  const result = [];

  for (const pack of packs) {
    if (!pack.IsDirectory) continue;
    const packPath = `${root}/${pack.ObjectName}`;
    const songs = await listFiles(packPath);
    const packSongs = [];

    for (const song of songs) {
      if (!song.IsDirectory) continue;
      const songPath = `${packPath}/${song.ObjectName}`;
      const items = await listFiles(songPath);

      // Check for subdirectories (e.g., DRUM LOOPS_STEMS has sub-songs)
      const hasDirs = items.some((i) => i.IsDirectory);
      if (hasDirs) {
        for (const sub of items) {
          if (!sub.IsDirectory) continue;
          const subPath = `${songPath}/${sub.ObjectName}`;
          const subItems = await listFiles(subPath);
          const tracks = subItems
            .filter((f) => {
              if (f.IsDirectory) return false;
              const ext = f.ObjectName.split(".").pop().toLowerCase();
              return AUDIO_EXTS.has(ext);
            })
            .map((f) => ({
              name: f.ObjectName,
              url: `https://${CDN_HOST}/wendigo/${encodeCdnPath(`${subPath}/${f.ObjectName}`)}`,
              size: f.Length,
            }));
          if (tracks.length > 0) {
            packSongs.push({
              name: sub.ObjectName,
              path: subPath,
              tracks,
            });
          }
        }
      } else {
        const tracks = items
          .filter((f) => {
            if (f.IsDirectory) return false;
            const ext = f.ObjectName.split(".").pop().toLowerCase();
            return AUDIO_EXTS.has(ext);
          })
          .map((f) => ({
            name: f.ObjectName,
            url: `https://${CDN_HOST}/wendigo/${encodeCdnPath(`${songPath}/${f.ObjectName}`)}`,
            size: f.Length,
          }));
        if (tracks.length > 0) {
          packSongs.push({
            name: song.ObjectName,
            path: songPath,
            tracks,
          });
        }
      }
    }

    if (packSongs.length > 0) {
      result.push({ name: pack.ObjectName, songs: packSongs });
    }
  }

  return result;
}

export async function deleteFile(key) {
  const res = await fetch(
    `https://${STORAGE_HOST}/${STORAGE_ZONE}/wendigo/${key}`,
    {
      method: "DELETE",
      headers: { AccessKey: STORAGE_KEY },
    },
  );

  if (!res.ok) throw new Error(`Bunny delete failed: ${res.status}`);
}
