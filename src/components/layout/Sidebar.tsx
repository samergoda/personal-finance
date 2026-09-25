import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineClipboardDocumentList,
  HiOutlineChartBar,
  HiOutlineTag,
  HiOutlineBanknotes,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: <HiOutlineHome className="h-5 w-5" />, end: true },
  { to: "/transactions", label: "Transactions", icon: <HiOutlineClipboardDocumentList className="h-5 w-5" /> },
  { to: "/analytics", label: "Analytics", icon: <HiOutlineChartBar className="h-5 w-5" /> },
  { to: "/categories", label: "Categories", icon: <HiOutlineTag className="h-5 w-5" /> },
  { to: "/budgets", label: "Budgets", icon: <HiOutlineBanknotes className="h-5 w-5" /> },
  { to: "/settings", label: "Settings", icon: <HiOutlineCog6Tooth className="h-5 w-5" /> },
];

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full bg-card border-r border-border">
      {/* Brand */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <HiOutlineBanknotes className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground">MoneyTrack</p>
            <p className="text-xs text-muted-foreground">Personal Finance</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <ul className="space-y-1" role="list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }>
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Separator />
      <div className="px-5 py-3">
        <p className="text-xs text-muted-foreground">© 2026 MoneyTrack</p>
      </div>
    </aside>
  );
}
