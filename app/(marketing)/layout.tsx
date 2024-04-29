import { Footer } from "./footer";
import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center custom-pattern">
        {children}
      </main>
      <Footer />
    </div>
  );
}
