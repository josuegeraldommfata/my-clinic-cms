import { Link } from "react-router-dom";
import { Heart, ClipboardCheck, Stethoscope, UserCheck, HeartHandshake, Award, Monitor, Users, Calendar, ArrowRight } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import doctorImg from "@/assets/doctor-hero.jpg";

const iconMap: Record<string, React.ElementType> = {
  Heart, ClipboardCheck, Stethoscope, UserCheck, HeartHandshake, Award, Monitor, Users,
};

export default function Home() {
  const { data } = useSiteData();
  const { home, identity } = data;

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-20 lg:py-28">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm font-medium uppercase tracking-widest opacity-80 mb-2">{identity.specialty}</p>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-4 leading-tight">{home.hero.title}</h1>
            <p className="text-lg opacity-90 max-w-lg mx-auto lg:mx-0 mb-8">{home.hero.text}</p>
            <Link to="/agenda">
              <Button size="lg" className="gradient-cta text-secondary-foreground hover:opacity-90 gap-2 text-base px-8">
                <Calendar className="h-5 w-5" />
                {home.hero.ctaText}
              </Button>
            </Link>
          </div>
          <div className="flex-shrink-0">
            <img
              src={doctorImg}
              alt={identity.name}
              className="w-64 h-80 lg:w-80 lg:h-[26rem] object-cover rounded-2xl shadow-elevated ring-4 ring-primary-foreground/20"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-center mb-12 text-foreground">{home.services.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {home.services.items.map((item, i) => {
              const Icon = iconMap[item.icon] || Heart;
              return (
                <div key={i} className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow border border-border group">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <Icon className="h-6 w-6 text-accent-foreground group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-20 bg-accent/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-center mb-12 text-foreground">{home.differentials.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {home.differentials.items.map((item, i) => {
              const Icon = iconMap[item.icon] || Heart;
              return (
                <div key={i} className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">{home.cta.title}</h2>
          <p className="text-lg opacity-90 max-w-md mx-auto mb-8">{home.cta.text}</p>
          <Link to="/agenda">
            <Button size="lg" className="gradient-cta text-secondary-foreground hover:opacity-90 gap-2 text-base px-8">
              <ArrowRight className="h-5 w-5" />
              {home.cta.buttonText}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
