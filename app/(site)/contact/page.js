import { cdn, siteWidth } from "@/app/styles";
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
      <ContactForm />
    </div>
  );
}
