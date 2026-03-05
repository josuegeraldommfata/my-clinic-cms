import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import logoImg from "@/assets/logo.png";

export function SiteFooter() {
  const { data } = useSiteData();
  const { footer, contact, identity } = data;

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain brightness-200" />
              <span className="font-heading text-lg font-semibold">{identity.name}</span>
            </div>
            <p className="text-sm opacity-70">{identity.specialty} — {identity.crm}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Links Rápidos</h4>
            <div className="space-y-2">
              {footer.links.map((l) => (
                <Link key={l.href} to={l.href} className="block text-sm opacity-70 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-2 text-sm opacity-70">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {contact.phone}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {contact.email}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {contact.address}</p>
            </div>
            <div className="flex gap-3 mt-4">
              {footer.social.map((s) => (
                <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-6 text-center text-sm opacity-50">
          {footer.text}
        </div>
      </div>
    </footer>
  );
}
