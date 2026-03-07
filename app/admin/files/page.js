import { box, cdn, listRow, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import { remove } from "@/app/admin/files/actions";
import DeleteButton from "@/app/admin/delete-button";
import UploadForm from "@/app/admin/files/upload";

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / 1048576).toFixed(2) + " MB";
}

export default async function Files() {
  const files = await Sql.client`
    SELECT f.*,
      COALESCE(
        json_agg(p.title) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) as post_titles
    FROM wendigo.files f
    LEFT JOIN wendigo.post_files pf ON pf.file_id = f.id
    LEFT JOIN wendigo.posts p ON p.id = pf.post_id
    GROUP BY f.id
    ORDER BY f.created_at DESC
  `;

  return (
    <div className={`mt-5 text-zinc-900 overflow-hidden ${siteWidth}`}>
      <div className="flex font-bold text-sm mb-2.5">Upload a New File</div>
      <div className={box}>
        <UploadForm />
      </div>
      <div className="flex font-bold text-sm mb-2.5 mt-5">Files</div>
      <div className={`${box} !gap-2`}>
        {files.map((file) => (
          <div key={file.id} className={listRow}>
            <span className="text-sm truncate">{file.name}</span>
            <div className="text-xs text-zinc-500 whitespace-nowrap">
              {formatSize(Number(file.size))}
            </div>
            {file.post_titles.length > 0 && (
              <div className="text-xs text-zinc-500 truncate">
                {file.post_titles.join(", ")}
              </div>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <a href={file.url} target="_blank" className="flex items-center">
                <img className="w-[16px] h-[16px]" src={`${cdn}/icons/small/inbox_download.png`} alt="Download" />
              </a>
              <form action={remove}>
                <input type="hidden" name="id" value={file.id} />
                <DeleteButton />
              </form>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <div className="text-sm text-zinc-500">No files yet.</div>
        )}
      </div>
    </div>
  );
}
