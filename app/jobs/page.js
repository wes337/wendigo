import Image from "next/image";
import { box, insetShadow, dropShadow } from "@/app/styles";

const JOBS = [
  {
    title: "Slime Video Producer",
    description: `Make satisfying slime videos. Work closely with Scott Apples and help him with whatever he needs to make his slime videos.`,
    applicants: 9,
  },
  {
    title: "Sexy Dancer",
    description: `We are looking to hire a sexy exclusive luxury dancer. We can train you. No past experience required.`,
    applicants: 12,
  },
  {
    title: "Freight Conductor",
    description: `Conduct freight. Move freight around. Stuff that can only be lifted by machines (we don't have any).`,
    applicants: 0,
  },
];

export default function Jobs() {
  return (
    <div className="mt-5">
      <div className="flex font-bold text-sm mb-2.5">
        <Image
          className="w-[16px] h-[16px] mr-1"
          src={`/icons/small/briefcase.png`}
          width={16}
          height={16}
          alt=""
          unoptimized
        />
        Jobs
      </div>
      <div className="flex flex-col gap-5">
        {JOBS.map((job) => {
          return (
            <div key={job.title} className={box}>
              <div className="flex flex-col">
                <div className="font-bold text-md">{job.title}</div>
                <div className="text-xs text-zinc-600">
                  {job.applicants} Applicants
                </div>
                <div className="text-sm mt-2.5">{job.description}</div>
              </div>
              <button className="mr-auto text-blue-600 cursor-pointer hover:underline active:underline">
                Apply Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
