import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import logoImg from "@/assets/logo.png";

export function SiteFooter() {
  const { data } = useSiteData();
  const { footer, contact, identity, theme } = data;

  const footerStyle = theme ? {
    backgroundColor: theme.footerBg,
    color: theme.footerText,
  } : {};

  return (
    <footer style={footerStyle}>
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 justify-center sm:justify-start">
              <img src={identity.logo || logoImg} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain brightness-200" />
              <span className="font-heading text-base sm:text-lg font-semibold">{identity.name}</span>
            </div>
            <p className="text-xs sm:text-sm opacity-70">{identity.specialty} — {identity.crm}</p>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-heading text-base sm:text-lg font-semibold mb-3 sm:mb-4">Links Rápidos</h4>
            <div className="space-y-1 sm:space-y-2">
              {footer.links.map((l) => (
                <Link key={l.href} to={l.href} className="block text-xs sm:text-sm opacity-70 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h4 className="font-heading text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contato</h4>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-70">
              <p className="flex items-center gap-2 justify-center sm:justify-start"><Phone className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" /> {contact.phone}</p>
              <p className="flex items-center gap-2 justify-center sm:justify-start"><Mail className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" /> <span className="truncate">{contact.email}</span></p>
              <p className="flex items-center gap-2 justify-center sm:justify-start"><MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" /> <span className="truncate">{contact.address}</span></p>
            </div>
            <div className="flex gap-3 mt-3 sm:mt-4 justify-center sm:justify-start">
              {footer.social.map((s) => (
                <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm opacity-70 hover:opacity-100 transition-opacity">
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-current/20 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-xs sm:text-sm opacity-50">
          {footer.text}
        </div>
      </div>
    </footer>
  );
}
