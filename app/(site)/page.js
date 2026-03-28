import { Fragment } from "react";
import Link from "next/link";
import { box, cdn, dropShadow, insetShadow, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import Ticker from "@/app/(site)/ticker";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function formatDate(date) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "p.m." : "a.m.";
  hours = hours % 12 || 12;
  return `${mm}/${dd}/${yy} @ ${hours}:${minutes} ${ampm}`;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / 1048576).toFixed(2) + " MB";
}

export default async function Home() {
  const posts = await Sql.client`
    SELECT p.*,
      COALESCE(
        json_agg(json_build_object('name', f.name, 'size', f.size, 'url', f.url))
        FILTER (WHERE f.id IS NOT NULL),
        '[]'
      ) as files
    FROM wendigo.posts p
    LEFT JOIN wendigo.post_files pf ON pf.post_id = p.id
    LEFT JOIN wendigo.files f ON f.id = pf.file_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;
  let upcomingEvents = await Sql.client`
    SELECT * FROM wendigo.events
    WHERE date >= CURRENT_DATE
    ORDER BY date ASC
    LIMIT 10
  `;
  const hasUpcoming = upcomingEvents.length > 0;
  if (!hasUpcoming) {
    upcomingEvents = await Sql.client`
      SELECT * FROM wendigo.events
      WHERE date < CURRENT_DATE
      ORDER BY date DESC
      LIMIT 10
    `;
  }
  const now = Date.now();

  return (
    <div className={`mt-5 md:mt-8 text-[var(--t-text)] ${siteWidth}`}>
      <Link
        href="/mixer"
        className={`flex items-center justify-center gap-1.5 mb-2 py-2 px-4 w-full rounded-[2px] border-1 border-fuchsia-400/40 bg-gradient-to-bl from-fuchsia-50 via-purple-100 to-fuchsia-200 cursor-pointer hover:from-fuchsia-100 hover:via-purple-150 hover:to-fuchsia-250 active:from-white active:via-fuchsia-50 active:to-fuchsia-100 ${insetShadow} ${dropShadow}`}
      >
        <img
          className={`w-[16px] h-[16px] ${dropShadow}`}
          src={`${cdn}/icons/small/control_equalizer.png`}
          alt=""
        />
        <span className="text-xs font-bold text-fuchsia-900/80 tracking-normal">
          Try our latest sample pack in the mixer! Click here!
        </span>
      </Link>
      <Link
        href="/contact"
        className={`flex items-center justify-center gap-1.5 mb-5 md:mb-8 py-2 px-4 w-full rounded-[2px] border-1 border-amber-400/40 bg-gradient-to-bl from-amber-50 via-yellow-100 to-amber-200 cursor-pointer hover:from-amber-100 hover:via-yellow-150 hover:to-amber-250 active:from-white active:via-amber-50 active:to-amber-100 ${insetShadow} ${dropShadow}`}
      >
        <img
          className={`w-[16px] h-[16px] ${dropShadow}`}
          src={`${cdn}/icons/small/new.png`}
          alt=""
        />
        <span className="text-xs font-bold text-amber-800/80 tracking-normal">
          Need custom music, sound design, or art? Click here!
        </span>
      </Link>
      {upcomingEvents.length > 0 && (
        <>
          <div className="flex font-bold text-sm mb-2.5">
            <img
              className="w-[16px] h-[16px] mr-1"
              src={`${cdn}/icons/small/calendar.png`}
              alt=""
            />
            {hasUpcoming ? "Upcoming Events" : "Recent Events"}
          </div>
          <Ticker events={upcomingEvents} />
        </>
      )}
      <div className="flex font-bold text-sm mb-2.5 mt-5 md:mt-8">
        <img
          className="w-[16px] h-[16px] mr-1"
          src={`${cdn}/icons/small/newspaper.png`}
          alt=""
        />
        News
      </div>
      <div className={box}>
        {posts.map((post, i) => (
          <Fragment key={post.id}>
            {i > 0 && <hr className="border-[var(--t-panel-border)] drop-shadow-md" />}
            <div>
              <div className="flex items-center gap-[4px] mb-[4px]">
                <div className="font-bold">{post.title}</div>
                {now - new Date(post.created_at).getTime() < SEVEN_DAYS && (
                  <img
                    className="w-[32px] h-[32px]"
                    src={`${cdn}/icons/new.png`}
                    alt=""
                  />
                )}
              </div>
              <div className="about-prose text-sm" dangerouslySetInnerHTML={{ __html: post.content }} />
              {post.files.length > 0 && (
                <div className="flex flex-col mt-[8px]">
                  {post.files.map((file, j) => (
                    <a
                      key={j}
                      href={file.url}
                      className="flex items-center whitespace-nowrap text-sm font-bold cursor-pointer text-[var(--t-accent)] hover:underline active:underline mb-2.5"
                    >
                      <img
                        className="mt-[-2px] mr-1"
                        src={`${cdn}/icons/small/inbox_download.png`}
                        alt=""
                      />
                      <span className="hidden md:inline">Download&nbsp;</span>{file.name} ({formatSize(Number(file.size))})
                    </a>
                  ))}
                </div>
              )}
              <div className="flex items-center mt-[8px]">
                <div className="text-xs text-[var(--t-text-muted)]">
                  Posted by{" "}
                  <span className="text-xs text-orange-600 font-bold cursor-pointer hover:underline active:underline">
                    {post.author}
                  </span>{" "}
                  on {formatDate(post.created_at)}
                </div>
              </div>
            </div>
          </Fragment>
        ))}
        {posts.length === 0 && (
          <div className="text-sm text-[var(--t-text-muted)]">No posts yet.</div>
        )}
      </div>
    </div>
  );
}
