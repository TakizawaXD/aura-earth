import { useState, useEffect } from "react";
import Mapbox from "@/components/Mapbox";
import CitySearch from "@/components/CitySearch";
import WeatherCard from "@/components/WeatherCard";
import AuthDialog from "@/components/AuthDialog";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "sonner";

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

interface Coordinates {
  lon: number;
  lat: number;
}

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const fetchWeather = async (city: string, isBackgroundUpdate = false) => {
    if (!isBackgroundUpdate) {
      setLoading(true);
    }
    try {
      const API_KEY = "bb408aeec5264c3e59e40a0ac545d87d";
      
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      
      if (!weatherResponse.ok) {
        throw new Error("Ciudad no encontrada");
      }
      
      const weatherData = await weatherResponse.json();
      
      const { coord } = weatherData;
      setCoordinates(coord);
      const airQualityResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`
      );
      
      const airQualityData = await airQualityResponse.json();
      
      const uvResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`
      );
      
      const uvData = await uvResponse.json();
      
      setWeatherData({
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed),
        uvIndex: uvData.current?.uvi ? Math.round(uvData.current.uvi) : 0,
        airQuality: airQualityData.list[0].main.aqi * 50,
        description: weatherData.weather[0].description,
        pressure: weatherData.main.pressure,
        feelsLike: Math.round(weatherData.main.feels_like),
        tempMin: Math.round(weatherData.main.temp_min),
        tempMax: Math.round(weatherData.main.temp_max),
        windDirection: weatherData.wind.deg,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        visibility: weatherData.visibility,
      });
      
      setCityName(weatherData.name);
      
      if (!isBackgroundUpdate) {
        toast.success(`¡Datos cargados! Mostrando clima de ${weatherData.name}`);
      }
    } catch (error) {
      if (!isBackgroundUpdate) {
        toast.error("No se pudo obtener la información del clima. Intenta con otra ciudad.");
      }
      setWeatherData(null);
    } finally {
      if (!isBackgroundUpdate) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!cityName) return;

    const intervalId = setInterval(() => {
      toast.info(`Actualizando datos para ${cityName}...`);
      fetchWeather(cityName, true);
    }, 300000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [cityName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <header className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-center sm:text-left bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
            🌍 Aura Global
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AuthDialog />
          </div>
        </div>
        <p className="text-center sm:text-left text-muted-foreground text-base md:text-lg">
          Tu amigo climático personal
        </p>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 space-y-8 md:space-y-12">
        <section className="flex justify-center">
          <div className="w-full max-w-4xl h-[500px] rounded-lg overflow-hidden shadow-large">
            <Mapbox coordinates={coordinates} />
          </div>
        </section>

        <section className="space-y-4">
          <CitySearch onSearch={fetchWeather} loading={loading} />
        </section>

        {weatherData && (
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center">
              Clima en {cityName}
            </h2>
            
            <WeatherCard data={weatherData} loading={loading} />
          </section>
        )}
      </main>

      <footer className="container mx-auto px-4 py-6 md:py-8 mt-12 md:mt-16 text-center text-muted-foreground text-sm md:text-base">
        <p>🌎 Aura Global - Clima en tiempo real para todo el mundo</p>
      </footer>
    </div>
  );
};

export default Index;
