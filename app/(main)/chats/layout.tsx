import "@/styles/globals.css";

import AuthProtected from "@/app/_components/protectedRoutes/authProtected";
import ResponsiveLayout from "./_components/responsiveLayout/idex.";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProtected>
      <ResponsiveLayout>{children}</ResponsiveLayout>
    </AuthProtected>
  );
}
