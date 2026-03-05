import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  User, Navigation, Home, Info, CalendarDays, FileText, Phone, LayoutDashboard,
  LogOut, Menu, X, Trash2, Plus, Save
} from "lucide-react";
import type { SiteData } from "@/data/mockData";

const sections = [
  { key: "identity", label: "Identidade", icon: User },
  { key: "navbar", label: "Navbar", icon: Navigation },
  { key: "home", label: "Home", icon: Home },
  { key: "about", label: "Quem Somos", icon: Info },
  { key: "schedule", label: "Agenda", icon: CalendarDays },
  { key: "blog", label: "Conteúdos", icon: FileText },
  { key: "contact", label: "Contato", icon: Phone },
  { key: "footer", label: "Rodapé", icon: LayoutDashboard },
] as const;

type SectionKey = (typeof sections)[number]["key"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data, updateSection } = useSiteData();
  const [active, setActive] = useState<SectionKey>("identity");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-sidebar-foreground">Admin</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => { setActive(s.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                active === s.key ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-heading font-semibold text-foreground">
            {sections.find((s) => s.key === active)?.label}
          </h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <EditorSection sectionKey={active} data={data} updateSection={updateSection} />
        </main>
      </div>
    </div>
  );
}

function EditorSection({ sectionKey, data, updateSection }: {
  sectionKey: SectionKey;
  data: SiteData;
  updateSection: <K extends keyof SiteData>(key: K, value: SiteData[K]) => void;
}) {
  const save = (key: keyof SiteData, value: unknown) => {
    updateSection(key, value as SiteData[typeof key]);
    toast.success("Salvo com sucesso!");
  };

  switch (sectionKey) {
    case "identity":
      return <IdentityEditor data={data} save={save} />;
    case "navbar":
      return <NavbarEditor data={data} save={save} />;
    case "home":
      return <HomeEditor data={data} save={save} />;
    case "about":
      return <AboutEditor data={data} save={save} />;
    case "schedule":
      return <ScheduleEditor data={data} save={save} />;
    case "blog":
      return <BlogEditor data={data} save={save} />;
    case "contact":
      return <ContactEditor data={data} save={save} />;
    case "footer":
      return <FooterEditor data={data} save={save} />;
  }
}

type SaveFn = (key: keyof SiteData, value: unknown) => void;

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4 max-w-2xl">{children}</div>;
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
      {textarea ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1 mt-2">
      <Save className="h-4 w-4" /> Salvar
    </Button>
  );
}

function IdentityEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState(data.identity);
  useEffect(() => setV(data.identity), [data.identity]);
  return (
    <FieldGroup>
      <Field label="Nome do Médico" value={v.name} onChange={(name) => setV({ ...v, name })} />
      <Field label="CRM" value={v.crm} onChange={(crm) => setV({ ...v, crm })} />
      <Field label="Especialidade" value={v.specialty} onChange={(specialty) => setV({ ...v, specialty })} />
      <Field label="URL da Foto" value={v.photo} onChange={(photo) => setV({ ...v, photo })} />
      <Field label="URL do Logo" value={v.logo} onChange={(logo) => setV({ ...v, logo })} />
      <SaveBtn onClick={() => save("identity", v)} />
    </FieldGroup>
  );
}

function NavbarEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState(data.navbar);
  useEffect(() => setV(data.navbar), [data.navbar]);
  return (
    <FieldGroup>
      <Field label="Texto do Botão CTA" value={v.ctaText} onChange={(ctaText) => setV({ ...v, ctaText })} />
      <h3 className="font-semibold text-foreground">Links</h3>
      {v.links.map((l, i) => (
        <div key={i} className="flex gap-2">
          <Input placeholder="Label" value={l.label} onChange={(e) => { const links = [...v.links]; links[i] = { ...l, label: e.target.value }; setV({ ...v, links }); }} />
          <Input placeholder="URL" value={l.href} onChange={(e) => { const links = [...v.links]; links[i] = { ...l, href: e.target.value }; setV({ ...v, links }); }} />
        </div>
      ))}
      <SaveBtn onClick={() => save("navbar", v)} />
    </FieldGroup>
  );
}

function HomeEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState(data.home);
  useEffect(() => setV(data.home), [data.home]);

  return (
    <div className="space-y-6 max-w-2xl">
      <FieldGroup>
        <h3 className="font-heading font-semibold text-foreground text-lg">Hero</h3>
        <Field label="Título" value={v.hero.title} onChange={(title) => setV({ ...v, hero: { ...v.hero, title } })} />
        <Field label="Subtítulo" value={v.hero.subtitle} onChange={(subtitle) => setV({ ...v, hero: { ...v.hero, subtitle } })} />
        <Field label="Texto" value={v.hero.text} onChange={(text) => setV({ ...v, hero: { ...v.hero, text } })} textarea />
        <Field label="Botão CTA" value={v.hero.ctaText} onChange={(ctaText) => setV({ ...v, hero: { ...v.hero, ctaText } })} />
      </FieldGroup>

      <FieldGroup>
        <h3 className="font-heading font-semibold text-foreground text-lg">Serviços</h3>
        <Field label="Título da Seção" value={v.services.title} onChange={(title) => setV({ ...v, services: { ...v.services, title } })} />
        {v.services.items.map((item, i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-2">
            <Input placeholder="Ícone" value={item.icon} onChange={(e) => { const items = [...v.services.items]; items[i] = { ...item, icon: e.target.value }; setV({ ...v, services: { ...v.services, items } }); }} />
            <Input placeholder="Título" value={item.title} onChange={(e) => { const items = [...v.services.items]; items[i] = { ...item, title: e.target.value }; setV({ ...v, services: { ...v.services, items } }); }} />
            <Textarea placeholder="Descrição" value={item.description} onChange={(e) => { const items = [...v.services.items]; items[i] = { ...item, description: e.target.value }; setV({ ...v, services: { ...v.services, items } }); }} rows={2} />
          </div>
        ))}
      </FieldGroup>

      <FieldGroup>
        <h3 className="font-heading font-semibold text-foreground text-lg">CTA</h3>
        <Field label="Título" value={v.cta.title} onChange={(title) => setV({ ...v, cta: { ...v.cta, title } })} />
        <Field label="Texto" value={v.cta.text} onChange={(text) => setV({ ...v, cta: { ...v.cta, text } })} textarea />
        <Field label="Botão" value={v.cta.buttonText} onChange={(buttonText) => setV({ ...v, cta: { ...v.cta, buttonText } })} />
      </FieldGroup>

      <SaveBtn onClick={() => save("home", v)} />
    </div>
  );
}

function AboutEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState(data.about);
  useEffect(() => setV(data.about), [data.about]);

  return (
    <div className="space-y-6 max-w-2xl">
      <FieldGroup>
        <Field label="Biografia" value={v.bio} onChange={(bio) => setV({ ...v, bio })} textarea />
      </FieldGroup>
      <FieldGroup>
        <h3 className="font-heading font-semibold text-foreground text-lg">Formação</h3>
        {v.education.map((e, i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-2">
            <Input placeholder="Título" value={e.title} onChange={(ev) => { const edu = [...v.education]; edu[i] = { ...e, title: ev.target.value }; setV({ ...v, education: edu }); }} />
            <Input placeholder="Instituição" value={e.institution} onChange={(ev) => { const edu = [...v.education]; edu[i] = { ...e, institution: ev.target.value }; setV({ ...v, education: edu }); }} />
            <Input placeholder="Ano" value={e.year} onChange={(ev) => { const edu = [...v.education]; edu[i] = { ...e, year: ev.target.value }; setV({ ...v, education: edu }); }} />
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => { const edu = v.education.filter((_, j) => j !== i); setV({ ...v, education: edu }); }}>
              <Trash2 className="h-3 w-3 mr-1" /> Remover
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setV({ ...v, education: [...v.education, { title: "", institution: "", year: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar Formação
        </Button>
      </FieldGroup>
      <FieldGroup>
        <h3 className="font-heading font-semibold text-foreground text-lg">Experiência</h3>
        {v.experience.map((e, i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-2">
            <Input placeholder="Cargo" value={e.role} onChange={(ev) => { const exp = [...v.experience]; exp[i] = { ...e, role: ev.target.value }; setV({ ...v, experience: exp }); }} />
            <Input placeholder="Local" value={e.place} onChange={(ev) => { const exp = [...v.experience]; exp[i] = { ...e, place: ev.target.value }; setV({ ...v, experience: exp }); }} />
            <Input placeholder="Período" value={e.period} onChange={(ev) => { const exp = [...v.experience]; exp[i] = { ...e, period: ev.target.value }; setV({ ...v, experience: exp }); }} />
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => { const exp = v.experience.filter((_, j) => j !== i); setV({ ...v, experience: exp }); }}>
              <Trash2 className="h-3 w-3 mr-1" /> Remover
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setV({ ...v, experience: [...v.experience, { role: "", place: "", period: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar Experiência
        </Button>
      </FieldGroup>
      <SaveBtn onClick={() => save("about", v)} />
    </div>
  );
}

function ScheduleEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState(data.schedule);
  useEffect(() => setV(data.schedule), [data.schedule]);
  return (
    <FieldGroup>
      <Field label="Dias" value={v.days} onChange={(days) => setV({ ...v, days })} />
      <Field label="Horários" value={v.hours} onChange={(hours) => setV({ ...v, hours })} />
      <Field label="Endereço" value={v.address} onChange={(address) => setV({ ...v, address })} />
      <Field label="WhatsApp" value={v.whatsapp} onChange={(whatsapp) => setV({ ...v, whatsapp })} />
      <Field label="Telefone" value={v.phone} onChange={(phone) => setV({ ...v, phone })} />
      <SaveBtn onClick={() => save("schedule", v)} />
    </FieldGroup>
  );
}

function BlogEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [posts, setPosts] = useState(data.blog);
  useEffect(() => setPosts(data.blog), [data.blog]);

  const addPost = () => {
    setPosts([...posts, { id: Date.now().toString(), title: "", image: "", summary: "", content: "", date: new Date().toISOString().split("T")[0] }]);
  };

  const removePost = (i: number) => setPosts(posts.filter((_, j) => j !== i));

  const update = (i: number, field: string, value: string) => {
    const updated = [...posts];
    updated[i] = { ...updated[i], [field]: value };
    setPosts(updated);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {posts.map((p, i) => (
        <div key={p.id} className="bg-card rounded-xl p-5 shadow-card border border-border space-y-3">
          <Input placeholder="Título" value={p.title} onChange={(e) => update(i, "title", e.target.value)} />
          <Input placeholder="URL da Imagem" value={p.image} onChange={(e) => update(i, "image", e.target.value)} />
          <Textarea placeholder="Resumo" value={p.summary} onChange={(e) => update(i, "summary", e.target.value)} rows={2} />
          <Textarea placeholder="Conteúdo" value={p.content} onChange={(e) => update(i, "content", e.target.value)} rows={4} />
          <Input type="date" value={p.date} onChange={(e) => update(i, "date", e.target.value)} />
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => removePost(i)}>
            <Trash2 className="h-3 w-3 mr-1" /> Excluir Artigo
          </Button>
        </div>
      ))}
      <div className="flex gap-3">
        <Button variant="outline" onClick={addPost} className="gap-1"><Plus className="h-4 w-4" /> Novo Artigo</Button>
        <SaveBtn onClick={() => save("blog", posts)} />
      </div>
    </div>
  );
}

function ContactEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState(data.contact);
  useEffect(() => setV(data.contact), [data.contact]);
  return (
    <div className="space-y-6 max-w-2xl">
      <FieldGroup>
        <Field label="Telefone" value={v.phone} onChange={(phone) => setV({ ...v, phone })} />
        <Field label="WhatsApp" value={v.whatsapp} onChange={(whatsapp) => setV({ ...v, whatsapp })} />
        <Field label="E-mail" value={v.email} onChange={(email) => setV({ ...v, email })} />
        <Field label="Endereço" value={v.address} onChange={(address) => setV({ ...v, address })} />
        <Field label="URL do Mapa" value={v.mapUrl} onChange={(mapUrl) => setV({ ...v, mapUrl })} />
      </FieldGroup>
      <FieldGroup>
        <h3 className="font-heading font-semibold text-foreground text-lg">Redes Sociais</h3>
        {v.social.map((s, i) => (
          <div key={i} className="flex gap-2">
            <Input placeholder="Plataforma" value={s.platform} onChange={(e) => { const social = [...v.social]; social[i] = { ...s, platform: e.target.value }; setV({ ...v, social }); }} />
            <Input placeholder="URL" value={s.url} onChange={(e) => { const social = [...v.social]; social[i] = { ...s, url: e.target.value }; setV({ ...v, social }); }} />
            <Button variant="outline" size="sm" className="text-destructive shrink-0" onClick={() => setV({ ...v, social: v.social.filter((_, j) => j !== i) })}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setV({ ...v, social: [...v.social, { platform: "", url: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </FieldGroup>
      <SaveBtn onClick={() => save("contact", v)} />
    </div>
  );
}

function FooterEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState(data.footer);
  useEffect(() => setV(data.footer), [data.footer]);
  return (
    <div className="space-y-6 max-w-2xl">
      <FieldGroup>
        <Field label="Texto do Copyright" value={v.text} onChange={(text) => setV({ ...v, text })} />
      </FieldGroup>
      <FieldGroup>
        <h3 className="font-heading font-semibold text-foreground text-lg">Links</h3>
        {v.links.map((l, i) => (
          <div key={i} className="flex gap-2">
            <Input placeholder="Label" value={l.label} onChange={(e) => { const links = [...v.links]; links[i] = { ...l, label: e.target.value }; setV({ ...v, links }); }} />
            <Input placeholder="URL" value={l.href} onChange={(e) => { const links = [...v.links]; links[i] = { ...l, href: e.target.value }; setV({ ...v, links }); }} />
          </div>
        ))}
      </FieldGroup>
      <FieldGroup>
        <h3 className="font-heading font-semibold text-foreground text-lg">Redes Sociais</h3>
        {v.social.map((s, i) => (
          <div key={i} className="flex gap-2">
            <Input placeholder="Plataforma" value={s.platform} onChange={(e) => { const social = [...v.social]; social[i] = { ...s, platform: e.target.value }; setV({ ...v, social }); }} />
            <Input placeholder="URL" value={s.url} onChange={(e) => { const social = [...v.social]; social[i] = { ...s, url: e.target.value }; setV({ ...v, social }); }} />
          </div>
        ))}
      </FieldGroup>
      <SaveBtn onClick={() => save("footer", v)} />
    </div>
  );
}
