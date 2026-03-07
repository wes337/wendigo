"use client";

import { useActionState } from "react";
import { box, cdn, input, submitBtn } from "@/app/styles";
import { sendInquiry } from "@/app/(site)/contact/actions";

export default function ContactForm() {
  const [state, formAction] = useActionState(sendInquiry, null);

  if (state?.success) {
    return (
      <div className={box}>
        <div className="text-sm text-green-700 font-bold">
          Your inquiry has been sent! We&apos;ll get back to you soon.
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={box}>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold">Name</span>
        <input name="name" required minLength={1} maxLength={100} className={input} />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold">Email</span>
        <input name="email" type="email" required minLength={3} maxLength={320} className={input} />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className={`${input} resize-y`}
        />
      </label>

      {state?.error && (
        <div className="text-red-600 text-sm">{state.error}</div>
      )}

      <button
        type="submit"
        className={submitBtn}
      >
        <img
          className="w-[16px] h-[16px] mr-1.5"
          src={`${cdn}/icons/small/email_go.png`}
          alt=""
        />
        Send Inquiry
      </button>
    </form>
  );
}
