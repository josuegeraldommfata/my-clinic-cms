import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === "admin" && pass === "admin123") {
      sessionStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      toast.error("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form onSubmit={handleLogin} className="bg-card rounded-2xl p-8 shadow-elevated border border-border w-full max-w-sm space-y-5">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Painel Admin</h1>
          <p className="text-sm text-muted-foreground">Acesse o painel administrativo</p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Usuário</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" value={user} onChange={(e) => setUser(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" type="password" value={pass} onChange={(e) => setPass(e.target.value)} required />
          </div>
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Entrar</Button>
      </form>
    </div>
  );
}
