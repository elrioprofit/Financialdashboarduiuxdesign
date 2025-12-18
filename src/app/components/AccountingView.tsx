import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Download, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Eye,
  FileText
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface CashflowEntry {
  id: string;
  tanggal: string;
  waktu: string;
  sumber: "loket" | "kasir";
  tipe: "pemasukan" | "pengeluaran";
  kategori: string;
  deskripsi: string;
  jumlah: number;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  bukti?: string;
  catatan?: string;
}

export function AccountingView() {
  const [filterDate, setFilterDate] = useState("2025-12-18");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<CashflowEntry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Mock data
  const [cashflowData, setCashflowData] = useState<CashflowEntry[]>([
    {
      id: "1",
      tanggal: "2025-12-18",
      waktu: "10:30",
      sumber: "loket",
      tipe: "pemasukan",
      kategori: "Penjualan Pulsa",
      deskripsi: "Loket 1 - Total penjualan",
      jumlah: 5250000,
      status: "pending",
      bukti: "/proof1.jpg",
    },
    {
      id: "2",
      tanggal: "2025-12-18",
      waktu: "11:15",
      sumber: "loket",
      tipe: "pemasukan",
      kategori: "Penjualan PPOB",
      deskripsi: "Loket 2 - Total penjualan",
      jumlah: 4800000,
      status: "verified",
      verifiedBy: "Finance Admin",
      bukti: "/proof2.jpg",
    },
    {
      id: "3",
      tanggal: "2025-12-18",
      waktu: "12:00",
      sumber: "kasir",
      tipe: "pengeluaran",
      kategori: "Setor Bank",
      deskripsi: "Setor ke BCA - Modal",
      jumlah: 8000000,
      status: "pending",
      bukti: "/proof3.jpg",
    },
    {
      id: "4",
      tanggal: "2025-12-18",
      waktu: "13:30",
      sumber: "loket",
      tipe: "pemasukan",
      kategori: "Penjualan Token PLN",
      deskripsi: "Loket 3 - Total penjualan",
      jumlah: 3950000,
      status: "verified",
      verifiedBy: "Finance Admin",
      bukti: "/proof4.jpg",
    },
    {
      id: "5",
      tanggal: "2025-12-18",
      waktu: "14:00",
      sumber: "kasir",
      tipe: "pengeluaran",
      kategori: "Deposit Reseller",
      deskripsi: "Deposit untuk Reseller A",
      jumlah: 2500000,
      status: "verified",
      verifiedBy: "Finance Admin",
      bukti: "/proof5.jpg",
    },
    {
      id: "6",
      tanggal: "2025-12-18",
      waktu: "15:00",
      sumber: "kasir",
      tipe: "pengeluaran",
      kategori: "Operational",
      deskripsi: "Biaya operasional & admin",
      jumlah: 350000,
      status: "pending",
      bukti: "/proof6.jpg",
    },
  ]);

  const handleVerify = (id: string) => {
    setCashflowData(
      cashflowData.map((entry) =>
        entry.id === id
          ? { ...entry, status: "verified", verifiedBy: "Finance Admin" }
          : entry
      )
    );
    toast.success("Data berhasil diverifikasi");
  };

  const handleReject = (id: string) => {
    setCashflowData(
      cashflowData.map((entry) =>
        entry.id === id ? { ...entry, status: "rejected" } : entry
      )
    );
    toast.error("Data ditolak - permintaan klarifikasi dikirim");
  };

  const viewDetail = (entry: CashflowEntry) => {
    setSelectedEntry(entry);
    setIsDetailOpen(true);
  };

  // Calculations
  const totalPemasukan = cashflowData
    .filter((e) => e.tipe === "pemasukan" && e.status === "verified")
    .reduce((sum, e) => sum + e.jumlah, 0);

  const totalPengeluaran = cashflowData
    .filter((e) => e.tipe === "pengeluaran" && e.status === "verified")
    .reduce((sum, e) => sum + e.jumlah, 0);

  const netCashflow = totalPemasukan - totalPengeluaran;

  const pendingCount = cashflowData.filter((e) => e.status === "pending").length;
  const verifiedCount = cashflowData.filter((e) => e.status === "verified").length;

  // Chart data - Cashflow trend
  const trendData = [
    { hari: "Sen", pemasukan: 12000000, pengeluaran: 8500000 },
    { hari: "Sel", pemasukan: 15000000, pengeluaran: 9200000 },
    { hari: "Rab", pemasukan: 13500000, pengeluaran: 8800000 },
    { hari: "Kam", pemasukan: 16500000, pengeluaran: 10500000 },
    { hari: "Jum", pemasukan: 14000000, pengeluaran: 9000000 },
  ];

  // Kategori breakdown
  const kategoriPemasukan = cashflowData
    .filter((e) => e.tipe === "pemasukan" && e.status === "verified")
    .reduce((acc, e) => {
      acc[e.kategori] = (acc[e.kategori] || 0) + e.jumlah;
      return acc;
    }, {} as Record<string, number>);

  const kategoriPengeluaran = cashflowData
    .filter((e) => e.tipe === "pengeluaran" && e.status === "verified")
    .reduce((acc, e) => {
      acc[e.kategori] = (acc[e.kategori] || 0) + e.jumlah;
      return acc;
    }, {} as Record<string, number>);

  const pieDataPemasukan = Object.entries(kategoriPemasukan).map(([name, value]) => ({
    name,
    value,
  }));

  const pieDataPengeluaran = Object.entries(kategoriPengeluaran).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#1E3A8A", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

  const filteredData = cashflowData.filter((entry) => {
    if (filterStatus !== "all" && entry.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Finance & Cashflow</h1>
          <p className="text-muted-foreground mt-1">
            Verifikasi data, kelola cashflow, dan analisa keuangan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Export Excel berhasil")}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => toast.success("Export PDF berhasil")}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Pemasukan</div>
                <div className="text-2xl font-bold text-success mt-1">
                  Rp {totalPemasukan.toLocaleString("id-ID")}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-success opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Pengeluaran</div>
                <div className="text-2xl font-bold text-destructive mt-1">
                  Rp {totalPengeluaran.toLocaleString("id-ID")}
                </div>
              </div>
              <TrendingDown className="w-8 h-8 text-destructive opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Net Cashflow</div>
                <div
                  className={`text-2xl font-bold mt-1 ${
                    netCashflow >= 0 ? "text-primary" : "text-warning"
                  }`}
                >
                  Rp {netCashflow.toLocaleString("id-ID")}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Pending Verifikasi</div>
                <div className="text-2xl font-bold text-warning mt-1">{pendingCount}</div>
              </div>
              <AlertCircle className="w-8 h-8 text-warning opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="verifikasi" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verifikasi">Verifikasi Data</TabsTrigger>
          <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
          <TabsTrigger value="analisa">Analisa</TabsTrigger>
        </TabsList>

        {/* Tab 1: Verifikasi */}
        <TabsContent value="verifikasi" className="space-y-4">
          {/* Filters */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Data Transaksi</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal/Waktu</TableHead>
                      <TableHead>Sumber</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="text-sm">
                            <div>{entry.tanggal}</div>
                            <div className="text-muted-foreground">{entry.waktu}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {entry.sumber}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={entry.tipe === "pemasukan" ? "default" : "secondary"}
                          >
                            {entry.tipe === "pemasukan" ? "Masuk" : "Keluar"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{entry.kategori}</TableCell>
                        <TableCell className="text-sm">{entry.deskripsi}</TableCell>
                        <TableCell className="text-right font-medium">
                          <span
                            className={
                              entry.tipe === "pemasukan" ? "text-success" : "text-destructive"
                            }
                          >
                            {entry.tipe === "pemasukan" ? "+" : "-"}Rp{" "}
                            {entry.jumlah.toLocaleString("id-ID")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              entry.status === "verified"
                                ? "default"
                                : entry.status === "rejected"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {entry.status === "verified"
                              ? "Verified"
                              : entry.status === "rejected"
                              ? "Rejected"
                              : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => viewDetail(entry)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            {entry.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleVerify(entry.id)}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verifikasi
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(entry.id)}
                                >
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Tolak
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Cashflow */}
        <TabsContent value="cashflow" className="space-y-4">
          {/* Cashflow Trend */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Trend Cashflow Mingguan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hari" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`} />
                  <Legend />
                  <Bar dataKey="pemasukan" fill="#10B981" name="Pemasukan" radius={[8, 8, 0, 0]} />
                  <Bar
                    dataKey="pengeluaran"
                    fill="#EF4444"
                    name="Pengeluaran"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Summary by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Breakdown Pemasukan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(kategoriPemasukan).map(([kategori, jumlah]) => (
                    <div key={kategori} className="flex justify-between items-center">
                      <span className="text-sm">{kategori}</span>
                      <span className="font-medium text-success">
                        Rp {jumlah.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Breakdown Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(kategoriPengeluaran).map(([kategori, jumlah]) => (
                    <div key={kategori} className="flex justify-between items-center">
                      <span className="text-sm">{kategori}</span>
                      <span className="font-medium text-destructive">
                        Rp {jumlah.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Analisa */}
        <TabsContent value="analisa" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pie Chart Pemasukan */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Komposisi Pemasukan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieDataPemasukan}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieDataPemasukan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart Pengeluaran */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Komposisi Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieDataPengeluaran}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieDataPengeluaran.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Metrik Keuangan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Rata-rata Pemasukan/Hari</div>
                  <div className="text-xl font-bold text-success mt-1">
                    Rp {(totalPemasukan / 5).toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Rata-rata Pengeluaran/Hari</div>
                  <div className="text-xl font-bold text-destructive mt-1">
                    Rp {(totalPengeluaran / 5).toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Profit Margin</div>
                  <div className="text-xl font-bold text-primary mt-1">
                    {((netCashflow / totalPemasukan) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Tanggal & Waktu</div>
                  <div className="font-medium">
                    {selectedEntry.tanggal} {selectedEntry.waktu}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Sumber</div>
                  <div className="font-medium capitalize">{selectedEntry.sumber}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Tipe</div>
                  <Badge variant={selectedEntry.tipe === "pemasukan" ? "default" : "secondary"}>
                    {selectedEntry.tipe}
                  </Badge>
                </div>
                <div>
                  <div className="text-muted-foreground">Kategori</div>
                  <div className="font-medium">{selectedEntry.kategori}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Deskripsi</div>
                  <div className="font-medium">{selectedEntry.deskripsi}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Jumlah</div>
                  <div
                    className={`text-xl font-bold ${
                      selectedEntry.tipe === "pemasukan" ? "text-success" : "text-destructive"
                    }`}
                  >
                    Rp {selectedEntry.jumlah.toLocaleString("id-ID")}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <Badge
                    variant={
                      selectedEntry.status === "verified"
                        ? "default"
                        : selectedEntry.status === "rejected"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {selectedEntry.status}
                  </Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/30 text-center">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Preview Bukti: {selectedEntry.bukti}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Tutup
                </Button>
                {selectedEntry.status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedEntry.id);
                        setIsDetailOpen(false);
                      }}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Tolak
                    </Button>
                    <Button
                      onClick={() => {
                        handleVerify(selectedEntry.id);
                        setIsDetailOpen(false);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verifikasi
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
