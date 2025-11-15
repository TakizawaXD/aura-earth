import { useState } from "react";
import Earth3D from "@/components/Earth3D";
import CitySearch from "@/components/CitySearch";
import WeatherCard from "@/components/WeatherCard";
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  airQuality: number;
  description: string;
}

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState("");
  const { toast } = useToast();

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const API_KEY = "bb408aeec5264c3e59e40a0ac545d87d";
      
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      
      if (!weatherResponse.ok) {
        throw new Error("Ciudad no encontrada");
      }
      
      const weatherData = await weatherResponse.json();
      
      // Fetch air quality
      const { coord } = weatherData;
      const airQualityResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`
      );
      
      const airQualityData = await airQualityResponse.json();
      
      // Fetch UV index (using One Call API)
      const uvResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`
      );
      
      const uvData = await uvResponse.json();
      
      setWeatherData({
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        uvIndex: uvData.current?.uvi ? Math.round(uvData.current.uvi) : 0,
        airQuality: airQualityData.list[0].main.aqi * 50, // Convert to 0-500 scale
        description: weatherData.weather[0].description,
      });
      
      setCityName(weatherData.name);
      
      toast({
        title: "¡Datos del clima cargados!",
        description: `Mostrando información de ${weatherData.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo obtener la información del clima. Intenta con otra ciudad.",
        variant: "destructive",
      });
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="pt-8 pb-4 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-3">
            Aura Global
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Tu amigo del clima en tiempo real 🌍
          </p>
        </div>
      </header>

      {/* 3D Earth Animation */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Earth3D />
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <CitySearch onSearch={fetchWeather} loading={loading} />
      </div>

      {/* City Name Display */}
      {cityName && (
        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground">{cityName}</h2>
        </div>
      )}

      {/* Weather Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <WeatherCard data={weatherData} loading={loading} />
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground">
        <p className="text-sm">
          Datos proporcionados por OpenWeatherMap • Actualizado en tiempo real
        </p>
      </footer>
    </div>
  );
};

export default Index;
