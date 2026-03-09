import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function Contato() {
  const { data } = useSiteData();
  const { contact } = data;
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <section className="gradient-hero text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">Contato</h1>
          <p className="mt-2 text-sm sm:text-base opacity-80">Entre em contato conosco</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-4 sm:mb-6">Informações de Contato</h2>
            <div className="space-y-3 sm:space-y-4">
              <a href={`tel:${contact.phone}`} className="flex items-center gap-3 bg-card rounded-xl p-3 sm:p-4 shadow-card border border-border hover:shadow-elevated transition-shadow">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground text-sm sm:text-base truncate">{contact.phone}</span>
              </a>
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-card rounded-xl p-3 sm:p-4 shadow-card border border-border hover:shadow-elevated transition-shadow">
                <MessageCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground text-sm sm:text-base">WhatsApp</span>
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 bg-card rounded-xl p-3 sm:p-4 shadow-card border border-border hover:shadow-elevated transition-shadow">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground text-sm sm:text-base truncate">{contact.email}</span>
              </a>
              <div className="flex items-start gap-3 bg-card rounded-xl p-3 sm:p-4 shadow-card border border-border">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground text-xs sm:text-sm">{contact.address}</span>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Redes Sociais</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {contact.social.map((s) => (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-accent text-xs sm:text-sm">{s.platform}</Button>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5 sm:mt-6 rounded-xl overflow-hidden border border-border">
              <iframe src={contact.mapUrl} width="100%" height="200" className="sm:h-[250px]" style={{ border: 0 }} allowFullScreen loading="lazy" title="Localização" />
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-4 sm:mb-6">Envie uma Mensagem</h2>
            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-4 sm:p-6 shadow-card border border-border space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nome</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">E-mail</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Mensagem</label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} required />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Enviar Mensagem</Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
