import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calendar } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const { data } = useSiteData();
  const location = useLocation();
  const { navbar, identity } = data;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={identity.logo || logoImg} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="font-heading text-lg font-semibold text-foreground hidden sm:block">
            {identity.name}
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navbar.links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/agenda">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1">
              <Calendar className="h-4 w-4" />
              {navbar.ctaText}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4">
          {navbar.links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/agenda" onClick={() => setOpen(false)}>
            <Button size="sm" className="mt-2 w-full bg-primary text-primary-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {navbar.ctaText}
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
