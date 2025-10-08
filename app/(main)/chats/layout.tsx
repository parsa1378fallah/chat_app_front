import "@/styles/globals.css";

import ChatsSidebar from "./_components/chatsSidebar";
import AuthProtected from "@/app/_components/protectedRoutes/authProtected";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProtected>
      {" "}
      <div className="relative flex flex-col">
        <ChatsSidebar />
        <main
          className="mr-80   overflow-auto  "
          style={{ backgroundImage: "url('/chatbg.jpg')" }}
        >
          {children}
        </main>
      </div>
    </AuthProtected>
  );
}
