// app/page.tsx
import React from "react";
import GetProfileClient from "./_components/getProfileClient";

export default async function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      سلام
      <GetProfileClient />
    </section>
  );
}
