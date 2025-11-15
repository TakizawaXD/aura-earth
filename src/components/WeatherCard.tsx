import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Sun, Gauge } from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  airQuality: number;
  description: string;
}

interface WeatherCardProps {
  data: WeatherData | null;
  loading: boolean;
}

export default function WeatherCard({ data, loading }: WeatherCardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-24 bg-muted rounded-lg" />
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-success";
    if (aqi <= 100) return "text-accent";
    if (aqi <= 150) return "text-orange-500";
    return "text-destructive";
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "Bueno";
    if (aqi <= 100) return "Moderado";
    if (aqi <= 150) return "Insalubre para grupos sensibles";
    return "Insalubre";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Temperature Card */}
      <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-accent/10">
            <Sun className="w-8 h-8 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Temperatura</p>
            <p className="text-3xl font-bold text-foreground">{data.temperature}°C</p>
            <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
          </div>
        </div>
      </Card>

      {/* Humidity Card */}
      <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Droplets className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Humedad</p>
            <p className="text-3xl font-bold text-foreground">{data.humidity}%</p>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${data.humidity}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Wind Speed Card */}
      <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary-glow/10">
            <Wind className="w-8 h-8 text-primary-glow" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Viento</p>
            <p className="text-3xl font-bold text-foreground">{data.windSpeed}</p>
            <p className="text-xs text-muted-foreground mt-1">km/h</p>
          </div>
        </div>
      </Card>

      {/* UV Index Card */}
      <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-accent/10">
            <Sun className="w-8 h-8 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Índice UV</p>
            <p className="text-3xl font-bold text-foreground">{data.uvIndex}</p>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${(data.uvIndex / 11) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Air Quality Card */}
      <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-success/10">
            <Cloud className="w-8 h-8 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Calidad del Aire</p>
            <p className={`text-3xl font-bold ${getAQIColor(data.airQuality)}`}>
              {data.airQuality}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{getAQILabel(data.airQuality)}</p>
          </div>
        </div>
      </Card>

      {/* Atmospheric Pressure Card */}
      <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Gauge className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Presión</p>
            <p className="text-3xl font-bold text-foreground">1013</p>
            <p className="text-xs text-muted-foreground mt-1">hPa</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
