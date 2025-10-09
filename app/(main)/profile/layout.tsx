import "@/styles/globals.css";

import ProfileSidebar from "./_components/profileSidebar";
import AuthProtected from "@/app/_components/protectedRoutes/authProtected";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProtected>
      <div className="relative flex flex-col ">
        <ProfileSidebar />
        <main className="flex-1 mr-98   border-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthProtected>
  );
}
