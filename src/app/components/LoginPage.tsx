import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Building2, User } from "lucide-react";

type UserRole = "loket" | "kasir" | "finance" | "owner";

interface LoginPageProps {
  onLogin: (role: UserRole, username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState("");

  const roles = [
    { id: "loket" as UserRole, name: "Loket", description: "Input laporan harian transaksi", icon: User },
    { id: "kasir" as UserRole, name: "Kasir", description: "Terima setoran & kelola kas", icon: Building2 },
    { id: "finance" as UserRole, name: "Finance", description: "Verifikasi & jurnal akuntansi", icon: Building2 },
    { id: "owner" as UserRole, name: "Owner", description: "Lihat laporan & dashboard", icon: Building2 },
  ];

  const handleLogin = () => {
    setError("");
    
    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    if (!selectedRole) {
      setError("Pilih role terlebih dahulu");
      return;
    }

    // Mock authentication - in real app, validate against backend
    onLogin(selectedRole, username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center space-y-2 bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-3xl">Sistem PPOB</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Payment Point Online Bank - Silakan login dengan role Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Login Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label>Pilih Role</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      selectedRole === role.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${selectedRole === role.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {role.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Login Button */}
          <Button 
            onClick={handleLogin} 
            className="w-full"
            size="lg"
          >
            Masuk ke Sistem
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
