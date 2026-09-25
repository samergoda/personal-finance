import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { HiOutlineBars3, HiOutlineBanknotes } from "react-icons/hi2";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/Button";

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <div className="w-60">
          <Sidebar />
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="relative w-64 z-50 shadow-xl">
            <Sidebar onNavClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-card border-b">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <HiOutlineBars3 className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <HiOutlineBanknotes className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold">MoneyTrack</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
