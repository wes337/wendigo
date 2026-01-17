import Image from "next/image";
import { box, insetShadow, dropShadow } from "@/app/styles";

export default function About() {
  return (
    <div className="mt-5">
      <div className="flex font-bold text-sm mb-2.5">
        <Image
          className="w-[16px] h-[16px] mr-1"
          src={`/icons/small/information.png`}
          width={16}
          height={16}
          alt=""
          unoptimized
        />
        About
      </div>
      <div className={`${box}`}>
        <div className="flex flex-col gap-[16px] text-sm">
          <p>
            Wendigo Corp is founded on one principle:{" "}
            <strong>We solve the problems we create.</strong>
          </p>
          <p>
            Founded in 2001, on a cool dry summer morning just north of a small
            town. I forget which town{" "}
            <em>(note to intern please fill this info in later)</em>. I was a
            general nuisance and disliked by most people in the village, so I
            had to move. I didn&apos;t update the business info so if you see
            that old address that&apos;s why{" "}
            <em>(note to intern please update our business address)</em>. I made
            a lot of money doing this so you could say it was a pretty good
            business idea so then naturally I started hiring people.
          </p>
          <div className="shadow-md">
            <blockquote
              className={`text-zinc-800 bg-zinc-100/75 border-1 border-zinc-500/75 rounded-[4px] p-2.5 italic ${insetShadow}`}
            >
              Like you, I used to think the world was this great place where
              everybody lived by the same standards I did, then some kid with a
              nail showed me I was living in his world, a world where chaos
              rules not order, a world where righteousness is not rewarded.
              That&apos;s Cesar&apos;s world, and if you&apos;re not willing to
              play by his rules, then you&apos;re gonna have to pay the price.
            </blockquote>
          </div>
          <p className="p-2.5 pt-0 leading-none ml-auto -mt-2.5 text-zinc-600">
            —Wendigo, <cite>Brave New World</cite>
          </p>
          <p>
            Anyways long story short I think we sell drugs or something now? I
            don&apos;t really ask too many questions I just make problems and
            then charge money to have them fixed.
          </p>
          <p>
            If you want to get in touch with us you can find the contact form on
            the bottom of the page. Here&apos; a photo of our founding moment:
          </p>
          <div className="shadow-md">
            <div
              className={`flex bg-zinc-100 p-5 border-1 border-zinc-500/75 rounded-[2px] ${insetShadow}`}
            >
              <figure className="m-auto">
                <Image
                  className={`${dropShadow}`}
                  src={"/images/about.jfif"}
                  width={492}
                  height={400}
                  alt=""
                />
                <figcaption className="italic text-xs mt-2.5 text-right">
                  Fig.1 - Trulli, Puglia, Italy.
                </figcaption>
              </figure>
            </div>
          </div>
          <p>
            That image is a .jfif file. Who uses the fuck uses .jfif? The guy
            who made jfif should quit his job we already have jpeg and png.
          </p>
          <p>
            I need to write one more line, just to fill in the space. Maybe the
            intern can write something better and more enticing.
          </p>
        </div>
      </div>
    </div>
  );
}
