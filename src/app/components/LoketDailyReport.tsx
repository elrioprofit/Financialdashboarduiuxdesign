import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Save, Send, Plus, Trash2, Calendar, User, Upload } from "lucide-react";
import { toast } from "sonner";

interface SalesItem {
  id: string;
  namaItem: string;
  kategori: string;
  jumlah: number;
  harga: number;
  total: number;
}

export function LoketDailyReport() {
  const [salesItems, setSalesItems] = useState<SalesItem[]>([
    {
      id: "1",
      namaItem: "Pulsa Telkomsel 50k",
      kategori: "Pulsa",
      jumlah: 15,
      harga: 48500,
      total: 727500,
    },
    {
      id: "2",
      namaItem: "Token PLN 100k",
      kategori: "PLN",
      jumlah: 8,
      harga: 100500,
      total: 804000,
    },
  ]);

  const [newItem, setNewItem] = useState({
    namaItem: "",
    kategori: "",
    jumlah: 0,
    harga: 0,
  });

  const [catatan, setCatatan] = useState("");
  const [buktiTransaksi, setBuktiTransaksi] = useState<File | null>(null);
  const [status, setStatus] = useState<"draft" | "submitted">("draft");

  const kategoriOptions = [
    "Pulsa",
    "Paket Data",
    "PLN",
    "PDAM",
    "BPJS",
    "Telkom",
    "TV Kabel",
    "Game Voucher",
    "Tiket",
    "Lainnya",
  ];

  const addItem = () => {
    if (!newItem.namaItem || !newItem.kategori || newItem.jumlah <= 0 || newItem.harga <= 0) {
      toast.error("Mohon lengkapi semua data item");
      return;
    }

    const item: SalesItem = {
      id: Date.now().toString(),
      namaItem: newItem.namaItem,
      kategori: newItem.kategori,
      jumlah: newItem.jumlah,
      harga: newItem.harga,
      total: newItem.jumlah * newItem.harga,
    };

    setSalesItems([...salesItems, item]);
    setNewItem({ namaItem: "", kategori: "", jumlah: 0, harga: 0 });
    toast.success("Item berhasil ditambahkan");
  };

  const removeItem = (id: string) => {
    setSalesItems(salesItems.filter((item) => item.id !== id));
    toast.info("Item dihapus");
  };

  const updateItem = (id: string, field: keyof SalesItem, value: any) => {
    setSalesItems(
      salesItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "jumlah" || field === "harga") {
            updated.total = updated.jumlah * updated.harga;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const saveDraft = () => {
    setStatus("draft");
    toast.info("Laporan disimpan sebagai draft");
  };

  const submitReport = () => {
    if (salesItems.length === 0) {
      toast.error("Tidak ada data penjualan untuk dikirim");
      return;
    }

    setStatus("submitted");
    toast.success("Laporan penjualan berhasil dikirim ke Kasir");
  };

  const totalPenjualan = salesItems.reduce((sum, item) => sum + item.total, 0);
  const totalTransaksi = salesItems.reduce((sum, item) => sum + item.jumlah, 0);

  // Group by kategori for summary
  const summaryByKategori = salesItems.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = { jumlah: 0, total: 0 };
    }
    acc[item.kategori].jumlah += item.jumlah;
    acc[item.kategori].total += item.total;
    return acc;
  }, {} as Record<string, { jumlah: number; total: number }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Laporan Penjualan Loket</h1>
          <p className="text-muted-foreground mt-1">
            Input akumulasi transaksi penjualan harian
          </p>
        </div>
        <Badge
          variant={status === "submitted" ? "default" : "outline"}
          className="text-sm py-2 px-4"
        >
          {status === "submitted" ? "Terkirim" : "Draft"}
        </Badge>
      </div>

      {/* Info Bar */}
      <Card className="shadow-sm bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">Tanggal:</span>
              <span>18 Desember 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium">Shift:</span>
              <span>Pagi (08:00 - 14:00)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Loket:</span>
              <span>Loket 1</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Item */}
      <Card className="shadow-sm border-secondary/30">
        <CardHeader className="bg-secondary/5">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Tambah Item Penjualan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Nama Item / Produk</Label>
              <Input
                placeholder="Contoh: Pulsa Telkomsel 50k"
                value={newItem.namaItem}
                onChange={(e) => setNewItem({ ...newItem, namaItem: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <select
                value={newItem.kategori}
                onChange={(e) => setNewItem({ ...newItem, kategori: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="">Pilih Kategori</option>
                {kategoriOptions.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Jumlah</Label>
              <Input
                type="number"
                placeholder="0"
                value={newItem.jumlah || ""}
                onChange={(e) => setNewItem({ ...newItem, jumlah: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Harga Satuan</Label>
              <Input
                type="number"
                placeholder="0"
                value={newItem.harga || ""}
                onChange={(e) => setNewItem({ ...newItem, harga: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Items Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Transaksi Penjualan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {salesItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Belum ada item penjualan</p>
              <p className="text-sm mt-1">Tambahkan item menggunakan form di atas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-center">Jumlah</TableHead>
                    <TableHead className="text-right">Harga Satuan</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.namaItem}
                          onChange={(e) => updateItem(item.id, "namaItem", e.target.value)}
                          className="min-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.kategori}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          value={item.jumlah}
                          onChange={(e) =>
                            updateItem(item.id, "jumlah", Number(e.target.value))
                          }
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.harga}
                          onChange={(e) => updateItem(item.id, "harga", Number(e.target.value))}
                          className="w-32 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rp {item.total.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary by Category */}
      {Object.keys(summaryByKategori).length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Ringkasan Per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(summaryByKategori).map(([kategori, data]) => (
                <div key={kategori} className="p-4 border rounded-lg bg-muted/30">
                  <div className="text-sm text-muted-foreground">{kategori}</div>
                  <div className="font-medium mt-1">{data.jumlah} transaksi</div>
                  <div className="text-sm font-medium text-primary mt-1">
                    Rp {data.total.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Summary */}
      <Card className="shadow-md border-primary/30">
        <CardHeader className="bg-primary/5">
          <CardTitle>Total Penjualan</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-card rounded-lg border">
              <div className="text-sm text-muted-foreground">Total Transaksi</div>
              <div className="text-3xl font-bold text-secondary mt-1">{totalTransaksi}</div>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <div className="text-sm text-muted-foreground">Total Penjualan</div>
              <div className="text-3xl font-bold text-success mt-1">
                Rp {totalPenjualan.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Tambahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea
              placeholder="Tambahkan catatan atau keterangan khusus..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Upload Bukti Transaksi (Opsional)</Label>
            <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="text-sm">
                {buktiTransaksi ? buktiTransaksi.name : "Klik untuk upload bukti"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => setBuktiTransaksi(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="lg" onClick={saveDraft}>
          <Save className="w-4 h-4 mr-2" />
          Simpan Draft
        </Button>
        <Button size="lg" onClick={submitReport} disabled={salesItems.length === 0}>
          <Send className="w-4 h-4 mr-2" />
          Kirim ke Kasir
        </Button>
      </div>
    </div>
  );
}
