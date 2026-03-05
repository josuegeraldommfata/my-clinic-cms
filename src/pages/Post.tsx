import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";

export default function Post() {
  const { id } = useParams();
  const { data } = useSiteData();
  const post = data.blog.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Artigo não encontrado</h1>
          <Link to="/conteudo"><Button variant="outline">Voltar</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <Link to="/conteudo" className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100 mb-4">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold">{post.title}</h1>
          <p className="mt-2 opacity-80 flex items-center gap-1 text-sm">
            <CalendarDays className="h-4 w-4" />
            {new Date(post.date).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-8" />
          <div className="prose prose-lg max-w-none text-foreground">
            {post.content.split("\n").map((p, i) => (
              <p key={i} className="mb-4 text-foreground leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
