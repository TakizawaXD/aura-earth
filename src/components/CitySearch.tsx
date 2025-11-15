import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CitySearchProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export default function CitySearch({ onSearch, loading }: CitySearchProps) {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar ciudad... (ej: Madrid, Barcelona, Lima)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-10 h-12 text-lg shadow-soft border-2 border-primary/20 focus:border-primary"
            disabled={loading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading || !city.trim()}
          className="h-12 px-8 shadow-soft"
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </form>
  );
}
