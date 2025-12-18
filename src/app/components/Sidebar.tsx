import { LayoutDashboard, FileText, Wallet, Calculator, Activity, LogOut, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { useState } from "react";

type UserRole = "loket" | "kasir" | "finance" | "owner";
type Page = "dashboard" | "loket-report" | "kasir-report" | "accounting" | "activity-log";

interface SidebarProps {
  role: UserRole;
  username: string;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
}

export function Sidebar({ role, username, currentPage, onPageChange, onLogout }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getMenuItems = () => {
    const allItems = [
      { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard, roles: ["loket", "kasir", "finance", "owner"] },
      { id: "loket-report" as Page, label: "Laporan Loket", icon: FileText, roles: ["loket"] },
      { id: "kasir-report" as Page, label: "Laporan Kasir", icon: Wallet, roles: ["kasir"] },
      { id: "accounting" as Page, label: "Jurnal Akuntansi", icon: Calculator, roles: ["finance", "owner"] },
      { id: "activity-log" as Page, label: "Log Aktivitas", icon: Activity, roles: ["finance", "owner"] },
    ];

    return allItems.filter(item => item.roles.includes(role));
  };

  const menuItems = getMenuItems();

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b bg-primary text-primary-foreground">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Sistem PPOB</h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-primary-foreground/80">Payment Point Online Bank</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{username}</div>
            <div className="text-xs text-muted-foreground capitalize">{role}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                setIsMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Keluar
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r shadow-sm h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-screen w-64 bg-card shadow-xl transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
