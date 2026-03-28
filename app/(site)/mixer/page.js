import { cdn, siteWidth } from "@/app/styles";
import { listSamplePacks } from "@/lib/bunny";
import Mixer from "@/app/(site)/mixer/mixer";

const TRACK_COLORS = [
  "blue", "red", "green", "orange", "purple", "pink", "yellow", "zinc",
];

export default async function MixerPage() {
  const packs = await listSamplePacks();

  // Flatten into a list of songs with colored tracks
  const songs = packs.flatMap((pack) =>
    pack.songs.map((song) => ({
      pack: pack.name,
      name: song.name,
      tracks: song.tracks.map((t, i) => ({
        id: i + 1,
        label: t.name.replace(/\.[^.]+$/, ""),
        url: t.url,
        size: t.size,
        color: TRACK_COLORS[i % TRACK_COLORS.length],
      })),
    }))
  );

  return (
    <div className={`mt-5 md:mt-8 text-[var(--t-text)] ${siteWidth}`}>
      <div className="flex font-bold text-sm mb-2.5">
        <img
          className="w-[16px] h-[16px] mr-1"
          src={`${cdn}/icons/small/control_equalizer.png`}
          alt=""
        />
        Mixer
      </div>
      <Mixer songs={songs} initialIndex={Math.floor(Math.random() * songs.length)} />
    </div>
  );
}
