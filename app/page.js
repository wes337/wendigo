import Image from "next/image";
import { box } from "./styles";

export default function Home() {
  return (
    <div className="mt-5">
      <div className="flex font-bold text-sm mb-2.5">
        <Image
          className="w-[16px] h-[16px] mr-1"
          src={`/icons/small/newspaper.png`}
          width={16}
          height={16}
          alt=""
          unoptimized
        />
        News
      </div>
      <div className={`${box}`}>
        <div>
          <div className="flex items-center gap-[4px] mb-[4px]">
            <div className="font-bold">Latest Sample Pack</div>
            <Image
              className="w-[32px] h-[32px]"
              src={`/icons/new.png`}
              width={32}
              height={32}
              alt=""
              unoptimized
            />
          </div>
          <div className="text-sm">
            Download our latest sample pack! Its got samples of things you want
            to hear repeatedly. Like many times over and over in the background
            while you do the dishes or something.
          </div>
          <div className="flex flex-col mt-[8px]">
            <div className="flex items-center text-sm font-bold cursor-pointer text-blue-600 hover:underline active:underline mb-2.5">
              <Image
                className="mt-[-2px] mr-[8px]"
                src={`/icons/small/inbox_download.png`}
                width={16}
                height={16}
                alt=""
                unoptimized
              />
              Download sample_pack_1.24.zip (1.55 MB)
            </div>
            <div className="flex items-center mt-[8px]">
              <div className="text-xs text-zinc-500">
                Posted by{" "}
                <span className="text-xs text-orange-600 font-bold cursor-pointer hover:underline active:underline">
                  Wendigo
                </span>{" "}
                on 01/12/26 @ 10:15 a.m.
              </div>
            </div>
          </div>
        </div>
        <hr className="border-zinc-500/50 drop-shadow-md" />
        <div>
          <div className="flex items-center gap-[4px] mb-[4px]">
            <div className="font-bold">Job Position filled!</div>
          </div>
          <div className="text-sm">
            After the tragic loss of Wendigo Corp&apos;s previous Marketing
            Director Executive Support Specialist, we are pleased to announce
            the role has once again been filled! We assure you we are doing our
            best to ensure that incident never happens again. The families of
            all involved have been consoled with free sample packs and have
            mostly recovered.
          </div>
          <div className="flex mt-[8px]">
            <div className="text-xs text-zinc-500">
              Posted by{" "}
              <span className="text-xs text-orange-600 font-bold cursor-pointer hover:underline active:underline">
                Wendigo
              </span>{" "}
              on 03/10/02 @ 04:24 a.m.
            </div>
          </div>
        </div>
        <hr className="border-zinc-500/50 drop-shadow-md" />
        <div>
          <div className="flex items-center gap-[4px] mb-[4px]">
            <div className="font-bold">Situation Stabilized</div>
          </div>
          <div className="text-sm">
            Experts have assured us that there is nothing to be concerned about.
            The situation at our office is under control. Please stop emailing
            us. If you have any questions please feel free to email the other
            guy.
          </div>
          <div className="flex items-center mt-[8px]">
            <div className="text-xs text-zinc-500">
              Posted by{" "}
              <span className="text-xs text-orange-600 font-bold cursor-pointer hover:underline active:underline">
                Wendigo
              </span>{" "}
              on 06/20/01 @ 3:41 p.m.
            </div>
          </div>
        </div>
        <hr className="border-zinc-500/50 drop-shadow-md" />
        <div>
          <div className="flex items-center gap-[4px] mb-[4px]">
            <div className="font-bold">New Website</div>
          </div>
          <div className="text-sm">Hey guys welcome to our new website!</div>
          <div className="flex items-center mt-[8px]">
            <div className="text-xs text-zinc-500">
              Posted by{" "}
              <span className="text-xs text-orange-600 font-bold cursor-pointer hover:underline active:underline">
                Wendigo
              </span>{" "}
              on 01/09/01 @ 6:00 p.m.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
