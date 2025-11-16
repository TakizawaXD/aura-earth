import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Star, History, User, LogOut, Trash2, MapPin } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

interface FavoriteCity {
  id: string;
  city_name: string;
  country: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

interface SearchHistory {
  id: string;
  city_name: string;
  country: string;
  temperature: number;
  weather_condition: string;
  searched_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, favoritesRes, historyRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
        supabase.from("favorite_cities").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
        supabase.from("search_history").select("*").eq("user_id", user!.id).order("searched_at", { ascending: false }).limit(10),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setFullName(profileRes.data.full_name || "");
        setUsername(profileRes.data.username || "");
      }
      if (favoritesRes.data) setFavorites(favoritesRes.data);
      if (historyRes.data) setHistory(historyRes.data);
    } catch (error: any) {
      toast.error("Error al cargar datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Sesión cerrada");
  };

  const handleDeleteFavorite = async (id: string) => {
    const { error } = await supabase.from("favorite_cities").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar favorito");
    } else {
      setFavorites(favorites.filter((f) => f.id !== id));
      toast.success("Favorito eliminado");
    }
  };

  const handleClearHistory = async () => {
    const { error } = await supabase.from("search_history").delete().eq("user_id", user!.id);
    if (error) {
      toast.error("Error al limpiar historial");
    } else {
      setHistory([]);
      toast.success("Historial limpiado");
    }
  };

  const handleUpdateProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, username })
      .eq("id", user!.id);

    if (error) {
      toast.error("Error al actualizar perfil");
    } else {
      setProfile({ ...profile!, full_name: fullName, username });
      setEditingProfile(false);
      toast.success("Perfil actualizado");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <header className="container mx-auto px-4 py-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate("/")}>
              <MapPin className="mr-2 h-4 w-4" />
              Mapa
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="favorites">
              <Star className="mr-2 h-4 w-4" />
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              Historial
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ciudades Favoritas</CardTitle>
                <CardDescription>
                  Administra tus ubicaciones guardadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No tienes ciudades favoritas aún. Busca una ciudad en el mapa y agrégala a favoritos.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((fav) => (
                      <Card key={fav.id} className="relative">
                        <CardHeader>
                          <CardTitle className="text-lg">{fav.city_name}</CardTitle>
                          <CardDescription>{fav.country}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">
                            <p>Lat: {fav.latitude}</p>
                            <p>Lon: {fav.longitude}</p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-4 w-full"
                            onClick={() => handleDeleteFavorite(fav.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historial de Búsquedas</CardTitle>
                  <CardDescription>
                    Últimas 10 búsquedas realizadas
                  </CardDescription>
                </div>
                {history.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleClearHistory}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpiar
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay búsquedas registradas aún.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div>
                          <p className="font-semibold">{item.city_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.weather_condition} • {item.temperature}°C
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.searched_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>
                  Actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!editingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!editingProfile}
                  />
                </div>
                {editingProfile ? (
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} className="flex-1">
                      Guardar Cambios
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingProfile(false);
                        setFullName(profile?.full_name || "");
                        setUsername(profile?.username || "");
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setEditingProfile(true)} className="w-full">
                    Editar Perfil
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
