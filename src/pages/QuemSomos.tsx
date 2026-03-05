import { GraduationCap, Briefcase } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import defaultDoctorImg from "@/assets/doctor-hero.jpg";

export default function QuemSomos() {
  const { data } = useSiteData();
  const { about, identity } = data;

  return (
    <>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-heading font-bold">Quem Somos</h1>
          <p className="mt-2 opacity-80">Conheça nossa história e compromisso com sua saúde</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-shrink-0">
              <img src={identity.photo || defaultDoctorImg} alt={identity.name} className="w-64 h-80 object-cover rounded-2xl shadow-elevated" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-1">{identity.name}</h2>
              <p className="text-primary font-medium mb-1">{identity.specialty}</p>
              <p className="text-sm text-muted-foreground mb-6">{identity.crm}</p>
              <p className="text-foreground leading-relaxed">{about.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-8 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" /> Formação Acadêmica
          </h2>
          <div className="space-y-4">
            {about.education.map((e, i) => (
              <div key={i} className="bg-card rounded-xl p-5 shadow-card border border-border">
                <h3 className="font-heading font-semibold text-foreground">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.institution} — {e.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-8 flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" /> Experiência Profissional
          </h2>
          <div className="space-y-4">
            {about.experience.map((e, i) => (
              <div key={i} className="bg-card rounded-xl p-5 shadow-card border border-border">
                <h3 className="font-heading font-semibold text-foreground">{e.role}</h3>
                <p className="text-sm text-muted-foreground">{e.place} — {e.period}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
