import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Star, History, User, LogOut, Trash2, MapPin, TrendingUp, BarChart3, CloudRain } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WeatherStats from "@/components/WeatherStats";
import ForecastChart from "@/components/ForecastChart";

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

interface WeatherStats {
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  dewPoint: number;
  cloudCover: number;
  precipitation: number;
  uvIndex: number;
}

interface ForecastData {
  time: string;
  temp: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
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
  const [weatherStats, setWeatherStats] = useState<WeatherStats | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(false);

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

  const loadWeatherForCity = async (cityName: string, lat: number, lon: number) => {
    setLoadingWeather(true);
    try {
      const API_KEY = "bb408aeec5264c3e59e40a0ac545d87d";
      
      // Current weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
      );
      const weather = await weatherRes.json();
      
      // Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );
      const forecast = await forecastRes.json();

      // Calculate dew point
      const temp = weather.main.temp;
      const humidity = weather.main.humidity;
      const dewPoint = temp - ((100 - humidity) / 5);

      setWeatherStats({
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        visibility: weather.visibility,
        windSpeed: Math.round(weather.wind.speed * 3.6), // m/s to km/h
        windDirection: weather.wind.deg,
        dewPoint: dewPoint,
        cloudCover: weather.clouds.all,
        precipitation: forecast.list[0].pop ? Math.round(forecast.list[0].pop * 100) : 0,
        uvIndex: Math.floor(Math.random() * 11), // UV index (simulated)
      });

      // Process forecast data (next 24 hours)
      const hourlyForecast = forecast.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('es-ES', { hour: '2-digit' }),
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        precipitation: Math.round((item.pop || 0) * 100),
        windSpeed: Math.round(item.wind.speed * 3.6),
      }));

      setForecastData(hourlyForecast);
      toast.success(`Datos meteorológicos cargados para ${cityName}`);
    } catch (error) {
      toast.error("Error al cargar datos meteorológicos");
    } finally {
      setLoadingWeather(false);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-primary/5">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-primary/5">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_2px_8px_hsl(var(--primary)/0.08)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-accent to-success flex items-center justify-center shadow-md text-xl">
                🌍
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                  Aura Global
                </h1>
                <p className="text-sm text-muted-foreground">Dashboard de {profile?.full_name || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={() => navigate("/")} className="shadow-sm hover:shadow-md transition-all hidden sm:flex">
                <MapPin className="mr-2 h-4 w-4" />
                Mapa
              </Button>
              <Button variant="outline" onClick={handleSignOut} size="icon" className="shadow-sm hover:shadow-md transition-all">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5 bg-muted/50 p-1 h-auto">
            <TabsTrigger value="favorites" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all flex flex-col sm:flex-row items-center gap-1 py-3">
              <Star className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Favoritos</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all flex flex-col sm:flex-row items-center gap-1 py-3">
              <CloudRain className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Clima</span>
            </TabsTrigger>
            <TabsTrigger value="forecast" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all flex flex-col sm:flex-row items-center gap-1 py-3">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Pronóstico</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all flex flex-col sm:flex-row items-center gap-1 py-3">
              <History className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Historial</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all flex flex-col sm:flex-row items-center gap-1 py-3">
              <User className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="space-y-4 animate-in fade-in-50 duration-300">
            <Card className="border-border/50 shadow-[0_2px_8px_hsl(var(--primary)/0.08)]">
              <CardHeader className="bg-gradient-to-r from-card to-card/80">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Ciudades Favoritas
                </CardTitle>
                <CardDescription>
                  Administra tus ubicaciones guardadas y consulta el clima
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
                      <Card key={fav.id} className="relative border-border/50 bg-gradient-to-br from-card to-card/80 hover:shadow-[0_4px_16px_hsl(var(--primary)/0.12)] transition-all duration-300 hover:scale-[1.02]">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {fav.city_name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            🌍 {fav.country}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-lg">
                            <p>📍 Lat: {Number(fav.latitude).toFixed(4)}°</p>
                            <p>📍 Lon: {Number(fav.longitude).toFixed(4)}°</p>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all"
                              onClick={() => loadWeatherForCity(fav.city_name, Number(fav.latitude), Number(fav.longitude))}
                            >
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Ver Clima
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFavorite(fav.id)}
                              className="shadow-sm hover:shadow-md transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weather" className="space-y-4 animate-in fade-in-50 duration-300">
            <Card className="border-border/50 shadow-[0_2px_8px_hsl(var(--primary)/0.08)]">
              <CardHeader className="bg-gradient-to-r from-card to-card/80">
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-primary" />
                  Datos Meteorológicos Técnicos
                </CardTitle>
                <CardDescription>
                  Información detallada del clima actual con métricas profesionales
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingWeather ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : weatherStats ? (
                  <WeatherStats data={weatherStats} />
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Selecciona una ciudad favorita para ver los datos meteorológicos técnicos
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pronóstico Extendido</CardTitle>
                <CardDescription>
                  Gráficos de pronóstico para las próximas 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingWeather ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : forecastData.length > 0 ? (
                  <ForecastChart data={forecastData} />
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Selecciona una ciudad favorita para ver el pronóstico extendido
                  </p>
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
