import { Clock, MapPin, Phone, MessageCircle, CalendarDays, Send } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function Agenda() {
  const { data } = useSiteData();
  const { schedule } = data;
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada com sucesso! Entraremos em contato.");
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <>
      <section className="gradient-hero text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">Agende sua Consulta</h1>
          <p className="mt-2 text-sm sm:text-base opacity-80">Escolha a melhor forma de agendar seu atendimento</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-4 sm:mb-6">Informações de Atendimento</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 bg-card rounded-xl p-4 sm:p-5 shadow-card border border-border">
                <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Dias de Atendimento</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{schedule.days}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-card rounded-xl p-4 sm:p-5 shadow-card border border-border">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Horários</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{schedule.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-card rounded-xl p-4 sm:p-5 shadow-card border border-border">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Endereço</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{schedule.address}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-5 sm:mt-6">
              <a href={`https://wa.me/${schedule.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" /> WhatsApp
                </Button>
              </a>
              <a href={`tel:${schedule.phone}`} className="flex-1">
                <Button variant="outline" className="w-full gap-2 border-primary text-primary hover:bg-accent">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" /> Ligar
                </Button>
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-4 sm:mb-6">Formulário de Agendamento</h2>
            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-4 sm:p-6 shadow-card border border-border space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nome completo</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Telefone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Mensagem</label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Send className="h-4 w-4" /> Enviar Solicitação
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
