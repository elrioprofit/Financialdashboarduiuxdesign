import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  DollarSign, 
  TrendingDown,
  Building2,
  Users,
  Send,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface LoketReport {
  id: string;
  loketName: string;
  tanggal: string;
  shift: string;
  totalPenjualan: number;
  totalTransaksi: number;
  status: "pending" | "pulled" | "verified";
  items: any[];
}

interface SetorTunai {
  id: string;
  loketId: string;
  loketName: string;
  jumlah: number;
  bukti: File | null;
}

interface Pengeluaran {
  id: string;
  jenis: "setor_bank" | "deposit_reseller" | "lainnya";
  keterangan: string;
  jumlah: number;
  bukti: File | null;
}

export function KasirDailyReport() {
  // Data Penjualan dari Loket (Mock)
  const [loketReports, setLoketReports] = useState<LoketReport[]>([
    {
      id: "L1",
      loketName: "Loket 1",
      tanggal: "2025-12-18",
      shift: "Pagi",
      totalPenjualan: 5250000,
      totalTransaksi: 35,
      status: "pending",
      items: [],
    },
    {
      id: "L2",
      loketName: "Loket 2",
      tanggal: "2025-12-18",
      shift: "Pagi",
      totalPenjualan: 4800000,
      totalTransaksi: 28,
      status: "pending",
      items: [],
    },
    {
      id: "L3",
      loketName: "Loket 3",
      tanggal: "2025-12-18",
      shift: "Pagi",
      totalPenjualan: 3950000,
      totalTransaksi: 22,
      status: "pending",
      items: [],
    },
  ]);

  const [setorTunai, setSetorTunai] = useState<SetorTunai[]>([]);
  const [pengeluaran, setPengeluaran] = useState<Pengeluaran[]>([]);
  const [selectedReport, setSelectedReport] = useState<LoketReport | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [catatan, setCatatan] = useState("");

  // Pull data from loket
  const pullLoketData = (reportId: string) => {
    setLoketReports(
      loketReports.map((report) =>
        report.id === reportId ? { ...report, status: "pulled" } : report
      )
    );

    const report = loketReports.find((r) => r.id === reportId);
    if (report) {
      // Auto add to setor tunai
      const newSetor: SetorTunai = {
        id: Date.now().toString(),
        loketId: report.id,
        loketName: report.loketName,
        jumlah: report.totalPenjualan,
        bukti: null,
      };
      setSetorTunai([...setorTunai, newSetor]);
      toast.success(`Data ${report.loketName} berhasil ditarik`);
    }
  };

  const viewLoketDetail = (report: LoketReport) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  // Add Pengeluaran
  const addPengeluaran = (jenis: "setor_bank" | "deposit_reseller" | "lainnya") => {
    const newPengeluaran: Pengeluaran = {
      id: Date.now().toString(),
      jenis,
      keterangan: "",
      jumlah: 0,
      bukti: null,
    };
    setPengeluaran([...pengeluaran, newPengeluaran]);
  };

  const updatePengeluaran = (id: string, field: keyof Pengeluaran, value: any) => {
    setPengeluaran(
      pengeluaran.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const removePengeluaran = (id: string) => {
    setPengeluaran(pengeluaran.filter((p) => p.id !== id));
    toast.info("Pengeluaran dihapus");
  };

  const updateSetorTunai = (id: string, field: keyof SetorTunai, value: any) => {
    setSetorTunai(setorTunai.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeSetorTunai = (id: string) => {
    setSetorTunai(setorTunai.filter((s) => s.id !== id));
  };

  const submitToFinance = () => {
    if (setorTunai.length === 0) {
      toast.error("Belum ada data setor tunai");
      return;
    }

    toast.success("Laporan kasir berhasil dikirim ke Finance untuk verifikasi");
  };

  // Calculations
  const totalPenjualanLoket = loketReports
    .filter((r) => r.status === "pulled")
    .reduce((sum, r) => sum + r.totalPenjualan, 0);
  const totalSetoran = setorTunai.reduce((sum, s) => sum + s.jumlah, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, p) => sum + p.jumlah, 0);
  const saldoAkhir = totalSetoran - totalPengeluaran;

  const jenisOptions = [
    { value: "setor_bank", label: "Setor Bank", icon: Building2 },
    { value: "deposit_reseller", label: "Deposit Reseller", icon: Users },
    { value: "lainnya", label: "Lainnya", icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Laporan Kasir</h1>
        <p className="text-muted-foreground mt-1">
          Tarik data penjualan loket, input setoran tunai & pengeluaran
        </p>
      </div>

      <Tabs defaultValue="loket-data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="loket-data">Data Loket</TabsTrigger>
          <TabsTrigger value="setor-tunai">Setor Tunai</TabsTrigger>
          <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
        </TabsList>

        {/* Tab 1: Data Loket */}
        <TabsContent value="loket-data" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Data Penjualan dari Loket</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loketReports.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Belum ada laporan dari loket
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loket</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead className="text-center">Total Transaksi</TableHead>
                      <TableHead className="text-right">Total Penjualan</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loketReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.loketName}</TableCell>
                        <TableCell>{report.tanggal}</TableCell>
                        <TableCell>{report.shift}</TableCell>
                        <TableCell className="text-center">{report.totalTransaksi}</TableCell>
                        <TableCell className="text-right font-medium">
                          Rp {report.totalPenjualan.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              report.status === "pulled"
                                ? "default"
                                : report.status === "verified"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {report.status === "pulled"
                              ? "Ditarik"
                              : report.status === "verified"
                              ? "Terverifikasi"
                              : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewLoketDetail(report)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Lihat
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => pullLoketData(report.id)}
                              disabled={report.status === "pulled"}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {report.status === "pulled" ? "Ditarik" : "Tarik Data"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Setor Tunai */}
        <TabsContent value="setor-tunai" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Penerimaan Setoran Tunai</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {setorTunai.length} Setoran
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {setorTunai.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Belum ada data setoran tunai</p>
                  <p className="text-sm mt-1">Tarik data dari loket terlebih dahulu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {setorTunai.map((setor) => (
                    <div key={setor.id} className="p-4 border rounded-lg bg-success/5">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Dari Loket</Label>
                            <Input value={setor.loketName} disabled className="bg-muted" />
                          </div>
                          <div className="space-y-2">
                            <Label>Jumlah Setoran</Label>
                            <Input
                              type="number"
                              value={setor.jumlah}
                              onChange={(e) =>
                                updateSetorTunai(setor.id, "jumlah", Number(e.target.value))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Upload Bukti</Label>
                            <label className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-muted/50">
                              <Upload className="w-4 h-4" />
                              <span className="text-sm truncate">
                                {setor.bukti ? setor.bukti.name : "Upload"}
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  updateSetorTunai(setor.id, "bukti", e.target.files?.[0] || null)
                                }
                              />
                            </label>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSetorTunai(setor.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Setoran */}
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Setoran Tunai:</span>
                  <span className="text-2xl font-bold text-success">
                    Rp {totalSetoran.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Pengeluaran */}
        <TabsContent value="pengeluaran" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Input Pengeluaran</CardTitle>
                <div className="flex gap-2">
                  {jenisOptions.map((jenis) => {
                    const Icon = jenis.icon;
                    return (
                      <Button
                        key={jenis.value}
                        size="sm"
                        variant="outline"
                        onClick={() => addPengeluaran(jenis.value as any)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {jenis.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pengeluaran.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <TrendingDown className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Belum ada pengeluaran</p>
                  <p className="text-sm mt-1">
                    Klik tombol di atas untuk menambah pengeluaran
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pengeluaran.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-destructive/5">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {jenisOptions.find((j) => j.value === item.jenis)?.label}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Keterangan</Label>
                              <Input
                                placeholder="Contoh: Setor ke BCA"
                                value={item.keterangan}
                                onChange={(e) =>
                                  updatePengeluaran(item.id, "keterangan", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Jumlah</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={item.jumlah || ""}
                                onChange={(e) =>
                                  updatePengeluaran(item.id, "jumlah", Number(e.target.value))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Upload Bukti</Label>
                              <label className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-muted/50">
                                <Upload className="w-4 h-4" />
                                <span className="text-sm truncate">
                                  {item.bukti ? item.bukti.name : "Upload"}
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*,.pdf"
                                  onChange={(e) =>
                                    updatePengeluaran(
                                      item.id,
                                      "bukti",
                                      e.target.files?.[0] || null
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePengeluaran(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Pengeluaran */}
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Pengeluaran:</span>
                  <span className="text-2xl font-bold text-destructive">
                    Rp {totalPengeluaran.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary & Submit */}
      <Card className="shadow-lg border-primary/30">
        <CardHeader className="bg-primary/5">
          <CardTitle>Ringkasan Laporan Kasir</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="text-sm text-muted-foreground">Total Setoran</div>
              <div className="text-2xl font-bold text-success mt-1">
                Rp {totalSetoran.toLocaleString("id-ID")}
              </div>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="text-sm text-muted-foreground">Total Pengeluaran</div>
              <div className="text-2xl font-bold text-destructive mt-1">
                Rp {totalPengeluaran.toLocaleString("id-ID")}
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                saldoAkhir >= 0
                  ? "bg-primary/10 border-primary/20"
                  : "bg-warning/10 border-warning/20"
              }`}
            >
              <div className="text-sm text-muted-foreground">Saldo Akhir</div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  saldoAkhir >= 0 ? "text-primary" : "text-warning"
                }`}
              >
                Rp {saldoAkhir.toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Catatan (Opsional)</Label>
            <Textarea
              placeholder="Tambahkan catatan untuk finance..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button size="lg" onClick={submitToFinance}>
              <Send className="w-4 h-4 mr-2" />
              Kirim ke Finance
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Loket Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Laporan {selectedReport?.loketName}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Tanggal</div>
                  <div className="font-medium">{selectedReport.tanggal}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Shift</div>
                  <div className="font-medium">{selectedReport.shift}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Transaksi</div>
                  <div className="font-medium">{selectedReport.totalTransaksi}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Penjualan</div>
                  <div className="font-medium">
                    Rp {selectedReport.totalPenjualan.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center text-sm text-muted-foreground">
                Detail transaksi akan ditampilkan di sini
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
