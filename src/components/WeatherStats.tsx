import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cloud, Droplets, Wind, Eye, Gauge, Sun, Moon, CloudRain } from "lucide-react";

interface WeatherStatsProps {
  data: {
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDirection: number;
    dewPoint: number;
    cloudCover: number;
    precipitation: number;
    uvIndex: number;
  };
}

const WeatherStats = ({ data }: WeatherStatsProps) => {
  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: "Bajo", color: "text-green-500" };
    if (uv <= 5) return { level: "Moderado", color: "text-yellow-500" };
    if (uv <= 7) return { level: "Alto", color: "text-orange-500" };
    if (uv <= 10) return { level: "Muy Alto", color: "text-red-500" };
    return { level: "Extremo", color: "text-purple-500" };
  };

  const uvInfo = getUVLevel(data.uvIndex);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Humedad Relativa</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.humidity}%</div>
          <Progress value={data.humidity} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Punto de rocío: {data.dewPoint.toFixed(1)}°C
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Presión Atmosférica</CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.pressure} hPa</div>
          <p className="text-xs text-muted-foreground mt-2">
            {data.pressure > 1013 ? "Alta presión ↑" : "Baja presión ↓"}
          </p>
          <p className="text-xs text-muted-foreground">
            Normal: 1013 hPa
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Viento</CardTitle>
          <Wind className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.windSpeed} km/h</div>
          <p className="text-xs text-muted-foreground mt-2">
            Dirección: {getWindDirection(data.windDirection)} ({data.windDirection}°)
          </p>
          <Progress value={(data.windSpeed / 100) * 100} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visibilidad</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(data.visibility / 1000).toFixed(1)} km</div>
          <p className="text-xs text-muted-foreground mt-2">
            {data.visibility >= 10000 ? "Excelente" : data.visibility >= 5000 ? "Buena" : "Reducida"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Índice UV</CardTitle>
          <Sun className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${uvInfo.color}`}>{data.uvIndex}</div>
          <p className={`text-xs mt-2 ${uvInfo.color}`}>
            {uvInfo.level}
          </p>
          <Progress value={(data.uvIndex / 11) * 100} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nubosidad</CardTitle>
          <Cloud className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.cloudCover}%</div>
          <Progress value={data.cloudCover} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {data.cloudCover < 20 ? "Despejado" : data.cloudCover < 50 ? "Parcialmente nublado" : "Nublado"}
          </p>
        </CardContent>
      </Card>

      <Card className={data.precipitation > 0 ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Probabilidad de Lluvia</CardTitle>
          <CloudRain className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.precipitation}%
          </div>
          <Progress value={data.precipitation} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {data.precipitation > 70 ? "🌧️ Muy probable" : 
             data.precipitation > 40 ? "☁️ Probable" : 
             data.precipitation > 10 ? "🌤️ Posible" : "☀️ Poco probable"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherStats;
