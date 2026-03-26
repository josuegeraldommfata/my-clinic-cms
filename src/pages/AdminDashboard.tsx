import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  User, Navigation, Home, Info, CalendarDays, FileText, Phone, LayoutDashboard,
  LogOut, Menu, X, Trash2, Plus, Save, Palette, Image, ChevronRight
} from "lucide-react";
import type { SiteData, ThemeColors } from "@/data/mockData";

const sections = [
  { key: "identity", label: "Identidade", icon: User },
  { key: "theme", label: "Cores / Tema", icon: Palette },
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
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <h2 className="font-heading text-lg font-bold text-sidebar-foreground">Admin</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-sidebar-accent">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => { setActive(s.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active === s.key
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <s.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{s.label}</span>
              {active === s.key && <ChevronRight className="h-3 w-3 opacity-50" />}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-sidebar-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-3 sm:px-6 gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            {(() => { const Icon = sections.find((s) => s.key === active)?.icon || Home; return <Icon className="h-5 w-5 text-primary" />; })()}
            <h1 className="text-base sm:text-lg font-heading font-semibold text-foreground">
              {sections.find((s) => s.key === active)?.label}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
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
    case "identity": return <IdentityEditor data={data} save={save} />;
    case "theme": return <ThemeEditor data={data} save={save} />;
    case "navbar": return <NavbarEditor data={data} save={save} />;
    case "home": return <HomeEditor data={data} save={save} />;
    case "about": return <AboutEditor data={data} save={save} />;
    case "schedule": return <ScheduleEditor data={data} save={save} />;
    case "blog": return <BlogEditor data={data} save={save} />;
    case "contact": return <ContactEditor data={data} save={save} />;
    case "footer": return <FooterEditor data={data} save={save} />;
  }
}

type SaveFn = (key: keyof SiteData, value: unknown) => void;

function FieldGroup({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-card border border-border space-y-4">
      {title && <h3 className="font-heading font-semibold text-foreground text-base sm:text-lg">{title}</h3>}
      {children}
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs sm:text-sm font-medium text-foreground mb-1 block">{label}</label>
      {textarea ? (
        <Textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={4} className="text-sm" />
      ) : (
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} className="text-sm" />
      )}
    </div>
  );
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 mt-2 w-full sm:w-auto">
      <Save className="h-4 w-4" /> Salvar
    </Button>
  );
}

function FileUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label className="text-xs sm:text-sm font-medium text-foreground mb-1 block">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL ou faça upload" className="flex-1 text-sm" />
        <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-border bg-muted text-sm hover:bg-accent transition-colors shrink-0">
          <Image className="h-4 w-4" /> Upload
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
      {value && <img src={value} alt="Preview" className="mt-2 h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-lg border border-border" />}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-border cursor-pointer shrink-0" />
      <div className="flex-1 min-w-0">
        <label className="text-xs sm:text-sm font-medium text-foreground block">{label}</label>
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 text-sm" />
      </div>
    </div>
  );
}

function ThemeEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState<ThemeColors>({
    primary: '#0d9488',
    secondary: '#d97706',
    accent: '#b2dfdb',
    background: '#f5f9f8',
    foreground: '#1e3a3a',
    card: '#ffffff',
    muted: '#e8efee',
    footerBg: '#1e3a3a',
    footerText: '#f5f9f8'
  });
  useEffect(() => {
    if (data.theme) setV(data.theme);
  }, [data.theme]);
  const set = (key: keyof ThemeColors, val: string) => setV({ ...v, [key]: val });
  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl">
      <FieldGroup title="Cores Principais">
        <ColorField label="Cor Primária" value={v.primary || '#0d9488'} onChange={(c) => set("primary", c)} />
        <ColorField label="Cor Secundária" value={v.secondary || '#d97706'} onChange={(c) => set("secondary", c)} />
        <ColorField label="Cor de Destaque (Accent)" value={v.accent || '#b2dfdb'} onChange={(c) => set("accent", c)} />
      </FieldGroup>
      <FieldGroup title="Fundo e Texto">
        <ColorField label="Cor de Fundo" value={v.background || '#f5f9f8'} onChange={(c) => set("background", c)} />
        <ColorField label="Cor do Texto" value={v.foreground || '#1e3a3a'} onChange={(c) => set("foreground", c)} />
        <ColorField label="Cor dos Cards" value={v.card || '#ffffff'} onChange={(c) => set("card", c)} />
        <ColorField label="Cor de Elementos Suaves (Muted)" value={v.muted || '#e8efee'} onChange={(c) => set("muted", c)} />
      </FieldGroup>
      <FieldGroup title="Rodapé">
        <ColorField label="Fundo do Rodapé" value={v.footerBg || '#1e3a3a'} onChange={(c) => set("footerBg", c)} />
        <ColorField label="Texto do Rodapé" value={v.footerText || '#f5f9f8'} onChange={(c) => set("footerText", c)} />
      </FieldGroup>
      <SaveBtn onClick={() => save("theme", v)} />
    </div>
  );
}

function IdentityEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState(data.identity);
  useEffect(() => setV(data.identity), [data.identity]);
  return (
    <div className="max-w-2xl">
      <FieldGroup>
        <Field label="Título da Página" value={v.name} onChange={(name) => setV({ ...v, name })} />
        <Field label="CRM" value={v.crm} onChange={(crm) => setV({ ...v, crm })} />
        <Field label="Especialidade" value={v.specialty} onChange={(specialty) => setV({ ...v, specialty })} />
        <FileUpload label="Foto do Médico" value={v.photo} onChange={(photo) => setV({ ...v, photo })} />
        <FileUpload label="Logo Navbar" value={v.logo} onChange={(logo) => setV({ ...v, logo })} />
        <FileUpload label="Favicon" value={v.favicon || ''} onChange={(favicon) => setV({ ...v, favicon })} />
        <SaveBtn onClick={() => save("identity", v)} />
      </FieldGroup>
    </div>
  );
}


function NavbarEditor({ data, save }: { data: SiteData; save: SaveFn }) {
const [v, setV] = useState({ ctaText: '', links: [] });
  useEffect(() => setV(data.navbar || { ctaText: '', links: [] }), [data.navbar]);
  return (
    <div className="max-w-2xl">
      <FieldGroup>
        <Field label="Texto do Botão CTA" value={v.ctaText || ''} onChange={(ctaText) => setV({ ...v, ctaText })} />
        <h3 className="font-semibold text-foreground text-sm sm:text-base">Links</h3>
        {(v.links || []).map((l, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Label" value={l.label || ''} onChange={(e) => {
              const links = [...(v.links || [])];
              links[i] = { ...l, label: e.target.value };
              setV({ ...v, links });
            }} className="text-sm" />
            <Input placeholder="URL" value={l.href || ''} onChange={(e) => {
              const links = [...(v.links || [])];
              links[i] = { ...l, href: e.target.value };
              setV({ ...v, links });
            }} className="text-sm" />
          </div>
        ))}
        <SaveBtn onClick={() => save("navbar", v)} />
      </FieldGroup>
    </div>
  );

}

function HomeEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState({ hero: { title: '', subtitle: '', text: '', ctaText: '' }, services: { title: '', items: [] }, differentials: { title: '', items: [] }, cta: { title: '', text: '', buttonText: '' } });
  useEffect(() => setV(data.home || v), [data.home]);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl">
      <FieldGroup title="Hero">
        <Field label="Título" value={(v.hero?.title || '')} onChange={(title) => setV({ ...v, hero: { ...v.hero, title } })} />
        <Field label="Subtítulo" value={(v.hero?.subtitle || '')} onChange={(subtitle) => setV({ ...v, hero: { ...v.hero, subtitle } })} />
        <Field label="Texto" value={(v.hero?.text || '')} onChange={(text) => setV({ ...v, hero: { ...v.hero, text } })} textarea />
        <Field label="Botão CTA" value={(v.hero?.ctaText || '')} onChange={(ctaText) => setV({ ...v, hero: { ...v.hero, ctaText } })} />
      </FieldGroup>

      <FieldGroup title="Serviços">
        <Field label="Título da Seção" value={(v.services?.title || '')} onChange={(title) => setV({ ...v, services: { ...v.services, title } })} />
        {((v.services?.items || [])).map((item, i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-2">
            <Input placeholder="Ícone" value={item.icon || ''} onChange={(e) => {
              const items = [...(v.services?.items || [])];
              items[i] = { ...item, icon: e.target.value };
              setV({ ...v, services: { ...v.services, items } });
            }} className="text-sm" />
            <Input placeholder="Título" value={item.title || ''} onChange={(e) => {
              const items = [...(v.services?.items || [])];
              items[i] = { ...item, title: e.target.value };
              setV({ ...v, services: { ...v.services, items } });
            }} className="text-sm" />
            <Textarea placeholder="Descrição" value={item.description || ''} onChange={(e) => {
              const items = [...(v.services?.items || [])];
              items[i] = { ...item, description: e.target.value };
              setV({ ...v, services: { ...v.services, items } });
            }} rows={2} className="text-sm" />
          </div>
        ))}
      </FieldGroup>

      <FieldGroup title="CTA">
        <Field label="Título" value={(v.cta?.title || '')} onChange={(title) => setV({ ...v, cta: { ...v.cta, title } })} />
        <Field label="Texto" value={(v.cta?.text || '')} onChange={(text) => setV({ ...v, cta: { ...v.cta, text } })} textarea />
        <Field label="Botão" value={(v.cta?.buttonText || '')} onChange={(buttonText) => setV({ ...v, cta: { ...v.cta, buttonText } })} />
      </FieldGroup>

      <SaveBtn onClick={() => save("home", v)} />
    </div>
  );
}

function AboutEditor({ data, save }: { data: SiteData; save: SaveFn }) {
  const [v, setV] = useState({ bio: '', education: [], experience: [] });
  useEffect(() => setV(data.about || { bio: '', education: [], experience: [] }), [data.about]);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl">
      <FieldGroup>
        <Field label="Biografia" value={v.bio || ''} onChange={(bio) => setV({ ...v, bio })} textarea />
      </FieldGroup>
      <FieldGroup title="Formação">
        {(v.education || []).map((e, i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-2">
            <Input placeholder="Título" value={e.title || ''} onChange={(ev) => {
              const edu = [...(v.education || [])];
              edu[i] = { ...e, title: ev.target.value };
              setV({ ...v, education: edu });
            }} className="text-sm" />
            <Input placeholder="Instituição" value={e.institution || ''} onChange={(ev) => {
              const edu = [...(v.education || [])];
              edu[i] = { ...e, institution: ev.target.value };
              setV({ ...v, education: edu });
            }} className="text-sm" />
            <Input placeholder="Ano" value={e.year || ''} onChange={(ev) => {
              const edu = [...(v.education || [])];
              edu[i] = { ...e, year: ev.target.value };
              setV({ ...v, education: edu });
            }} className="text-sm" />
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => {
              const edu = (v.education || []).filter((_, j) => j !== i);
              setV({ ...v, education: edu });
            }}>
              <Trash2 className="h-3 w-3 mr-1" /> Remover
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setV({ ...v, education: [...(v.education || []), { title: "", institution: "", year: "" }] })}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar Formação
        </Button>
      </FieldGroup>
      <FieldGroup title="Experiência">
        {(v.experience || []).map((e, i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-2">
            <Input placeholder="Cargo" value={e.role || ''} onChange={(ev) => {
              const exp = [...(v.experience || [])];
              exp[i] = { ...e, role: ev.target.value };
              setV({ ...v, experience: exp });
            }} className="text-sm" />
            <Input placeholder="Local" value={e.place || ''} onChange={(ev) => {
              const exp = [...(v.experience || [])];
              exp[i] = { ...e, place: ev.target.value };
              setV({ ...v, experience: exp });
            }} className="text-sm" />
            <Input placeholder="Período" value={e.period || ''} onChange={(ev) => {
              const exp = [...(v.experience || [])];
              exp[i] = { ...e, period: ev.target.value };
              setV({ ...v, experience: exp });
            }} className="text-sm" />
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => {
              const exp = (v.experience || []).filter((_, j) => j !== i);
              setV({ ...v, experience: exp });
            }}>
              <Trash2 className="h-3 w-3 mr-1" /> Remover
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setV({ ...v, experience: [...(v.experience || []), { role: "", place: "", period: "" }] })}>
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
    <div className="max-w-2xl">
      <FieldGroup>
        <Field label="Dias" value={v.days} onChange={(days) => setV({ ...v, days })} />
        <Field label="Horários" value={v.hours} onChange={(hours) => setV({ ...v, hours })} />
        <Field label="Endereço" value={v.address} onChange={(address) => setV({ ...v, address })} />
        <Field label="WhatsApp" value={v.whatsapp} onChange={(whatsapp) => setV({ ...v, whatsapp })} />
        <Field label="Telefone" value={v.phone} onChange={(phone) => setV({ ...v, phone })} />
        <SaveBtn onClick={() => save("schedule", v)} />
      </FieldGroup>
    </div>
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
        <div key={p.id} className="bg-card rounded-xl p-4 sm:p-5 shadow-card border border-border space-y-3">
          <Input placeholder="Título" value={p.title} onChange={(e) => update(i, "title", e.target.value)} className="text-sm" />
          <Input placeholder="URL da Imagem" value={p.image} onChange={(e) => update(i, "image", e.target.value)} className="text-sm" />
          <Textarea placeholder="Resumo" value={p.summary} onChange={(e) => update(i, "summary", e.target.value)} rows={2} className="text-sm" />
          <Textarea placeholder="Conteúdo" value={p.content} onChange={(e) => update(i, "content", e.target.value)} rows={4} className="text-sm" />
          <Input type="date" value={p.date} onChange={(e) => update(i, "date", e.target.value)} className="text-sm" />
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => removePost(i)}>
            <Trash2 className="h-3 w-3 mr-1" /> Excluir Artigo
          </Button>
        </div>
      ))}
      <div className="flex flex-col sm:flex-row gap-3">
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
    <div className="space-y-4 sm:space-y-6 max-w-2xl">
      <FieldGroup>
        <Field label="Telefone" value={v.phone} onChange={(phone) => setV({ ...v, phone })} />
        <Field label="WhatsApp" value={v.whatsapp} onChange={(whatsapp) => setV({ ...v, whatsapp })} />
        <Field label="E-mail" value={v.email} onChange={(email) => setV({ ...v, email })} />
        <Field label="Endereço" value={v.address} onChange={(address) => setV({ ...v, address })} />
        <Field label="URL do Mapa" value={v.mapUrl} onChange={(mapUrl) => setV({ ...v, mapUrl })} />
      </FieldGroup>
      <FieldGroup title="Redes Sociais">
        {v.social.map((s, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Plataforma" value={s.platform} onChange={(e) => { const social = [...v.social]; social[i] = { ...s, platform: e.target.value }; setV({ ...v, social }); }} className="text-sm" />
            <Input placeholder="URL" value={s.url} onChange={(e) => { const social = [...v.social]; social[i] = { ...s, url: e.target.value }; setV({ ...v, social }); }} className="text-sm" />
            <Button variant="outline" size="sm" className="text-destructive shrink-0 w-full sm:w-auto" onClick={() => setV({ ...v, social: v.social.filter((_, j) => j !== i) })}>
              <Trash2 className="h-3 w-3 mr-1" /> Remover
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
  const [v, setV] = useState({ text: '', links: [], social: [] });
  useEffect(() => setV(data.footer || { text: '', links: [], social: [] }), [data.footer]);
  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl">
      <FieldGroup>
        <Field label="Texto do Copyright" value={v.text || ''} onChange={(text) => setV({ ...v, text })} />
      </FieldGroup>
      <FieldGroup title="Links">
        {(v.links || []).map((l, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Label" value={l.label || ''} onChange={(e) => {
              const links = [...(v.links || [])];
              links[i] = { ...l, label: e.target.value };
              setV({ ...v, links });
            }} className="text-sm" />
            <Input placeholder="URL" value={l.href || ''} onChange={(e) => {
              const links = [...(v.links || [])];
              links[i] = { ...l, href: e.target.value };
              setV({ ...v, links });
            }} className="text-sm" />
          </div>
        ))}
      </FieldGroup>
      <FieldGroup title="Redes Sociais">
        {(v.social || []).map((s, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Plataforma" value={s.platform || ''} onChange={(e) => {
              const social = [...(v.social || [])];
              social[i] = { ...s, platform: e.target.value };
              setV({ ...v, social });
            }} className="text-sm" />
            <Input placeholder="URL" value={s.url || ''} onChange={(e) => {
              const social = [...(v.social || [])];
              social[i] = { ...s, url: e.target.value };
              setV({ ...v, social });
            }} className="text-sm" />
          </div>
        ))}
      </FieldGroup>
      <SaveBtn onClick={() => save("footer", v)} />
    </div>
  );
}
