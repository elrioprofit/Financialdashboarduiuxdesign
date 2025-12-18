import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Wallet, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { AlertBanner } from "./AlertBanner";
import { useState } from "react";

type UserRole = "loket" | "kasir" | "finance" | "owner";

interface DashboardProps {
  role: UserRole;
  username: string;
}

export function DashboardPPOB({ role, username }: DashboardProps) {
  const [showAlert, setShowAlert] = useState(true);

  // Mock data for charts
  const salesData = [
    { shift: "Pagi", penjualan: 4500000, transaksi: 45 },
    { shift: "Siang", penjualan: 6200000, transaksi: 62 },
    { shift: "Sore", penjualan: 5800000, transaksi: 58 },
  ];

  const weeklyData = [
    { day: "Sen", amount: 12000000 },
    { day: "Sel", amount: 15000000 },
    { day: "Rab", amount: 13500000 },
    { day: "Kam", amount: 16500000 },
    { day: "Jum", amount: 18000000 },
    { day: "Sab", amount: 14000000 },
    { day: "Min", amount: 11000000 },
  ];

  const todayStats = {
    totalSales: 16500000,
    totalDeposit: 15000000,
    cashBalance: 2500000,
    pendingReports: 3,
  };

  const recentActivities = [
    { id: 1, user: "Loket 1", action: "Mengirim laporan harian", status: "success", time: "10:30" },
    { id: 2, user: "Kasir", action: "Menerima setoran Loket 2", status: "success", time: "11:15" },
    { id: 3, user: "Loket 3", action: "Draft laporan (belum kirim)", status: "pending", time: "11:45" },
    { id: 4, user: "Finance", action: "Verifikasi laporan", status: "success", time: "12:00" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Dashboard PPOB</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang, <span className="font-medium">{username}</span> ({role})
          </p>
        </div>
        <Badge variant="outline" className="text-sm py-2 px-4">
          <Clock className="w-4 h-4 mr-2" />
          18 Des 2025
        </Badge>
      </div>

      {/* Alert Banner - Show for specific roles or conditions */}
      {showAlert && role === "kasir" && (
        <AlertBanner
          type="warning"
          title="Perhatian: Laporan Pending"
          message="Ada 2 loket yang belum mengirim laporan hari ini. Mohon segera ditindaklanjuti."
          action={{
            label: "Lihat Detail",
            onClick: () => console.log("View details"),
          }}
          onDismiss={() => setShowAlert(false)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Penjualan Hari Ini
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {todayStats.totalSales.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success">+12.5%</span> dari kemarin
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Setoran
            </CardTitle>
            <DollarSign className="w-5 h-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {todayStats.totalDeposit.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari {salesData.length} shift
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Kas
            </CardTitle>
            <Wallet className="w-5 h-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {todayStats.cashBalance.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Kas operasional
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Laporan Pending
            </CardTitle>
            <AlertCircle className="w-5 h-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.pendingReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Menunggu verifikasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Penjualan Per Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shift" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
                />
                <Legend />
                <Bar dataKey="penjualan" fill="#1E3A8A" name="Penjualan" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Trend Penjualan Mingguan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  name="Penjualan"
                  dot={{ fill: "#06B6D4", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${
                    activity.status === "success" 
                      ? "bg-success/10 text-success" 
                      : "bg-warning/10 text-warning"
                  }`}>
                    {activity.status === "success" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </div>
                  </div>
                  <Badge variant={activity.status === "success" ? "default" : "outline"}>
                    {activity.status === "success" ? "Selesai" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Status Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Sudah Disetor</div>
                  <div className="text-2xl font-bold">8</div>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Belum Disetor</div>
                  <div className="text-2xl font-bold">3</div>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>

              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Perlu Klarifikasi</div>
                  <div className="text-2xl font-bold">1</div>
                </div>
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}