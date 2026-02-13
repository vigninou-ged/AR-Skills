import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { ModuleCard } from "@/components/ModuleCard";
import { categories } from "@/data/mockData";
import { useModules } from "@/hooks/useModules";

export default function Catalogue() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const { modules, loading } = useModules();

  const filtered = useMemo(() => {
    return modules.filter((m) => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !selectedCategory || m.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [modules, search, selectedCategory]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Catalogue des Modules</h1>
          <p className="text-muted-foreground">Explorez nos formations en réalité augmentée</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un module..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!selectedCategory ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("")}
            >
              Tous
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat.name}
                variant={selectedCategory === cat.name ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat.name === selectedCategory ? "" : cat.name)}
              >
                {cat.icon} {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Chargement des modules...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Aucun module trouvé</p>
            <p className="text-sm">Essayez de modifier votre recherche ou vos filtres.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
