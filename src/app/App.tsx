import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { LoginPage } from "./components/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { DashboardPPOB } from "./components/DashboardPPOB";
import { LoketDailyReport } from "./components/LoketDailyReport";
import { KasirDailyReport } from "./components/KasirDailyReport";
import { AccountingView } from "./components/AccountingView";
import { ActivityLog } from "./components/ActivityLog";

type UserRole = "loket" | "kasir" | "finance" | "owner";
type Page = "dashboard" | "loket-report" | "kasir-report" | "accounting" | "activity-log";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUsername(name);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUsername("");
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    if (!userRole) return null;

    switch (currentPage) {
      case "dashboard":
        return <DashboardPPOB role={userRole} username={username} />;
      case "loket-report":
        return <LoketDailyReport />;
      case "kasir-report":
        return <KasirDailyReport />;
      case "accounting":
        return <AccountingView />;
      case "activity-log":
        return <ActivityLog />;
      default:
        return <DashboardPPOB role={userRole} username={username} />;
    }
  };

  if (!isLoggedIn || !userRole) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        role={userRole}
        username={username}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto p-6 lg:p-8">
          {renderPage()}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
