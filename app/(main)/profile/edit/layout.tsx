import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full p-10 overflow-auto  mr-auto">{children}</div>;
};

export default Layout;
