import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  // sidebar will collapse in mobile or small devises
  return (
    <div
      className={cn(
        "bg-blue-500 h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      Sidebar
    </div>
  );
};
