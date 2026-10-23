import Link from "next/link";
import { box, btn, cdn, dropShadow, insetShadow, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import { getVisitor } from "@/lib/visitor";
import Ticker from "@/app/(site)/ticker";
import ReactionBar from "@/app/(site)/reaction-bar";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const POSTS_PER_PAGE = 5;

// Promo banner tinted by `--promo` (set per banner), mixed into the theme's colors so it works on every theme
const promoBanner = `flex items-center justify-center gap-1.5 py-2 px-4 w-full rounded-[2px] border-1 border-[color-mix(in_oklab,var(--promo)_40%,transparent)] bg-gradient-to-bl from-[color-mix(in_oklab,var(--promo)_8%,var(--t-input-bg))] via-[color-mix(in_oklab,var(--promo)_18%,var(--t-input-bg))] to-[color-mix(in_oklab,var(--promo)_32%,var(--t-input-bg))] hover:from-[color-mix(in_oklab,var(--promo)_14%,var(--t-input-bg))] hover:via-[color-mix(in_oklab,var(--promo)_26%,var(--t-input-bg))] hover:to-[color-mix(in_oklab,var(--promo)_40%,var(--t-input-bg))] active:from-[var(--t-input-bg)] active:via-[color-mix(in_oklab,var(--promo)_8%,var(--t-input-bg))] active:to-[color-mix(in_oklab,var(--promo)_18%,var(--t-input-bg))] cursor-pointer ${insetShadow} ${dropShadow}`;
const promoText = "text-xs font-bold tracking-normal text-[color-mix(in_oklab,var(--promo)_45%,var(--t-text))]";

function PageLink({ page, disabled, children }) {
  if (disabled) {
    return <span className={`${btn} gap-1 w-[96px] opacity-50 cursor-default`}>{children}</span>;
  }
  return (
    <Link href={page === 1 ? "/" : `/?page=${page}`} className={`${btn} gap-1 w-[96px]`}>
      {children}
    </Link>
  );
}

// "MM/DD/YY"
function formatDate(date) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

// "h:mm a.m."
function formatTime(date) {
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "p.m." : "a.m.";
  return `${hours % 12 || 12}:${minutes} ${ampm}`;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / 1048576).toFixed(2) + " MB";
}

// News feed is paginated via `?page=N` (1-based)
export default async function Home({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const [{ count }] = await Sql.client`SELECT count(*)::int FROM wendigo.posts`;
  const totalPages = Math.max(1, Math.ceil(count / POSTS_PER_PAGE));
  const page = Math.min(Math.max(1, Number.parseInt(pageParam, 10) || 1), totalPages);

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
    LIMIT ${POSTS_PER_PAGE} OFFSET ${(page - 1) * POSTS_PER_PAGE}
  `;

  // Reaction counts for this page's posts, keyed post id -> reaction id -> { count, mine }
  const visitor = await getVisitor();
  const reactionRows = await Sql.client`
    SELECT post_id, reaction, count(*)::int AS count,
      bool_or(visitor_id = ${visitor.id} OR ip_hash = ${visitor.ipHash}) AS mine
    FROM wendigo.post_reactions
    WHERE post_id = ANY(${posts.map((p) => p.id)}::int[])
    GROUP BY post_id, reaction
  `;
  const reactions = {};
  for (const { post_id, reaction, count, mine } of reactionRows) {
    (reactions[post_id] ??= {})[reaction] = { count, mine };
  }

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
        className={`${promoBanner} mb-2 [--promo:var(--color-fuchsia-500)]`}
      >
        <img
          className={`w-[16px] h-[16px] ${dropShadow}`}
          src={`${cdn}/icons/small/control_equalizer.png`}
          alt=""
        />
        <span className={promoText}>
          Try our latest sample pack in the mixer! Click here!
        </span>
      </Link>
      <Link
        href="/contact"
        className={`${promoBanner} mb-5 md:mb-8 [--promo:var(--color-amber-500)]`}
      >
        <img
          className={`w-[16px] h-[16px] ${dropShadow}`}
          src={`${cdn}/icons/small/new.png`}
          alt=""
        />
        <span className={promoText}>
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
        {posts.map((post) => (
          <article
            key={post.id}
            className="border-1 border-[var(--t-panel-border)] rounded-[2px] overflow-hidden drop-shadow-sm"
          >
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-bl from-[var(--t-row-hover)] via-[var(--t-input-bg)] to-[var(--t-row-even)] border-b-1 border-[var(--t-panel-border)] ${insetShadow}`}>
              <h2 className="text-sm font-bold truncate">
                {post.title}
              </h2>
              {now - new Date(post.created_at).getTime() < SEVEN_DAYS && (
                <img
                  className="w-[16px] h-[16px] shrink-0 ml-auto"
                  src={`${cdn}/icons/small/new.png`}
                  alt="New"
                />
              )}
            </div>
            <div className={`p-2.5 bg-[var(--t-row-odd)] ${insetShadow}`}>
              <div className="about-prose text-sm" dangerouslySetInnerHTML={{ __html: post.content }} />
              {post.files.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-2.5 p-2 bg-[var(--t-input-bg)] border-1 border-dashed border-[var(--t-panel-border)] rounded-[2px]">
                  {post.files.map((file, j) => (
                    <a
                      key={j}
                      href={file.url}
                      className="flex items-center whitespace-nowrap text-sm font-bold cursor-pointer text-[var(--t-accent)] hover:underline active:underline"
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
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-2.5 py-1 text-xs text-[var(--t-text-muted)] bg-[var(--t-row-even)] border-t-1 border-[var(--t-panel-border)]">
              <div>
                <span className="hidden md:inline">Posted by </span>
                <span className="text-[color-mix(in_oklab,var(--color-orange-600)_75%,var(--t-text))] font-bold cursor-pointer hover:underline active:underline">
                  {post.author}
                </span>{" "}
                <span className="hidden md:inline">on </span>
                {formatDate(post.created_at)}
                <span className="hidden min-[376px]:inline"> @ {formatTime(post.created_at)}</span>
              </div>
              <ReactionBar postId={post.id} reactions={reactions[post.id] ?? {}} />
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <div className="text-sm text-[var(--t-text-muted)]">No posts yet.</div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2.5">
          <PageLink page={page - 1} disabled={page === 1}>
            <img className="w-[16px] h-[16px]" src={`${cdn}/icons/small/arrow_left.png`} alt="" />
            Newer
          </PageLink>
          <span className="text-xs font-bold text-[var(--t-text-muted)]">
            Page {page} of {totalPages}
          </span>
          <PageLink page={page + 1} disabled={page === totalPages}>
            Older
            <img className="w-[16px] h-[16px]" src={`${cdn}/icons/small/arrow_right.png`} alt="" />
          </PageLink>
        </div>
      )}
    </div>
  );
}
