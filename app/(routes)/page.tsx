import { RetroGrid } from "@/components/magicui/retro-grid";
import TempLoginBtnn from "@/components/ui/TempLoginBtnn";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Image from "next/image";
import React from "react";

function page() {
  return (
    <div>
      <TempLoginBtnn />
      <RetroGrid />
      <TextHoverEffect text="StoneDocs" />
    </div>
  );
}

export default page;
