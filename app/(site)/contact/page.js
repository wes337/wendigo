import { cdn, dropShadow, insetShadow, siteWidth } from "@/app/styles";
import ContactForm from "@/app/(site)/contact/form";

export default function Contact() {
  return (
    <div className={`mt-5 text-[var(--t-text)] ${siteWidth}`}>
      <div className="flex font-bold text-sm mb-2.5">
        <img
          className="w-[16px] h-[16px] mr-1"
          src={`${cdn}/icons/small/email.png`}
          alt=""
        />
        Contact
      </div>
      <div className={`flex items-start gap-2.5 p-3 mb-2.5 w-full rounded-[2px] border-1 border-sky-300/50 bg-gradient-to-bl from-sky-50 via-sky-100 to-blue-100 ${insetShadow} drop-shadow-md`}>
        <img
          className={`w-[16px] h-[16px] mt-0.5 shrink-0 ${dropShadow}`}
          src={`${cdn}/icons/small/information.png`}
          alt=""
        />
        <p className="text-sm text-sky-900/80">
          Looking for custom music, sound design, or artwork? Drop us a message and we&apos;ll get back to you.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
