import "@/styles/globals.css";
import Navbar from "./_components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col ">
      <Navbar />

      <main>{children}</main>
    </div>
  );
}
