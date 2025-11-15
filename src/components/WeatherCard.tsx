import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Sun, Gauge, Activity, Thermometer, Sunrise, Sunset, Eye } from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  airQuality: number;
  description: string;
  pressure: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  windDirection: number;
  sunrise: number;
  sunset: number;
  visibility: number;
}

interface WeatherCardProps {
  data: WeatherData | null;
  loading: boolean;
}

export default function WeatherCard({ data, loading }: WeatherCardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="p-4 sm:p-6 animate-pulse">
            <div className="h-20 sm:h-24 bg-muted rounded-lg" />
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
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {/* Temperature Card */}
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-accent/10 shrink-0">
            <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Temperatura</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.temperature}°C</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">{data.description}</p>
          </div>
        </div>
      </Card>

      {/* Feels Like Card */}
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-accent/10 shrink-0">
            <Thermometer className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Sensación térmica</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.feelsLike}°C</p>
          </div>
        </div>
      </Card>

      {/* Min/Max Temperature Card */}
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-primary/10 shrink-0">
            <Thermometer className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Min/Max</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.tempMin}°C / {data.tempMax}°C</p>
          </div>
        </div>
      </Card>

      {/* Humidity Card */}
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-primary/10 shrink-0">
            <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Humedad</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.humidity}%</p>
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
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-primary-glow/10 shrink-0">
            <Wind className="w-6 h-6 sm:w-8 sm:h-8 text-primary-glow" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Viento</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.windSpeed} m/s</p>
            <p className="text-xs text-muted-foreground mt-1">Dirección: {data.windDirection}°</p>
          </div>
        </div>
      </Card>

      {/* UV Index Card */}
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-accent/10 shrink-0">
            <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Índice UV</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.uvIndex}</p>
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
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-success/10 shrink-0">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Calidad del Aire</p>
            <p className={`text-2xl sm:text-3xl font-bold ${getAQIColor(data.airQuality)}`}>
              {data.airQuality}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{getAQILabel(data.airQuality)}</p>
          </div>
        </div>
      </Card>

      {/* Pressure Card */}
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-primary/10 shrink-0">
            <Gauge className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Presión</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.pressure} hPa</p>
          </div>
        </div>
      </Card>
      
      {/* Sunrise/Sunset Card */}
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-primary-glow/10 shrink-0">
             <div className="flex flex-row gap-4">
                <Sunrise className="w-6 h-6 sm:w-8 sm:h-8 text-primary-glow" />
                <Sunset className="w-6 h-6 sm:w-8 sm:h-8 text-primary-glow" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Amanecer/Atardecer</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{formatTime(data.sunrise)} / {formatTime(data.sunset)}</p>
          </div>
        </div>
      </Card>

      {/* Visibility Card */}
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-primary/10 shrink-0">
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Visibilidad</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.visibility / 1000} km</p>
          </div>
        </div>
      </Card>

    </div>
  );
}
