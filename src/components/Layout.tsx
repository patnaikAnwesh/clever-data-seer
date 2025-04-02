
import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default Layout;
