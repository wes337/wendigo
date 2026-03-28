"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { box, btn, cdn, dropShadow, insetShadow, input } from "@/app/styles";

const COLORS = {
  blue: { dot: "bg-blue-500", border: "border-blue-400" },
  red: { dot: "bg-red-500", border: "border-red-400" },
  green: { dot: "bg-green-500", border: "border-green-400" },
  orange: { dot: "bg-orange-500", border: "border-orange-400" },
  purple: { dot: "bg-purple-500", border: "border-purple-400" },
  pink: { dot: "bg-pink-500", border: "border-pink-400" },
  yellow: { dot: "bg-yellow-500", border: "border-yellow-400" },
  zinc: { dot: "bg-zinc-500", border: "border-zinc-400" },
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Mixer({ songs, initialIndex = 0 }) {
  const audioCtxRef = useRef(null);
  const buffersRef = useRef({});
  const sourcesRef = useRef({});
  const gainsRef = useRef({});
  const pannersRef = useRef({});
  const analysersRef = useRef({});
  const canvasRefs = useRef({});
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);
  const rafRef = useRef(null);
  const durationRef = useRef(30);

  const [songIndex, setSongIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [loadLog, setLoadLog] = useState([]);
  const logRef = useRef(null);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volumes, setVolumes] = useState({});
  const [pans, setPans] = useState({});
  const [muted, setMuted] = useState(() => new Set());
  const [soloed, setSoloed] = useState(() => new Set());

  const song = songs[songIndex];
  const tracks = song?.tracks || [];

  // Auto-scroll console log
  useLayoutEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [loadLog]);

  // Initialize volumes/pans and preload when song changes
  useEffect(() => {
    setVolumes(Object.fromEntries(tracks.map((t) => [t.id, 80])));
    setPans(Object.fromEntries(tracks.map((t) => [t.id, 0])));
    setMuted(new Set());
    setSoloed(new Set());
    setError(null);
    setCurrentTime(0);
    pausedAtRef.current = 0;

    if (tracks.length > 0) loadBuffers();
  }, [songIndex]);

  function getAudioCtx() {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AC();
    }
    return audioCtxRef.current;
  }

  async function loadBuffers() {
    const ctx = getAudioCtx();
    setLoading(true);
    setLoaded(0);
    setLoadLog([`> initializing audio context...`]);
    setError(null);

    await Promise.all(
      tracks.map(async (track) => {
        const key = track.url;
        if (!buffersRef.current[key]) {
          setLoadLog((prev) => [...prev, `> fetching "${track.label}"...`]);
          try {
            const res = await fetch(track.url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const arrayBuf = await res.arrayBuffer();
            if (arrayBuf.byteLength === 0) throw new Error("Empty response");
            const audioBuf = await ctx.decodeAudioData(arrayBuf);
            buffersRef.current[key] = audioBuf;
            const mb = (arrayBuf.byteLength / 1048576).toFixed(1);
            setLoadLog((prev) => [...prev, `  ✓ "${track.label}" loaded (${mb}MB, ${audioBuf.duration.toFixed(1)}s)`]);
          } catch (e) {
            console.error(`Failed to load "${track.label}":`, e);
            setLoadLog((prev) => [...prev, `  ✗ "${track.label}" FAILED: ${e.message}`]);
            setError(`Failed to load "${track.label}": ${e.message}`);
          }
        } else {
          setLoadLog((prev) => [...prev, `  ✓ "${track.label}" cached`]);
        }
        setLoaded((prev) => prev + 1);
      })
    );

    setLoadLog((prev) => [...prev, `> all tracks ready. hit play.`]);

    // Create persistent gain + analyser + panner nodes per track id
    for (const track of tracks) {
      if (!buffersRef.current[track.url]) continue;
      if (!gainsRef.current[track.id]) {
        const gain = ctx.createGain();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        const panner = ctx.createStereoPanner();
        gain.connect(analyser);
        analyser.connect(panner);
        panner.connect(ctx.destination);
        gainsRef.current[track.id] = gain;
        analysersRef.current[track.id] = analyser;
        pannersRef.current[track.id] = panner;
      }
    }

    setLoading(false);
  }

  const applyGains = useCallback(() => {
    const anySoloed = soloed.size > 0;
    for (const track of tracks) {
      const gain = gainsRef.current[track.id];
      if (!gain) continue;
      const audible =
        (!anySoloed || soloed.has(track.id)) && !muted.has(track.id);
      gain.gain.value = audible ? (volumes[track.id] ?? 80) / 100 : 0;
    }
  }, [tracks, volumes, muted, soloed]);

  useEffect(() => {
    applyGains();
  }, [applyGains]);

  useEffect(() => {
    for (const track of tracks) {
      const panner = pannersRef.current[track.id];
      if (panner) panner.pan.value = (pans[track.id] ?? 0) / 100;
    }
  }, [tracks, pans]);

  // Draw visualizers
  function drawVisualizers() {
    for (const track of tracks) {
      const analyser = analysersRef.current[track.id];
      const canvas = canvasRefs.current[track.id];
      if (!analyser || !canvas) continue;

      const ctx2d = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      const bufLen = analyser.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyser.getByteTimeDomainData(data);

      ctx2d.clearRect(0, 0, w, h);

      const color = COLORS[track.color]?.dot.replace("bg-", "").replace("-500", "") || "blue";
      const colorMap = { blue: "#3b82f6", red: "#ef4444", green: "#22c55e", orange: "#f97316", purple: "#a855f7", pink: "#ec4899", yellow: "#eab308", zinc: "#71717a" };
      ctx2d.strokeStyle = colorMap[color] || "#3b82f6";
      ctx2d.lineWidth = 1.5;
      ctx2d.beginPath();

      const gain = 0.75;
      const mid = h / 2;
      const sliceW = w / bufLen;
      for (let i = 0; i < bufLen; i++) {
        const v = (data[i] - 128) * gain;
        const y = Math.max(0, Math.min(h, mid + v));
        if (i === 0) ctx2d.moveTo(0, y);
        else ctx2d.lineTo(i * sliceW, y);
      }
      ctx2d.stroke();
    }
  }

  // Timeline
  function startTimeline() {
    function tick() {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const elapsed = ctx.currentTime - startTimeRef.current;
      setCurrentTime(elapsed);
      drawVisualizers();
      if (elapsed >= durationRef.current) {
        stopPlayback();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function stopTimeline() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function clearVisualizers() {
    for (const track of tracks) {
      const canvas = canvasRefs.current[track.id];
      if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function stopSources() {
    for (const track of tracks) {
      const source = sourcesRef.current[track.id];
      if (source) {
        try { source.stop(); } catch {}
      }
    }
    sourcesRef.current = {};
  }

  function handlePause() {
    if (!playing) return;
    stopTimeline();
    const ctx = audioCtxRef.current;
    if (ctx) pausedAtRef.current = ctx.currentTime - startTimeRef.current;
    stopSources();
    clearVisualizers();
    setPlaying(false);
  }

  function stopPlayback() {
    stopTimeline();
    stopSources();
    clearVisualizers();
    pausedAtRef.current = 0;
    setPlaying(false);
    setCurrentTime(0);
  }

  async function handlePlay() {
    if (playing) return;
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") await ctx.resume();

    const needsLoad = tracks.some((t) => !buffersRef.current[t.url]);
    if (needsLoad) await loadBuffers();

    const maxDur = Math.max(
      30,
      ...tracks.map((t) => buffersRef.current[t.url]?.duration || 0)
    );
    durationRef.current = maxDur;
    setDuration(maxDur);

    const offset = pausedAtRef.current;

    for (const track of tracks) {
      const buf = buffersRef.current[track.url];
      if (!buf) continue;
      const source = ctx.createBufferSource();
      source.buffer = buf;
      source.connect(gainsRef.current[track.id]);
      sourcesRef.current[track.id] = source;
    }

    startTimeRef.current = ctx.currentTime - offset;
    for (const track of tracks) {
      const source = sourcesRef.current[track.id];
      if (!source) continue;
      const buf = buffersRef.current[track.url];
      if (offset < buf.duration) {
        source.start(ctx.currentTime, offset);
      }
    }

    applyGains();
    setPlaying(true);
    startTimeline();
  }

  function handleStop() {
    if (!playing && pausedAtRef.current === 0) return;
    stopPlayback();
  }

  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTo = pct * durationRef.current;

    if (playing) {
      // Stop current sources, restart at new offset
      stopTimeline();
      stopSources();
      const ctx = audioCtxRef.current;

      for (const track of tracks) {
        const buf = buffersRef.current[track.url];
        if (!buf) continue;
        const source = ctx.createBufferSource();
        source.buffer = buf;
        source.connect(gainsRef.current[track.id]);
        sourcesRef.current[track.id] = source;
        if (seekTo < buf.duration) {
          source.start(ctx.currentTime, seekTo);
        }
      }

      startTimeRef.current = ctx.currentTime - seekTo;
      applyGains();
      startTimeline();
    } else {
      // While paused, just update the position
      pausedAtRef.current = seekTo;
      setCurrentTime(seekTo);
    }
  }

  function handleSongChange(e) {
    // Force stop everything regardless of state
    stopTimeline();
    for (const id in sourcesRef.current) {
      try { sourcesRef.current[id].stop(); } catch {}
    }
    sourcesRef.current = {};
    for (const id in gainsRef.current) {
      try { gainsRef.current[id].disconnect(); } catch {}
    }
    for (const id in pannersRef.current) {
      try { pannersRef.current[id].disconnect(); } catch {}
    }
    for (const id in analysersRef.current) {
      try { analysersRef.current[id].disconnect(); } catch {}
    }
    for (const id in canvasRefs.current) {
      try { canvasRefs.current[id].getContext("2d").clearRect(0, 0, canvasRefs.current[id].width, canvasRefs.current[id].height); } catch {}
    }
    gainsRef.current = {};
    pannersRef.current = {};
    analysersRef.current = {};
    canvasRefs.current = {};
    pausedAtRef.current = 0;
    setPlaying(false);
    setCurrentTime(0);
    setSongIndex(Number(e.target.value));
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimeline();
      for (const id in sourcesRef.current) {
        try { sourcesRef.current[id].stop(); } catch {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  function toggleMute(id) {
    setMuted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSolo(id) {
    setSoloed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const noTracks = tracks.length === 0;

  return (
    <div className={box}>
      {/* Song picker */}
      <div className="flex items-center gap-2">
        <img
          className={`w-[16px] h-[16px] shrink-0 ${dropShadow}`}
          src={`${cdn}/icons/small/music.png`}
          alt=""
        />
        <select
          value={songIndex}
          onChange={handleSongChange}
          className={input}
        >
          {songs.map((s, i) => (
            <option key={i} value={i}>
              {s.pack} — {s.name} ({s.tracks.length} tracks)
            </option>
          ))}
        </select>
      </div>

      {/* Console log */}
      {loadLog.length > 0 && (
        <div ref={logRef} className="bg-[#1a1a2e] border-1 border-[#2a2a4a] rounded-[2px] p-2.5 max-h-[72px] overflow-y-auto font-mono [scrollbar-width:thin] [scrollbar-color:#2a2a4a_#1a1a2e] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-[#1a1a2e] [&::-webkit-scrollbar-thumb]:bg-[#2a2a4a] [&::-webkit-scrollbar-thumb]:rounded-full">
          {loadLog.map((line, i) => (
            <div
              key={i}
              className={`text-[11px] leading-[18px] ${line.includes("✗") ? "text-red-400" : line.includes("✓") ? "text-green-400" : line.includes("ready") ? "text-amber-400" : "text-zinc-400"}`}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-600 font-bold">{error}</div>
      )}

      {/* Transport + Timeline */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`${btn} h-[34px] disabled:opacity-40`}
          onClick={playing ? handlePause : handlePlay}
          disabled={loading || noTracks}
        >
          <img
            className="w-[16px] h-[16px] mr-1"
            src={`${cdn}/icons/small/${playing ? "control_pause_blue" : "control_play_blue"}.png`}
            alt=""
          />
          <span className="w-[34px] text-center">{playing ? "Pause" : "Play"}</span>
        </button>
        <button
          type="button"
          className={`${btn} h-[34px] disabled:opacity-40`}
          onClick={handleStop}
          disabled={loading || !playing}
        >
          <img
            className="w-[16px] h-[16px]"
            src={`${cdn}/icons/small/control_stop_blue.png`}
            alt=""
          />
        </button>
        <span className="text-[10px] text-[var(--t-text-muted)] font-bold tabular-nums w-[32px] shrink-0 text-right">
          {formatTime(currentTime)}
        </span>
          <div
            className={`relative flex-1 h-[14px] bg-[var(--t-input-bg)] border-1 border-[var(--t-panel-border)] rounded-[2px] overflow-hidden cursor-pointer ${insetShadow}`}
            onClick={handleSeek}
          >
            <div
              className="absolute top-0 left-0 bottom-0 bg-[var(--t-accent)] opacity-15 transition-none"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[var(--t-accent)] transition-none"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
            {Array.from({ length: Math.floor(duration / 5) + 1 }, (_, i) => {
              const t = i * 5;
              const isMajor = t % 10 === 0;
              return (
                <div
                  key={t}
                  className={`absolute top-0 ${isMajor ? "h-full" : "h-1/2"} w-px bg-[var(--t-panel-border)]`}
                  style={{ left: `${(t / duration) * 100}%` }}
                />
              );
            })}
          </div>
          <span className="text-[10px] text-[var(--t-text-muted)] font-bold tabular-nums w-[32px] shrink-0 text-right">
            {formatTime(duration)}
          </span>
      </div>

      {/* Track list */}
      {noTracks ? (
        <div className="text-sm text-[var(--t-text-muted)]">
          No audio tracks found for this song.
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {tracks.map((track) => {
            const color = COLORS[track.color] || COLORS.blue;
            const isMuted = muted.has(track.id);
            const isSoloed = soloed.has(track.id);

            const anySoloed = soloed.size > 0;
            const faded = isMuted || (anySoloed && !isSoloed);

            return (
              <div key={track.id} className={faded ? "opacity-50" : ""}>
                <canvas
                  ref={(el) => { if (el) canvasRefs.current[track.id] = el; }}
                  width={680}
                  height={24}
                  className="w-full h-[24px] rounded-t-[2px] bg-[var(--t-input-bg)] border-1 border-b-0 border-[var(--t-panel-border)]"
                />
                <div
                  className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 px-2.5 py-2 bg-[var(--t-row-even)] border-1 border-[var(--t-panel-border)] rounded-b-[2px] shadow-sm"
                >
                {/* Label */}
                <div className="flex items-center gap-2 md:w-[140px] shrink-0">
                  <div
                    className={`w-[10px] h-[10px] rounded-[2px] ${color.dot} border-1 ${color.border}`}
                  />
                  <span className="text-xs font-bold truncate">
                    {track.label}
                  </span>
                </div>

                {/* Mute / Solo */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    className={`flex items-center justify-center w-[28px] h-[28px] cursor-pointer border-1 border-[var(--t-panel-border)] rounded-[2px] ${isMuted ? "bg-red-100" : "bg-[var(--t-btn-bg)] hover:bg-[var(--t-btn-hover)]"} ${insetShadow}`}
                    onClick={() => toggleMute(track.id)}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    <img
                      className="w-[14px] h-[14px]"
                      src={`${cdn}/icons/small/${isMuted ? "sound_mute" : "sound"}.png`}
                      alt=""
                    />
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center w-[28px] h-[28px] cursor-pointer text-[10px] font-black border-1 border-[var(--t-panel-border)] rounded-[2px] ${isSoloed ? "bg-amber-200 text-amber-800 border-amber-400" : "bg-[var(--t-btn-bg)] hover:bg-[var(--t-btn-hover)] text-[var(--t-text-muted)]"} ${insetShadow}`}
                    onClick={() => toggleSolo(track.id)}
                    title={isSoloed ? "Unsolo" : "Solo"}
                  >
                    S
                  </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <img
                    className={`w-[14px] h-[14px] shrink-0 ${dropShadow}`}
                    src={`${cdn}/icons/small/sound_low.png`}
                    alt=""
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volumes[track.id] ?? 80}
                    onChange={(e) =>
                      setVolumes((prev) => ({
                        ...prev,
                        [track.id]: Number(e.target.value),
                      }))
                    }
                    className="flex-1 min-w-0 retro-slider"
                  />
                  <span className="text-[10px] text-[var(--t-text-muted)] font-bold w-[24px] text-right tabular-nums">
                    {volumes[track.id] ?? 80}
                  </span>
                </div>

                {/* Pan */}
                <div className="flex items-center gap-1.5 md:w-[140px] shrink-0">
                  <span className="text-[10px] text-[var(--t-text-muted)] font-bold">
                    L
                  </span>
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    value={pans[track.id] ?? 0}
                    onChange={(e) =>
                      setPans((prev) => ({
                        ...prev,
                        [track.id]: Number(e.target.value),
                      }))
                    }
                    className="flex-1 min-w-0 retro-slider"
                  />
                  <span className="text-[10px] text-[var(--t-text-muted)] font-bold">
                    R
                  </span>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
