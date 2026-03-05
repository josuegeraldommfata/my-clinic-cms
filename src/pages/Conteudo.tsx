import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";

export default function Conteudo() {
  const { data } = useSiteData();

  return (
    <>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-heading font-bold">Conteúdo</h1>
          <p className="mt-2 opacity-80">Artigos e informações sobre saúde cardiovascular</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.blog.map((post) => (
              <article key={post.id} className="bg-card rounded-xl overflow-hidden shadow-card border border-border group hover:shadow-elevated transition-shadow">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-5">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString("pt-BR")}
                  </p>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.summary}</p>
                  <Link to={`/conteudo/${post.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 border-primary text-primary hover:bg-accent">
                      Ler mais <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {data.blog.length === 0 && (
            <p className="text-center text-muted-foreground">Nenhum artigo publicado ainda.</p>
          )}
        </div>
      </section>
    </>
  );
}
