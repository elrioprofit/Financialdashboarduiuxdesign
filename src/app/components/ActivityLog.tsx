import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Clock, User, FileText, CheckCircle, AlertCircle, Send, Filter } from "lucide-react";

interface Activity {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  type: "create" | "update" | "verify" | "submit" | "alert";
  details?: string;
}

export function ActivityLog() {
  const [filterRole, setFilterRole] = useState("all");

  const activities: Activity[] = [
    {
      id: "1",
      timestamp: "2025-12-18 14:30:15",
      user: "Kasir",
      role: "kasir",
      action: "Mengirim laporan harian kasir ke Finance",
      type: "submit",
      details: "Total setoran: Rp 12.700.000",
    },
    {
      id: "2",
      timestamp: "2025-12-18 14:15:42",
      user: "Loket 3",
      role: "loket",
      action: "Mengupdate laporan harian",
      type: "update",
      details: "Menambahkan bukti transaksi BRI",
    },
    {
      id: "3",
      timestamp: "2025-12-18 14:00:28",
      user: "Finance",
      role: "finance",
      action: "Memverifikasi laporan Loket 1",
      type: "verify",
      details: "Status: Terverifikasi",
    },
    {
      id: "4",
      timestamp: "2025-12-18 13:45:10",
      user: "System",
      role: "system",
      action: "Notifikasi: Selisih kas terdeteksi",
      type: "alert",
      details: "Loket 3 - Selisih: Rp 50.000",
    },
    {
      id: "5",
      timestamp: "2025-12-18 13:30:55",
      user: "Loket 3",
      role: "loket",
      action: "Mengirim laporan harian loket",
      type: "submit",
      details: "3 channel dilaporkan",
    },
    {
      id: "6",
      timestamp: "2025-12-18 12:20:33",
      user: "Finance",
      role: "finance",
      action: "Meminta klarifikasi Loket 2",
      type: "alert",
      details: "Bukti transaksi tidak jelas",
    },
    {
      id: "7",
      timestamp: "2025-12-18 11:45:18",
      user: "Kasir",
      role: "kasir",
      action: "Menerima setoran dari Loket 2",
      type: "create",
      details: "Jumlah: Rp 3.500.000",
    },
    {
      id: "8",
      timestamp: "2025-12-18 11:15:05",
      user: "Loket 2",
      role: "loket",
      action: "Mengirim laporan harian loket",
      type: "submit",
      details: "3 channel dilaporkan",
    },
    {
      id: "9",
      timestamp: "2025-12-18 10:45:22",
      user: "Finance",
      role: "finance",
      action: "Memverifikasi laporan Kasir",
      type: "verify",
      details: "Laporan tanggal 17 Des 2025",
    },
    {
      id: "10",
      timestamp: "2025-12-18 10:30:40",
      user: "Loket 1",
      role: "loket",
      action: "Mengirim laporan harian loket",
      type: "submit",
      details: "3 channel dilaporkan",
    },
  ];

  const filteredActivities = filterRole === "all" 
    ? activities 
    : activities.filter(a => a.role === filterRole);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return <FileText className="w-4 h-4" />;
      case "update":
        return <FileText className="w-4 h-4" />;
      case "verify":
        return <CheckCircle className="w-4 h-4" />;
      case "submit":
        return <Send className="w-4 h-4" />;
      case "alert":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "verify":
        return "text-success bg-success/10";
      case "alert":
        return "text-destructive bg-destructive/10";
      case "submit":
        return "text-secondary bg-secondary/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" => {
    switch (role) {
      case "finance":
        return "default";
      case "kasir":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Log Aktivitas</h1>
        <p className="text-muted-foreground mt-1">
          Riwayat semua aktivitas pengguna di sistem
        </p>
      </div>

      {/* Filter */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              <option value="all">Semua Role</option>
              <option value="loket">Loket</option>
              <option value="kasir">Kasir</option>
              <option value="finance">Finance</option>
              <option value="owner">Owner</option>
              <option value="system">System</option>
            </select>
            <Input
              type="date"
              defaultValue="2025-12-18"
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Timeline Aktivitas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                {/* Activities */}
                <div className="space-y-6">
                  {filteredActivities.map((activity, index) => (
                    <div key={activity.id} className="relative pl-12">
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      {/* Activity card */}
                      <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="font-medium">{activity.action}</div>
                            {activity.details && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {activity.details}
                              </div>
                            )}
                          </div>
                          <Badge variant={getRoleBadgeVariant(activity.role)}>
                            {activity.user}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {activities.filter(a => a.type === "create").length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Dibuat</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {activities.filter(a => a.type === "submit").length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Dikirim</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {activities.filter(a => a.type === "verify").length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Diverifikasi</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              {activities.filter(a => a.type === "update").length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Diupdate</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {activities.filter(a => a.type === "alert").length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Alert</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
