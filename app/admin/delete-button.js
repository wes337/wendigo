"use client";

import { cdn } from "@/app/styles";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      className="flex items-center cursor-pointer"
      onClick={(e) => {
        if (!confirm("Are you sure you want to delete this?")) {
          e.preventDefault();
        }
      }}
    >
      <img
        className="w-[16px] h-[16px]"
        src={`${cdn}/icons/small/cross.png`}
        alt="Delete"
      />
    </button>
  );
}
