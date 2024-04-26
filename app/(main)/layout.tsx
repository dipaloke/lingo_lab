import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <>
      <MobileHeader />
      {/* keeping space for side bar in lg */}
      <Sidebar className="hidden lg:flex" />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="bg-red-500 h-full">{children}</div>
      </main>
    </>
  );
}
