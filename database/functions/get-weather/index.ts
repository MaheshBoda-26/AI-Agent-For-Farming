import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, city } = await req.json();
    
    const OPENWEATHERMAP_API_KEY = Deno.env.get("OPENWEATHERMAP_API_KEY");
    if (!OPENWEATHERMAP_API_KEY) {
      throw new Error("OPENWEATHERMAP_API_KEY is not configured");
    }

    let weatherUrl: string;
    let forecastUrl: string;

    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=40&appid=${OPENWEATHERMAP_API_KEY}`;
    } else if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&cnt=40&appid=${OPENWEATHERMAP_API_KEY}`;
    } else {
      // Default to Warangal, Telangana
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Warangal,IN&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Warangal,IN&units=metric&cnt=40&appid=${OPENWEATHERMAP_API_KEY}`;
    }

    // Fetch current weather and forecast in parallel
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error("Weather API error:", weatherResponse.status, errorText);
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }

    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      console.error("Forecast API error:", forecastResponse.status, errorText);
      throw new Error(`Forecast API error: ${forecastResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    // Process forecast to get daily data (one entry per day at noon)
    const dailyForecast = [];
    const seenDays = new Set<string>();
    
    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      const hour = date.getHours();
      
      // Get midday forecast for each day
      if (!seenDays.has(dayKey) && hour >= 11 && hour <= 14) {
        seenDays.add(dayKey);
        dailyForecast.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main.toLowerCase(),
          icon: item.weather[0].icon,
        });
        
        if (dailyForecast.length >= 5) break;
      }
    }

    // If we don't have enough days, fill with available data
    if (dailyForecast.length < 5) {
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toISOString().split('T')[0];
        
        if (!seenDays.has(dayKey)) {
          seenDays.add(dayKey);
          dailyForecast.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main.toLowerCase(),
            icon: item.weather[0].icon,
          });
          
          if (dailyForecast.length >= 5) break;
        }
      }
    }

    const result = {
      location: `${weatherData.name}, ${weatherData.sys.country}`,
      current: {
        temp: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main.toLowerCase(),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        wind: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        icon: weatherData.weather[0].icon,
      },
      forecast: dailyForecast,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("get-weather error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
